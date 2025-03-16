import { Link } from "react-router-dom";

export default function CourseCardSchedule({ children, course }) {
  return (
    // ✅ Ensure JSX is returned
    <div className="relative">
      <Link to={`/courses/${course.id}`}>
        <div className="bg-white border-x-4 border-TAF-300 p-4 rounded-lg shadow-md hover:shadow-lg transition-all h-full flex flex-col">
          <h2 className="text-xl font-semibold text-gray-800">{course.code}</h2>
          <p className="text-gray-600 mt-2">{course.name}</p>
          <p className="text-gray-600 mt-2 text-right">
            <span>عدد الساعات : </span>
            {course.creditHours}
          </p>
        </div>
      </Link>
      {children}
    </div>
  );
}
