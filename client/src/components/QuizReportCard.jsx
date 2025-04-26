import React from "react";

export default function QuizReportCard({
  quiz,
  adminExecutedHide,
  adminExecutedBan,
  isAuthorBanned,
  isElementHidden,
}) {
  if (!quiz) return null;

  return (
    <div className="w-full sm:w-auto bg-white rounded-2xl shadow-md p-4 flex flex-col gap-2 transition-transform hover:scale-[1.01]">
      <div className="text-lg sm:text-xl font-semibold text-gray-800 break-words">
        {quiz.title || "Untitled Quiz"}
      </div>

      <div className="text-sm text-gray-600">
        <span className="font-medium">Author:</span> {quiz.author || "Unknown"}
      </div>

      <div className="flex flex-col gap-1 text-sm">
        {isElementHidden && (
          <span className="text-red-600">⚠️ Quiz is hidden.</span>
        )}
        {adminExecutedHide && (
          <span className="text-yellow-600">🔒 Hidden by admin.</span>
        )}
        {isAuthorBanned && (
          <span className="text-red-500">🚫 Author is banned.</span>
        )}
        {adminExecutedBan && (
          <span className="text-red-700 font-semibold">
            🚨 Banned by admin.
          </span>
        )}
      </div>
    </div>
  );
}
