import { useState } from "react";
import { Link } from "react-router-dom";
import ThreeDotMenuButton from "../ThreeDotMenuButton";
import KababMenu from "../KababMenu";
import { Trash2, ClipboardList, BarChart, BookOpen } from "lucide-react";
import EnterGrade from "../coursePageComponents/EnterGrade";
import Rate from "../coursePageComponents/Rate";
import { useSchedule } from "../../context/ScheduleContext";
import { motion } from "framer-motion";
import { getColor } from "../../util/getColor";

// Function to get color based on grade value
const getGradeColor = (grade) => {
  if (grade >= 4.75) return "bg-green-400"; // A+, A
  if (grade >= 4) return "bg-green-600"; // B+, B
  if (grade >= 3) return "bg-yellow-500"; // C+, C
  if (grade >= 2) return "bg-orange-500"; // D+, D
  return "bg-red-600"; // F
};

// Function to get grade label
const getGradeLabel = (grade) => {
  if (grade === 5) return "A+";
  if (grade === 4.75) return "A";
  if (grade === 4.5) return "B+";
  if (grade === 4) return "B";
  if (grade === 3.5) return "C+";
  if (grade === 3) return "C";
  if (grade === 2.5) return "D+";
  if (grade === 2) return "D";
  if (grade === 1) return "F";
  return "";
};

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
            <span className="bg-gray-50">عدد الساعات : </span>
            {course.creditHours}
          </p>
          {!current && course.rate > 0 && (
            <div className="mt-4">
              <p className="text-gray-600 mb-1 text-center">
                <span className="bg-gray-50">
                  قمت بتقييم صعوبة هذا المقرر
                </span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <motion.div
                  className={`h-full ${getColor(course.rate)} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(course.rate / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                <span className="absolute inset-0 flex justify-center items-center text-white font-bold text-xs">
                  {course.rate <= 1.5
                    ? "سهل جدا"
                    : course.rate <= 2.5
                    ? "سهل"
                    : course.rate <= 3.5
                    ? "متوسط"
                    : course.rate <= 4.5
                    ? "صعب"
                    : "صعب جدا"}
                </span>
              </div>
            </div>
          )}
          {!current && course.grade > 0 && (
            <div className="mt-4">
              <p className="text-gray-600 mb-1 text-center">
                <span className="bg-gray-50">كانت درجتك في هذا المقرر </span>
              </p>
              <div className="w-full bg-gray-200 rounded-full h-4 relative overflow-hidden">
                <motion.div
                  className={`h-full ${getGradeColor(
                    course.grade
                  )} rounded-full`}
                  initial={{ width: 0 }}
                  animate={{ width: `${(course.grade / 5) * 100}%` }}
                  transition={{ duration: 0.5 }}
                />
                <span className="absolute inset-0 flex justify-center items-center text-white font-bold text-xs">
                  {getGradeLabel(course.grade)}
                </span>
              </div>
            </div>
          )}
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
      {current && ratingCourse && (
        <div className="fixed inset-0 flex items-center justify-center z-50">
          <Rate onClose={() => setRatingCourse(false)} courseId={course.id} />
        </div>
      )}

      {current && gradingCourse && (
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
