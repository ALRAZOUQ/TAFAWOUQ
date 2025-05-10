import { useState, useEffect } from "react";
import { Search, X } from "lucide-react";
import { useCourseData } from "../../context/CourseContext";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

export default function SearchBarForDesktop({ handleSearching }) {
  const [filterdCourses, setfilterdCourses] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [searchInput, setSearchInput] = useState("");

  const { coursesData, fetchCoursesContext } = useCourseData();

  useEffect(() => {
    if (!coursesData) fetchCoursesContext();
  }, [coursesData, fetchCoursesContext]);

  const onSearch = (e) => {
    const value = e.target.value;
    setSearchInput(value);
    setShowResults(value.length > 0);

    if (coursesData) {
      setfilterdCourses(
        coursesData.filter(
          (c) =>
            c.code.toLowerCase().includes(value.toLowerCase()) ||
            c.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      transition={{ duration: 0.2, ease: "easeOut" }}
      className="relative w-full ml-10 flex justify-center items-center bg-TAF-300 z-50 transition-all duration-300 overflow-visible"
    >
      <div
        id="search-container"
        className="w-full relative bg-TAF-300 rounded-md shadow-md overflow-visible "
      >
        {/* input + clear button */}
        <div className="relative flex items-center w-full">
          {/* clear button on the left */}
          {
            <button
              onClick={() => {
                setSearchInput("");
                handleSearching();
              }}
              className="absolute left-3 p-1 rounded-full hover:bg-gray-100 z-10"
            >
              <X size={18} />
            </button>
          }

          {/* search input */}
          <input
            type="text"
            placeholder={
              /*space here is very important don't remove it i know you can't stand unless you remve but try not to remove it */ "        إبحث عن المواد"
            }
            className="w-full p-3 pl-10 rounded-md border border-gray-300 focus:outline-none 
                       focus:ring-2 focus:ring-TAF-100 focus:border-transparent transition-all"
            value={searchInput}
            onChange={onSearch}
            onFocus={() => setShowResults(searchInput.length > 0)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
            autoFocus
          />

          {/* search icon as placeholder on the right */}
          {!searchInput && (
            <Search className="absolute right-3 h-5 w-5 text-gray-400 pointer-events-none" />
          )}
        </div>

        {/* dropdown */}
        {showResults && (
          <div
            className="absolute top-full left-0 right-0 mt-2 bg-white rounded-md border border-gray-300 
                       shadow-xl z-50 max-h-[60vh] overflow-y-auto"
          >
            {filterdCourses.length === 0 ? (
              <div className="p-3 text-gray-500">لا توجد نتائج</div>
            ) : (
              <ul className="py-2">
                {filterdCourses.map((course) => (
                  <li
                    key={course.id}
                    className="px-3 py-2 hover:bg-gray-100 group/searchResult"
                  >
                    <Link
                      onClick={() => {
                        setSearchInput("");
                        handleSearching();
                      }}
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
        )}
      </div>
    </motion.div>
  );
}
