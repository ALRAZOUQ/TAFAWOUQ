import { coursesP } from "../dummy-data/dummyData";
import Course from "../components/Course";
export default function CoursesPage() {
  return (
    <div className="w-full min-h-screen max-h-max bg-gradient-to-b from-TAF-200 via-white to-TAF-200 grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 p-6 gap-6">
      {coursesP.map((course) => (
        <Course
          name={course.name}
          avgRating={course.avgrating}
          code={course.code}
          description={course.description}
          key={course.code}
        />
      ))}
    </div>
  );
}
