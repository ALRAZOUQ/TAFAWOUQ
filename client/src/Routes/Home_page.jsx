import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState } from "react";
import { useSchedule } from "../context/ScheduleContext";
import { Eye, EyeOff } from "lucide-react";

import GPA from "../components/HomePageComponents/GPA";
import CourseCardSchedule from "../components/HomePageComponents/CourseCardSchedule";

export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const {
    scheduleCourses,
    fetchScheduleCourses,
    scheduleId,
    createSchedule,
    currentScheduleGPA,
    totalGPA,
  } = useSchedule();

  const [showGPA, setShowGPA] = useState(true);

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
      return;
    }
    if (user?.isAdmin) {
      navigate("/admin/admin-home");
      return;
    }
  }, [isAuthorized, user?.isAdmin, navigate]);

  async function createScheduleHandler() {
    try {
      await createSchedule();
      await fetchScheduleCourses(); //this will update schedule data after create it (to get the id ,name, startDate , endDate)
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
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
                <CourseCardSchedule course={course} key={course.id} />
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
