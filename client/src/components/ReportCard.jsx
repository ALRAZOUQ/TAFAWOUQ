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
        className="cursor-pointer bg-white p-4 border rounded-lg shadow-md hover:shadow-lg transition text-right"
      >
        <p className="font-semibold"> السبب: {reason} </p>
      </div>

      {isOpen && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-fit text-right">
            <h2 className="text-lg font-bold mb-4">تفاصيل البلاغ</h2>
            <p className="font-semibold"> السبب: {reason} </p>
            <p className="mt-2">التعليق: {comment}</p>
            <p className="mt-2 font-semibold">كاتب التعليق: {commentWriter}</p>
            <div className="mt-4 flex justify-start space-x-2 rtl:space-x-reverse">
              <button
                className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
                onClick={() => {
                  onReject();
                  setIsOpen(false);
                }}
              >
                رفض
              </button>
              <button
                className="bg-red-400 text-white px-4 py-2 rounded hover:bg-red-600"
                onClick={() => {
                  onDeleteComment();
                  setIsOpen(false);
                }}
              >
                حذف التعليق
              </button>
              <button
                className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
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
