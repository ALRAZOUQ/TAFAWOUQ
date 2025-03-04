import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import axios from "../api/axios";
// actually we don't need to assign default values and these values don't affect the context but its benifit is to provide auto completion in the VS code so don't remove it it will help us //HASSAN
const ScheduleContext = createContext({
  scheduleCourses: [],
  GPA: 0.0,
  setGPA: () => {},
  addCourseToSchedule: () => {},
  removeCoursefromSchedule: () => {},
  fetchScheduleCourses: () => {},
  createSchedule: () => {},
});

export function ScheduleProvider({ children }) {
  const [scheduleCourses, setScheduleCourses] = useState([]);
  const [GPA, setGPA] = useState(0);

  const fetchScheduleCourses = useCallback(async () => {
    try {
      const response = await axios.get("protected/currentSchedule");
      if (response.status === 200) {
        setScheduleCourses(response.data.courses || []);
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to fetch schedule"
      );
    }
  }, []);

  useEffect(() => {
    fetchScheduleCourses();
  }, [fetchScheduleCourses]);
  async function createSchedule() {}

  async function addCourseToSchedule(course, scheduleId) {
    try {
      const response = await axios.post("/addCourseToSchedule", {
        scheduleId,
        courseId: course.id,
      });

      if (response.data.success) {
        setScheduleCourses((prevCourses) => [...prevCourses, course]);
      } else {
        console.error(response.data.message || "Failed to add course");
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to add course");
    }
  }

  async function removeCoursefromSchedule(courseId, scheduleId) {
    try {
      const response = await axios.delete("/deleteCourseFromSchedule", {
        data: { scheduleId, courseId },
      });

      if (response.data.success) {
        setScheduleCourses((prevCourses) =>
          prevCourses.filter((course) => course.id !== courseId)
        );
      } else {
        console.error(response.data.message || "Failed to remove course");
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to remove course");
    }
  }

  return (
    <ScheduleContext.Provider
      value={{
        scheduleCourses,
        GPA,
        setGPA,
        addCourseToSchedule,
        removeCoursefromSchedule,
        fetchScheduleCourses,
        createSchedule,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
