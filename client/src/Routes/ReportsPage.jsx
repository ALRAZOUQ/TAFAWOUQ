import { useEffect, useState, lazy, Suspense } from "react";
import axios from "../api/axios";
import ReportCard from "../components/CommentReportCard";
import { toast } from "react-toastify";
import Screen from "../components/Screen";
import { useRouteIfAuthorizedAndHeIsNotAdmin } from "../util/useRouteIfNotAuthorized";
import SearchButton from "../components/SearchButton";
import Page from "../components/Page";
// Lazy load Pagination component
const Pagination = lazy(() =>
  import("../components/coursePageComponents/Pagination")
);

// QuizReportCard component for displaying quiz reports
const QuizReportCard = ({ report, onReject, updateProperty }) => {
  async function onDeleteQuiz() {
    try {
      const response = await axios.put("/admin/hideQuiz", {
        reason: report.content,
        reportId: report.reportId,
        quizId: report.quiz.id,
      });
   
      if (response.data.success) {
        updateProperty(report.reportId, "isResolved", true);
        updateProperty(report.reportId, "isElementHidden", true);
        updateProperty(report.reportId, "adminExecutedHide", response.data.hiddenQuiz
          .adminExecutedHide);

        return true;
      }
    } catch (error) {
      console.error("Error hiding quiz:", error);
      return false;
    }
    return false;
  }

  function handleDelete() {
    if (onDeleteQuiz()) {
      toast.success("تم اخفاء الاختبار بنجاح");
    } else {
      toast.error("حدث خطأ أثناء اخفاء الاختبار");
    }
  }

  async function onDeleteQuizAndBanUser() {
    try {
      const response = await axios.post("/admin/banUser", {
        reason: report.content,
        studentId: report.quiz.authorId,
        reportId: report.reportId,
      });
      if (response.data.success) {
        await onDeleteQuiz();
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
    if (onDeleteQuizAndBanUser()) {
      toast.success("تم اخفاء الاختبار و حظر المستخدم بنجاح");
    } else {
      toast.error("حدث خطأ أثناء اخفاء الاختبار و حظر المستخدم");
    }
  }

  return (
    <div className="bg-white p-2 sm:p-3 md:p-4 border rounded-lg shadow-md hover:shadow-lg transition-all duration-200 text-right w-full">
      <h2 className="text-base sm:text-lg font-bold mb-1 sm:mb-2">بلاغ</h2>
      <p className="text-xs sm:text-sm md:text-base font-semibold whitespace-normal break-words">
        السبب: {report.content}
      </p>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base whitespace-normal break-words">
        الاختبار: {report.quiz.title}
      </p>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-semibold whitespace-normal break-words">
        منشئ الاختبار: {report.quiz.authorName}
      </p>
      <p className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-semibold whitespace-normal break-words">
        الحالة: {report.isResolved ? "تمت المعالجة" : "تحت الانتظار"}
      </p>
      {report.isResolved && (
        <div className="mt-1 sm:mt-2 text-xs sm:text-sm md:text-base font-semibold whitespace-normal break-words">
          الاجراءات:
          <ul className="pr-2 sm:pr-4">
            {report.isElementHidden && (
              <li>
                تم اخفاء الاختبار بواسطة:{" "}
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

      <div className="mt-2 sm:mt-4 flex flex-wrap sm:flex-nowrap justify-start gap-1 sm:gap-2 rtl:space-x-reverse">
        <button
          className="bg-green-500 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-green-700 transition-colors duration-200 flex-1 sm:flex-none"
          onClick={() => onReject(report.reportId)}
        >
          رفض
        </button>
        <button
          className="bg-red-500 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-700 transition-colors duration-200 flex-1 sm:flex-none"
          onClick={handleDelete}
        >
          اخفاء الاختبار
        </button>
        <button
          className="bg-red-700 text-white text-xs sm:text-sm px-2 sm:px-4 py-1 sm:py-2 rounded hover:bg-red-900 transition-colors duration-200 w-full sm:w-auto mt-1 sm:mt-0"
          onClick={handleBan}
        >
          اخفاء الاختبار و حظر المستخدم
        </button>
      </div>
    </div>
  );
};

export default function AdminHomePage() {
  useRouteIfAuthorizedAndHeIsNotAdmin();
  const [commentReports, setCommentReports] = useState([]);
  const [quizReports, setQuizReports] = useState([]);
  const [toggleReportsType, setToggleReportsType] = useState(false); // false for comments, true for quizzes
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const reportsPerPage = 6;

  useEffect(() => {
    const fetchCommentReports = async () => {
      try {
        const response = await axios.get("/admin/reports/comments");
        if (response.data.success) {
          setCommentReports(response.data.reports);
        }
      } catch (error) {
        console.error("Error fetching comment reports:", error);
      }
    };
    const fetchQuizReports = async () => {
      try {
        const response = await axios.get("/admin/reports/quizzes");
        if (response.data.success) {
          setQuizReports(response.data.reports);
        }
      } catch (error) {
        console.error("Error fetching quiz reports:", error);
      }
    };

    fetchCommentReports();
    fetchQuizReports();
  }, []);

  async function onReject(reportId) {
    try {
      const response = await axios.delete("/admin/deleteReport", {
        data: { reportId },
      });
      if (response.data.success) {
        if (toggleReportsType) {
          setQuizReports(quizReports.filter((report) => report.reportId !== reportId));
        } else {
          setCommentReports(commentReports.filter((report) => report.reportId !== reportId));
        }
        return true;
      }
    } catch (error) {
      console.error("Error deleting report:", error);
      return false;
    }
    return false;
  }

  async function updateProperty(reportId, property, value) {
    if (toggleReportsType) {
      setQuizReports((prevReports) =>
        prevReports.map((report) =>
          report.reportId === reportId ? { ...report, [property]: value } : report
        )
      );
    } else {
      setCommentReports((prevReports) =>
        prevReports.map((report) =>
          report.reportId === reportId ? { ...report, [property]: value } : report
        )
      );
    }
  }

  function handleReject(reportId) {
    if (onReject(reportId)) {
      toast.success("تم رفض البلاغ بنجاح");
    } else {
      toast.error("حدث خطأ أثناء رفض البلاغ");
    }
  }
  
  function handleDeleteReport(reportId) {
    // This function is needed for the ReportCard component
    if (onReject(reportId)) {
      toast.success("تم حذف البلاغ بنجاح");
    } else {
      toast.error("حدث خطأ أثناء حذف البلاغ");
    }
  }

  // Filter & pagination calculations
  const filteredReports = toggleReportsType 
    ? quizReports.filter((report) =>
        report.quiz?.title?.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : commentReports.filter((report) =>
        report.comment?.content?.toLowerCase().includes(searchQuery.toLowerCase())
      );

  const indexOfLastReport = currentPage * reportsPerPage;
  const indexOfFirstReport = indexOfLastReport - reportsPerPage;
  const currentReports = filteredReports.slice(
    indexOfFirstReport,
    indexOfLastReport
  );
  const totalPages = Math.ceil(filteredReports.length / reportsPerPage);

  // Preload Pagination component
  useEffect(() => {
    import("../components/coursePageComponents/Pagination");
  }, []);

  return (
    <Screen>
      <Page>
        {/* Toggle Reports Type */}
        <div className="flex justify-center mb-4 px-2 sm:px-4">
          <div className="inline-flex rounded-md shadow-sm w-full max-w-xs" role="group">
            <button
              type="button"
              onClick={() => {
                setToggleReportsType(false);
                setCurrentPage(1);
              }}
              className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base font-medium rounded-r-lg flex-1 transition-all duration-200 ${!toggleReportsType 
                ? "bg-TAF-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              التعليقات
            </button>
            <button
              type="button"
              onClick={() => {
                setToggleReportsType(true);
                setCurrentPage(1);
              }}
              className={`px-2 sm:px-4 py-1 sm:py-2 text-xs sm:text-sm md:text-base font-medium rounded-l-lg flex-1 transition-all duration-200 ${toggleReportsType 
                ? "bg-TAF-600 text-white" 
                : "bg-white text-gray-700 hover:bg-gray-100"}`}
            >
              الاختبارات
            </button>
          </div>
        </div>

        {/* Search Button */}
        <SearchButton
          placeholder={`ابحث في بلاغات ${toggleReportsType ? "الاختبارات" : "التعليقات"}...`}
          value={searchQuery}
          onChange={(value) => {
            setSearchQuery(value);
            setCurrentPage(1); // Reset to first page on search
          }}
        />

        <div
          className={`${
            filteredReports.length > 0
              ? "grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4 gap-2 sm:gap-3 md:gap-4 mx-1 sm:mx-2 md:mx-4 p-2 sm:p-3 md:p-4"
              : "flex items-center justify-center h-screen"
          }`}
        >
          {filteredReports.length > 0 ? (
            currentReports.map((report) => (
              toggleReportsType ? (
                <QuizReportCard
                  key={report.reportId}
                  report={report}
                  onReject={() => onReject(report.reportId)}
                  updateProperty={updateProperty}
                />
              ) : (
                <ReportCard
                  key={report.reportId}
                  report={report}
                  handleReject={handleReject}
                  commentWriter={report.comment.authorName}
                  onReject={() => onReject(report.reportId)}
                  onDeleteComment={() => handleDeleteReport(report.reportId)}
                  updateProperty={updateProperty}
                />
              )
            ))
          ) : (
            <div className="text-red-400 text-2xl">
              لا يوجد بلاغات {toggleReportsType ? "للاختبارات" : "للتعليقات"}
            </div>
          )}
        </div>

        {/* Pagination */}
        {filteredReports.length > 0 && (
          <Suspense fallback={<div>Loading pagination...</div>}>
            <Pagination
              currentPage={currentPage}
              totalPages={totalPages}
              setCurrentPage={setCurrentPage}
            />
          </Suspense>
        )}
      </Page>
    </Screen>
  );
}
