import { useState, useEffect } from "react";
import { Search,X } from "lucide-react";
import { useCourseData } from "../../context/CourseContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
export default function SearchBarForDesktop({handleSearching}) {
  const [filterdCourses, setfilterdCourses] = useState(null);
  const [showResults, setShowResults] = useState(false);
  const [searchInput, setSearchInput] = useState("");
  const { coursesData, fetchCoursesContext } = useCourseData();
  const onSearch = (e) => {
    const { value } = e.target;
    setSearchInput(value);
    setShowResults(value.length > 0);

    if (coursesData) {
      setfilterdCourses(
        coursesData.filter(
          (course) =>
            course.code.toLowerCase().includes(value.toLowerCase()) ||
            course.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };
  useEffect(() => {
    if (!coursesData) {
      fetchCoursesContext();
    }
  }, [coursesData]);
  return (
    <motion.div
      initial={{ opacity: 0, y: -100 }} // Start above the navigation bar
      animate={{ opacity: 1, y: 0 }} // Slide down to its position
      exit={{ opacity: 0, y: -100 }} // Slide back up when exiting
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="hidden md:flex md:justify-center md:items-center p-2 border-b border-b-TAF-100 bg-TAF-200 z-50 
               fixed top-[100px] left-0 w-full shadow-md" // Position below the navigation bar
    >
      <div className="w-3/5 relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="إبحث عن المواد"
            className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none 
                     focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchInput}
            onChange={onSearch}
            onFocus={() => setShowResults(searchInput.length > 0)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
        </div>
        <div className="relative">
          <button
            onClick={handleSearching}
            className="hidden md:absolute md:top-1 md:right-1"
          >
            <X size={18} />
          </button>
        </div>
        {/* Search Results */}
        {showResults && (
          <div className="absolute z-50 w-full mt-1 bg-white rounded-md border border-gray-300 shadow-lg">
            <div className="max-h-60 overflow-y-auto">
              {filterdCourses?.length === 0 ? (
                <div className="p-3 text-gray-500">لا توجد نتائج</div>
              ) : (
                <ul className="py-2">
                  {filterdCourses?.map((course) => (
                    <li
                      key={course.id}
                      className="px-3 py-2 hover:bg-gray-100 group/searchResult"
                    >
                      <Link
                        onClick={() => setSearchInput("")}
                        to={`/courses/${course.id}`}
                        className="block text-lg"
                      >
                        <p className="text-gray-700 group-hover/searchResult:text-blue-500">
                          {course.name} |{" "}
                          <span className="font-bold text-gray-900">
                            {course.code}
                          </span>
                        </p>
                      </Link>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </motion.div>
  );
}
