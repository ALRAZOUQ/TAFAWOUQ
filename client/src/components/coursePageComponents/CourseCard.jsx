import React, { useState, useEffect } from "react";
import {
  Trash2,
  SquarePlus,
  MoreVertical,
  Pencil,
  BarChart,
  ClipboardList,
} from "lucide-react";
import { useSchedule } from "../../context/ScheduleContext";
import EditCourseModal from "../../components/EditCourseModal";
import Rate from "./Rate";
import EnterGrade from "./EnterGrade";
import KababMenu from "../KababMenu";
import ThreeDotMenuButton from "../ThreeDotMenuButton";

export default function CourseCard({
  course,
  isAdmin,
  onDelete,
  onCourseUpdate,
}) {
  const { addCourseToSchedule } = useSchedule();
  const [menuOpen, setMenuOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isRating, setIsRating] = useState(false);
  const [isGrading, setIsGrading] = useState(false);
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
          </div>
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
  );
}
