import { useEffect, useRef, useActionState } from "react";
import { motion } from "framer-motion";
import { toast } from "react-toastify";
import { useCourseData } from "../context/CourseContext";
import { motion } from "framer-motion";
export default function EditCourseModal({
  id,
  overview,
  code,
  name,
  creditHours,
  isOpen,
  onClose,
}) {
  const { onUpdateCourseIntoContext } = useCourseData();
  const updateFormData = (prevState, { name, value }) => ({
    ...prevState,
    [name]: value,
  });

  const [formData, dispatch] = useActionState(updateFormData, {
    overview,
    code,
    name,
    creditHours,
  });

  const dialogRef = useRef(null);

  useEffect(() => {
    if (isOpen) {
      dialogRef.current?.showModal();
    } else {
      dialogRef.current?.close();
    }
  }, [isOpen]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      onUpdateCourseIntoContext(formData, id); //this is the context
      onClose(); // Close the modal
    } catch (error) {
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء تحديث المقرر";
      toast.error(errorMessage);
    }
  };

  return (
    <>
      {isOpen && (
        <dialog
          ref={dialogRef}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4 
                  w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl 
                  bg-white shadow-2xl rounded-2xl border border-gray-200"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="w-full"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                تعديل المقرر
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-5 mt-4">
              {/* Course Code */}
              <div className="flex flex-col">
                <label
                  htmlFor="code"
                  className="text-sm font-medium text-gray-700"
                >
                  رمز المقرر
                </label>
                <input
                  id="code"
                  name="code"
                  value={formData.code}
                  onChange={(e) =>
                    dispatch({ name: e.target.name, value: e.target.value })
                  }
                  required
                  className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Course Name */}
              <div className="flex flex-col">
                <label
                  htmlFor="name"
                  className="text-sm font-medium text-gray-700"
                >
                  إسم المقرر
                </label>
                <input
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={(e) =>
                    dispatch({ name: e.target.name, value: e.target.value })
                  }
                  required
                  className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Credit Hours */}
              <div className="flex flex-col">
                <label
                  htmlFor="creditHours"
                  className="text-sm font-medium text-gray-700"
                >
                  الساعات
                </label>
                <input
                  id="creditHours"
                  name="creditHours"
                  type="number"
                  value={formData.creditHours}
                  onChange={(e) =>
                    dispatch({ name: e.target.name, value: e.target.value })
                  }
                  required
                  className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none"
                />
              </div>

              {/* Course Overview */}
              <div className="flex flex-col">
                <label
                  htmlFor="overview"
                  className="text-sm font-medium text-gray-700"
                >
                  وصف المقرر
                </label>
                <textarea
                  id="overview"
                  name="overview"
                  value={formData.overview}
                  onChange={(e) =>
                    dispatch({ name: e.target.name, value: e.target.value })
                  }
                  className="mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:outline-none h-24 resize-none"
                ></textarea>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end space-x-3 border-t pt-3">
                <button
                  type="button"
                  className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition ml-6"
                  onClick={onClose}
                >
                  إلغاء
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  حفظ
                </button>
              </div>
            </form>
          </motion.div>
        </dialog>
      )}
    </>
  );
}
