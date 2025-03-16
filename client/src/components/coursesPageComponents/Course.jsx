import { MoreVertical, Pencil, SquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import EditCourseModal from "../EditCourseModal";
import { useSchedule } from "../../context/ScheduleContext";
import DifficultyProgressBar from "../DifficultyProgressBar";

export default function Course({
  id,
  code,
  name,
  avgRating,
  creditHours,
  overview,
}) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { addCourseToSchedule } = useSchedule();

  function handleAddCourseToSchedule() {
    addCourseToSchedule(id);
    setMenuOpen(false);
  }

  return (
    <div className="relative bg-white shadow-lg rounded-2xl p-4 border-y border-y-gray-200 border-x-4 border-x-TAF-300 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto">
      <div className="absolute top-3 right-3">
        <button
          onClick={() => setMenuOpen(!menuOpen)}
          className="p-1 rounded-full hover:bg-gray-100"
        >
          <MoreVertical size={20} />
        </button>
        {!user?.isAdmin && menuOpen && (
          <div className="absolute right-0 mt-2 w-fit z-10 bg-white shadow-md rounded-md py-2 border border-gray-200">
            <button
              onClick={handleAddCourseToSchedule}
              className="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 whitespace-nowrap"
            >
              <SquarePlus size={20} />
              أضف المادة الى الجدول
            </button>
          </div>
        )}
        {user?.isAdmin && menuOpen && (
          <div className="absolute right-0 mt-2 w-40 z-10 bg-white shadow-md rounded-md py-2 border border-gray-200">
            <button
              onClick={() => {
                setIsEditModalOpen(true);
                setMenuOpen(false);
              }}
              className="flex items-center gap-2 w-full text-right px-4 py-2 text-sm text-orange-400 hover:bg-gray-100"
            >
              <Pencil size={16} />
              <span>تعديل المادة</span>
            </button>
          </div>
        )}
      </div>
      <EditCourseModal
        id={id}
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        code={code}
        name={name}
        creditHours={creditHours}
        overview={overview}
      />

      <Link to={`/courses/${id}`}>
        <div>
          {/* Course Code */}
          <h3 className="text-base sm:text-lg font-bold text-gray-700 text-center sm:text-left">
            {code}
          </h3>
          {/* Course Name */}
          <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-1 text-center sm:text-left">
            {name}
          </h2>
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-2">
            <div className="w-full mt-2 sm:mt-0">
              <DifficultyProgressBar value={avgRating} />
            </div>
          </div>
        </div>
      </Link>
    </div>
  );
}
