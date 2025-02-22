import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/authContext";
import { useEffect, useState, useCallback, useMemo } from "react";
import axios from "../api/axios";

export default function HomePage() {
  // TODO Razouq: `scheduleCourses` should be `coursesSchedule`
  // TODO Razouq: Actually it should be `scheduleData` because it containts the data only, not the components
  const [scheduleCourses, setscheduleCourses] = useState([]);
  const navigate = useNavigate();
  const { isAuthorized, user } = useAuth(); // Get authorization status and user data from context

  useEffect(() => {
    if (!isAuthorized) {
      navigate("/"); // Redirects correctly
    } else {
      fetchCourses();
    }
    if (user.isAdmin) {
      navigate("/admin/admin-home");
    }
  }, [isAuthorized, navigate]);
  // ? Razouq: why did u use `useCallback` ?
  const fetchCourses = useCallback(async () => {
    try {
      const response = await axios.get("protected/currentSchedule");
      console.log(response.data); // i do not know why it is printing the data twice
      if (response.status === 200) {
        setscheduleCourses((prevCourses) =>
          JSON.stringify(prevCourses) !== JSON.stringify(response.data.courses)
            ? response.data.courses
            : prevCourses
        );
      }
    } catch (error) {
      // Todo :Razouq:  we dont show an error msg to the user here !
      console.error(
        error.response?.data?.message ||
          "An error occurred while sending the request"
      );
    }
  }, []);

  // ? Razouq: why did u use `useMemo` ?
  // TODO Razouq: I think the descriptive name for `renderedCourses` is coursesList
  // ? Razouq: BTW, we always use ".map" inside the return statment, why did u write it here?
  const renderedCourses = useMemo(
    () =>
      scheduleCourses.map((course) => (
        <Link key={course.id}>
          <div className="bg-white p-4 rounded-lg shadow-md hover:shadow-lg transition-all">
            <h2 className="text-xl font-semibold text-gray-800">
              {course.code}
            </h2>
            <p className="text-gray-600 mt-2">{course.overview}</p>
          </div>
        </Link>
      )),
    [scheduleCourses]
  );

  // TODO Razouq: Hmmmmmmm, Do u thik there is a logical error in this return?
  return (
    <div className="min-h-screen w-full bg-gradient-to-b from-TAF-200 via-white to-TAF-200 flex justify-center items-center p-6">
      <div
        className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 
             grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 
             max-h-max min-h-0 scrollbar-thumb-blue-500 my-16">
        {/* Schedule Courses */}
        {
          scheduleCourses &&
            renderedCourses /* if there is courses it will render it otherwise nothing will happen}

        {/* Add Course Box */
        }

        {scheduleCourses && (
          <Link to="/courses" className="col-span-full w-full">
            <div
              className="flex flex-col items-center justify-center bg-gray-200 border-2 border-dashed h-56 border-gray-400 p-3 rounded-lg cursor-pointer 
                        hover:bg-gray-300 transition-all text-gray-600 text-lg font-semibold 
                        w-full col-span-full">
              <p>لا يوجد لديك مواد مضافة</p>
              <p>أضف مواد الآن</p>
              <span className="text-6xl">+</span>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
