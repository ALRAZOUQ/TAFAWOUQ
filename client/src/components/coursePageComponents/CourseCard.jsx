import React from "react";
import { Trash2, SquarePlus } from "lucide-react";
import { useSchedule } from "../../context/ScheduleContext";
export default function CourseCard({ course, isAdmin, onDelete }) {
  const { addCourseToSchedule } = useSchedule();
  async function handleAddCourseToSchedule(courseId) {
    addCourseToSchedule(courseId);
  }
  if (!course) return <div className="text-center py-4">Loading...</div>;

  return (
    <div className="w-full h-auto bg-white shadow-lg rounded-lg p-6 border-y border-y-gray-200 border-x-4 border-x-TAF-300 hover:shadow-xl transition-shadow">
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{course.code}</h2>
            {isAdmin ? (
              <button
                onClick={() => onDelete(course.id)}
                className="text-red-600 hover:text-red-800 p-2 rounded-full hover:bg-red-50 transition-colors"
              >
                <Trash2 size={20} />
              </button>
            ) : (
              <button
                onClick={() => handleAddCourseToSchedule(course.id)}
                className="text-gray-500 hover:text-gray-700 p-2 rounded-full hover:bg-gray-50 transition-colors"
              >
                <SquarePlus size={20} />
              </button>
            )}
          </div>
          <div className="flex items-center gap-2 mt-1">
            <h3 className="text-xl text-gray-700">{course.name}</h3>
            <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded">
              عدد الساعات {course.creditHours}
            </span>
          </div>
        </div>

        <div className="py-2">
          <p className="text-gray-600 leading-relaxed">{course.overview}</p>
        </div>

        <div className="grid grid-cols-2 gap-4 pt-4">
          <div className="space-y-1">
            <p className="text-sm text-gray-500">متوسط الدرجات</p>
            <p className="text-lg font-semibold text-gray-800">
              {course.avgGrade}
            </p>
          </div>
          <div className="space-y-1">
            <p className="text-sm text-gray-500">متوسط الصعوبة</p>
            <p className="text-lg font-semibold text-gray-800">
              {course.avgRating}/5
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
