import React, { useState } from "react";
import { Send, X } from "lucide-react";

export default function WriteComment({ onSubmit }) {
  const [comment, setComment] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [selectedTag, setSelectedTag] = useState(null);

  const tags = ["عملي", "محاضرة", "ملاحظات", "عام", "مراجعة", "عام"];

  function handlePost() {
    if (!comment.trim()) return;
    setShowTags(true);
  }

  function handleTagSelection(tag) {
    setSelectedTag(tag);
    setShowTags(false);
    onSubmit({ content: comment, tag });
    setComment("");
    setSelectedTag(null);
  }

  return (
    <div className="w-full bg-white p-4 shadow-md rounded-lg border border-gray-200 mb-4">
      <textarea
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="اكتب تعليقك هنا..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      ></textarea>
      <div className="flex justify-between items-center mt-2">
        <button
          className="bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-600"
          onClick={handlePost}
        >
          <Send size={16} /> نشر
        </button>
      </div>

      {showTags && (
        <div className="absolute top-0 left-0 w-full h-full flex justify-center items-center bg-gray-500 bg-opacity-50">
          <div className="bg-white p-4 rounded-lg shadow-lg w-80">
            <div className="flex justify-between items-center mb-3">
              <h3 className="text-lg font-semibold">اختر وسمًا</h3>
              <button onClick={() => setShowTags(false)}>
                <X size={20} />
              </button>
            </div>
            <div className="grid grid-cols-2 gap-2">
              {tags.map((tag) => (
                <button
                  key={tag}
                  className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
                  onClick={() => handleTagSelection(tag)}
                >
                  {tag}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
