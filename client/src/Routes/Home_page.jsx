import { Link } from "react-router-dom";
import Schedule from "../components/Schedule";
import { useState, useEffect } from "react";
import { useSchedule } from "../context/ScheduleContext";
import { Eye, EyeOff } from "lucide-react";
import { useRouteIfAuthorizedAndHeIsAdmin } from "../util/useRouteIfNotAuthorized";
import GPA from "../components/HomePageComponents/GPA";
import CourseCardSchedule from "../components/HomePageComponents/CourseCardSchedule";
import { requestNotificationPermissionAndGetTheFCMToken } from "../config/firebase";

export default function HomePage() {
  useRouteIfAuthorizedAndHeIsAdmin();
  useEffect(() => {
    requestNotificationPermissionAndGetTheFCMToken(); // Ask for notification permission
  }, []);

  const {
    scheduleCourses,
    fetchScheduleCourses,
    scheduleId,
    createSchedule,
    currentScheduleGPA,
    totalGPA,
  } = useSchedule();

  const [showGPA, setShowGPA] = useState(true);

  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex flex-col justify-center items-center">
      <Schedule
        scheduleCourses={scheduleCourses}
        createScheduleHandler={createScheduleHandler}
        current={true}
        Id={scheduleId}
      />

      <div className="w-full max-w-screen-xl p-6 mt-6 relative">
        <div className="w-full flex justify-start pr-2">
          <button
            className="flex items-center gap-2 text-gray-700 hover:bg-gray-200 px-3 py-1 rounded-lg transition-all"
            onClick={handleShowGPA}>
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
  function handleShowGPA() {
    setShowGPA((showGPA) => !showGPA);
  }

  async function createScheduleHandler() {
    try {
      await createSchedule();
      await fetchScheduleCourses(); //this will update schedule data after create it (to get the id ,name, startDate , endDate)
    } catch (error) {
      console.error("Failed to create schedule:", error);
    }
  }
}
