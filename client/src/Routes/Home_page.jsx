import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { useSchedule } from "../context/ScheduleContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const { scheduleCourses, fetchScheduleCourses, scheduleId, createSchedule } =
    useSchedule();
  console.log(scheduleId);
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    } else {
      fetchScheduleCourses(); // Fetch schedule and courses
    }
    if (user?.isAdmin) {
      navigate("/admin/admin-home");
    }
  }, [isAuthorized, navigate, user, fetchScheduleCourses]);

  function createScheduleHandler() {
    try {
      createSchedule(); // Call createSchedule from context
      fetchScheduleCourses(); // Fetch the newly created schedule
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  }

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex justify-center items-center p-6">
      <div className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 min-h-[400px] flex flex-col">
        {scheduleId ? (
          scheduleCourses.length > 0 ? (
            // User has a schedule with courses
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
              {scheduleCourses.map((course) => (
                <Link key={course.id} to={`/courses/${course.id}`}>
                  <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all h-full flex flex-col">
                    <h2 className="text-xl font-semibold text-gray-800">
                      {course.code}
                    </h2>
                    <p className="text-gray-600 mt-2">{course.name}</p>
                    <p className="text-gray-600 mt-2">
                      <span>عدد الساعات : </span>
                      {course.creditHours}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          ) : (
            // User has a schedule but no courses
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
          // User has no schedule
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
