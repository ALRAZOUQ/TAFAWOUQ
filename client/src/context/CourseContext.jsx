import { createContext, useState, useContext } from "react";
import axios from "../api/axios";
import { toast } from "react-toastify";
/*
this file is used to create a context for the courses data for the search bar in the header and the courses in coursesPage
so that we can access the courses data from any component warrbed by the CourseProvider
*/
const CourseContext = createContext();

/**
 * The `CourseProvider` function is a React component that provides course data to its children
 * components through a context provider.
 * @returns The `CourseProvider` component is being returned. It is a context provider component that
 * provides the `coursesData` state and `setCoursesData` function through the `CourseContext.Provider`
 * component to its children.
 */
export function CourseProvider({ children }) {
  const [coursesData, setCoursesData] = useState(null);

  // Add a new course to the courses list
  const addCourseToContext = (newCourse) => {
    setCoursesData((prevCourses) =>
      prevCourses ? [...prevCourses, newCourse] : [newCourse]
    );
  };

  const deleteCourseFromContext = (courseId) => {
    setCoursesData(
      (prevCourses) =>
        prevCourses?.filter((course) => course.id !== courseId) || null
    );
  };

  const onUpdateCourseIntoContext = async (formData, courseId) => {
    try {
      const response = await axios.put("/admin/updateCourse", {
        courseId: courseId,
        name: formData.name,
        code: formData.code,
        overview: formData.overview,
        creditHours: parseInt(formData.creditHours),
      });

      if (response.status === 200) {
        toast.success("تم تحديث المقرر بنجاح");

        setCoursesData((prevCourses) => {
          if (!prevCourses) return null;

          return prevCourses.map((course) =>
            course.id === courseId
              ? { ...course, ...formData } // ✅ Spread formData to ensure updates are applied
              : course
          );
        });
      }
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء تحديث المقرر";
      toast.error(errorMessage);
    }
  };

  // Fetch all courses from the API
  const fetchCoursesContext = async () => {
    try {
      const response = await axios.get("auth/courses");
      if (response.status === 200) {
        setCoursesData(response.data.courses);
      }
    } catch (error) {
      console.error("Error fetching courses:", error);
      setCoursesData(null);
    }
  };

  return (
    <CourseContext.Provider
      value={{
        coursesData,
        setCoursesData,
        addCourseToContext,
        deleteCourseFromContext,
        fetchCoursesContext,
        onUpdateCourseIntoContext,
      }}
    >
      {children}
    </CourseContext.Provider>
  );
}

export function useCourseData() {
  return useContext(CourseContext);
}
