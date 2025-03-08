import React, { useState } from "react";
import { CircleX } from "lucide-react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { gradeMapping } from "../../util/gradeMapping";

export default function EnterGrade({ courseId, onClose }) {
  const [grade, setGrade] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function handleChange(e) {
    setGrade(e.target.value);
  }

  async function handleSubmit() {
    if (isSubmitting) return;
    try {
      console.log(gradeMapping(grade));
    } catch (error) {
      toast.error("يجب ان تكون الدرجة صحيحة");
      return;
    }

    setIsSubmitting(true);

    try {
      const response = await axios.post("/enterGrade", {
        courseId,
        grade: gradeValue,
      });

      if (response.status === 200) {
        toast.success("تم تسجيل الدرجة بنجاح");
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
    <div className="relative bg-white p-4 rounded-lg shadow-md" dir="rtl">
      {/* Close Button */}
      <button
        className="absolute top-2 left-2 text-gray-500 hover:text-red-500 transition"
        onClick={onClose}
      >
        <CircleX size={24} />
      </button>

      <h3 className="text-lg font-semibold mb-2">أدخل درجتك</h3>

      <input
        type="text"
        value={grade}
        onChange={handleChange}
        placeholder="أدخل الدرجة (0-100)"
        className="w-full px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500 outline-none"
        min="0"
        max="100"
        disabled={isSubmitting}
      />

      <button
        onClick={handleSubmit}
        className="mt-4 bg-blue-500 text-white px-6 py-2 rounded-lg hover:opacity-70 active:opacity-55 transition-all"
        disabled={isSubmitting}
      >
        {isSubmitting ? "جاري الحفظ..." : "حفظ"}
      </button>
    </div>
  );
}
