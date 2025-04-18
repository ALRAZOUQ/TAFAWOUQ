import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Search } from "lucide-react";

export default function ShareQuizModal({
  isOpen,
  onClose,
  courses = [{ name: "fff", code: "jfjf", id: 44 }],
}) {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCourse, setSelectedCourse] = useState(null);

  const filteredCourses = courses.filter(
    (course) =>
      course.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      course.code.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.dialog
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="fixed inset-0 flex items-center justify-center backdrop-blur-md p-4 
                  w-full max-w-md sm:max-w-lg md:max-w-xl lg:max-w-3xl 
                  bg-white shadow-2xl rounded-2xl border border-gray-200"
          open={isOpen}
          onClose={onClose}
        >
          <div className="w-full p-6">
            {/* Modal Header */}
            <div className="flex justify-between items-center pb-3">
              <h2 className="text-2xl font-semibold text-gray-800">
                مشاركة الاختبار
              </h2>
              <button
                onClick={onClose}
                className="text-gray-500 hover:text-gray-800 text-xl"
              >
                &times;
              </button>
            </div>

            {/* Search Input */}
            <div className="relative w-full my-4">
              <Search className="absolute right-3 top-3 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="ابحث عن المادة"
                className="w-full h-10 p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>

            {/* Courses List */}
            <div className="max-h-96 overflow-y-auto my-4">
              {filteredCourses.map((course) => (
                <motion.div
                  key={course.id}
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  className={`p-3 my-2 rounded-lg border cursor-pointer ${
                    selectedCourse?.id === course.id
                      ? "bg-blue-50 border-blue-200"
                      : "bg-gray-50 border-gray-200"
                  }`}
                  onClick={() => setSelectedCourse(course)}
                >
                  <h3 className="font-medium">
                    {course.code} - {course.name}
                  </h3>
                </motion.div>
              ))}
            </div>

            {/* Action Buttons */}
            <div className="flex justify-end space-x-3 border-t pt-3">
              <button
                className="px-4 py-2 bg-gray-300 text-gray-800 rounded-lg hover:bg-gray-400 transition"
                onClick={onClose}
              >
                إلغاء
              </button>
              <button
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition disabled:opacity-50"
                disabled={!selectedCourse}
                onClick={() => {
                  // TODO: Implement share action
                  onClose();
                }}
              >
                مشاركة
              </button>
            </div>
          </div>
        </motion.dialog>
      )}
    </AnimatePresence>
  );
}
