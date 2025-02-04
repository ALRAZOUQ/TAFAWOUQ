import { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import { Menu, X, Search } from "lucide-react";
import main_logo from "../assets/mainLogo.svg";
import axios from "../api/axios";
import { useCourseData } from "../context/CourseContext";
export default function MainHeader() {
  const [searchInput, setSearchInput] = useState("");
  const [isOpen, setIsOpen] = useState(false);
const [isLogged, setIsLogged] = useState(false);//we have to update the state bases on userContext

  const [filterdCourses, setfilterdCourses] = useState(null);
  const [showResults, setShowResults] = useState(false);
  // Use the context to get courses data
  const { coursesData, setCoursesData } = useCourseData();
  

  // Only fetch the data one time then use
  useEffect(() => {
    if (!coursesData) {
      axios
        .get("auth/coursesTiteles")
        .then((response) => {
          const coursesArray = Array.isArray(response.data)
            ? response.data
            : [];
          // console.log(response.data);
          setCoursesData(coursesArray);
          setfilterdCourses(coursesArray);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }
  }, [coursesData, setCoursesData]);
  // Only fetch the data one time then use
  useEffect(() => {
    if (!coursesData) {
      axios
        .get("auth/coursesTiteles")
        .then((response) => {
          const coursesArray = Array.isArray(response.data)
            ? response.data
            : [];
          // console.log(response.data);
          setCoursesData(coursesArray);
          setfilterdCourses(coursesArray);
        })
        .catch((error) => {
          console.error("API Error:", error);
        });
    }
  }, [coursesData, setCoursesData]);

  /*note if the admin create new course we have to update the data stored in the context CourseContext */

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
      setfilterdCourses(
        coursesData.filter(
          (course) =>
            course.code.toLowerCase().includes(value.toLowerCase()) ||
            course.name.toLowerCase().includes(value.toLowerCase())
        )
      );
    }
  };

  return (
    <nav className="p-4 flex flex-col md:flex-row items-center justify-between border-2 border-TAFb-400 bg-gradient-to-l from-TAFb-200 to-TAFb-100 rounded-lg w-full">
      {/* Logo and Toggle Button */}
      <div className="flex items-center justify-between w-full md:w-auto">
        <h1 className="text-white font-bold text-xl md:text-2xl">
          <img
            src={main_logo}
            className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 object-contain"
            alt="TAFAWOUQ LOGO"
          />
        </h1>

        
        <button
          className="md:hidden text-white focus:outline-none"
          onClick={() => setIsOpen(!isOpen)}
        >
          {isOpen ? <X size={28} /> : <Menu size={28} />}
        </button>
        
      </div>

      {/* Navigation Links & Search Bar */}
      <div
        className={`w-full md:flex md:items-center md:gap-8  ${
          isOpen ? "flex flex-col gap-4" : "hidden"
        } md:flex-row md:justify-center`}
      >
        {/* Search Bar */}
        <div className="w-full md:w-1/2 relative">
          <div className="relative flex items-center">
            <Search className="absolute left-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              placeholder="إبحث عن المواد"
              className="w-full p-2 pl-10 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-cairo"
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
                  
                  <div className="p-3 text-gray-500 font-cairo">
                    لا توجد نتائج
                  </div>
                ) : (
                  <ul className="py-2">
                    {filterdCourses?.map((course) => (
                      <li
                        key={course.id}
                        className="px-3 py-2 hover:bg-gray-100 group/searchResult"
                      >
                        <Link
                          to={`/course/${course.id}`}
                          className="block font-cairo text-lg  "
                        >
                          <p className="text-gray-700 group-hover/searchResult:text-blue-500 ">
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


  {/* Additional Links */}
   {/*
  <div className="flex flex-col md:flex-row gap-2 md:gap-8 mt-4 md:mt-0 justify-center items-center ">
  <Link to="/" className="text-white hover:text-gray-300 transition-colors w-full md:w-auto text-center p-1 md:p-0 font-cairo">
       القائمة الرئيسية
  </Link>
  <Link to="/about" className="text-white hover:text-gray-300 transition-colors w-full md:w-auto text-center p-1 md:p-0 font-cairo">
    حول
  </Link>
  <Link to="/contact" className="text-white hover:text-gray-300 transition-colors w-full md:w-auto text-center p-1 md:p-0 font-cairo">
    التواصل
  </Link>
  </div>
  */}

  {/* Sign Up Button mobile */}

 
  {isLogged ?(  <button className=" md:hidden bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors font-cairo  ">
     سجل الخروج
        </button>):(
      <button className="md:hidden  bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors font-cairo ">
     سجل الدخول
        </button>)}

      </div>
      {/* Desktop Sign Up Button */}
      {isLogged ?( <button className="hidden md:block bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors font-cairo w-fit whitespace-nowrap ">
      سجل الخروج
        </button>):(
      <button className="hidden md:block bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors font-cairo w-fit whitespace-nowrap ">
      سجل الدخول
        </button>)}
    </nav>
  );
}

