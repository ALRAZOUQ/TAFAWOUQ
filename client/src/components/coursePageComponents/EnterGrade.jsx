import React, { useState } from "react";
import { CircleX } from "lucide-react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useSchedule } from "../../context/ScheduleContext";
import { gradeMapping } from "../../util/gradeMapping";

export default function EnterGrade({ courseId, onClose,onCourseUpdate }) {
  
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scheduleCourses, updateCourseGrade } = useSchedule();
  const gradeOptions = [
    { label: "A+", value: 5 },
    { label: "A", value: 4.75 },
    { label: "B+", value: 4.5 },
    { label: "B", value: 4 },
    { label: "C+", value: 3.5 },
    { label: "C", value: 3 },
    { label: "D+", value: 2.5 },
    { label: "D", value: 2 },
    { label: "F", value: 1 },
  ];

const [grade, setGrade] = useState(getCurrentGrade(scheduleCourses,courseId));//this state will take the curent rate of the course registerd in the course if founded
  async function handleSubmit() {
    if (isSubmitting || grade === null) return;

    setIsSubmitting(true);

    try {
      const response = await axios.post("/protected/gradeCourse", {
        courseId,
        gradeValue: grade,
      });

      if (response.status === 200) {
        toast.success("تم تسجيل الدرجة بنجاح");
        updateCourseGrade(courseId,grade)//will update the grade of the course inside scheduleContext
        onCourseUpdate && onCourseUpdate();//will update the course rate inside the course card(refetch the course data) only used in the course card
        onClose();
      } else {
        toast.error("حدث خطأ غير متوقع.");
      }
    } catch (error) {
      console.error("Error submitting grade:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تسجيل الدرجة."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="relative bg-white p-6 rounded-lg shadow-md min-w-[300px] max-w-sm mx-auto"
      dir="rtl"
    >
      {/* Close Button */}
      <button
        className="absolute top-2 left-2 text-gray-500 hover:text-red-500 transition"
        onClick={onClose}
      >
        <CircleX size={24} />
      </button>

      <h3 className="text-lg font-semibold mb-4 text-center">أدخل درجتك</h3>

      <div className="flex flex-wrap gap-2 justify-center">
        {gradeOptions.map((option) => (
          <button
            key={option.value}
            onClick={() => setGrade(option.value)}
            className={`px-4 py-2 rounded-lg border transition-all ${
              grade === option.value
                ? getColor(option.value)
                : "bg-gray-200 text-gray-700 bg-ye"
            } hover:bg-blue-400 hover:text-white`}
          >
            {option.label}
          </button>
        ))}
      </div>

      <button
        onClick={handleSubmit}
        className="mt-4 w-full bg-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all"
        disabled={isSubmitting || grade === null}
      >
        {isSubmitting ? "جاري الحفظ..." : "حفظ"}
      </button>
    </div>
  );
}
//colors is based on my invidual choosing it can be modified if you prefer something else
const getColor = (grade) => {
  if (grade === 5) return "bg-green-400";
  if (grade === 4.75) return "bg-green-600";
  if (grade === 4.5) return "bg-green-700";
  if (grade === 4) return "bg-yellow-200";
  if (grade === 3.5) return "bg-orange-300";
  if (grade === 3) return "bg-orange-400";
  if (grade === 2.5) return "bg-red-300";
  if (grade === 2) return "bg-red-400";
  if (grade === 1) return "bg-red-600";
};

/**
 * Gets the current grade for a specific course from the courses array
 * @param {Array} courses - Array of course objects containing id and grade properties
 * @param {string|number} courseId - ID of the course to find
 * @returns {number|null} The grade value if found and not 0, otherwise null
 */
function getCurrentGrade(courses, courseId) {
  const foundCourse = courses.find(
    (course) => course.id === courseId && course.grade !== 0
  );
  return foundCourse?.grade ?? null;
}