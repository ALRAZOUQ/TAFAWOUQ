import { Pencil, SquarePlus } from "lucide-react";
import { Link } from "react-router-dom";
import { useState } from "react";
import { useAuth } from "../../context/authContext";
import EditCourseModal from "../EditCourseModal";
import { useSchedule } from "../../context/ScheduleContext";
import DifficultyProgressBar from "../DifficultyProgressBar";
import KababMenu from "../KababMenu";
import ThreeDotMenuButton from "../ThreeDotMenuButton";
import { motion } from "framer-motion";

export default function Course({ id, code, name, avgRating, creditHours, overview }) {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user, isAuthorized } = useAuth();
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { addCourseToSchedule } = useSchedule();

  function handleAddCourseToSchedule() {
    addCourseToSchedule(id);
    setMenuOpen(false);
  }

  return (
    <motion.div
      className="relative bg-white shadow-lg rounded-2xl p-4 border-y border-y-gray-200 border-x-4 border-x-TAF-300 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      whileHover={{ y: -5, boxShadow: "0 10px 25px rgba(0, 0, 0, 0.1)" }}>
      {isAuthorized && (
        <KababMenu setMenuOpen={setMenuOpen} position={"absolute top-3 right-3"} menuOpen={menuOpen}>
          {!user?.isAdmin && (
            <ThreeDotMenuButton clickHandler={handleAddCourseToSchedule} purpose={"normal"}>
              <SquarePlus size={20} />
              أضف المادة الى الجدول
            </ThreeDotMenuButton>
          )}
          {isAuthorized && user.isAdmin && (
            <ThreeDotMenuButton
              clickHandler={() => {
                setIsEditModalOpen(true);
                setMenuOpen(false);
              }}
              purpose={"warning"}>
              <Pencil size={16} />
              تعديل المادة
            </ThreeDotMenuButton>
          )}
        </KababMenu>
      )}
      {isAuthorized && user.isAdmin && (
        <EditCourseModal
          id={id}
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          code={code}
          name={name}
          creditHours={creditHours}
          overview={overview}
        />
      )}

      <Link to={`/courses/${id}`} className="h-full">
        <motion.div whileTap={{ scale: 0.98 }} className="h-full flex flex-col">
          <h3 className="text-base sm:text-lg font-bold text-gray-700 text-center sm:text-left">{code}</h3>
          <h2 className="text-lg sm:text-base  text-gray-900 mt-1 text-center sm:text-left">{name}</h2>
          <div className="flex flex-1"> </div>
          <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-2">
            <div className="w-full mt-2 sm:mt-0">
              <DifficultyProgressBar value={avgRating} />
            </div>
          </div>
        </motion.div>
      </Link>
    </motion.div>
  );
}
