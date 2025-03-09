import React, { useState, useEffect } from "react";
import { CircleX } from "lucide-react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useSchedule } from "../../context/ScheduleContext";

export default function Rate({ courseId, onClose, onCourseUpdate }) {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { scheduleCourses, updateCourseRate } = useSchedule();
  const [rating, setRating] = useState(
    getCurrentRate(scheduleCourses, courseId)
  ); //this state will take the curent rate of the course registerd in the course if founded

  function handleRating(value) {
    setRating(value);
  }

  async function handleSubmitting() {
    if (isSubmitting) return;
    if (rating < 1 || rating > 5 || isNaN(rating)) {
      toast.error("يجب أن يكون التقييم بين 1 و 5");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/protected/rateCourse", {
        courseId,
        rateValue: rating,
      });

      if (response.status === 200) {
        toast.success("تم التقييم بنجاح");
        updateCourseRate(courseId, rating); //will update the rate of the course inside scheduleContext
        onCourseUpdate && onCourseUpdate(); //will update the course rate inside the course card(refetch the course data) only used in the course card
      } else {
        toast.error("حدث خطأ غير متوقع.");
      }
    } catch (error) {
      if (error?.response?.status === 404) {
        toast.error("هذا المقرر غير مسجل في الجدول الخاص بك");
        return;
      }
      console.error("Error submitting rating:", error);
      toast.error(
        error.response?.data?.message || "حدث خطأ أثناء تسجيل التقييم."
      );
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div
      className="relative bg-white p-6 pt-10 rounded-lg shadow-md w-80"
      dir="rtl"
    >
      {/* Close Button */}
      <button
        className="absolute top-2 left-2 text-gray-500 hover:text-red-500 transition"
        onClick={onClose}
      >
        <CircleX size={24} />
      </button>

      <h3 className="text-lg font-semibold mb-2 text-center">
        قيّم صعوبة المقرر
      </h3>

      <div className="flex mb-2 justify-center">
        {Array.from({ length: 5 }, (_, i) => i + 1).map((num) => (
          <button
            key={num}
            className={`w-8 h-8 flex mx-1 items-center justify-center rounded-full text-white font-bold transition ${
              num <= rating ? getColor(rating) : "bg-gray-300"
            }`}
            onClick={() => handleRating(num)}
            disabled={isSubmitting}
          >
            {num}
          </button>
        ))}
      </div>

      <div className="relative w-full bg-gray-300 rounded-full h-4">
        <div
          className={`absolute top-0 right-0 h-full rounded-full transition-all ${getColor(
            rating
          )}`}
          style={{ width: `${(rating / 5) * 100}%` }}
        />
      </div>

      {rating > 0 && (
        <>
          <p className="mt-2 font-semibold text-center">
            {rating === 1
              ? "سهل جدا"
              : rating === 2
              ? "سهل"
              : rating === 3
              ? "متوسط"
              : rating === 4
              ? "صعب"
              : "صعب جدا"}
          </p>
          <button
            onClick={handleSubmitting}
            className={`mt-4 ${getColor(
              rating
            )} text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all w-full`}
            disabled={isSubmitting}
          >
            {isSubmitting ? "جاري التقييم..." : "قيّم"}
          </button>
        </>
      )}
    </div>
  );
}

const getColor = (rating) => {
  if (rating <= 1) return "bg-green-400";
  if (rating <= 2) return "bg-green-800";
  if (rating <= 3) return "bg-orange-600";
  if (rating <= 4) return "bg-red-500";
  return "bg-red-600";
};

/**
 * Gets the current rate for a specific course from the courses array
 * @param {Array} courses - Array of course objects containing id and rate properties
 * @param {string|number} courseId - ID of the course to find
 * @returns {number|null} The rate value if found and not 0, otherwise null
 */
function getCurrentRate(courses, courseId) {
  const foundCourse = courses.find(
    (course) => course.id === courseId && course.rate !== 0
  );
  return foundCourse?.rate ?? null;
}
