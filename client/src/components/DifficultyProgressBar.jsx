import { motion } from "framer-motion";
import { getColor } from "../util/getColor.js";

export default function DifficultyProgressBar({ value }) {
  const getDifficultyLabel = () => {
    if (value > 4) return "صعب جدا";
    if (value > 3) return "صعب";
    if (value > 2) return "متوسط";
    if (value > 1) return "سهل";
    if (value > 0) return "سهل جدا";
    return "لا يوجد تقييمات بعد";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
      <motion.div
            className={`h-full ${getColor(value)} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / 5) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
      <span className="absolute inset-0 flex justify-center items-center text-white font-bold text-sm">
        {value > 0 ? getDifficultyLabel() : "لا يوجد تقييمات بعد"}
      </span>
    </div>
  );
}
