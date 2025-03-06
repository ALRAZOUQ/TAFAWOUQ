import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useSchedule } from "../context/ScheduleContext";
import { FiMoreVertical } from "react-icons/fi";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const {
    scheduleCourses,
    fetchScheduleCourses,
    scheduleId,
    createSchedule,
    removeCoursefromSchedule,
  } = useSchedule();
  const [menuOpen, setMenuOpen] = useState(null); // Hassan: this implementation is to track which course id is active so that it will open its menu

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    } else {
      fetchScheduleCourses();
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
  }

  function handleRemoveCourse(courseId) {
    removeCoursefromSchedule(courseId);
    fetchScheduleCourses();
    setMenuOpen(null);
  }
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex justify-center items-center p-6">
      <div className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 min-h-[400px] flex flex-col">
        {scheduleId ? (
          scheduleCourses.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1 text-left">
              {scheduleCourses.map((course) => (
                <div key={course.id} className="relative">
                  <Link to={`/courses/${course.id}`}>
                    <div className="bg-white border-x-4 border-TAF-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-all h-full flex flex-col">
                      <h2 className="text-xl font-semibold text-gray-800">
                        {course.code}
                      </h2>
                      <p className="text-gray-600 mt-2">{course.name}</p>
                      <p className="text-gray-600 mt-2 text-right">
                        <span>عدد الساعات : </span>
                        {course.creditHours}
                      </p>
                    </div>
                  </Link>

                  {/* Kebab Menu */}
                  <button
                    onClick={() => toggleMenu(course.id)}
                    className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
                  >
                    <FiMoreVertical size={20} />
                  </button>

                  {/* Dropdown Menu */}
                  {menuOpen === course.id && (
                    <div className="absolute top-8 right-2 bg-white shadow-md rounded-lg w-40 z-10">
                      <Link
                        to={`/courses/${course.id}`}
                        className="block px-4 py-2 text-gray-700 hover:bg-gray-100 text-right"
                      >
                        عرض المادة
                      </Link>
                      <button
                        onClick={() => handleRemoveCourse(course.id)}
                        className="block w-full px-4 py-2 text-red-600 hover:bg-gray-100 text-right"
                      >
                        إزالة من الجدول
                      </button>
                    </div>
                  )}
                </div>
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
                className="mt-4 bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-all"
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
              className="mt-4 bg-TAF-100 text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all"
            >
              إنشاء جدول دراسي
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
