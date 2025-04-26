import { useState, useEffect } from "react";
import {
  Trash2,
  SquarePlus,
  Pencil,
  BarChart,
  ClipboardList,
  Info,
} from "lucide-react";
import { useSchedule } from "../../context/ScheduleContext";
import EditCourseModal from "../../components/EditCourseModal";
import Rate from "./Rate";
import EnterGrade from "./EnterGrade";
import KababMenu from "../KababMenu";
import { useAuth } from "../../context/authContext";
import ThreeDotMenuButton from "../ThreeDotMenuButton";
import { motion } from "framer-motion";

export default function CourseCard({
  course,
  isAdmin,
  onDelete,
  onCourseUpdate,
  activeTab,
  setActiveTab,
}) {
  const { addCourseToSchedule } = useSchedule();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
  const [animatedGrade, setAnimatedGrade] = useState(0);
  const [animatedRating, setAnimatedRating] = useState(0);
  const [showTooltip, setShowTooltip] = useState(false);
  const { isAuthorized } = useAuth();

  useEffect(() => {
    if (!course || !course?.avgGrade || !course?.avgRating) return;
    const duration = 1500; // Animation duration in milliseconds
    const steps = 60; // Number of updates
    let step = 0;

    const avgGrade = course.avgGrade;
    const avgRating = course.avgRating;

    const interval = setInterval(() => {
      step++;
      setAnimatedGrade((prev) =>
        Math.min(prev + ((avgGrade / 5) * 360) / steps, (avgGrade / 5) * 360)
      );
      setAnimatedRating((prev) =>
        Math.min(prev + ((avgRating / 5) * 360) / steps, (avgRating / 5) * 360)
      );
      if (step >= steps) clearInterval(interval);
    }, duration / steps);

    return () => clearInterval(interval);
  }, [course?.avgGrade, course?.avgRating]);
  const getDifficultyColor = (value) => {
    if (value <= 1.5 && value >= 1) return "#4ade80"; // bg-green-400
    if (value <= 2.5 && value > 1.5) return "#166534"; // bg-green-800
    if (value <= 3.5 && value > 2.5) return "#ea580c"; // bg-orange-600
    if (value <= 4.5 && value > 3.5) return "#ef4444"; // bg-red-500
    return "#dc2626"; // bg-red-600
  };

  async function handleAddCourseToSchedule(courseId) {
    addCourseToSchedule(courseId);
  }

  function handleRating() {
    setIsRating(true);
  }

  function handleGrading() {
    setIsGrading(true);
  }
  if (!course) return <div className="text-center py-4">Loading...</div>;
  return (
    <div className="w-full h-auto bg-white shadow-lg rounded-lg p-6 border-y border-y-gray-200 border-x-4 border-x-TAF-300 hover:shadow-xl transition-shadow">
      <EditCourseModal
        id={course.id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        code={course.code}
        name={course.name}
        creditHours={course.creditHours}
        overview={course.overview}
      />
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold text-gray-800">{course.code}</h2>
            {isAuthorized && (
              <KababMenu
                position={"relative absolute bottom-6 left-6"}
                menuOpen={menuOpen}
                setMenuOpen={setMenuOpen}
                reverse={true}
              >
                {isAdmin ? (
                  <>
                    <ThreeDotMenuButton
                      clickHandler={() => onDelete(course.id)}
                      purpose={"dangerous"}
                    >
                      <Trash2 size={20} />
                      حذف المادة
                    </ThreeDotMenuButton>
                    <ThreeDotMenuButton
                      clickHandler={() => {
                        setIsEditModalOpen(true);
                        setMenuOpen(false);
                      }}
                      purpose={"warning"}
                    >
                      <Pencil size={16} />
                      <span>تعديل المادة</span>
                    </ThreeDotMenuButton>
                  </>
                ) : (
                  <>
                    {!isRating && !isGrading && (
                      <>
                        <ThreeDotMenuButton
                          clickHandler={() =>
                            handleAddCourseToSchedule(course.id)
                          }
                          purpose={"normal"}
                        >
                          <SquarePlus size={20} />
                          أضف المادة إلى الجدول
                        </ThreeDotMenuButton>
                        <ThreeDotMenuButton
                          clickHandler={handleRating}
                          purpose={"normal"}
                        >
                          <BarChart size={20} />
                          قيّم صعوبة المقرر
                        </ThreeDotMenuButton>
                        <ThreeDotMenuButton
                          clickHandler={handleGrading}
                          purpose={"normal"}
                        >
                          <ClipboardList size={20} />
                          أضف درجتك
                        </ThreeDotMenuButton>
                      </>
                    )}
                    {isRating && (
                      <Rate
                        onClose={() => setIsRating(false)}
                        courseId={course.id}
                        onCourseUpdate={onCourseUpdate}
                      />
                    )}
                    {isGrading && (
                      <EnterGrade
                        onClose={() => setIsGrading(false)}
                        courseId={course.id}
                        onCourseUpdate={onCourseUpdate}
                      />
                    )}
                  </>
                )}
              </KababMenu>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 relative">
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
        {/* Circular Progress Bar for Average Grade */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500">متوسط الدرجات</p>
          <motion.div
            className="relative w-20 h-20 rounded-full flex items-center justify-center bg-gray-200"
            animate={{
              background: `conic-gradient(#3b82f6 ${animatedGrade}deg, #e5e7eb 0deg)`,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-white rounded-full m-2"></div>
            <p className="absolute text-lg font-semibold text-gray-800">
              {course.avgGrade}/5
            </p>
          </motion.div>
        </div>

        {/* Circular Progress Bar for Average Rating */}
        <div className="flex flex-col items-center space-y-2">
          <p className="text-sm text-gray-500 whitespace-nowrap flex items-center justify-center">
            متوسط الصعوبة
            <button
              onMouseEnter={() => setShowTooltip(true)}
              onClick={() => setShowTooltip(!showTooltip)}
              className="relative"
            >
              <Info className="mx-1" size={20} />
              {showTooltip && (
                <div className="absolute z-10 w-fit p-2 bg-white border border-gray-200 rounded-md shadow-lg -left-10 top-6 text-right">
                  <p className="text-sm text-gray-500">
                    عدد التقييمات: {course.numOfRaters}
                  </p>
                </div>
              )}
            </button>
          </p>
          <motion.div
            className="relative w-20 h-20 rounded-full flex items-center justify-center bg-gray-200"
            animate={{
              background: `conic-gradient(${getDifficultyColor(
                course.avgRating
              )} ${animatedRating}deg, #e5e7eb 0deg)`,
            }}
            transition={{ duration: 1.5, ease: "easeInOut" }}
          >
            <div className="absolute inset-0 bg-white rounded-full m-2"></div>
            <p className="absolute text-lg font-semibold text-gray-800">
              {course.avgRating}/5
            </p>
          </motion.div>
        </div>
      </div>
      {/*<div className="absolute top---4">
      {["comments", "quizzes"].map((tab) => (
            <button
              key={tab}
              className={`py-2 px-4 h-16 ml-2 font-medium text-base relative transition-all duration-200 rounded-lg bg-white shadow-sm hover:shadow-md
        ${
          activeTab === tab
            ? "text-black font-extrabold border-b-4 border-b-TAF-600"
            : "text-gray-500 hover:text-TAF-500 border-b-2 border-b-transparent"
        }`}
              onClick={() => setActiveTab(tab)}
            >
              {tab === "comments" ? "التعليقات" : "الاختبارات"}
            </button>
          ))}
          </div>*/}
    </div>
  );
}
