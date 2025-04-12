import { useState } from "react";
import { Link } from "react-router-dom";
import ThreeDotMenuButton from "../ThreeDotMenuButton";
import KababMenu from "../KababMenu";
import { Trash2, ClipboardList, BarChart, BookOpen } from "lucide-react";
import EnterGrade from "../coursePageComponents/EnterGrade";
import Rate from "../coursePageComponents/Rate";
import { useSchedule } from "../../context/ScheduleContext";

export default function CourseCardSchedule({ course, current = true }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const [ratingCourse, setRatingCourse] = useState(false);
  const [gradingCourse, setGradingCourse] = useState(false);
  const { removeCourseFromSchedule, fetchScheduleCourses } = useSchedule();

  function handleRating() {
    setRatingCourse(true);
    setGradingCourse(false);
    setMenuOpen(false); // Closes the menu
  }

  function handleGrading() {
    setGradingCourse(true);
    setRatingCourse(false);
    setMenuOpen(false); // Closes the menu
  }

  function handleRemoveCourse() {
    removeCourseFromSchedule(course.id).then(() => fetchScheduleCourses());
    setMenuOpen(false);
  }

  return (
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

      <KababMenu
        menuOpen={menuOpen}
        setMenuOpen={setMenuOpen}
        position={"absolute top-3 right-3"}
      >
        <ThreeDotMenuButton purpose={"normal"} clickHandler={() => {}}>
          <Link
            to={`/courses/${course.id}`}
            className="flex items-center gap-2 text-right whitespace-nowrap"
          >
            <BookOpen size={20} /> عرض المادة
          </Link>
        </ThreeDotMenuButton>

        {current && (
          <>
            <ThreeDotMenuButton clickHandler={handleRating} purpose={"normal"}>
              <BarChart size={20} />
              قيّم صعوبة المقرر
            </ThreeDotMenuButton>

            <ThreeDotMenuButton clickHandler={handleGrading} purpose={"normal"}>
              <ClipboardList size={20} />
              أضف درجتك
            </ThreeDotMenuButton>

            <ThreeDotMenuButton
              purpose={"dangerous"}
              clickHandler={handleRemoveCourse}
            >
              <Trash2 size={20} />
              إزالة من الجدول
            </ThreeDotMenuButton>
          </>
        )}
      </KababMenu>

      {/* ✅ Keep Rating & Grading Components Outside the Menu */}
      {ratingCourse && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Rate onClose={() => setRatingCourse(false)} courseId={course.id} />
        </div>
      )}

      {gradingCourse && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <EnterGrade
            onClose={() => setGradingCourse(false)}
            courseId={course.id}
          />
        </div>
      )}
    </div>
  );
}
