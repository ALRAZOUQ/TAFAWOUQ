import { toast } from "react-toastify";
import axios from "../api/axios";

export default function ReportCard({
  reason,
  comment,

  reportId,

  onReject,
}) {
  console.log(comment);
  async function onDeleteComment() {
    try {
      const response = await axios.put("/admin/hideComment", {
        reason,
        reportId,
        commentId: comment.id,
      });
      if (response.data.success) {
        onReject(reportId);
        toast.success("تم حذف التعليق بنجاح");
      }
    } catch (error) {
      console.error("Error hiding comment:", error);
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
        toast.success("تم حظر المستخدم بنجاح");
      }
    } catch (error) {
      console.error("Error banning user:", error);
    }
  }

  return (
    <div className="bg-white p-4 border rounded-lg shadow-md transition text-right w-full">
      <h2 className="text-lg font-bold mb-2">بلاغ</h2>
      <p className="font-semibold">السبب: {reason}</p>
      <p className="mt-2 whitespace-pre-line">التعليق: {comment.content}</p>
      <p className="mt-2 font-semibold">كاتب التعليق: {comment.authorName}</p>
      <div className="mt-4 flex justify-start space-x-2 rtl:space-x-reverse">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => onReject(reportId)}
        >
          رفض
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={onDeleteComment}
        >
          حذف التعليق
        </button>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
          onClick={onDeleteCommentAndBanUser}
        >
          حذف التعليق و حظر المستخدم
        </button>
      </div>
    </div>
  );
}
