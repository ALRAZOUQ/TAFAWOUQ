import { useEffect, useState } from "react";
import Screen from "../components/Screen";
import Schedule from "../components/Schedule";
import axios from "../api/axios";
export default function PreviousSchedules() {
  const [schedules, setSchedules] = useState([]);
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const response = await axios.get("/protected/AllSchedules");
        if (response.status === 200) {
          setSchedules(response.data.schedules);
          console.log(response.data.schedules); // TODO: remove this line after testing is done
          console.log(schedules); // TODO: remove this line after testing is done
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchSchedules();
  }, []);

  return (
    <Screen className="flex flex-col gap-4 justify-center items-center">
        {console.log(schedules.length)}
      {schedules.length > 0 ? (
        schedules.map((schedule) => (
          <Schedule
            scheduleCourses={schedule.courses}
            createScheduleHandler={() => {}}
            scheduleId={schedule.id}
            key={schedule.id}
          />
        ))
      ) : (
        <div className="text-2xl text-red-500">ليس لديك جدول سابق</div>
      )}
    </Screen>
  );
}
