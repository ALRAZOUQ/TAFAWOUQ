import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";

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
  const [scheduleId, setScheduleId] = useState(null);

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

  async function createSchedule(userId) {
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
          toast.error("هذاالمقرر مسجل لديك بالفعل في احدى جداولك");
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
    if (!scheduleId) {
      console.error("No schedule exists. Please create a schedule first.");
      return;
    }

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
        scheduleId,
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
