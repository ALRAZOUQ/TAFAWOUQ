import { useEffect, useState } from "react";
import Screen from "../components/Screen";
import Schedule from "../components/Schedule";
import axios from "../api/axios";
import { useSchedule } from "../context/ScheduleContext";
export default function PreviousSchedules() {
  const [previosSchedules, setPreviosSchedules] = useState([]);
  const { scheduleId } = useSchedule();
  useEffect(() => {
    async function fetchSchedules() {
      try {
        const response = await axios.get("/protected/AllSchedules");
        if (response.status === 200) {
          setPreviosSchedules(
            response.data.schedules.filter(
              (schedule) => schedule.scheduleid !== scheduleId
            )
          );
        }
      } catch (error) {
        console.log(error);
      }
    }
    fetchSchedules();
  }, [scheduleId]);

  return (
    <Screen className="flex flex-col gap-4 justify-center items-center">
      {console.log(previosSchedules.length)}
      {previosSchedules.length > 0 ? (
        previosSchedules.map((schedule) => (
          <Schedule
            scheduleCourses={schedule.courses}
            createScheduleHandler={() => {}}
            Id={schedule.scheduleid}
            key={schedule.scheduleid}
            current={false}
          />
        ))
      ) : (
        <div className="text-2xl text-red-500">ليس لديك جدول سابق</div>
      )}
    </Screen>
  );
}
