import { toast } from "react-toastify";
import axios from "../api/axios";

export default function ReportCard({ reason, comment, reportId, onReject }) {
  console.log(comment);
  async function onDeleteComment() {
    try {
      const response = await axios.put("/admin/hideComment", {
        reason,
        reportId:reportId,
        commentId: comment.id,
      });
      if (response.data.success) {
        onReject(reportId);
        return true;
      }
    } catch (error) {
      console.error("Error hiding comment:", error);
      return false;
    }
    return false;
  }
  function handleDelet() {
    if (onDeleteComment()) {
      toast.success("تم حذف التعليق بنجاح");
    } else {
      toast.error("حدث خطأ أثناء حذف التعليق");
    }
  }

  async function onDeleteCommentAndBanUser() {
    try {
      const response = await axios.post("/admin/banUser", {
        reason,
        studentId: comment.authorId,
        reportId,
      });
      if (response.data.success) {
        await onDeleteComment();

        return true;
      }
    } catch (error) {
      console.error("Error banning user:", error);
      return false;
    }
  }
  function handleBan() {
    if (onDeleteCommentAndBanUser()) {
      toast.success("تم حذف التعليق و حظر المستخدم بنجاح");
    } else {
      toast.error("حدث خطأ أثناء حذف التعليق و حظر المستخدم");
    }
  }

  return (
    <div className="bg-white p-4 border rounded-lg shadow-md transition text-right w-full">
      <h2 className="text-lg font-bold mb-2">بلاغ</h2>
      <p className="font-semibold whitespace-normal break-words">السبب: {reason}</p>
      <p className="mt-2 whitespace-normal break-words">التعليق: {comment.content}</p>
      <p className="mt-2 font-semibold whitespace-normal break-words">كاتب التعليق: {comment.authorName}</p>
      <div className="mt-4 flex justify-start space-x-2 rtl:space-x-reverse">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => onReject(reportId)}
        >
          رفض
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleDelet}
        >
          حذف التعليق
        </button>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
          onClick={handleBan}
        >
          حذف التعليق و حظر المستخدم
        </button>
      </div>
    </div>
  );
}
