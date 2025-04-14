import { useEffect, useState, lazy, Suspense } from "react";
import axios from "../api/axios";
import ReportCard from "../components/ReportCard";
import { toast } from "react-toastify";
import Screen from "../components/Screen";
import { useRouteIfAuthorizedAndHeIsNotAdmin } from "../util/useRouteIfNotAuthorized";
import SearchButton from "../components/SearchButton";

// Lazy load Pagination component
const Pagination = lazy(() => import("../components/coursePageComponents/Pagination"));

export default function AdminHomePage() {
  useRouteIfAuthorizedAndHeIsNotAdmin();
  const [reports, setReports] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const reportsPerPage = 6;

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

  async function updateProperty(reportId, property, value) {
    setReports((prevReports) =>
      prevReports.map((report) =>
        report.reportId === reportId ? { ...report, [property]: value } : report
      )
    );
  }

  function handleReject(reportId) {
    if (onReject(reportId)) {
      toast.success("تم رفض البلاغ بنجاح");
    } else {
      toast.error("حدث خطأ أثناء رفض البلاغ");
    }
  }

  // Filter & pagination calculations
  const filteredReports = reports.filter((report) => 
    report.comment.content.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(indexOfFirstReport, indexOfLastReport);
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Preload Pagination component
  useEffect(() => {
    import("../components/coursePageComponents/Pagination");
  }, []);

  return (
    <Screen>
      <div className="px-4 py-2">
        {/* Search Button */}
        <SearchButton
          placeholder="ابحث في البلاغات..."
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />

        <div
          className={`${
            reports.length > 0
              ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-2 mx-4 p-4"
              : "flex items-center justify-center h-screen"
          }`}
        >
          {reports.length > 0 ? (
            currentReports.map((report) => (
              <ReportCard
                key={report.reportId}
                report={report}
                handleReject={handleReject}
                commentWriter={report.comment.authorName}
                onReject={() => onReject(report.reportId)}
                onDeleteComment={() => handleDeleteReport(report.reportId)}
                updateProperty={updateProperty}
              />
            ))
          ) : (
            <div className="text-red-400 text-2xl">لا يوجد بلاغات</div>
          )}
        </div>

        {/* Pagination */}
        {reports.length > 0 && (
          <Suspense fallback={<div>Loading pagination...</div>}>
            <Pagination 
              currentPage={currentPage} 
              totalPages={totalPages} 
              setCurrentPage={setCurrentPage} 
            />
          </Suspense>
        )}
      </div>
    </Screen>
  );
}
