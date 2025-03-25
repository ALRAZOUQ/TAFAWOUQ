import Screen from "../components/Screen";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";

// Dummy
const dummyHiddenComments = [
  {
    id: 1,
    content: "This is a hidden comment for testing purposes",
    user: { name: "John Doe" },
    reason: "Inappropriate content",
  },
  {
    id: 2,
    content: "Another hidden comment with different content",
    user: { name: "Jane Smith" },
    reason: "Spam content",
  },
  {
    id: 3,
    content: "Third hidden comment for UI testing",
    user: { name: "Alex Johnson" },
    reason: "Offensive language",
  },
];

export default function HiddenComments() {
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
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {hiddenComments?.map((comment) => (
              <div
                key={comment.id}
                className="bg-gray-50 shadow-md hover:shadow-lg rounded-lg p-4 space-y-3"
              >
                <div className="space-y-2">
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">
                      المستخدم
                    </span>
                    <span className="text-sm text-gray-900">
                      {comment.author}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">
                      محتوى التعليق
                    </span>
                    <span className="text-sm text-gray-900 break-all">
                      {comment.content}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-xs font-medium text-gray-500">
                      السبب
                    </span>
                    <span className="text-sm text-gray-900">
                      {comment.hideReason}
                    </span>
                  </div>
                </div>
                <div className="flex justify-center">
                  <button
                    onClick={() => handleUnhide(comment.id)}
                    className="w-1/2 bg-red-500 hover:opacity-85 active:opacity-65 hover:shadow-md text-white font-bold py-2 px-4 rounded-md transition duration-200 text-sm"
                  >
                    إظهار التعليق
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </Screen>
  );
}
