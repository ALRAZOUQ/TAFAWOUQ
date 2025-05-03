import Screen from "../components/Screen";
import { useState, useEffect, lazy, Suspense, useMemo, useCallback } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import { useRouteIfAuthorizedAndHeIsNotAdmin } from "../util/useRouteIfNotAuthorized";
import SearchButton from "../components/SearchButton";
import Page from "../components/Page";
import HiddenQuizCard from "../components/hiddenItemsPageComponents/HiddenQuizCard";
import HiddenCommentCard from "../components/hiddenItemsPageComponents/HiddenCommentCard";
import { useDebounce, useMemoizedFilter, usePaginatedItems } from "../util/performanceOptimizations";

// Lazy load Pagination component
const Pagination = lazy(() =>
  import("../components/coursePageComponents/Pagination")
);

export default function HiddenItems() {
  const { user } = useAuth();
  useRouteIfAuthorizedAndHeIsNotAdmin();
  const [hiddenComments, setHiddenComments] = useState([]);
  const [hiddenQuizzes, setHiddenQuizzes] = useState([]);
  const [toggleHiddenItems, setToggleHiddenItems] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSetSearchQuery = useDebounce((value) => {
    setSearchQuery(value);
    setCurrentPage(1); // Reset to first page on search
  }, 300);
  const itemsPerPage = 8;

  async function fetchHiddenComments() {
    setIsLoading(true);
    try {
      const response = await axios.get("/admin/hiddenComments");
      if (response.status === 200) {
        setHiddenComments(response.data.hiddenComments || []);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching hidden comments:", error);
      toast.error("حدث خطأ أثناء جلب التعليقات المخفية");
      setHiddenComments([]);
      setIsLoading(false);
    }
  }
  function formatTime(isoString) {
    if (!isoString) {
      return {
        date: {
          year: "",
          month: "",
          day: "",
          formatted: "غير محدد",
        },
        time: {
          hours: "",
          minutes: "",
          seconds: "",
          formatted: "غير محدد",
        },
      };
    }

    try {
      const date = new Date(isoString);

      // Check if date is valid
      if (isNaN(date.getTime())) {
        throw new Error("Invalid date");
      }

      const year = date.getFullYear();
      const month = String(date.getMonth() + 1).padStart(2, "0");
      const day = String(date.getDate()).padStart(2, "0");

      const hours = String(date.getHours()).padStart(2, "0");
      const minutes = String(date.getMinutes()).padStart(2, "0");
      const seconds = String(date.getSeconds()).padStart(2, "0");

      return {
        date: {
          year,
          month,
          day,
          formatted: `${year}-${month}-${day}`,
        },
        time: {
          hours,
          minutes,
          seconds,
          formatted: `${hours}:${minutes}:${seconds}`,
        },
      };
    } catch (error) {
      console.error("Error formatting date:", error);
      return {
        date: {
          year: "",
          month: "",
          day: "",
          formatted: "غير محدد",
        },
        time: {
          hours: "",
          minutes: "",
          seconds: "",
          formatted: "غير محدد",
        },
      };
    }
  }

  async function fetchHiddenQuizzes() {
    setIsLoading(true);
    try {
      const response = await axios.get("/admin/hiddenQuizzes");
      if (response.status === 200) {
        setHiddenQuizzes(response.data.hiddenQuizzes || []);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching hidden quizzes:", error);
      toast.error("حدث خطأ أثناء جلب الإختبارات القصيرة المخفية");
      setHiddenQuizzes([]);
      setIsLoading(false);
    }
  }

  useEffect(() => {
    if (toggleHiddenItems) {
      fetchHiddenQuizzes();
    } else {
      fetchHiddenComments();
    }
  }, [toggleHiddenItems]);

  // Preload Pagination component
  useEffect(() => {
    import("../components/coursePageComponents/Pagination");
  }, []);

  // Memoized filter functions
  const commentFilterFn = useCallback(
    (comment) =>
      comment.commentContent
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      comment.adminExecutedHide
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      comment.hideReason?.toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery]
  );

  const quizFilterFn = useCallback(
    (quiz) =>
      quiz?.quizTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      quiz?.adminExecutedHide
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      quiz?.hideReason?.toLowerCase().includes(searchQuery.toLowerCase()),
    [searchQuery]
  );

  // Use memoized filters for better performance
  const filteredComments = useMemoizedFilter(hiddenComments, searchQuery, commentFilterFn);
  const filteredQuizzes = useMemoizedFilter(hiddenQuizzes, searchQuery, quizFilterFn) || [];

  // Use memoized pagination
  const currentItems = useMemo(() => {
    const items = toggleHiddenItems ? filteredQuizzes : filteredComments || [];
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [toggleHiddenItems, filteredQuizzes, filteredComments, currentPage, itemsPerPage]);

  const totalPages = useMemo(() => {
    const totalItems = toggleHiddenItems ? filteredQuizzes?.length : filteredComments?.length;
    return Math.ceil(totalItems / itemsPerPage);
  }, [toggleHiddenItems, filteredQuizzes, filteredComments, itemsPerPage]);

  const handleUnhideComment = useCallback(async (commentId) => {
    try {
      const response = await axios.put(`/admin/unhideComment`, { commentId });
      if (response.status === 200) {
        setHiddenComments((prev) =>
          prev.filter((comment) => comment.commentId !== commentId)
        );
        toast.success("تم إظهار التعليق بنجاح");
      } else {
        toast.error("حدث خطأ أثناء إظهار التعليق");
      }
    } catch (error) {
      console.error("Error unhiding comment:", error);
      toast.error("حدث خطأ أثناء إظهار التعليق");
    }
  }, []);

  const handleUnhideQuiz = useCallback(async (quizId) => {
    try {
      const response = await axios.put(`/admin/unhideQuiz`, { quizId });
      if (response.status === 200) {
        setHiddenQuizzes((prev) =>
          prev.filter((quiz) => quiz.quizId !== quizId)
        );
        toast.success("تم إظهار الإختبار بنجاح");
      } else {
        toast.error("حدث خطأ أثناء إظهار الإختبار");
      }
    } catch (error) {
      console.error("Error unhiding quiz:", error);
      toast.error("حدث خطأ أثناء إظهار الإختبار");
    }
  }, []);

  // Empty state handling is now done in the main render function with conditional rendering

  return (
    <Screen title="Hidden Items" className="p-2 sm:p-4 md:p-6">
      <Page className="w-full max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-right">
          العناصر المخفية
        </h1>

        {/* Toggle between comments and quizzes */}
        <div className="mb-4">
          {[false, true].map((isQuizzes) => (
            <button
              key={isQuizzes ? "quizzes" : "comments"}
              className={`mt-7 py-2 px-4 w-40 ml-2 font-medium text-base relative transition-all duration-200 rounded-lg bg-white shadow-sm hover:shadow-md
              ${toggleHiddenItems === isQuizzes
                ? "text-black font-extrabold border-b-4 border-b-TAF-600"
                : "text-gray-500 hover:text-TAF-500 border-b-2 border-b-transparent"}`}
              onClick={() => setToggleHiddenItems(isQuizzes)}>
              {isQuizzes ? "الاختبارات المخفية" : "التعليقات المخفية"}
            </button>
          ))}
        </div>
        
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-center">
          {toggleHiddenItems ? "الإختبارات المخفية" : "التعليقات المخفية"}
        </h1>

        {/* Search Button */}
        <div className="mb-4 sm:mb-6 w-full max-w-md mx-auto">
          <SearchButton
            placeholder={
              toggleHiddenItems
                ? "ابحث في الإختبارات المخفية..."
                : "ابحث في التعليقات المخفية..."
            }
            value={searchQuery}
            onChange={debouncedSetSearchQuery}
          />
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-TAF-100"></div>
          </div>
        ) : !currentItems || currentItems.length === 0 ? (
          <div className="flex justify-center items-center py-10">
            <div className="text-red-400 text-lg sm:text-xl md:text-2xl">
              {toggleHiddenItems
                ? "لا يوجد اختبارات مخفية"
                : "لا يوجد تعليقات مخفية"}
            </div>
          </div>
        ) : (
          <div className="w-full px-4 py-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
              {!toggleHiddenItems
                ? // Comments Display
                  currentItems?.map((x) => (
                    <HiddenCommentCard
                      key={x.commentId}
                      x={x}
                      formatTime={formatTime}
                      user={user}
                      handleUnhideComment={handleUnhideComment}
                    />
                  ))
                : // Quizzes Display
                  currentItems.map((x) => (
                    <HiddenQuizCard
                      key={x.quizId}
                      handleUnhideQuiz={handleUnhideQuiz}
                      x={x}
                      formatTime={formatTime}
                      user={user}
                    />
                  ))}
            </div>

            {/* Pagination */}
            {currentItems?.length > 0 && totalPages > 1 && (
              <div className="mt-6 sm:mt-8">
                <Suspense
                  fallback={
                    <div className="text-center py-2">
                      Loading pagination...
                    </div>
                  }
                >
                  <Pagination
                    currentPage={currentPage}
                    totalPages={totalPages}
                    setCurrentPage={setCurrentPage}
                  />
                </Suspense>
              </div>
            )}
          </div>
        )}
      </Page>
    </Screen>
  );
}
