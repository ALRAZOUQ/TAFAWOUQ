import { useState } from "react";
import Screen from "../components/Screen";
import Schedule from "../components/Schedule";
export default function PreviousSchedules() {
  const [schedules, setSchedules] = useState([]);

  return (
    <Screen className="flex flex-col gap-4 justify-center items-center">
      {schedules.length > 0 ? (
        schedules.map((schedule) => {
          <Schedule
            scheduleCourses={schedule.courses}
            createScheduleHandler={() => {}}
            scheduleId={schedule.id}
            key={schedule.id}
          />;
        })
      ) : (
        <div className="text-2xl text-red-500">ليس لديك جدول سابق</div>
      )}
    </Screen>
  );
}
