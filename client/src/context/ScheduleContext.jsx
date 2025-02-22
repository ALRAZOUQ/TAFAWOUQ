import { createContext, useState, useContext } from "react";
const ScheduleContext = createContext();
// here i decide to make the schedule as context and it will contain many data such as courses and GPA that will ease calculating the GPA

export function ScheduleProvider({ children }) {
  const [scheduleCourses, setscheduleCourses] = useState([]);
  const [GPA, setGPA] = useState(0);

  return (
    <ScheduleContext
      value={{ scheduleCourses, setscheduleCourses, GPA, setGPA }}>
      {children}
    </ScheduleContext>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
