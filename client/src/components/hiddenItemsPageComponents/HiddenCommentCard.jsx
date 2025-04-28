export default function HiddenCommentCard({ x,user,handleUnhideComment,formatTime }) {
  return (
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
            {formatTime(x?.hideDate).date.formatted || "غير محدد"}
          </span>
        </div>
        <div className="flex items-center space-x-2 rtl:space-x-reverse">
          <span className="text-sm font-semibold text-gray-900">
            وقت الإخفاء:
          </span>
          <span className="text-sm text-gray-600 truncate max-w-[200px]">
            {formatTime(x?.hideDate).time.formatted || "غير محدد"}
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
              تم اخفاء هذا التعليق من قبل المشرف مباشرة بدون بلاغ
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
  );
}
