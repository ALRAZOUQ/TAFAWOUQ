import { toast } from "react-toastify";
import axios from "../api/axios";
import { CodeSquare, Flag, MessageSquareMore, UserPen } from "lucide-react";
import { AnimatePresence, motion } from "framer-motion";
import { useAuth } from "@/context/authContext";

export default function ReportCard({ report, onReject, updateProperty }) {
  console.log(`report ${report.comment.content} :>> `, report);
  /** obj of the current admin info */
  const { user: me } = useAuth();
  return (
    <div className="  bg-white p-4  rounded-2xl shadow-md  text-right  h-full flex flex-col   border-y border-y-gray-200 border-x- border-x-TAF-300 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto ">
      {/* <h2 className="text-lg font-bold mb-2">بلاغ</h2> */}
      <p className="flex items-center gap-1">
        <Flag className="size-4  text-gray-500" />
        <span className="font-semibold">السبب:</span> {report.content}
      </p>
      <p className="flex  gap-1 mt-2 ">
        <MessageSquareMore className="size-4  text-gray-500" />

        <span className="font-semibold overflow-clip ">التعليق: </span>
        {report.comment.content}
      </p>
      <p className="flex items-center gap-1 mt-2 ">
        <UserPen className="size-4  text-gray-500" />

        <span className="font-semibold">الكاتـب: </span>
        {report.comment.authorName}
      </p>
      {/* <p className="mt-2  whitespace-normal break-words">
        <span className="font-semibold">الحالة: </span>
        {report.isResolved ? "تمت المعالجة" : "تحت الانتظار"}
      </p> */}
      <div className="flex flex-1"> </div>
      {report.isResolved && (
        //  !(report.isAuthorBanned && !report.isElementHidden) &&
        <div className="mt-2 font-semibold whitespace-normal break-words spc">
          <ul
            className="text-center bg-gray-300 rounded-xl text-xs font-semibold px-3 py-2 "
            style={{ wordSpacing: "0.3rem" }}>
            {report.isElementHidden && !report.isAuthorBanned && (
              <li>
                تم اخفاء التعليق بواسطة: <span>{report.adminExecutedHide || "المشرف"}</span>
                {me.name.startsWith(report.adminExecutedHide) && (
                  <span
                    className="underline ps-4 text-blue-800 cursor-pointer"
                    onClick={() => {
                      unHideComment(report.comment.id);
                    }}>
                    تراجع؟
                  </span>
                )}
              </li>
            )}
            {report.isAuthorBanned && (
              <li>
                تم حظره وإخفاؤه بواسطة: <span>{report.adminExecutedBan || "المشرف"}</span>
                {me.name.startsWith(report.adminExecutedBan) && (
                  <span
                    className="underline ps-4 text-blue-800 cursor-pointer"
                    onClick={() => {
                      unBan(report.authorId);
                      unHideComment(report.comment.id);
                    }}>
                    تراجع؟
                  </span>
                )}
              </li>
            )}
          </ul>
        </div>
      )}
      {/*  */}
      {!report.isResolved && (
        <div className="mt-4 flex justify-between space-x-1 rtl:space-x-reverse">
          <button
            className="bg-green-500 w-1/4 rounded-xl text-xs font-semibold text-white px-3 py-2 hover:bg-green-700"
            onClick={() => onReject(report.reportId)}>
            رفض
          </button>
          <button
            className="bg-red-500 w-1/4 rounded-xl text-xs font-semibold text-white px-3 py-2 hover:bg-red-700"
            onClick={handleDelet}>
            اخفاء
          </button>
          <button
            className="bg-red-700 w-2/4 rounded-xl text-xs font-semibold text-white px-3 py-2 hover:bg-red-900"
            onClick={handleBan}
            title="اخفاء التعليق و حظر المستخدم">
            اخفاء و حظر المستخدم
          </button>
        </div>
      )}
    </div>
  );

  // ==================================================

  async function unBan(userId) {
    try {
      const response = await axios.put("/admin/unBanUser", {
        studentId: userId,
      });
      if (response.status === 200) {
        updateProperty(report.reportId, "isResolved", false);
        updateProperty(report.reportId, "isAuthorBanned", false);
        updateProperty(report.reportId, "adminExecutedHide", null);
        toast.success("تم فك الحظر بنجاح");
      }
    } catch (error) {
      // dirty code because you are  dirty
      // console.error("Failed to unban account:", error);
      // setBannedAccounts((prev) => prev.filter((acc) => acc.result.user.id !== userId));
      // toast.success("تم فك الحظر بنجاح");
      toast.error("حدث خطأ أثناء فك الحظر");
    }
  }
  // ===========================================================
  async function unHideComment(commentId) {
    try {
      const response = await axios.put(`/admin/unhideComment`, { commentId });
      if (response.status === 200) {
        updateProperty(report.reportId, "isResolved", false);
        updateProperty(report.reportId, "isElementHidden", false);
        updateProperty(report.reportId, "adminExecutedHide", null);

        toast.success("تم إظهار التعليق بنجاح");
      } else {
        toast.error("حدث خطأ أثناء إظهار التعليق");
      }
    } catch (error) {
      console.error("Error unhiding comment:", error);
      // dirty code
      // updateProperty(report.reportId, "isResolved", false);
      // updateProperty(report.reportId, "isElementHidden", false);
      // updateProperty(report.reportId, "adminExecutedHide", null);

      toast.error("حدث خطأ أثناء إظهار التعليق");
    }
  }
  // ==================================================

  async function onDeleteComment() {
    try {
      const response = await axios.put("/admin/hideComment", {
        reason: report.content,
        reportId: report.reportId,
        commentId: report.comment.id,
      });

      if (response.data.success) {
        //onReject(reportId); we do not need to delete the the report after hide the comment

        updateProperty(report.reportId, "isResolved", true);
        updateProperty(report.reportId, "isElementHidden", true);
        updateProperty(report.reportId, "adminExecutedHide", response.data.hiddenComment.adminExecutedHide);

        return true;
      }
    } catch (error) {
      console.error("Error hiding comment:", error);
      return false;
    }
    return false;
  }

  // ==================================================

  function handleDelet() {
    if (onDeleteComment()) {
      toast.success("تم اخفاء التعليق بنجاح");
    } else {
      toast.error("حدث خطأ أثناء اخفاء التعليق");
    }
  }

  // ==================================================

  async function onDeleteCommentAndBanUser() {
    try {
      const response = await axios.post("/admin/banUser", {
        reason: report.content,
        studentId: report.comment.authorId,
        reportId: report.reportId,
      });
      if (response.data.success) {
        await onDeleteComment();
        updateProperty(report.reportId, "adminExecutedBan", response.data.bannedUser.adminExecutedban);
        updateProperty(report.reportId, "isAuthorBanned", true);
        return true;
      }
    } catch (error) {
      console.error("Error banning user:", error);
      return false;
    }
  }

  // ==================================================

  function handleBan() {
    if (onDeleteCommentAndBanUser()) {
      toast.success("تم اخفاء التعليق و حظر المستخدم بنجاح");
    } else {
      toast.error("حدث خطأ أثناء اخفاء التعليق و حظر المستخدم");
    }
  }
}
