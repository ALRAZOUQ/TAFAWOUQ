import { createContext, useState, useContext } from "react";
import axios from "../api/axios";
const ScheduleContext = createContext();
// here i decide to make the schedule as context and it will contain many data such as courses and GPA that will ease calculating the GPA

export function ScheduleProvider({ children }) {
  const [scheduleCourses, setscheduleCourses] = useState([]);
  const [GPA, setGPA] = useState(0);
  async function addCourseToSchedule(courseId) {
    try {
      const response = await axios.post("/api/schedule", { courseId });
      setscheduleCourses([...schedule, response.data.newEntry]);
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to add course");
    }
  }

  return (
    <ScheduleContext
      value={{ scheduleCourses, GPA, setGPA, addCourseToSchedule }}
    >
      {children}
    </ScheduleContext>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
