import React, { useState, useEffect, lazy, Suspense, useMemo } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useAuth } from "../context/authContext";
import { useCourseData } from "../context/CourseContext";
import Screen from "../components/Screen";
import { CommentSkeleton } from "../components/skeleton/CommentSkeleton";
import { QuizSkeleton } from "../components/skeleton/QuizSkeleton";
import { CourseSkeleton } from "../components/skeleton/CourseSkeleton";
import { FilterControlsSkeleton } from "../components/skeleton/FilterControlsSkeleton";
import { EnterCommentSkeleton } from "../components/skeleton/EnterCommentSkeleton";
// Lazy-loaded components
const ConfirmDialog = lazy(() => import("../components/ConfirmationComponent"));
const CourseCard = lazy(() =>
  import("../components/coursePageComponents/CourseCard")
);
const QuizCard = lazy(() => import("../components/QuizComponents/QuizCard"));
const Comment = lazy(() =>
  import("../components/coursePageComponents/Comment")
);
const FilterControls = lazy(() =>
  import("../components/coursePageComponents/FilterControls")
);
const Pagination = lazy(() =>
  import("../components/coursePageComponents/Pagination")
);
const WriteComment = lazy(() =>
  import("../components/coursePageComponents/WriteComment")
);

const CoursePage = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user, isAuthorized } = useAuth();
  const { deleteCourseFromContext } = useCourseData();

  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [quizzes, setQuizzes] = useState([]);

  // Add loading states for each data type we need to restrucer the code to cheek if the data stil lodindng show skeleton or useing react query to fetch data then we will all binefit of suspanse fallback
  const [isLoadingCourse, setIsLoadingCourse] = useState(true);
  const [isLoadingComments, setIsLoadingComments] = useState(true);
  const [isLoadingQuizzes, setIsLoadingQuizzes] = useState(true);
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
      // Set all loading states to true at the start
      setIsLoadingCourse(true);
      setIsLoadingComments(true);
      setIsLoadingQuizzes(true);

      try {
        // Load course data
        const courseRes = await axios.get(`auth/course/${courseId}`);
        setCourse(courseRes.data.course[0]);
        setIsLoadingCourse(false);

        // Load comments data
        const commentsRes = await axios.get(`auth/comments/${courseId}`);
        setComments(commentsRes.data.comments);
        setIsLoadingComments(false);

        // Load quizzes data
        const quizRes = await axios.get(`auth/course/quizzes/${courseId}`);
        setQuizzes(quizRes.data.quiz);
        setIsLoadingQuizzes(false);
      } catch (error) {
        // Set loading states to false even if there's an error
        setIsLoadingCourse(false);
        setIsLoadingComments(false);
        setIsLoadingQuizzes(false);
      }
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
      .filter((c) =>
        c.content.toLowerCase().includes(searchQuery.toLowerCase())
      )
      .filter((c) => (filterTag ? c.tag === filterTag : true))
      .sort((a, b) => {
        if (sortBy === "recent")
          return new Date(b.creationDate) - new Date(a.creationDate);
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
  // bg-gradient-to-b from-TAF-200 via-white to-TAF-200
  return (
    <Screen>
      <div className="container mx-auto p-4">
        {isLoadingCourse ? (
          <CourseSkeleton />
        ) : (
          <Suspense fallback={<CourseSkeleton />}>
            <CourseCard
              course={course}
              isAdmin={user?.isAdmin}
              activeTab={activeTab}
              setActiveTab={setActiveTab}
              onDelete={() => setIsConfirmOpen(true)}
            />
          </Suspense>
        )}
        <Suspense fallback={""}>
          <ConfirmDialog
            isOpen={isConfirmOpen}
            title="حذف المقرر"
            message="هل انت متأكد بانك تريد حذف المقرر؟"
            onConfirm={handleDeleteCourse}
            onCancel={() => setIsConfirmOpen(false)}
            isRTL
          />
        </Suspense>

        {!isLoadingCourse ? (
          <div className="mb-4">
            {["comments", "quizzes"].map((tab) => (
              <button
                key={tab}
                className={`mt-7 py-2 px-4 w-32 ml-2 font-medium text-base relative transition-all duration-200 rounded-lg bg-white shadow-sm hover:shadow-md
        ${
          activeTab === tab
            ? "text-black font-extrabold border-2 border-TAF-100"
            : "text-gray-500 hover:text-TAF-100 border-b-2 border-b-transparent"
        }`}
                onClick={() => setActiveTab(tab)}
              >
                {tab === "comments" ? "التعليقات" : "الاختبارات"}
              </button>
            ))}
          </div>
        ) : (
          ""
        )}

        {activeTab === "comments" && (
          <>
            <Suspense fallback={<FilterControlsSkeleton />}>
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
              <Suspense fallback={<EnterCommentSkeleton />}>
                <WriteComment
                  courseId={courseId}
                  onCommentAdded={handleNewComment}
                />
              </Suspense>
            )}

            {isLoadingComments ? (
              // Show skeletons while loading
              <div className="space-y-4">
                {[...Array(3)].map((_, index) => (
                  <CommentSkeleton key={index} />
                ))}
              </div>
            ) : comments && comments.length > 0 ? (
              <>
                <div className="space-y-4">
                  {paginatedComments.map((comment) => (
                    <Suspense key={comment.id} fallback={<CommentSkeleton />}>
                      <Comment
                        comment={comment}
                        courseCode={course?.code}
                        courseId={courseId}
                        onDelete={handleDeleteComment}
                      />
                    </Suspense>
                  ))}
                </div>

                <Suspense
                  fallback={
                    <div className="mt-4">
                      <CommentSkeleton />
                    </div>
                  }
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={Math.ceil(
                      filteredComments.length / commentsPerPage
                    )}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </>
            ) : (
              <div className="text-center text-gray-700 mt-4 p-8">
                لا يوجد تعليقات بعد
              </div>
            )}
          </>
        )}

        {activeTab === "quizzes" &&
          (quizzes && quizzes.length > 0 ? (
            <>
              {paginatedQuizzes.map((quiz) => (
                <Suspense key={quiz.id} fallback={<QuizSkeleton />}>
                  <QuizCard quiz={quiz} onDelete={handleDeleteQuiz} />
                </Suspense>
              ))}

              <div className="mt-6">
                <Suspense
                  fallback={
                    <div className="animate-pulse bg-gray-200 h-10 rounded-lg">
                      Loading pagination...
                    </div>
                  }
                >
                  <Pagination
                    currentPage={quizPage}
                    totalPages={Math.ceil(quizzes.length / quizzesPerPage)}
                    setCurrentPage={setQuizPage}
                  />
                </Suspense>
              </div>
            </>
          ) : (
            <div className="text-center text-gray-700 mt-4 p-8">
              لا يوجد اختبارات بعد
            </div>
          ))}
      </div>
    </Screen>
  );
};

export default CoursePage;
