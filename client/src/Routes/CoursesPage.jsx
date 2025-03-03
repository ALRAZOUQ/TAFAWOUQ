import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import Course from "../components/Course";
import CreateCourse from "../components/createCourseModal";
import CircularProgressBar from "../components/CircularProgressBar";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [progress, setProgress] = useState(0);
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth();
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/");
    }
  }, [isAuthorized, navigate]);

  useEffect(() => {
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
    fetchCourses();
  }, []);

    const handleAddNewCourse = (newCourse) => {
      // Add the new course to the existing courses array
      setCourses((prevCourses) => [...prevCourses, newCourse]);
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
  const onUpdate = (updatedCourse) => {
    // to update the course data after editing itF
    setCourses((prevCourses) =>
      prevCourses.map((course) =>
        course.id === updatedCourse.id ? updatedCourse : course
      )
    );
  } 
    return (
      <div className="w-full min-h-screen bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200">
        {loading && (
          <div className="w-full flex justify-center items-center h-full">
            <CircularProgressBar progress={progress} />
          </div>
        )}
        {error && (
          <div className="w-full text-center p-4 text-red-500">
            <p>{error}</p>
          </div>
        )}
        {!loading && !error && (
          <div className="w-full h-auto grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-6 gap-6">
            {user?.isAdmin && <CreateCourse handleAddNewCourse={handleAddNewCourse} />}
            {courses.map((course) => (
              <Course
                key={course.id}
                id={course.id}
                name={course.name}
                avgRating={course.avgRating}
                code={course.code}
                overview={course.overview}
                creditHours={course.creditHours}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        )}
      </div>
    );
  };

