import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useCourseData } from "../context/CourseContext";
//
// Lazy-loaded components
const ConfirmDialog = lazy(() => import("../components/ConfirmationComponent"));
const CourseCard = lazy(() => import("../components/coursePageComponents/CourseCard"));
const QuizCard = lazy(() => import("../components/QuizComponents/QuizCard"));
const Comment = lazy(() => import("../components/coursePageComponents/Comment"));
const FilterControls = lazy(() => import("../components/coursePageComponents/FilterControls"));
const Pagination = lazy(() => import("../components/coursePageComponents/Pagination"));
const WriteComment = lazy(() => import("../components/coursePageComponents/WriteComment"));

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthorized } = useAuth();
  const { deleteCourseFromContext } = useCourseData();

  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  const [searchQuery, setSearchQuery] = useState("");
  const [filterTag, setFilterTag] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [activeTab, setActiveTab] = useState("comments");

  const [currentPage, setCurrentPage] = useState(1);
  const [quizPage, setQuizPage] = useState(1);
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);

  const commentsPerPage = 8;
  const quizzesPerPage = 8;

  // ✅ Preload components in the background
  useEffect(() => {
    import("../components/ConfirmationComponent");
    import("../components/coursePageComponents/CourseCard");
    import("../components/coursePageComponents/Comment");
    import("../components/coursePageComponents/FilterControls");
    import("../components/coursePageComponents/Pagination");
    import("../components/coursePageComponents/WriteComment");
  }, []);

  useEffect(() => {
    const loadData = async () => {
      try {
        const courseRes = await axios.get(`auth/course/${courseId}`);
        setCourse(courseRes.data.course[0]);

        const commentsRes = await axios.get(`auth/comments/${courseId}`);
        setComments(commentsRes.data.comments);

        const quizRes = await axios.get(`auth/course/quizzes/${courseId}`);
        setQuizzes(quizRes.data.quiz);
      } catch (error) {}
    };
    loadData();
  }, [courseId]);

  const handleDeleteCourse = async () => {
    try {
      await axios.delete(`admin/deleteCourse/${courseId}`);
      toast.success("تم حذف المقرر بنجاح");
      deleteCourseFromContext(courseId);
      navigate("/courses");
    } catch {
      toast.error("حدث خطأ أثناء حذف المقرر");
    } finally {
      setIsConfirmOpen(false);
    }
  };

  const filteredComments = useMemo(() => {
    return comments
      .filter((c) => c.content.toLowerCase().includes(searchQuery.toLowerCase()))
      .filter((c) => (filterTag ? c.tag === filterTag : true))
      .sort((a, b) => {
        if (sortBy === "recent") return new Date(b.creationDate) - new Date(a.creationDate);
        if (sortBy === "mostLikes") return b.numOfLikes - a.numOfLikes;
        if (sortBy === "mostReplies") return b.numOfReplies - a.numOfReplies;
        return 0;
      });
  }, [comments, searchQuery, filterTag, sortBy]);

  const paginatedComments = useMemo(() => {
    const start = (currentPage - 1) * commentsPerPage;
    return filteredComments.slice(start, start + commentsPerPage);
  }, [filteredComments, currentPage]);

  const paginatedQuizzes = useMemo(() => {
    const start = (quizPage - 1) * quizzesPerPage;
    return quizzes.slice(start, start + quizzesPerPage);
  }, [quizzes, quizPage]);

  const handleNewComment = (newComment) => {
    if (newComment) {
      setComments((prev) => [newComment, ...prev]);
    }
  };

  const handleDeleteComment = (commentId) => {
    setComments((prev) => prev.filter((c) => c.id !== commentId));
  };
  const handleDeleteQuiz = (quizId) => {
    setComments((prev) => prev.filter((q) => q.id !== quizId));
  };

  return (
    <div className="bg-gradient-to-b from-TAF-200 via-white to-TAF-200 min-h-screen">
      <div className="container mx-auto p-4">
        <Suspense fallback={<div>Loading Course...</div>}>
          <CourseCard
            course={course}
            isAdmin={user?.isAdmin}
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            onDelete={() => setIsConfirmOpen(true)}
          />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmDialog
            isOpen={isConfirmOpen}
            title="حذف المقرر"
            message="هل انت متأكد بانك تريد حذف المقرر؟"
            onConfirm={handleDeleteCourse}
            onCancel={() => setIsConfirmOpen(false)}
            isRTL
          />
        </Suspense>

        <div className="mb-4">
          {["comments", "quizzes"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 w-32 ml-2 font-medium text-base relative transition-all duration-200 rounded-lg bg-white shadow-sm hover:shadow-md
        ${
          activeTab === tab
            ? "text-black font-extrabold border-b-4 border-b-TAF-600"
            : "text-gray-500 hover:text-TAF-500 border-b-2 border-b-transparent"
        }`}
              onClick={() => setActiveTab(tab)}>
              {tab === "comments" ? "التعليقات" : "الاختبارات"}
            </button>
          ))}
        </div>

        {activeTab === "comments" && (
          <>
            <Suspense fallback={<div>Loading...</div>}>
              <FilterControls
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                filterTag={filterTag}
                setFilterTag={setFilterTag}
                sortBy={sortBy}
                setSortBy={setSortBy}
              />
            </Suspense>

            {isAuthorized && (
              <Suspense fallback={<div>Loading comment box...</div>}>
                <WriteComment courseId={courseId} onCommentAdded={handleNewComment} />
              </Suspense>
            )}

            {comments && comments.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedComments.map((comment) => (
                    <Suspense key={comment.id} fallback={<div>Loading comment...</div>}>
                      <Comment
                        comment={comment}
                        courseCode={course?.code}
                        courseId={courseId}
                        onDelete={handleDeleteComment}
                      />
                    </Suspense>
                  ))}
                </div>

                <Suspense fallback={<div>Loading pagination...</div>}>
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(filteredComments.length / commentsPerPage)}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </>
            ) : (
              <div className="text-center text-gray-700 mt-4 p-8">لا يوجد تعليقات بعد</div>
            )}
          </>
        )}

        {activeTab === "quizzes" &&
          (quizzes && quizzes.length > 0 ? (
            <>
              {paginatedQuizzes.map((quiz) => (
                <Suspense
                  key={quiz.id}
                  fallback={<div className="animate-pulse bg-gray-200 h-32 rounded-lg">Loading quiz...</div>}>
                  <QuizCard quiz={quiz} onDelete={handleDeleteQuiz} />
                </Suspense>
              ))}

              <div className="mt-6">
                <Suspense
                  fallback={
                    <div className="animate-pulse bg-gray-200 h-10 rounded-lg">Loading pagination...</div>
                  }>
                  <Pagination
                    currentPage={quizPage}
                    totalPages={Math.ceil(quizzes.length / quizzesPerPage)}
                    setCurrentPage={setQuizPage}
                  />
                </Suspense>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-700 mt-4 p-8">لا يوجد اختبارات بعد</div>
          ))}
      </div>
    </div>
  );
};

export default CoursePage;
