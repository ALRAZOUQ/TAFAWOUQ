import { useState, useEffect } from "react";
import { Search } from "lucide-react";
import { useCourseData } from "../../context/CourseContext";
import { Link } from "react-router-dom";
export default function SearchBar({ isOpen }) {
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
    <div
      className={`w-full md:hidden ${
        isOpen ? "flex flex-col gap-4 mb-1" : "hidden"
      }`}
    >
      <div className="w-full relative">
        <div className="relative flex items-center">
          <Search className="absolute left-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            placeholder="إبحث عن المواد"
            className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
            value={searchInput}
            onChange={onSearch}
            onFocus={() => setShowResults(searchInput.length > 0)}
            onBlur={() => setTimeout(() => setShowResults(false), 200)}
          />
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
                        onClick={() => {
                          setIsSearching(false);
                          setSearchInput("");
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
          </div>
        )}
      </div>
    </div>
  );
}
