import { useRef, useEffect, useState } from "react";
import { isEmpty } from "../util/validation.js";
import axios from "../api/axios";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";

export default function CreateCourse({ handleAddNewCourse }) {
  const dialogRef = useRef(null);
  const dialogContentRef = useRef(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") closeModal();
    };

    document.addEventListener("keydown", handleKeyDown);

    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (
        dialogRef.current &&
        dialogContentRef.current &&
        !dialogContentRef.current.contains(e.target)
      ) {
        closeModal();
      }
    };

    if (isOpen) {
      //add listener
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  const openModal = () => {
    dialogRef.current?.showModal();
    setIsOpen(true);
  };

  const closeModal = () => {
    setIsOpen(false);
    setTimeout(() => dialogRef.current?.close(), 200);
  };

  async function createCourseHandler(event) {
    event.preventDefault();
    if (isLoading) return;

    setIsLoading(true);
    const formData = new FormData(event.target);

    const courseData = {
      code: formData.get("courseCode"),
      name: formData.get("courseName"),
      overview: formData.get("overview"),
      creditHours: parseInt(formData.get("creditHours"), 10),
    };

    if (
      ["code", "name", "overview"].some((field) => isEmpty(courseData[field]))
    ) {
      toast.error("بعض الحقول فارغة، يرجى تعبئتها.");
      setIsLoading(false);
      return;
    }

    try {
      const { data } = await axios.post("admin/addCourse", courseData);
      handleAddNewCourse(data.course);
      closeModal();
      toast.success("تم إنشاء المقرر بنجاح");
    } catch (error) {
      const message =
        error.response?.status === 401
          ? "هذا المقرر موجود بالفعل"
          : error.response?.data?.message || "حدث خطأ أثناء إنشاء المقرر";
      toast.error(message);
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <>
      <button
        onClick={openModal}
        className="bg-gray-50 border-2 border-TAF-100 border-dotted text-gray-700 shadow-lg rounded-2xl hover:opacity-75 px-4 py-2 w-full max-w-md mx-auto text-center font-bold"
      >
        إنشاء مقرر جديدة
      </button>

      <dialog
        ref={dialogRef}
        className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white shadow-2xl rounded-2xl p-0 backdrop:bg-black backdrop:bg-opacity-50"
      >
        <AnimatePresence>
          {isOpen && (
            <motion.div
              ref={dialogContentRef}
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              className="w-full p-4"
            >
              <div className="flex justify-between items-center pb-3">
                <h2 className="text-2xl font-semibold">إنشاء مقرر جديد</h2>
                <button onClick={closeModal} className="text-gray-500 text-xl">
                  &times;
                </button>
              </div>

              <form onSubmit={createCourseHandler} className="space-y-4">
                {[
                  { id: "courseCode", label: "رمز المقرر" },
                  { id: "courseName", label: "إسم المقرر" },
                  {
                    id: "creditHours",
                    label: "الساعات",
                    type: "number",
                    min: "1",
                  },
                ].map(({ id, label, type = "text", min }) => (
                  <div key={id} className="flex flex-col">
                    <label htmlFor={id} className="text-sm font-medium">
                      {label}
                    </label>
                    <input
                      id={id}
                      name={id}
                      type={type}
                      min={min}
                      required
                      className="mt-1 p-2 border rounded-lg"
                    />
                  </div>
                ))}

                <div className="flex flex-col">
                  <label htmlFor="overview" className="text-sm font-medium">
                    وصف المقرر
                  </label>
                  <textarea
                    id="overview"
                    name="overview"
                    required
                    className="mt-1 p-2 border rounded-lg h-24"
                  ></textarea>
                </div>

                <div className="flex justify-end space-x-3 pt-3 gap-4">
                  <button
                    type="button"
                    className="px-4 py-2 bg-gray-300 rounded-lg"
                    onClick={closeModal}
                  >
                    إلغاء
                  </button>
                  <button
                    type="submit"
                    className={`px-4 py-2 rounded-lg text-white ${
                      isLoading
                        ? "bg-gray-400"
                        : "bg-blue-600 hover:bg-blue-700"
                    }`}
                    disabled={isLoading}
                  >
                    {isLoading ? "جارٍ الإنشاء..." : "إنشاء"}
                  </button>
                </div>
              </form>
            </motion.div>
          )}
        </AnimatePresence>
      </dialog>
    </>
  );
}
