import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
const scheduleInitialState = {
  totalGPA: 0.0,
  currentScheduleGPA: 0.0,
  scheduleId: null,
  scheduleCourses: [],
};

const ScheduleContext = createContext({
  scheduleCourses: [],
  totalGPAGPA: 0.0,
  currentScheduleGPA: 0.0,
  scheduleId: null,
  addCourseToSchedule: () => {},
  removeCoursefromSchedule: () => {},
  fetchScheduleCourses: () => {},
  createSchedule: () => {},
  resetSchedule: () => {},
});

export function ScheduleProvider({ children }) {
  const [scheduleCourses, setScheduleCourses] = useState([]);
  const [currentScheduleGPA, setcurrentScheduleGPA] = useState(0);
  const [totalGPA, setTotalGPA] = useState(0);
  const [scheduleId, setScheduleId] = useState(null);

  /**
   * Updates the grade of a specific course in the schedule
   * @param {string|number} courseId - The ID of the course to update
   * @param {string|number} newGradeValue - The new grade value to set
   * @returns {void} - Updates the schedule courses state with the new grade
   */
  function updateCourseGrade(courseId, newGradeValue) {
    setScheduleCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, grade: newGradeValue } : course
      )
    );
  }

  /**
   * Updates the rating of a specific course in the schedule
   * @param {string|number} courseId - The ID of the course to update
   * @param {string|number} newRateValue - The new rating value to set
   * @returns {void} - Updates the schedule courses state with the new rating
   */
  function updateCourseRate(courseId, newRateValue) {
    setScheduleCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === courseId ? { ...course, rate: newRateValue } : course
      )
    );
  }
  async function fetchCurrentScheduleGPA() {
    if (!scheduleId) {
      return;
    }

    try {
      const endpoint = `/protected/viewGpa/${scheduleId}`;

      const { data } = await axios.get(endpoint, {
        withCredentials: true, // Same as `credentials: "include"`
        headers: { "Content-Type": "application/json" },
      });
      setcurrentScheduleGPA(data.averageGPA);
    } catch (err) {
      toast.error("error");
    }
  }
  async function fetchTotalGPA() {
    try {
      const endpoint = `/protected/viewGpa`;

      const { data } = await axios.get(endpoint, {
        withCredentials: true, // Same as `credentials: "include"`
        headers: { "Content-Type": "application/json" },
      });
      setTotalGPA(data.averageGPA);
    } catch (err) {
      toast.error("error");
    }
  }

  function resetSchedule() {
    setScheduleCourses(scheduleInitialState.scheduleCourses);
    setScheduleId(scheduleInitialState.scheduleId);
    setcurrentScheduleGPA(scheduleInitialState.currentScheduleGPA);
    setTotalGPA(scheduleInitialState.totalGPA);
  }

  const fetchScheduleCourses = useCallback(async () => {
    try {
      const response = await axios.get("/protected/currentSchedule");
      if (response.status === 200) {
        setScheduleCourses(response.data.courses || []);
        setScheduleId(response.data.scheduleId || null);
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

  async function createSchedule() {
    try {
      const response = await axios.post("/protected/createSchedule", {});

      if (response.data.success) {
        toast.success("تم إنشاء الجدول بنجاح");
        setScheduleId(response.data.scheduleId);
        setScheduleCourses([]); // Initially, no courses in the schedule
      } else {
        console.error(response.data.message || "Failed to create schedule");
      }
    } catch (error) {
      console.error(
        error.response?.data?.message || "Failed to create schedule"
      );
    }
  }

  async function addCourseToSchedule(courseId) {
    try {
      const response = await axios.post("protected/addCourseToLastSchedule", {
        courseId: courseId,
      });
      if (response.status === 200) {
        toast.success("تمت إضافة المادة الى الجدول بنجاح");
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 400) {
          toast.error("الرجاء إضافة جدول دراسي جديد");
        } else if (error.response.status === 404) {
          toast.error("انت تحاول اضافة مقرر غير موجود في قاعدة البيانات");
        } else if (error.response.status === 409) {
          toast.error("هذا المقرر مسجل لديك بالفعل في احدى جداولك");
        } else {
          toast.error(error.response.data.message);
          console.error(
            "Unexpected error while adding course to schedule:",
            error
          );
        }
      } else {
        console.error(
          "Unexpected error while sending the request adding course to schedule:",
          error
        );
      }
    }
  }

  async function removeCoursefromSchedule(courseId) {
    try {
      const response = await axios.delete(
        "/protected/deleteCourseFromSchedule",
        {
          data: { scheduleId, courseId },
        }
      );

      if (response.data.success) {
        toast.success("تمت إزالة المادة من الجدول بنجاح");
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
        currentScheduleGPA,
        totalGPA,
        scheduleId,
        addCourseToSchedule,
        removeCoursefromSchedule,
        fetchScheduleCourses,
        createSchedule,
        resetSchedule,
        updateCourseGrade,
        updateCourseRate,
        fetchCurrentScheduleGPA,
        fetchTotalGPA,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

export function useSchedule() {
  return useContext(ScheduleContext);
}
