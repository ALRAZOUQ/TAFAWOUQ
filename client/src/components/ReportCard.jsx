import { toast } from "react-toastify";
import axios from "../api/axios";

export default function ReportCard({
  report,
  onReject,
  updateProperty,
}) {
  //console.log(report);
  async function onDeleteComment() {
    try {
      const response = await axios.put("/admin/hideComment", {
        reason:report.content,
        reportId: report.reportId,
        commentId: report.comment.id,
      });
   
      if (response.data.success) {
        //onReject(reportId); we do not need to delete the the report after hide the comment
        
        updateProperty(report.reportId, "isResolved", true);
        updateProperty(report.reportId, "isElementHidden", true);
        updateProperty(report.reportId, "adminExecutedHide", response.data.hiddenComment
          .adminExecutedHide);

        return true;
      }
    } catch (error) {
      console.error("Error hiding comment:", error);
      return false;
    }
    return false;
  }
  function handleDelet() {
    if (onDeleteComment()) {
      toast.success("تم اخفاء التعليق بنجاح");
    } else {
      toast.error("حدث خطأ أثناء اخفاء التعليق");
    }
  }

  async function onDeleteCommentAndBanUser() {
    try {
      const response = await axios.post("/admin/banUser", {
        reason:report.content,
        studentId: report.comment.authorId,
        reportId: report.reportId,
      });
      if (response.data.success) {
        await onDeleteComment();
        updateProperty(
          report.reportId,
          "adminExecutedBan",
          response.data.bannedUser.adminExecutedban
        );
        updateProperty(report.reportId, "isAuthorBanned", true);
        return true;
      }
    } catch (error) {
      console.error("Error banning user:", error);
      return false;
    }
  }
  function handleBan() {
    if (onDeleteCommentAndBanUser()) {
      toast.success("تم اخفاء التعليق و حظر المستخدم بنجاح");
    } else {
      toast.error("حدث خطأ أثناء اخفاء التعليق و حظر المستخدم");
    }
  }

  return (
    <div className="bg-white p-4 border rounded-lg shadow-md transition text-right w-full">
      <h2 className="text-lg font-bold mb-2">بلاغ</h2>
      <p className="font-semibold whitespace-normal break-words">
        السبب: {report.content}
      </p>
      <p className="mt-2 whitespace-normal break-words">
        التعليق: {report.comment.content}
      </p>
      <p className="mt-2 font-semibold whitespace-normal break-words">
        كاتب التعليق: {report.comment.authorName}
      </p>
      <p className="mt-2 font-semibold whitespace-normal break-words">
        الحالة: {report.isResolved ? "تمت المعالجة" : "تحت الانتظار"}
      </p>
      {console.log("report", report)}
      {report.isResolved && (
        <div className="mt-2 font-semibold whitespace-normal break-words">
          الاجراءات:
          <ul>
            {report.isElementHidden && (
              <li>
                تم اخفاء التعليق بواسطة:{" "}
                <span>{report.adminExecutedHide || "المشرف"}</span>
              </li>
            )}
            {report.isAuthorBanned && (
              <li>
                تم حظر المستخدم بواسطة:{" "}
                <span>{report.adminExecutedBan || "المشرف"}</span>
              </li>
            )}
          </ul>
        </div>
      )}

      <div className="mt-4 flex justify-start space-x-2 rtl:space-x-reverse">
        <button
          className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-700"
          onClick={() => onReject(report.reportId)}
        >
          رفض
        </button>
        <button
          className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-700"
          onClick={handleDelet}
        >
          اخفاء التعليق
        </button>
        <button
          className="bg-red-700 text-white px-4 py-2 rounded hover:bg-red-900"
          onClick={handleBan}
        >
          اخفاء التعليق و حظر المستخدم
        </button>
      </div>
    </div>
  );
}
