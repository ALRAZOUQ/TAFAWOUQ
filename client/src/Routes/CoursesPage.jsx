import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import Course from "../components/Course";
import CreateCourse from "../components/createCourseModal";
import { useCourseData } from "../context/CourseContext";
export default function CoursesPage() {
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const {
    coursesData,
    addCourseToContext,
    fetchCoursesContext,
    onUpdateCourseIntoContext,
  } = useCourseData(); //To update the fetched course data used in the search bar and courses page
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
    fetchCoursesContext();
  }, []);
  const handleAddNewCourse = (newCourse) => {
    addCourseToContext(newCourse); //to update the courses context that used in the search par
  };

  /**
   * Updates the course list with the provided updated course data.
   *
   * This function takes an updated course object and updates the state
   * by replacing the existing course with the same ID with the updated course.
   *
   * @param {Object} updatedCourse - The course object containing updated data.
   * @param {string} updatedCourse.id - The unique identifier of the course.
   * @param {string} updatedCourse.name - The name of the course.
   * @param {string} updatedCourse.code - The code of the course.
   * @param {string} updatedCourse.overview - The overview of the course.
   * @param {number} updatedCourse.creditHours - The credit hours of the course.
   * @param {number} updatedCourse.avgRating - The average rating of the course.
   */
  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200">
      {coursesData && (
        <div className="w-full h-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-6 gap-6">
          {user?.isAdmin && (
            <CreateCourse handleAddNewCourse={handleAddNewCourse} />
          )}
          {coursesData.map((course) => (
            <Course
              key={course.id}
              id={course.id}
              name={course.name}
              avgRating={course.avgRating}
              code={course.code}
              overview={course.overview}
              creditHours={course.creditHours}
            />
          ))}
        </div>
      )}
    </div>
  );
}
