import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";

const BackButton = ({route}) => {
  const navigate = useNavigate();

  return (
    <motion.button
      onClick={() => navigate(route)} // Navigates to the previous route
      className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
      whileHover={{ scale: 1.2 }}
      whileTap={{ scale: 0.9 }}
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        animate={{ x: [0, -4, 0] }}
        transition={{ repeat: Infinity, repeatDelay: 1.5, duration: 0.5 }}
      >
        <ChevronRight size={16} strokeWidth={4} />
      </motion.div>
    </motion.button>
  );
};

export default BackButton;
