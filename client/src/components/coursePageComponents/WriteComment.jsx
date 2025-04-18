import React, { useState, useCallback, memo } from "react";
import { Send, X } from "lucide-react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

// Tag Selection Modal Component
const TagSelectionModal = ({ isOpen, onClose, onSelectTag }) => {
  // Move tags inside the component
  const tags = ["عملي", "محاضرة", "ملاحظات", "عام", "مراجعة", "سؤال"];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-gray-500 bg-opacity-50">
      <div className="bg-white p-4 rounded-lg shadow-lg w-80">
        <div className="flex justify-between items-center mb-3">
          <h3 className="text-lg font-semibold">اختر وسمًا</h3>
          <button onClick={onClose}>
            <X size={20} />
          </button>
        </div>
        <div className="grid grid-cols-2 gap-2">
          {tags.map((tag) => (
            <button
              key={tag}
              className="px-4 py-2 bg-gray-100 rounded-lg hover:bg-gray-200"
              onClick={() => onSelectTag(tag)}>
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};

export default function WriteComment({ courseId, onCommentAdded }) {
  const [comment, setComment] = useState("");
  const [showTags, setShowTags] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Post Button Click Handler
  const handlePost = useCallback(() => {
    if (!comment.trim()) {
      toast.error("الرجاء كتابة تعليق");
      return;
    }
    setShowTags(true);
  }, [comment]);

  // Tag Selection Handler
  const handleTagSelection = useCallback(
    async (tag) => {
      setShowTags(false);
      setIsSubmitting(true);

      try {
        const { data, status } = await axios.post("/protected/postComment", {
          courseId,
          content: comment,
          tag,
        });

        if (status === 201) {
          toast.success("تم إضافة التعليق بنجاح");
          setComment("");

          // Notify parent with the new comment data
          if (onCommentAdded && data.comment) {
            onCommentAdded(data.comment);
          }
        }
      } catch (error) {
        console.error("Error adding comment:", error);
        toast.error(error.response?.data?.message || "حدث خطأ أثناء إضافة التعليق");
      } finally {
        setIsSubmitting(false);
      }
    },
    [comment, courseId, onCommentAdded]
  );

  return (
    <div className="w-full bg-white p-4 shadow-md rounded-lg border border-gray-200 mb-4">
      <textarea
        className="w-full p-3 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
        placeholder="اكتب تعليقك هنا..."
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        disabled={isSubmitting}></textarea>

      <div className="flex justify-between items-center mt-2">
        <button
          className={`bg-blue-500 text-white px-4 py-2 rounded-lg flex items-center gap-2 ${
            isSubmitting ? "opacity-70 cursor-not-allowed" : "hover:bg-blue-600"
          }`}
          onClick={handlePost}
          disabled={isSubmitting}>
          <Send size={16} /> نشر
        </button>
      </div>

      <TagSelectionModal
        isOpen={showTags}
        onClose={() => setShowTags(false)}
        onSelectTag={handleTagSelection}
      />
    </div>
  );
}
