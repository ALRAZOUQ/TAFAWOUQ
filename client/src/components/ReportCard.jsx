import { useState } from "react";

export default function ReportCard({
  reason = "سبب بلاغ وهمي الرجاء حذفه لئلا يظهر للمستخدمين",
  comment,
  commentWriter,
  onReject,
  onDeleteComment,
  onBanUser,
}) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div
        onClick={() => setIsOpen(true)}
        className="cursor-pointer p-4 border rounded-lg shadow-md hover:shadow-lg transition"
      >
        <p className="font-semibold"> {reason}السبب: </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-fit">
            <h2 className="text-lg font-bold mb-4">تفاصيل البلاغ</h2>
            <p className="font-semibold"> {reason} السبب</p>
            <p className="mt-2"> {comment}التعليق:</p>
            <p className="mt-2 font-semibold">{commentWriter}</p>
            <div className="mt-4 flex justify-end space-x-2">
              <button
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  onReject();
                  setIsOpen(false);
                }}
              >
                رفض
              </button>
              <button
                className="bg-yellow-500 text-white px-4 py-2 rounded hover:bg-yellow-600"
                onClick={() => {
                  onDeleteComment();
                  setIsOpen(false);
                }}
              >
                حذف التعليق
              </button>
              <button
                className="bg-gray-800 text-white px-4 py-2 rounded hover:bg-gray-900"
                onClick={() => {
                  onBanUser();
                  setIsOpen(false);
                }}
              >
                حذف التعليق و حظر المستخدم
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
