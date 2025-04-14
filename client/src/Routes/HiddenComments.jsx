import Screen from "../components/Screen";
import { useState, useEffect, lazy, Suspense } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useAuth } from "../context/AuthContext";
import { useRouteIfAuthorizedAndHeIsNotAdmin } from "../util/useRouteIfNotAuthorized";

// Lazy load Pagination component
const Pagination = lazy(() => import("../components/coursePageComponents/Pagination"));

export default function HiddenComments() {
  const { user } = useAuth();
  useRouteIfAuthorizedAndHeIsNotAdmin();
  const [hiddenComments, setHiddenComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using dummy data
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const commentsPerPage = 6;
  function formatTime(isoString) {
    const date = new Date(isoString);

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
  }
  async function fetchHiddenComments() {
    setIsLoading(true);
    try {
      const response = await axios.get("/admin/hiddenComments");
      if (response.status === 200) {
        setHiddenComments(response.data.hiddenComments);
        setIsLoading(false);
      }
    } catch (error) {
      console.error("Error fetching hidden comments:", error);
      toast.error("حدث خطأ أثناء جلب التعليقات المخفية");
      setIsLoading(false);
    }
  }
  useEffect(() => {
    fetchHiddenComments();
  }, []);
  
  // Preload Pagination component
  useEffect(() => {
    import("../components/coursePageComponents/Pagination");
  }, []);
  
  // Filter & pagination calculations
  const filteredComments = hiddenComments.filter((comment) => 
    comment.commentContent.toLowerCase().includes(searchQuery.toLowerCase())
  );
  
  const indexOfLastComment = currentPage * commentsPerPage;
  const indexOfFirstComment = indexOfLastComment - commentsPerPage;
  const currentComments = filteredComments.slice(indexOfFirstComment, indexOfLastComment);
  const totalPages = Math.ceil(filteredComments.length / commentsPerPage);

  const handleUnhide = async (commentId) => {
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
  if (hiddenComments.length === 0) {
    return (
      <Screen
        title="Banned Accounts"
        className="p-2 sm:p-4 md:p-6 flex items-center justify-center"
      >
        <div className="text-red-400 text-2xl">لا يوجد تعليقات مخفية</div>
      </Screen>
    );
  }
  return (
    <Screen title="Hidden Comments" className="p-2 sm:p-4 md:p-6">
      <div className="w-full  mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-right">
          التعليقات المخفية
        </h1>
        
        {/* Search input */}
        <div className="mb-4 px-4">
          <input
            type="text"
            placeholder="ابحث في التعليقات المخفية..."
            value={searchQuery}
            onChange={(e) => {
              setSearchQuery(e.target.value);
              setCurrentPage(1); // Reset to first page on search
            }}
            className="w-full p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-TAF-100"></div>
          </div>
        ) : (
          <div className="w-full px-4 py-6">
            <div className="grid grid-cols-1  md:grid-cols-2 gap-6">
              {currentComments.map((x) => (
                <div
                  key={x.commentId}
                  className="bg-white border-y border-y-gray-100 border-x-4 border-x-TAF-300 rounded-lg w-full shadow-md hover:shadow-xl 
            transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="p-5 space-y-4 flex-grow flex flex-col">
                    {/* User Info Section */}
                    <h2>
                      لقد تم اخفاء هذا التعليق بواسطة المشرف{" "}
                      {x.adminExecutedHide || "غير محدد"}
                    </h2>
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold  text-gray-900">
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
                        {formatTime(x.hideDate).date.formatted || "غير محدد"}
                      </span>
                    </div>
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-sm font-semibold text-gray-900">
                        وقت الإخفاء:
                      </span>
                      <span className="text-sm text-gray-600 truncate max-w-[200px]">
                        {formatTime(x.hideDate).time.formatted || "غير محدد"}
                      </span>
                    </div>

                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      {x.reportId ? (
                        <>
                          {" "}
                          <span className="text-sm font-semibold text-gray-900">
                            رقم البلاغ
                          </span>
                          <span className="text-sm text-gray-600 truncate max-w-[200px]">
                            {x.reportId}
                          </span>
                        </>
                      ) : (
                        <span className="text-sm font-semibold text-gray-900">
                          تم اخفاء هذا التعليق من قبل المشرف مباشرة بدون بلاغ
                        </span>
                      )}
                    </div>

                    {/* Unhide Button */}
                    {user.id === x.hideCreatorId && (
                      <div className="mt-auto flex items-center justify-center">
                        <button
                          onClick={() => handleUnhide(x.commentId)}
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
              ))}
            </div>
            
            {/* Pagination */}
            {hiddenComments.length > 0 && (
              <Suspense fallback={<div>Loading pagination...</div>}>
                <Pagination 
                  currentPage={currentPage} 
                  totalPages={totalPages} 
                  setCurrentPage={setCurrentPage} 
                />
              </Suspense>
            )}
          </div>
        )}
      </div>
    </Screen>
  );
}
