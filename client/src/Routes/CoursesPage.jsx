import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import Course from "../components/Course";
import CreateCourse from "../components/createCourseModal";
import CircularProgressBar from "../components/CircularProgressBar";
import { useCourseData } from "../context/CourseContext";
export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null); 
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  const { coursesData,addCourseToContext ,fetchCoursesContext, onUpdateCourseIntoContext } = useCourseData(); //To update the fetched course data used in the search bar and courses page
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
  /* Not needed anymore, as I replaced it with the course context, which already has the data. This is the same context used in the search bar
   const fetchCourses = async () => {
      setLoading(true);
      setError(null);
      setProgress(0);
      try {
        const response = await axios.get("auth/courses", {
          onDownloadProgress: (progressEvent) => {
            const total = progressEvent.total || 100;
            const percentCompleted = Math.round(
              (progressEvent.loaded * 100) / total
            );
            setProgress(percentCompleted);
          },
        });
        if (response.status === 200) {
          setCourses(response.data.courses);
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            setError("حدث خطأ. لا داعي للقلق ليس الأمر بسببك");
          } else {
            setError(error.response.data.message || "حدث خطأ غير معروف");
          }
        } else {
          setError("حدث خطأ اثناء ارسال الطلب الرجاء المحاولة مرة اخرى لاحقا");
        }
      } finally {
        setLoading(false);
      }
    };
    fetchCourses();*/

    fetchCoursesContext();
  }, []);
const handelOnUpdate=(newCourse)=>{
  onUpdateCourseIntoContext(newCourse);
}
    const handleAddNewCourse = (newCourse) => {
      addCourseToContext(newCourse);//to update the courses context that used in the search par
      // Add the new course to the existing courses array
      //setCourses((prevCourses) => [...prevCourses, newCourse]);//this will update the local state
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
  /*
  Not needed anymore, as I replaced it with the course context, which already has the data. This is the same context used in the search bar
  const onUpdate = (updatedCourse) => {
    // to update the course data after editing itF
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  } */
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200">
        {/*loading */false && (
          <div className="w-full flex justify-center items-center h-full">
            <CircularProgressBar progress={progress} />
          </div>
        )}
        {/*error*/false && (
          <div className="w-full text-center p-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
        {/*!loading && !error*/ coursesData && (
          <div className="w-full h-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-6 gap-6">
            {user?.isAdmin && <CreateCourse handleAddNewCourse={handleAddNewCourse} />}
            {coursesData.map((course) => (
              <Course
                key={course.id}
                id={course.id}
                name={course.name}
                avgRating={course.avgRating}
                code={course.code}
                overview={course.overview}
                creditHours={course.creditHours}
                onUpdate={handelOnUpdate}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

