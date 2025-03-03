import { createContext, useState, useContext } from "react";
import axios from "../api/axios";
//HASSAN:here we don't need to set the default values and these values don't affect the context and we can remove it but to make VS code give us auto completion we add it
const ScheduleContext = createContext({
  scheduleCourses: {},
  GPA: 0.0,
  setGPA: () => {},
  addCourseToSchedule: () => {},
  removeCoursefromSchedule: () => {},
});

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
        setScheduleCourses((prevCourses) => [
          ...prevCourses,
          { scheduleId, courseId },
        ]);
      } else {
        console.error(response.data.message || "Failed to add course");
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to add course");
    }
  }
  async function removeCoursefromSchedule() {}
  return (
    <ScheduleContext.Provider
      value={{
        scheduleCourses,
        GPA,
        setGPA,
        addCourseToSchedule,
        removeCoursefromSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
