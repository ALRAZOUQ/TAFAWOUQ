import { createContext, useState, useContext } from "react";
import axios from "../api/axios";

const ScheduleContext = createContext();

export function ScheduleProvider({ children }) {
  const [scheduleCourses, setScheduleCourses] = useState([]);
  const [GPA, setGPA] = useState(0);

  async function addCourseToSchedule(courseId, scheduleId) {
    try {
      const response = await axios.post("/addCourseToSchedule", {
        scheduleId,
        courseId,
      });
      
      if (response.data.success) {
        setScheduleCourses((prevCourses) => [...prevCourses, { scheduleId, courseId }]);
      } else {
        console.error(response.data.message || "Failed to add course");
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to add course");
    }
  }

  return (
    <ScheduleContext.Provider value={{ scheduleCourses, GPA, setGPA, addCourseToSchedule }}>
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
