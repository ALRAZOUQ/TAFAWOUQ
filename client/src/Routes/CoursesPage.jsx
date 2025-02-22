import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";
import Course from "../components/Course";
import CreateCourse from "../components/createCourseModal";

export default function CoursesPage() {
  const [courses, setCourses] = useState([]);
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth(); // Get authorization status from context
  useEffect(() => {
    if (!isAuthorized) {
      navigate("/"); // Redirects correctly
    }
    // ? Razouq: why `navigate` added to the dependency array ?
  }, [isAuthorized, navigate]);

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const response = await axios.get("auth/courses");

        if (response.status === 200) {
          //console.log(response.data.courses);
          setCourses(response.data.courses); // ✅ Update state properly
        }
      } catch (error) {
        if (error.response) {
          if (error.response.status === 404) {
            console.log("No courses found");
            //we did handel the case of no courses found
          } else {
            // Todo :Razouq:  we dont show an error msg to the user here !
            console.error(error.response.data.message);
          }
        } else {
          // Todo :Razouq:  we dont show an error msg to the user here !
          console.error("An error occurred while sending the request");
        }
      }
    };

    fetchCourses();
  }, []);

  return (
    <div className="w-full min-h-screen max-h-max bg-gradient-to-b from-TAF-200 via-white to-TAF-200 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-6 gap-6">
      {courses.map((course) => (
        <Link key={course.id} to={`/courses/${course.id}`}>
          <Course
            // TODO Razouq: The long text should be truncated, we must maintain a consistent card size
            name={course.name}
            avgRating={course.avgRating}
            code={course.code}
            // TODO Razouq: The long text should be truncated, we must maintain a consistent card size
            overview={course.overview}
          />
        </Link>
      ))}
      {user.isAdmin && <CreateCourse />}
    </div>
  );
}
