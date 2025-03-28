import { useState, memo, useCallback, useMemo } from "react";
import {
  ThumbsUp,
  MessageCircle,
  Tag,
  ChevronDown,
  ChevronUp,
  Send,
  MessageSquareWarning,
  Trash2,
} from "lucide-react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import GenericForm from "../GenericForm";
import { useAuth } from "../../context/authContext";

// Separate the avatar component for reusability
const UserAvatar = memo(({ name }) => (
  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
    <span className="text-blue-600 font-semibold">{name.charAt(0)}</span>
  </div>
));

export default function Comment({
  comment,
  isReply = false,
  courseId,
  onDelete,
}) {
  const [replies, setReplies] = useState([]);
  const [showReplies, setShowReplies] = useState(false);
  const [isLoadingReplies, setIsLoadingReplies] = useState(false);
  const [repliesLoaded, setRepliesLoaded] = useState(false);
  const [isLiked, setIsLiked] = useState(comment.isLiked);
  const [likesCount, setLikesCount] = useState(parseInt(comment.numOfLikes));
  const [isLikeLoading, setIsLikeLoading] = useState(false);
  const [showReplyForm, setShowReplyForm] = useState(false);
  const { user, isAuthorized } = useAuth();
  const { user, isAuthorized } = useAuth();
  const deleteFields = useMemo(
    () => [
      {
        name: "reason",
        label: "سبب الاخفاء",
        type: "textarea",
        required: true,
      },
      {
        name: "reason",
        label: "سبب الاخفاء",
        type: "textarea",
        required: true,
      },
    ],
    []
  );

  const reportFields = useMemo(
    () => [
      {
        name: "reportContent",
        label: "سبب الإبلاغ",
        type: "textarea",
        required: true,
        required: true,
      },
    ],
    []
  );
  const handleHideComment = useCallback(async (formData) => {
    try {
      const response = await axios.put("/admin/hideComment", {
        commentId: formData.id,
        reason: formData.reason,
        reportId: formData.reportId, // formData has 'reportId', it can be null or undefined (optional)
      });

      if (response.data.success) {
        onDelete(formData.id); //to delete the comment from the comments list
        toast.success("تم إخفاء التعليق بنجاح");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error("تم حذف هذا المقرر بالفعل");
        return;
      }
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "حدث خطأاثناء حذف الكومنت.");
      console.error("Error hiding comment:", error);
    }
  }, []);
  const handleHideComment = useCallback(async (formData) => {
    try {
      const response = await axios.put("/admin/hideComment", {
        commentId: formData.id,
        reason: formData.reason,
        reportId: formData.reportId, // formData has 'reportId', it can be null or undefined (optional)
      });

      if (response.data.success) {
        onDelete(formData.id); //to delete the comment from the comments list
        toast.success("تم إخفاء التعليق بنجاح");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error("تم حذف هذا المقرر بالفعل");
        return;
      }
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "حدث خطأاثناء حذف الكومنت.");
      console.error("Error hiding comment:", error);
    }
  }, []);

  const handleReportComment = useCallback(async (formData) => {
    try {
      // Prepare the data for the API call
      const reportData = {
        commentId: comment.id,
        reportContent: formData.reportContent,
      };

      // Call the API endpoint
      const response = await axios.post("/protected/reportComment", reportData);

      if (response.data.success) {
        toast.success("تم الإبلاغ عن التعليق بنجاح");
      }
      return { success: true };
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("حدث خطأ أثناء الإبلاغ عن التعليق");
      return { success: false, error };
    }
  }, []);
  const handleReportComment = useCallback(async (formData) => {
    try {
      // Prepare the data for the API call
      const reportData = {
        commentId: comment.id,
        reportContent: formData.reportContent,
      };

      // Call the API endpoint
      const response = await axios.post("/protected/reportComment", reportData);

      if (response.data.success) {
        toast.success("تم الإبلاغ عن التعليق بنجاح");
      }
      return { success: true };
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("حدث خطأ أثناء الإبلاغ عن التعليق");
      return { success: false, error };
    }
  }, []);
  const handleToggleReplies = async () => {
    if (showReplies) {
      setShowReplies(false);
      return;
    }

    if (repliesLoaded) {
      setShowReplies(true);
      return;
    }

    setIsLoadingReplies(true);
    try {
      const response = await axios.get(`/auth/replies/${comment.id}`);

      if (response.data.success) {
        setReplies(response.data.comments);
        setRepliesLoaded(true);
      } else {
        throw new Error(response.data.message || "Failed to fetch replies");
      }
    } catch (error) {
      console.error("Error fetching replies:", error);
      setReplies([]);
    } finally {
      setIsLoadingReplies(false);
      setShowReplies(true);
    }
  };

  // Handle like toggle
  const handleLikeToggle = async () => {
    if (isLikeLoading) return;

    setIsLikeLoading(true);
    try {
      const response = await axios.post("/protected/toggleLikeComment", {
        commentId: comment.id,
      });

      if (response.data.success) {
        // Toggle like state and update count
        setIsLiked(!isLiked);
        setLikesCount((prevCount) => (isLiked ? prevCount - 1 : prevCount + 1));
      }
    } catch (error) {
      console.error("Error toggling like:", error);
    } finally {
      setIsLikeLoading(false);
    }
  };

  // Handle adding a new reply
  const handleReplyAdded = (newReply) => {
    setReplies((prev) => [newReply, ...prev]);

    // Update reply count
    comment.numOfReplies = (parseInt(comment.numOfReplies) || 0) + 1;

    // Make sure replies are visible after adding a new one
    if (!showReplies) {
      setShowReplies(true);
    }

    // Mark replies as loaded
    setRepliesLoaded(true);
  };

  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm hover:shadow-md transition-shadow space-y-3 mb-4 ${
        isReply ? "ml-8" : ""
      }`}>
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <UserAvatar name={comment.authorName} />
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

      <p className="text-gray-700 py-2 text-right break-words whitespace-normal">
        {comment.content}
      </p>

      <div className="flex justify-between items-center border-t border-gray-100 pt-2">
        <div className="flex gap-6">
          {isAuthorized && (
            <button
              className={`flex items-center gap-2 ${
                isLiked ? "text-blue-600" : "text-gray-600"
              } hover:text-blue-600 transition-colors`}
              onClick={handleLikeToggle}
              disabled={isLikeLoading}>
              <ThumbsUp size={18} />
              <span className="text-sm">{likesCount} اعجبني</span>
            </button>
          )}
          {isAuthorized && !isReply && (
            <button
              className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
              onClick={() => setShowReplyForm(!showReplyForm)}>
              <MessageCircle size={18} />
              <span className="text-sm">{comment.numOfReplies} رد</span>
            </button>
          )}
          <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
            <Tag size={18} />
            <span className="text-sm">{comment.tag}</span>
          </button>

          {isAuthorized && (
            <GenericForm
              itemId={comment.id}
              title="ابلاغ"
              fields={reportFields}
              submitButtonText="ابلاغ"
              onSubmit={(formData) => {
                handleReportComment(formData);
              }}>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MessageSquareWarning size={18} />
                <span className="text-sm">ابلاغ</span>
              </button>
            </GenericForm>
          )}
          {/* Make sure we're properly checking if the user is an admin */}
          {isAuthorized && user.isAdmin && (
            <GenericForm
              itemId={comment?.id}
              title="اخفاء تعليق"
              fields={deleteFields}
              submitButtonText="اخفاء"
              onSubmit={(formData) => {
                handleHideComment(formData);
              }}>
              <button
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                type="button">
                <Trash2 size={18} />
                <span className="text-sm">اخفاء</span>
              </button>
            </GenericForm>
          )}
        </div>
        {comment.numOfReplies > 0 && (
          <ReplyToggleButton
            isLoading={isLoadingReplies}
            showReplies={showReplies}
            onClick={handleToggleReplies}
          />
        )}
      </div>

      {/* Reply Form */}
      {showReplyForm && !isReply && (
        <ReplyForm
          parentId={comment.id}
          onReplyAdded={handleReplyAdded}
          onCancel={() => setShowReplyForm(false)}
          courseId={courseId}
        />
      )}

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

// Separate the reply toggle button for cleaner code
const ReplyToggleButton = ({ isLoading, showReplies, onClick }) => (
  <button
    onClick={onClick}
    className="text-gray-600 hover:text-blue-600 flex items-center gap-1 transition-colors"
    disabled={isLoading}>
    {isLoading ? (
      "جاري التحميل..."
    ) : showReplies ? (
      <>
        إخفاء الردود
        <ChevronUp size={18} />
      </>
    ) : (
      <>
        عرض الردود
        <ChevronDown size={18} />
      </>
    )}
  </button>
);

// Reply form component
const ReplyForm = ({ parentId, courseId, onReplyAdded, onCancel }) => {
  const [replyContent, setReplyContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitReply = async () => {
    if (!replyContent.trim()) return;

    setIsSubmitting(true);
    try {
      const response = await axios.post("/protected/postComment", {
        courseId,
        parentCommentId: parseInt(parentId),
        content: replyContent,
        tag: "رد", // Default tag for replies
      });

      if (response.data.success && response.data.comment) {
        toast.success("تم إضافة الرد بنجاح");
        onReplyAdded(response.data.comment);
        setReplyContent("");
        onCancel();
      }
    } catch (error) {
      console.error("Error posting reply:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="mt-3 bg-gray-50 p-3 rounded-lg">
      <textarea
        className="w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 text-right"
        placeholder="اكتب ردك هنا..."
        value={replyContent}
        onChange={(e) => setReplyContent(e.target.value)}
        disabled={isSubmitting}></textarea>
      <div className=" mt-2">
        <div className="flex flex-row gap-2">
          <button
            className={`px-3 py-1 bg-blue-500 text-white rounded-md flex items-center gap-1 ${
              isSubmitting
                ? "opacity-70 cursor-not-allowed"
                : "hover:bg-blue-600"
            }`}
            onClick={handleSubmitReply}
            disabled={isSubmitting || !replyContent.trim()}>
            <Send size={14} /> إرسال
          </button>
          <button
            className="px-3 py-1 bg-gray-200 text-gray-700 rounded-md mr-2"
            onClick={onCancel}
            disabled={isSubmitting}>
            إلغاء
          </button>
        </div>
      </div>
    </div>
  );
};
