import { createContext, useState, useContext } from 'react';
/*
this file is used to create a context for the courses data for the search bar in the header
so that we can access the courses data from any component warred by the CourseProvider
*/
const CourseContext = createContext();

export function CourseProvider({ children }) {
  const [coursesData, setCoursesData] = useState(null);

  return (
    <CourseContext.Provider value={{ coursesData, setCoursesData }}>
      {children}
    </CourseContext.Provider>
  );
}
/**
 * Custom hook to access and update the course data context.
 * 
 * This hook provides access to the course data and allows updating the courses list.
 * The course data is represented as an array of course objects, where each course
 * contains an `id`, `name`, and `code`. The hook ensures that context is accessed 
 * within a valid `CourseProvider`.
 * [
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