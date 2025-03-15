import { NavLink } from "react-router-dom";
import { motion } from "framer-motion";

export default function NavigationLink({ linkTo, route }) {
  return (
    <NavLink
      className="text-gray-700 hover:text-gray-500 transition-colors w-full md:w-auto text-center "
      to={route}
      end
    >
      {({ isActive }) => (
        <motion.div
          whileHover={{
            scale: 1.04,
          }}
          transition={{ duration: 0.2 }}
          className={`relative w-full whitespace-nowrap md:w-auto text-center py-1 px-3 
                    border-b-4 border-TAF-100 transition-all duration-300 
                   ${isActive ? "border-opacity-100" : "border-opacity-0"}`}
        >
          {linkTo}
        </motion.div>
      )}
    </NavLink>
  );
}
