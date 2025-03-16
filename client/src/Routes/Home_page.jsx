import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useSchedule } from "../context/ScheduleContext";
import { FiMoreVertical } from "react-icons/fi";
import {
  Trash2,
  ClipboardList,
  BarChart,
  Eye,
  EyeOff,
  BookOpen,
} from "lucide-react";
import EnterGrade from "../components/coursePageComponents/EnterGrade";
import Rate from "../components/coursePageComponents/Rate";
import GPA from "../components/HomePageComponents/GPA";
import CourseCardSchedule from "../components/HomePageComponents/CourseCardSchedule";
import ThreeDotMenuButton from "../components/ThreeDotMenuButton";
export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const {
    scheduleCourses,
    fetchScheduleCourses,
    scheduleId,
    createSchedule,
    removeCoursefromSchedule,
    fetchTotalGPA,
    fetchCurrentScheduleGPA,
    currentScheduleGPA,
    totalGPA,
  } = useSchedule();

  const [menuOpen, setMenuOpen] = useState(null);
  const [ratingCourseId, setRatingCourseId] = useState(null);
  const [gradingCourseId, setGradingCourseId] = useState(null);
  const [showGPA, setShowGPA] = useState(true);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    } else {
      fetchScheduleCourses();
      fetchCurrentScheduleGPA();
      fetchTotalGPA();
    }
    if (user?.isAdmin) {
      navigate("/admin/admin-home");
    }
  }, [isAuthorized, navigate, user, fetchScheduleCourses]);

  function createScheduleHandler() {
    try {
      createSchedule();
      fetchScheduleCourses();
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  }

  function toggleMenu(courseId) {
    setMenuOpen(menuOpen === courseId ? null : courseId);
    setRatingCourseId(null);
    setGradingCourseId(null);
  }

  function handleRating(courseId) {
    setRatingCourseId(courseId);
    setGradingCourseId(null);
    setMenuOpen(null);
  }

  function handleGrading(courseId) {
    setGradingCourseId(courseId);
    setRatingCourseId(null);
    setMenuOpen(null);
  }

  function handleRemoveCourse(courseId) {
    removeCoursefromSchedule(courseId);
    fetchScheduleCourses();
    setMenuOpen(null);
  }
  function handleShowGPA() {
    setShowGPA((showGPA) => !showGPA);
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex flex-col justify-center items-center p-6">
      {/* Schedule Container */}
      <div className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 min-h-[400px] flex flex-col">
        {scheduleId ? (
          scheduleCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1 text-left">
              {scheduleCourses.map((course) => (
                <CourseCardSchedule course={course} key={course.id}>
                  <button
                    onClick={() => toggleMenu(course.id)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    <FiMoreVertical size={20} />
                  </button>

                  {menuOpen === course.id && (
                    <div className="absolute top-8 right-2 bg-white shadow-md rounded-lg w-44 z-10">
                      <ThreeDotMenuButton
                        textColor={"text-gray-500"}
                        clickHandler={() => {}}
                        hoverColor={"hover:text-gray-700"}
                      >
                        <Link
                          to={`/courses/${course.id}`}
                          className="flex items-center gap-2 text-right whitespace-nowrap"
                        >
                          <BookOpen size={20} /> عرض المادة
                        </Link>
                      </ThreeDotMenuButton>

                      <ThreeDotMenuButton
                        textColor={"text-gray-500"}
                        clickHandler={() => handleRating(course.id)}
                        hoverColor={"hover:text-gray-700"}
                      >
                        <BarChart size={20} />
                        قيّم صعوبة المقرر
                      </ThreeDotMenuButton>
                      <ThreeDotMenuButton
                        textColor={"text-gray-500"}
                        clickHandler={() => handleGrading(course.id)}
                        hoverColor={"hover:text-gray-700"}
                      >
                        <ClipboardList size={20} />
                        أضف درجتك
                      </ThreeDotMenuButton>
                      <ThreeDotMenuButton
                        textColor={"text-red-500"}
                        clickHandler={() => handleRemoveCourse(course.id)}
                        hoverColor={"hover:text-red-600"}
                      >
                        <Trash2 size={20} />
                        إزالة من الجدول
                      </ThreeDotMenuButton>
                    </div>
                  )}

                  {ratingCourseId === course.id && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <Rate
                        onClose={() => setRatingCourseId(null)}
                        courseId={course.id}
                      />
                    </div>
                  )}
                  {gradingCourseId === course.id && (
                    <div className="fixed inset-0 flex items-center justify-center z-50">
                      <EnterGrade
                        onClose={() => setGradingCourseId(null)}
                        courseId={course.id}
                      />
                    </div>
                  )}
                </CourseCardSchedule>
              ))}
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center text-center p-6">
              <p className="text-gray-600 text-lg font-semibold">
                لا يوجد لديك مواد مضافة
              </p>
              <p className="text-gray-500">أضف مواد الآن إلى جدولك الدراسي</p>
              <Link
                to="/courses"
                className="mt-4 bg-TAF-100 text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all"
              >
                إضافة مواد
              </Link>
            </div>
          )
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <p className="text-gray-600 text-lg font-semibold">
              لا يوجد لديك جدول دراسي
            </p>
            <p className="text-gray-500">قم بإنشاء جدولك الآن</p>
            <button
              onClick={createScheduleHandler}
              className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all"
            >
              إنشاء جدول دراسي
            </button>
          </div>
        )}
      </div>

      <div className="w-full max-w-screen-xl p-6 mt-6 relative">
        <div className="w-full flex justify-start pr-2">
          <button
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
            onClick={handleShowGPA}
          >
            {showGPA ? (
              <>
                <EyeOff size={16} />
                إخفاء المعدل
              </>
            ) : (
              <>
                <Eye size={16} />
                إظهار المعدل
              </>
            )}
          </button>
        </div>

        {/* GPA Components */}
        {showGPA && (
          <div className="w-full flex flex-wrap justify-center gap-6 mt-3">
            <GPA
              heading={"معدلك الدراسي لهذا الترم"}
              value={currentScheduleGPA}
            />
            <GPA heading={"معدلك الدراسي التراكمي"} value={totalGPA} />
          </div>
        )}
      </div>
    </div>
  );
}
