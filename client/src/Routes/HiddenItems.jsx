import Screen from "../components/Screen";
import { useState, useEffect, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import { useRouteIfAuthorizedAndHeIsNotAdmin } from "../util/useRouteIfNotAuthorized";
import SearchButton from "../components/SearchButton";
import Page from "../components/Page";
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

  // Filter & pagination calculations for comments
  const filteredComments = hiddenComments?.filter(
    (comment) =>
      comment.commentContent
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      comment.adminExecutedHide
        ?.toLowerCase()
        .includes(searchQuery.toLowerCase()) ||
      comment.hideReason?.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Filter & pagination calculations for quizzes
  const filteredQuizzes =
    hiddenQuizzes?.filter(
      (quiz) =>
        quiz?.quizTitle?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        quiz?.adminExecutedHide
          ?.toLowerCase()
          .includes(searchQuery.toLowerCase()) ||
        quiz?.hideReason?.toLowerCase().includes(searchQuery.toLowerCase())
    ) || [];

  const currentItems = toggleHiddenItems
    ? filteredQuizzes?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      )
    : filteredComments?.slice(
        (currentPage - 1) * itemsPerPage,
        currentPage * itemsPerPage
      ) || [];

  const totalPages = Math.ceil(
    (toggleHiddenItems ? filteredQuizzes?.length : filteredComments?.length) /
      itemsPerPage
  );

  const handleUnhideComment = async (commentId) => {
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
  };

  const handleUnhideQuiz = async (quizId) => {
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
  };

  // Empty state handling is now done in the main render function with conditional rendering

  return (
    <Screen title={toggleHiddenItems ? "Hidden Quizzes" : "Hidden Comments"}>
      <Page>
        {/* Toggle Reports Type - Centered */}
        <div className="flex justify-center mb-4 px-2 sm:px-4">
          <div
            className="rounded-b-2xl inline-flex shadow-sm w-full max-w-xs"
            role="group"
          >
            <button
              onClick={() => {
                setToggleHiddenItems(false);
                setCurrentPage(1);
                setSearchQuery("");
              }}
              className={`px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base font-medium md:rounded-br-3xl rounded-br-3xl flex-1 transition-all duration-200 ${
                !toggleHiddenItems
                  ? "bg-TAF-100 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              التعليقات
            </button>
            <button
              onClick={() => {
                setToggleHiddenItems(true);
                setCurrentPage(1);
                setSearchQuery("");
              }}
              className={`px-1 sm:px-4 py-2 sm:py-3 text-xs sm:text-sm md:text-base md:rounded-bl-3xl rounded-bl-3xl font-medium flex-1 transition-all duration-200 ${
                toggleHiddenItems
                  ? "bg-TAF-100 text-white"
                  : "bg-white text-gray-700 hover:bg-gray-100"
              }`}
            >
              الإختبارات
            </button>
          </div>
        </div>
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 text-right">
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
            onChange={(value) => {
              setSearchQuery(value);
              setCurrentPage(1); // Reset to first page on search
            }}
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
                    <div
                      key={x.commentId}
                      className="bg-white border-y border-y-gray-100 border-x-4 border-x-TAF-300 rounded-lg w-full shadow-md hover:shadow-xl 
                    transition-shadow duration-300 flex flex-col h-full overflow-hidden"
                    >
                      <div className="p-5 space-y-4 flex-grow flex flex-col">
                        {/* User Info Section */}
                        <h2>
                          لقد تم اخفاء هذا التعليق بواسطة المشرف{" "}
                          {x.adminExecutedHide || "غير محدد"}
                        </h2>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900">
                              المستخدم:
                            </span>
                            <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                              {x.commentAuthor}
                            </span>
                          </div>
                        </div>

                        {/* Comment Content Section */}
                        <div className="bg-gray-50 p-3 rounded-md flex-grow overflow-hidden">
                          <div className="flex items-start space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 mt-1 flex-shrink-0">
                              محتوى التعليق:
                            </span>
                            <p
                              className="text-sm text-gray-600 break-words overflow-hidden text-ellipsis 
                          max-h-[100px] overflow-y-auto"
                            >
                              {x.commentContent}
                            </p>
                          </div>
                        </div>

                        {/* Hide Reason Section */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm font-semibold text-gray-900">
                            سبب الإخفاء:
                          </span>
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {x.hideReason || "غير محدد"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm font-semibold text-gray-900">
                            تاريخ الإخفاء:
                          </span>
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {formatTime(x?.hideDate).date.formatted ||
                              "غير محدد"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm font-semibold text-gray-900">
                            وقت الإخفاء:
                          </span>
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {formatTime(x?.hideDate).time.formatted ||
                              "غير محدد"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {x.reportId ? (
                            <>
                              <span className="text-sm font-semibold text-gray-900">
                                رقم البلاغ
                              </span>
                              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                {x.reportId}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">
                              تم اخفاء هذا التعليق من قبل المشرف مباشرة بدون
                              بلاغ
                            </span>
                          )}
                        </div>

                        {/* Unhide Button */}
                        {user.id === x.hideCreatorId && (
                          <div className="mt-auto flex items-center justify-center">
                            <button
                              onClick={() => handleUnhideComment(x.commentId)}
                              className="w-3/4 bg-red-500 text-white py-2 px-4 rounded-md 
                            hover:bg-red-600 transition-colors duration-200 
                            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50
                            active:scale-95"
                            >
                              اعادة إظهار التعليق
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  ))
                : // Quizzes Display
                  currentItems.map((x) => (
                    <div
                      key={x.quizId}
                      className="bg-white border-y border-y-gray-100 border-x-4 border-x-TAF-300 rounded-lg w-full shadow-md hover:shadow-xl 
                    transition-shadow duration-300 flex flex-col h-full overflow-hidden"
                    >
                      <div className="p-5 space-y-4 flex-grow flex flex-col">
                        {/* Quiz Info Section */}
                        <h2>
                          لقد تم اخفاء هذا الإختبار بواسطة المشرف{" "}
                          {x.adminExecutedHideName || "غير محدد"}
                        </h2>
                        <div className="flex items-center justify-between mb-3">
                          <div className="flex items-center space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900">
                              المستخدم:
                            </span>
                            <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                              {x.quizAuthor}
                            </span>
                          </div>
                        </div>

                        {/* Quiz Title Section */}
                        <div className="bg-gray-50 p-3 rounded-md flex-grow overflow-hidden">
                          <div className="flex items-start space-x-2 rtl:space-x-reverse">
                            <span className="text-sm font-semibold text-gray-900 mt-1 flex-shrink-0">
                              عنوان الإختبار:
                            </span>
                            <p
                              className="text-sm text-gray-600 break-words overflow-hidden text-ellipsis 
                          max-h-[100px] overflow-y-auto"
                            >
                              {x.quizTitle}
                            </p>
                          </div>
                        </div>

                        {/* Hide Reason Section */}
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm font-semibold text-gray-900">
                            سبب الإخفاء:
                          </span>
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {x.hideReason || "غير محدد"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm font-semibold text-gray-900">
                            تاريخ الإخفاء:
                          </span>
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {formatTime(x.hideDate).date.formatted ||
                              "غير محدد"}
                          </span>
                        </div>
                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          <span className="text-sm font-semibold text-gray-900">
                            وقت الإخفاء:
                          </span>
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {formatTime(x.hideDate).time.formatted ||
                              "غير محدد"}
                          </span>
                        </div>

                        <div className="flex items-center space-x-2 rtl:space-x-reverse">
                          {x.reportId ? (
                            <>
                              <span className="text-sm font-semibold text-gray-900">
                                رقم البلاغ
                              </span>
                              <span className="text-sm text-gray-600 truncate max-w-[200px]">
                                {x.reportId}
                              </span>
                            </>
                          ) : (
                            <span className="text-sm font-semibold text-gray-900">
                              تم اخفاء هذا الإختبار من قبل المشرف مباشرة بدون
                              بلاغ
                            </span>
                          )}
                        </div>

                        {/* Unhide Button */}
                        {user.id === x.adminExecutedHideId && (
                          <div className="mt-auto flex items-center justify-center">
                            <button
                              onClick={() => handleUnhideQuiz(x.quizId)}
                              className="w-3/4 bg-red-500 text-white py-2 px-4 rounded-md 
                            hover:bg-red-600 transition-colors duration-200 
                            focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50
                            active:scale-95"
                            >
                              اعادة إظهار الإختبار
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
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
