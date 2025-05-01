import Schedule from "../components/Schedule";
import { useState, useEffect } from "react";
import { useSchedule } from "../context/ScheduleContext";
import { Eye, EyeOff } from "lucide-react";
import { useRouteIfAuthorizedAndHeIsAdmin } from "../util/useRouteIfNotAuthorized";
import GPA from "../components/HomePageComponents/GPA";
import { requestNotificationPermissionAndGetTheFCMToken } from "../config/firebase";
import PushNotificationDialog from "@/components/RootLayoutComponents/InboxComponents/PushNotificationDialog";
export default function HomePage() {
  useRouteIfAuthorizedAndHeIsAdmin();
  useEffect(() => {
    // requestNotificationPermissionAndGetTheFCMToken(); // Ask for notification permission
  }, []);

  const {
    scheduleCourses,
    fetchScheduleCourses,
    scheduleId,
    createSchedule,
    currentScheduleGPA,
    totalGPA,
    scheduleName,
  } = useSchedule();

  const [showGPA, setShowGPA] = useState(true);
  // bg-gradient-to-b from-TAF-200 via-white to-TAF-200
  return (
    <div className="min-h-screen w-full  flex flex-col justify-center items-center">
      <PushNotificationDialog />
      {scheduleName && <h2 className="text-2xl font-bold text-gray-800 mb-2 mt-2">{scheduleName}</h2>}
      <Schedule
        scheduleCourses={scheduleCourses}
        createScheduleHandler={createScheduleHandler}
        current={true}
        Id={scheduleId}
        scheduleName={scheduleName}
      />
      <div className="w-full max-w-screen-xl mb-6 flex flex-col items-center">
        <div className="w-full flex justify-start pr-2 mb-3">
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
          <div className="w-full flex flex-wrap justify-center gap-6">
            <GPA heading={"معدلك الدراسي لهذا الترم"} value={currentScheduleGPA} />
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
