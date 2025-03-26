import Screen from "../components/Screen";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useRouteIfAuthorizedAndHeIsNotAdmin } from "../util/useRouteIfNotAuthorized";

export default function HiddenComments() {
  useRouteIfAuthorizedAndHeIsNotAdmin();
  const [hiddenComments, setHiddenComments] = useState([]);
  const [isLoading, setIsLoading] = useState(false); // Set to false since we're using dummy data

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

  const handleUnhide = async (commentId) => {
    try {
      const response = await axios.put(`/admin/unhideComment`, { commentId });
      if (response.status === 200) {
        setHiddenComments((prev) =>
          prev.filter((comment) => comment.id !== commentId)
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
      <div className="w-full max-w-7xl mx-auto">
        <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-gray-800 mb-4 sm:mb-6 text-center sm:text-right">
          التعليقات المخفية
        </h1>
        {isLoading ? (
          <div className="flex justify-center items-center h-32 sm:h-64">
            <div className="animate-spin rounded-full h-8 w-8 sm:h-12 sm:w-12 border-t-2 border-b-2 border-TAF-100"></div>
          </div>
        ) : (
          <div className="container mx-auto px-4 py-6">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {hiddenComments.map((comment) => (
                <div
                  key={comment.id}
                  className="bg-white border border-gray-100 rounded-lg shadow-md hover:shadow-xl 
            transition-shadow duration-300 flex flex-col h-full"
                >
                  <div className="p-5 space-y-4 flex-grow flex flex-col">
                    {/* User Info Section */}
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex items-center space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold  text-gray-900">
                          المستخدم:
                        </span>
                        <span className="text-sm font-semibold text-gray-900 truncate max-w-[200px]">
                          {comment.author}
                        </span>
                      </div>
                    </div>

                    {/* Comment Content Section */}
                    <div className="bg-gray-50 p-3 rounded-md flex-grow overflow-hidden">
                      <div className="flex items-start space-x-2 rtl:space-x-reverse">
                        <span className="text-sm font-semibold text-gray-900 mt-1 flex-shrink-0">
                          التعليق:
                        </span>
                        <p
                          className="text-sm text-gray-600 break-words overflow-hidden text-ellipsis 
                    max-h-[100px] overflow-y-auto"
                        >
                          {comment.content}
                        </p>
                      </div>
                    </div>

                    {/* Hide Reason Section */}
                    <div className="flex items-center space-x-2 rtl:space-x-reverse">
                      <span className="text-sm font-semibold text-gray-900">
                        سبب الإخفاء:
                      </span>
                      <span className="text-sm text-gray-600 truncate max-w-[200px]">
                        {comment.hideReason || "غير محدد"}
                      </span>
                    </div>

                    {/* Unhide Button */}
                    <div className="mt-auto">
                      <button
                        onClick={() => handleUnhide(comment.id)}
                        className="w-full bg-red-500 text-white py-2 px-4 rounded-md 
                    hover:bg-red-600 transition-colors duration-200 
                    focus:outline-none focus:ring-2 focus:ring-red-400 focus:ring-opacity-50
                    active:scale-95"
                      >
                        إظهار التعليق
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </Screen>
  );
}
