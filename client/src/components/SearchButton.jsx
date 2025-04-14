import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

/**
 * SearchButton - A reusable search component that appears as a button on the right side
 * and expands to show a search input when clicked.
 * 
 * @param {Object} props
 * @param {string} props.placeholder - Placeholder text for the search input
 * @param {string} props.value - Current search value
 * @param {function} props.onChange - Function to handle search input changes
 * @param {string} props.className - Additional CSS classes
 */
export default function SearchButton({ placeholder = "ابحث...", value, onChange, className = "" }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  // Close search on escape key press
  useEffect(() => {
    const handleEscKey = (e) => {
      if (e.key === "Escape" && isExpanded) {
        setIsExpanded(false);
      }
    };
    
    window.addEventListener("keydown", handleEscKey);
    return () => window.removeEventListener("keydown", handleEscKey);
  }, [isExpanded]);
  
  // Close search when clicking outside
  useEffect(() => {
    if (!isExpanded) return;
    
    const handleClickOutside = (e) => {
      if (!e.target.closest(".search-container")) {
        setIsExpanded(false);
      }
    };
    
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isExpanded]);

  return (
    <div className={`search-container fixed bottom-24 right-4 z-50 ${className}`}>
      <AnimatePresence>
        {isExpanded ? (
          <motion.div
            initial={{ width: "48px", opacity: 0.7 }}
            animate={{ width: "300px", opacity: 1 }}
            exit={{ width: "48px", opacity: 0.7 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="flex items-center bg-white rounded-full shadow-md overflow-hidden"
          >
            <input
              type="text"
              value={value}
              onChange={(e) => onChange(e.target.value)}
              placeholder={placeholder}
              className="flex-grow h-12 px-4 outline-none text-right"
              autoFocus
            />
            <button
              onClick={() => setIsExpanded(false)}
              className="p-3 text-gray-500 hover:text-gray-700 transition-colors"
              aria-label="إغلاق البحث"
            >
              <X size={20} />
            </button>
          </motion.div>
        ) : (
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.8, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            onClick={() => setIsExpanded(true)}
            className="flex items-center justify-center w-12 h-12 bg-TAF-300 text-gray-700 rounded-full shadow-md hover:bg-TAF-100 transition-colors"
            aria-label="فتح البحث"
          >
            <Search size={20} />
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
}