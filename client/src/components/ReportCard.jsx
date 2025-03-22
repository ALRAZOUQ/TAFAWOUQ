import { useState } from "react";
export default function ReportCard({
  reason = "سبب بلاغ وهمي الرجاء حذفه لئلا يظهر للمستخدمين",
  comment,
  commentWriter,
  onReject,
}) {
  const [isOpen, setIsOpen] = useState(false);
  function onDeleteComment() {}
  return (
    <div className="bg-white p-4 border rounded-lg shadow-md transition text-right w-full">
      <h2 className="text-lg font-bold mb-2">بلاغ</h2>
      <p className="font-semibold">السبب: {reason}</p>
      <p className="mt-2 whitespace-pre-line">التعليق: {comment}</p>
      <p className="mt-2 font-semibold">كاتب التعليق: {commentWriter}</p>
      <div className="mt-4 flex justify-start space-x-2 rtl:space-x-reverse">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={onReject}
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
          onClick={onBanUser}
        >
          حذف التعليق و حظر المستخدم
        </button>
      </div>
    </div>
  );
}
