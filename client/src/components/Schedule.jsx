import CourseCardSchedule from "./HomePageComponents/CourseCardSchedule";

import { Link } from "react-router-dom";

export default function Schedule({
  scheduleCourses,
  scheduleId,
  current = false,
  createScheduleHandler,
}) {
  return (
    <div className="w-full max-w-screen-xl bg-gray-50 shadow-inner shadow-gray-300 rounded-lg p-6 min-h-[400px] flex flex-col">
      {scheduleId ? (
        scheduleCourses.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 flex-1 text-left">
            {scheduleCourses.map((course) => (
              <CourseCardSchedule course={course} key={course.id} />
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center text-center p-6">
            <p className="text-gray-600 text-lg font-semibold">
              لا يوجد لديك مواد مضافة
            </p>
            <p className="text-gray-500">أضف مواد الآن إلى جدولك الدراسي</p>
            <Link
              to="/courses"
              className="mt-4 bg-TAF-100 text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all"
            >
              إضافة مواد
            </Link>
          </div>
        )
      ) : (
        <div className="flex flex-col items-center justify-center text-center p-6">
          <p className="text-gray-600 text-lg font-semibold">
            لا يوجد لديك جدول دراسي
          </p>
          <p className="text-gray-500">قم بإنشاء جدولك الآن</p>
          <button
            onClick={createScheduleHandler}
            className="mt-4 bg-green-600 text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all"
          >
            إنشاء جدول دراسي
          </button>
        </div>
      )}
    </div>
  );
}
