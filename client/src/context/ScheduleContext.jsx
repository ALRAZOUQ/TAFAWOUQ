import {
  createContext,
  useState,
  useContext,
  useEffect,
  useCallback,
} from "react";
import { toast } from "react-toastify";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";

// Initial state
const scheduleInitialState = {
  scheduleId: null,
  scheduleName: null,
  startDate: null,
  endDate: null,
  scheduleCourses: [],
  totalGPA: 0.0,
  currentScheduleGPA: 0.0,
};

// Context creation
const ScheduleContext = createContext({
  ...scheduleInitialState,
  addCourseToSchedule: () => {},
  removeCourseFromSchedule: () => {},
  fetchScheduleCourses: () => {},
  createSchedule: () => {},
  resetSchedule: () => {},
  updateGpa: () => {},
  updateCourseProperty: () => {},
});

export function ScheduleProvider({ children }) {
  const [schedule, setSchedule] = useState(scheduleInitialState);
  const { isAuthorized, user } = useAuth();

  // ===== COURSE MANAGEMENT =====
  const updateCourseProperty = (courseId, property, value) => {
    setSchedule((prevSchedule) => ({
      ...prevSchedule,
      scheduleCourses: prevSchedule.scheduleCourses.map((course) =>
        course.id === courseId ? { ...course, [property]: value } : course
      ),
    }));
  };

  const addCourseToSchedule = async (courseId) => {
    try {
      const { status } = await axios.post("protected/addCourseToLastSchedule", {
        courseId,
      });
      if (status === 200) {
        toast.success("تمت إضافة المادة الى الجدول بنجاح");
        await fetchScheduleCourses();
       
      }
    } catch (error) {
      if (error.response?.status === 400) {
        toast.error("الرجاء إضافة جدول دراسي جديد");
      } else if (error.response?.status === 404) {
        toast.error("انت تحاول اضافة مقرر غير موجود في قاعدة البيانات");
      } else if (error.response?.status === 409) {
        toast.error("هذا المقرر مسجل لديك بالفعل في احدى جداولك");
      } else {
        console.error(error.response?.data?.message || "Failed to add course");
      }
    }
  };
  const removeCourseFromSchedule = async (courseId) => {
    try {
      const { data } = await axios.delete(
        "/protected/deleteCourseFromSchedule",
        { data: { scheduleId: schedule.scheduleId, courseId } }
      );
      if (data.success) {
        toast.success("تمت إزالة المادة من الجدول بنجاح");
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          scheduleCourses: prevSchedule.scheduleCourses.filter(
            (course) => course.id !== courseId
          ),
        }));
        await updateGpa();
      }
    } catch (error) {
      console.error(error.response?.data?.message || "Failed to remove course");
    }
  };

  // ===== GPA MANAGEMENT =====
  const fetchGPA = async () => {
    try {
      const { data } = await axios.get(`/protected/viewGpa`);
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        totalGPA: data.averageGPA ,
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          totalGPA: 0.0,
        }));
      } else {
        console.error(" GPA fetch error:", error);
      }
    }
  };

  const fetchCurrentGPA = async () => {
    try {
      if (!schedule.scheduleId) {
        return;
      }
      const { data } = await axios.get(
        `/protected/viewGpa/${schedule.scheduleId}`
      );
      setSchedule((prevSchedule) => ({
        ...prevSchedule,
        currentScheduleGPA: data.averageGPA,
      }));
    } catch (error) {
      if (error.response?.status === 404) {
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          currentScheduleGPA: 0.0,
        }));
      } else {
        console.error(" curent GPA fetch error:", error);
      }
    }
  };

  const updateGpa = async () => {
    try {
      await fetchGPA();
      await fetchCurrentGPA();
    } catch (error) {
      if(error.response?.status === 500)
      console.error("Error updating GPAs:", error);
    }
  };

  // ===== SCHEDULE MANAGEMENT =====
  const resetSchedule = () => {
    setSchedule(scheduleInitialState);
  };

  const fetchScheduleCourses = useCallback(async () => {
    try {
      const { data, status } = await axios.get("/protected/currentSchedule");
      console.log("data", data);
      if (status === 200) {
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          scheduleCourses: data.courses || [],
          scheduleId: data.scheduleId || null,
          scheduleName: data.scheduleName || null,
          startDate: data.startDate || null,
          endDate: data.endDate || null,
        }));
      }
    } catch (error) {
      if (error.response?.status === 404) {
        //console.error("No schedule found for the student");
      } else {
        //this for unknoun erorr
        console.error("Schedule fetch error:", error);
      }
    }
  }, []);

  const createSchedule = async () => {
    try {
      const { data } = await axios.post("/protected/createSchedule");
      if (data.success) {
        toast.success("تم إنشاء الجدول بنجاح");
        setSchedule((prevSchedule) => ({
          ...prevSchedule,
          scheduleId: data.scheduleId,
          scheduleName: data.scheduleName,
          startDate: data.startDate,
          endDate: data.endDate,
          scheduleCourses: [],
        }));

        // console.log("================", schedule)
      }
    } catch (error) {
      console.error("Failed to create schedule", error);
    }
  };

  // this effect to update schedule data
  useEffect(() => {
    const fetchData = async () => {
      if (user?.isAdmin === false) {
        console.log("fetch schedule for the first time");
        await fetchScheduleCourses();
        await updateGpa();
      }
    };

    fetchData();
  }, [user]);

  // this effect to update current GPA when scheduleId changes
  useEffect(() => {
    const fetchData = async () => {
      if (user?.isAdmin === false) {
        console.log("update gpa ");
        await updateGpa();
      }
    };

    fetchData();
  }, [schedule.scheduleId]);

  return (
    <ScheduleContext.Provider
      value={{
        ...schedule,
        addCourseToSchedule,
        removeCourseFromSchedule,
        fetchScheduleCourses,
        createSchedule,
        resetSchedule,
        updateGpa,
        updateCourseProperty,
      }}
    >
      {children}
    </ScheduleContext.Provider>
  );
}

// Change from arrow function to named function declaration for Fast Refresh compatibility
export function useSchedule() {
  return useContext(ScheduleContext);
}
