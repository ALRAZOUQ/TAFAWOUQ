import { useEffect, useState } from "react";
import axios from "../api/axios";
import ReportCard from "../components/ReportCard";

export default function AdminHomePage() {
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

  return (
    <div className="min-h-screen max-h-max w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200">
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mx-4 p-4">
        {reports.map((report) => (
          <ReportCard
            key={report.reportId}
            reason={report.content}
            comment={report.comment.content}
            commentWriter={report.comment.authorName}
            onBanUser={() => {}}
            onDeleteComment={() => {}}
            onReject={() => {}}
          />
        ))}
      </div>
    </div>
  );
}
