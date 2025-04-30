import { motion } from "framer-motion";

export default function DifficultyProgressBar({ value }) {
  const getDifficultyLabel = () => {
    if (value > 4.5) return "صعب جدا";
    if (value <= 4.5 && value > 3.5) return "صعب";
    if (value <= 3.5 && value > 2.5) return "متوسط";
    if (value <= 2.5 && value > 1.5) return "سهل";
    if (value <= 1.5 && value >= 1) return "سهل جدا";
    return "لا يوجد تقييمات بعد";
  };
  const getColor = (value) => {
    if (value <= 1.5 && value >= 1) return "bg-green-400";
    if (value <= 2.5 && value > 1.5) return "bg-green-800";
    if (value <= 3.5 && value > 2.5) return "bg-orange-600";
    if (value <= 4.5 && value > 3.5) return "bg-red-500";
    return "bg-red-600";
  };

  return (
    <div className="w-full bg-gray-200 rounded-full h-6 relative overflow-hidden">
      <motion.div
        className={`h-full ${getColor(value)} rounded-full`}
        initial={{ width: 0 }}
        animate={{ width: `${(value / 5) * 100}%` }}
        transition={{ duration: 0.5 }}
      />
      <span
        className={`absolute inset-0 flex justify-center items-center ${
          value > 0
            ? value <= 2.5 && value > 1.5
              ? "text-green-800"
              : "text-white"
            : "text-gray-950"
        } font-bold text-sm`}
      >
        {value > 0 ? getDifficultyLabel() : "لا يوجد تقييمات بعد"}
      </span>
    </div>
  );
}
