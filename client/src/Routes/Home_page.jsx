import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState ,useCallback , useMemo } from "react";
import axios from "../api/axios";


export default function HomePage() {
  const [scheduleCourses, setscheduleCourses] = useState([]);
  const navigate = useNavigate();
  const { isAuthorized } = useAuth(); // Get authorization status from context

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/"); // Redirects correctly
    }else{
      fetchCourses();
    }
  }, [isAuthorized, navigate]);

  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get("protected/currentSchedule");
      //console.log(response.data);// i do not know why it is printing the data twice
      if (response.status === 200) {
        setscheduleCourses(prevCourses =>
          JSON.stringify(prevCourses) !== JSON.stringify(response.data.courses) 
            ? response.data.courses 
            : prevCourses
        );
      }
    } catch (error) {
      console.error(error.response?.data?.message || "An error occurred while sending the request");
    }
  }, []);

  const renderedCourses = useMemo(() => 
    scheduleCourses.map((course) => (
      <Link key={course.id}>
        <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
          <h2 className="text-xl font-semibold text-gray-800">{course.code}</h2>
          <p className="text-gray-600 mt-2">{course.overview}</p>
        </div>
      </Link>
    ))
  , [scheduleCourses]);
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex justify-center items-center p-6">
      <div
        className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 
                        grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 
                         max-h-max min-h-0 scrollbar-thumb-blue-500 my-16"
      >
        {/* Schedule Courses */}
       {renderedCourses}

        {/* Add Course Box */}
        <Link to="/courses">
          <div
            className="flex flex-col items-center justify-center bg-gray-200 border-2 border-dotted border-gray-400 p-3 rounded-lg cursor-pointer 
                            hover:bg-gray-300 transition-all text-gray-600 text-lg font-semibold"
          >
            <span className="text-6xl">+</span>
            <p>Add a New Course</p>
          </div>
        </Link>
      </div>
    </div>
  );
}
