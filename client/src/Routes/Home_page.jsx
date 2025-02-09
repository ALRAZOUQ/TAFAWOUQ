import { Link, useNavigate } from "react-router-dom";
import { courses } from "../dummy-data/dummyData.jsx";
import { useAuth } from "../context/authContext";
import { useEffect } from "react";
export default function HomePage() {
  const navigate = useNavigate();
  const { isAuthorized } = useAuth(); // Get authorization status from context

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/"); // Redirects correctly
    }
  }, [isAuthorized, navigate]);
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex justify-center items-center p-6">
      <div
        className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 
                        grid sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 
                         max-h-max min-h-0 scrollbar-thumb-blue-500 my-16"
      >
        {courses.map((course) => (
          <Link key={course.id}>
            <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
              <h2 className="text-xl font-semibold text-gray-800">
                {course.title}
              </h2>
              <p className="text-gray-600 mt-2">{course.description}</p>
            </div>
          </Link>
        ))}

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
