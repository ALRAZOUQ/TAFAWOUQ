import React, { useState, useEffect } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";

export default function Rate({ courseId, initialRating }) {
  const [rating, setRating] = useState(initialRating || 0);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    if (initialRating) {
      setRating(initialRating);
    }
  }, [initialRating]);

  const handleRating = async (value) => {
    if (isSubmitting) return;

    setRating(value);
    setIsSubmitting(true);

    try {
      const response = await axios.post(`auth/rateCourse/${courseId}`, {
        rating: value,
      });

      if (response.status === 200) {
        toast.success("تم تسجيل تقييمك بنجاح!");
      }
    } catch (error) {
      console.error("Error submitting rating:", error);
      toast.error("حدث خطأ أثناء تسجيل التقييم");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="bg-white p-4 rounded-lg shadow-md" dir="rtl">
      <h3 className="text-lg font-semibold mb-2">قيّم صعوبة المقرر</h3>
      <div className="flex mb-2">
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

      {/* Progress bar filling from right to left */}
      <div className="relative w-full bg-gray-300 rounded-full h-4">
        <div
          className={`absolute top-0 right-0 h-full rounded-full transition-all ${getColor(
            rating
          )}`}
          style={{ width: `${(rating / 5) * 100}%` }}
        />
      </div>

      {rating > 0 && (
        <p className="mt-2 font-semibold">
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
      )}
    </div>
  );
}

// Function to get background color based on rating
const getColor = (rating) => {
  if (rating <= 1) return "bg-green-400";
  if (rating <= 2) return "bg-green-800";
  if (rating <= 3) return "bg-orange-600";
  if (rating <= 4) return "bg-red-500";
  return "bg-red-600";
};
