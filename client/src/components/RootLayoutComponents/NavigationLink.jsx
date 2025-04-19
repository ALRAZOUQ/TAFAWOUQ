import { motion } from "framer-motion";
import { Link, useLocation } from "react-router-dom";

export default function NavigationLink({ linkTo, route }) {
  const location = useLocation();
  const isActive = location.pathname === route;

  return (
    <motion.div
      whileHover={{
        scale: 1.04,
      }}
      transition={{ duration: 0.2 }}
      className="relative group"
    >
      <Link
        to={route}
        className={`relative w-full whitespace-nowrap md:w-auto text-center py-1 px-3 text-gray-700 hover:text-gray-500 transition-colors border-b-4 border-TAF-100 ${isActive ? "border-opacity-100" : "border-opacity-0"}`}
        aria-label={linkTo}
      >
        {linkTo}
      </Link>
      <div className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
        {linkTo}
      </div>
    </motion.div>
  );
}
