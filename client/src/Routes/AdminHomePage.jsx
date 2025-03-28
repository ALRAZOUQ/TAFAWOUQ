import { useEffect, useState } from "react";
import axios from "../api/axios";
import ReportCard from "../components/ReportCard";
import { toast } from "react-toastify";
import Screen from "../components/Screen";
import { useRouteIfAuthorizedAndHeIsNotAdmin } from "../util/useRouteIfNotAuthorized";
import CreateTermModal from "../components/CreateTermModal";

export default function AdminHomePage() {
  useRouteIfAuthorizedAndHeIsNotAdmin();
  const [reports, setReports] = useState([]);

  useEffect(() => {
    const fetchReports = async () => {
      try {
        const response = await axios.get("/admin/reports/comments");
        if (response.data.success) {
          setReports(response.data.reports);
        }
      } catch (error) {
        console.error("Error fetching reports:", error);
      }
    };

    fetchReports();
  }, []);

  async function onReject(reportId) {
    try {
      const response = await axios.delete("/admin/deleteReport", {
        data: { reportId },
      });
      if (response.data.success) {
        setReports(reports.filter((report) => report.reportId !== reportId));
        return true;
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      return false;
    }
    return false;
  }
  function handleReject(reportId) {
    if (onReject(reportId)) {
      toast.success("تم رفض البلاغ بنجاح");
    } else {
      toast.error("حدث خطأ أثناء رفض البلاغ");
    }
  }

  return (
    <Screen>
      <div
        className={`${
          reports.length > 0
            ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mx-4 p-4"
            : "flex items-center justify-center h-screen"
        }`}
      >
        {reports.length > 0 ? (
          reports.map((report) => (
            <ReportCard
              key={report.reportId}
              reportId={report.reportId}
              reason={report.content}
              comment={report.comment}
              handleReject={handleReject}
              commentWriter={report.comment.authorName}
              onReject={() => onReject(report.reportId)}
              onDeleteComment={() => handleDeleteReport(report.reportId)}
            />
          ))
        ) : (
          <div className="text-red-400 text-2xl">لا يوجد بلاغات</div>
        )}
      </div>
    </Screen>
  );
}
