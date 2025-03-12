import { useState, useEffect } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Tag,
  ChevronDown,
  ChevronUp,
} from "lucide-react";
import axios from "../../api/axios";

export default function Comment({ comment, isReply = false }) {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);

  useEffect(() => {
    async function fetchReplies(commentId) {
      try {
        const response = await axios.get(`/auth/replies/${commentId}`, {
          withCredentials: true,
        });

        if (response.data.success) {
          setReplies(response.data.comments);
        } else {
          throw new Error(response.data.message || "Failed to fetch replies");
        }
      } catch (error) {
        console.error("Error fetching replies:", error);
        setReplies([]);
      }
    }

    fetchReplies(comment.id);
  }, []);

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3 mb-4 ${
        isReply ? "ml-8" : ""
      }`}
    >
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
            <span className="text-blue-600 font-semibold">
              {comment.authorName.charAt(0)}
            </span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              {comment.authorName}
            </h3>
            <small className="text-gray-500 text-sm">
              {new Date(comment.creationDate).toLocaleDateString("ar-SA")}
            </small>
          </div>
        </div>
        <span className="px-3 py-1 bg-gray-100 text-gray-600 text-sm rounded-full">
          {comment.tag}
        </span>
      </div>

      <p className="text-gray-700 py-2 text-right">{comment.content}</p>

      <div className="flex justify-between items-center border-t border-gray-100 pt-2">
        <div className="flex gap-6">
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <ThumbsUp size={18} />
            <span className="text-sm">{comment.numOfLikes} إعجاب</span>
          </button>
          {!isReply && (
            <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
              <MessageCircle size={18} />
              <span className="text-sm">{comment.numOfReplies} رد</span>
            </button>
          )}
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Tag size={18} />
            <span className="text-sm">{comment.tag}</span>
          </button>
        </div>

        {/* Toggle Button for Replies */}
        {replies.length > 0 && (
          <button
            onClick={() => setShowReplies(!showReplies)}
            className="text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
          >
            {showReplies ? "إخفاء الردود" : "عرض الردود"}
            {showReplies ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        )}
      </div>

      {/* Replies Section */}
      {showReplies && replies.length > 0 && (
        <div className="mt-4 space-y-3">
          {replies.map((reply) => (
            <Comment key={reply.id} comment={reply} isReply={true} />
          ))}
        </div>
      )}
    </div>
  );
}
