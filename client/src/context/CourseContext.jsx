import { createContext, useState, useContext } from "react";
import axios from "../api/axios";
import {toast }from "react-toastify"
/*
this file is used to create a context for the courses data for the search bar in the header
so that we can access the courses data from any component warred by the CourseProvider
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
    setCoursesData(prevCourses => 
      prevCourses ? [...prevCourses, newCourse] : [newCourse]
    );
  };
  //setCoursesData(prevCourses => prevCourses.filter(course => course.id != courseId))
  // Remove a course by its ID
  const deleteCourseFromContext = (courseId) => {
    setCoursesData(prevCourses => 
      prevCourses?.filter(course => course.id !== courseId) || null
    );
  };
  
  /*const onUpdateCourseIntoContext = (updatedCourse) => {
    // to update the course data after editing itF
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )

    );
  } */
  /*const onUpdateCourseIntoContext = async (formData) => {
  try {
     const response = await axios.put("admin/updateCourse", {
       courseId: id,
       name: formData.name,
       code: formData.code,
       overview: formData.overview,
       creditHours: parseInt(formData.creditHours),
     });

     if (response.status === 200) {
       toast.success("تم تحديث المقرر بنجاح");
       const updatedCourse ={
        // Pass the updated data to the parent component
        id,
        code,
        name,
        avgRating,
        creditHours,
        overview,
        ...updatedData, // Merge updated data with existing data any redundent will be overwritten
      }
       
      setCoursesData((prevCourses) =>
        prevCourses.map((course) =>
          course.id === updatedCourse.id ? updatedCourse : course
        ));
      
     }
      
   } catch (error) {
     const errorMessage =
       error.response?.data?.message || "حدث خطأ أثناء تحديث المقرر";
     toast.error(errorMessage);
   }}*/

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
    
          setCoursesData((prevCourses) =>
            prevCourses.map((course) =>
              course.id === courseId
                ? { ...course, ...formData } // Update only the changed values
                : course
            )
          );
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
      const response = await axios.get('auth/courses');
      if (response.status === 200) {
        setCoursesData(response.data.courses);
      }
    } catch (error) {
      console.error('Error fetching courses:', error);
      setCoursesData(null);
    }
  };
  
  return (
    <CourseContext.Provider value={{ 
      coursesData, 
      setCoursesData,
      addCourseToContext,
      deleteCourseFromContext,
      fetchCoursesContext,
      onUpdateCourseIntoContext
    }}>
      {children}
    </CourseContext.Provider>
  );}
/**
 * Custom hook to access and update the course data context.
 * 
 * This hook provides access to the course data and allows updating the courses list.
 * The course data is represented as an array of course objects, where each course
 * contains an `id`, `name`, and `code`. The hook ensures that context is accessed 
 * within a valid `CourseProvider`.
```[
    {
        "id": 1,
        "name": "Introduction to Computer Science",
        "code": "CS101"
    },
    {
        "id": 2,
        "name": "Data Structures",
        "code": "CS201"
    }
]

  * @returns {{
  *   coursesData: Course[] | null, 
  *   setCoursesData: (data: Course[] | null) => void
  * }} An state object containing the current list of courses detiles and a function to update the state.
  * 
*/
export function useCourseData() {
  return useContext(CourseContext);
}
