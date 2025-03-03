import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
import { useSchedule } from "../context/ScheduleContext";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const { scheduleCourses, fetchCourses } = useSchedule(); // Using context data

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    } else {
      fetchCourses(); // Fetch schedule courses when user logs in
    }
    if (user?.isAdmin) {
      navigate("/admin/admin-home");
    }
  }, [isAuthorized, navigate, user, fetchCourses]);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex justify-center items-center p-6">
      <div className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 min-h-[400px] flex flex-col">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1">
          {scheduleCourses.length > 0 ? (
            scheduleCourses.map((course) => (
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
            ))
          ) : (
            <Link to="/courses" className="col-span-full w-full mt-auto">
              <div
                className="flex flex-col items-center justify-center bg-gray-200 border-2 border-dotted border-gray-400 p-3 rounded-lg cursor-pointer 
                    hover:bg-gray-300 transition-all text-gray-600 text-lg font-semibold 
                    w-full h-96"
              >
                <p>لا يوجد لديك مواد مضافة</p>
                <p>أضف مواد الآن</p>
                <span className="text-6xl">+</span>
              </div>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
