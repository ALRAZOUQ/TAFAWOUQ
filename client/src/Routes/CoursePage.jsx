import React, { useState, useEffect, lazy, Suspense, useCallback } from "react";
import axios from "../api/axios";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-confirm-alert/src/react-confirm-alert.css";
import { useAuth } from "../context/authContext";
import { useCourseData } from "../context/CourseContext";

// ✅ Lazy Load Components
const ConfirmDialog = lazy(() => import("../components/ConfirmationComponent"));
const CourseCard = lazy(() =>
  import("../components/coursePageComponents/CourseCard")
);
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
  // Hooks
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { deleteCourseFromContext } = useCourseData(); //To update the fetched course data used in the search bar and courses page

  // State
  const [course, setCourse] = useState(null);
  const [comments, setComments] = useState([]);
  const [filterTag, setFilterTag] = useState("");
  const [sortBy, setSortBy] = useState("recent");
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isConfirmOpen, setIsConfirmOpen] = useState(false);
  const commentsPerPage = 8;

  // ✅ Preload components in the background
  useEffect(() => {
    import("../components/ConfirmationComponent");
    import("../components/coursePageComponents/CourseCard");
    import("../components/coursePageComponents/Comment");
    import("../components/coursePageComponents/FilterControls");
    import("../components/coursePageComponents/Pagination");
    import("../components/coursePageComponents/WriteComment");
  }, []);

  // API Calls
  const fetchCourse = async () => {
    try {
      const response = await axios.get(`auth/course/${courseId}`);
      if (response.status === 200) {
        setCourse(response.data.course[0]);
        return true;
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.error("المقرر غير موجود");
        setTimeout(() => navigate("/home"), 0); // Defer navigation
        return false;
      }
    }
  };

  const fetchComments = async () => {
    try {
      const response = await axios.get(`auth/comments/${courseId}`);
      if (response.status === 200) {
        setComments(response.data.comments);
      }
    } catch (error) {
      if (error.response?.status === 404) {
        toast.info("لا توجد تعليقات على هذا المقرر بعد");
        setComments([]);
      }
      console.error("Error fetching comments:", error);
    }
  };



  


  // Event Handlers
  const deleteCourse = async () => {
    try {
      const response = await axios.delete(`admin/deleteCourse/${courseId}`);
      if (response.status === 200) {
        toast.success("تم حذف المقرر بنجاح");
        deleteCourseFromContext(courseId);
        navigate("/courses");
      }
    } catch (error) {
      toast.error("حدث خطأ أثناء حذف المقرر");
      console.error("Error deleting course:", error);
    } finally {
      setIsConfirmOpen(false);
    }
  };

  // Effects
  useEffect(() => {
    let mounted = true;
    const loadData = async () => {
      if (mounted) {
        const courseResult = await fetchCourse();
        if (courseResult !== false && mounted) {
          await fetchComments();
        }
      }
    };
    loadData();
    return () => {
      mounted = false;
    };
  }, [courseId]);

  useEffect(() => {
    const totalPages = Math.ceil(
      filteredAndSortedComments.length / commentsPerPage
    );
    if (currentPage > totalPages) {
      setCurrentPage(Math.max(1, totalPages));
    }
  }, [filterTag, sortBy, searchQuery, comments]);

  // Filter & Sort Comments
  const filteredAndSortedComments = comments
    .filter((comment) =>
      comment.content.toLowerCase().includes(searchQuery.toLowerCase())
    )
    .filter((comment) => (filterTag ? comment.tag === filterTag : true))
    .sort((a, b) => {
      if (sortBy === "recent")
        return new Date(b.creationDate) - new Date(a.creationDate);
      if (sortBy === "mostLikes") return b.numOfLikes - a.numOfLikes;
      if (sortBy === "mostReplies") return b.numOfReplies - a.numOfReplies;
      return 0;
    });

  // Pagination calculations
  const currentComments = filteredAndSortedComments.slice(
    (currentPage - 1) * commentsPerPage,
    currentPage * commentsPerPage
  );

  const totalPages = Math.ceil(
    filteredAndSortedComments.length / commentsPerPage
  );

  
  const handleDeleteComment = (commentId) => {
    console.log("Comment ID to delete:", commentId);
    setComments(
        (prevComments) =>
            prevComments?.filter((comment) => comment.id !== commentId)
    );
};

  return (
    <div className="bg-gradient-to-b from-TAF-200 via-white to-TAF-200 min-h-screen">
      <div className="w-auto mx-auto container p-4">
        {/* ✅ Lazy Loading Components with Suspense */}
        <Suspense fallback={<div>Loading Course...</div>}>
          <CourseCard
            course={course}
            isAdmin={user?.isAdmin}
            onDelete={() => setIsConfirmOpen(true)}
          />
        </Suspense>

        <Suspense fallback={<div>Loading...</div>}>
          <ConfirmDialog
            title="حذف المقرر"
            message="هل انت متأكد بانك تريد حذف المقرر؟"
            onConfirm={deleteCourse}
            onCancel={() => setIsConfirmOpen(false)}
            isRTL={true}
            isOpen={isConfirmOpen}
          />
        </Suspense>

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

        <Suspense fallback={<div>Loading...</div>}>
          <WriteComment
            courseId={courseId}
            onCommentAdded={(newComment) => {
              if (newComment) {
                setComments((prevComments) => [newComment, ...prevComments]);
              } else {
                fetchComments();
              }
            }}
          />
        </Suspense>

        <div className="space-y-4">
          {currentComments.map((comment) => (
            <Suspense key={comment.id} fallback={<div>Loading comment...</div>}>
              <Comment
                comment={comment}
                courseId={courseId}
                onDelete={handleDeleteComment}
              />
            </Suspense>
          ))}
        </div>

        <Suspense fallback={<div>Loading pagination...</div>}>
          <Pagination
            currentPage={currentPage}
            totalPages={totalPages}
            setCurrentPage={setCurrentPage}
          />
        </Suspense>
      </div>
    </div>
  );
};

export default CoursePage;
