import { useState, useEffect } from "react";
import { Menu, X, Search, LogOut, LogIn } from "lucide-react";
import main_logo from "../../assets/mainLogo.svg";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import SearchBar from "./SearchBarForMobile";
import SearchBarForDesktop from "./SearchBarForDesktop";
import { useLocation, useNavigate, Link } from "react-router-dom";
import InboxButton from "./InboxComponents/InboxButton";
import { useMediaQuery } from "../../helperHocks/useMediaQuery";
import AdminLinks from "./AdminLinks";
import UserLinks from "./UserLinks";
import GeneralNavigationLinks from "./GeneralNavigationLinks";
import { useSchedule } from "../../context/ScheduleContext";
export default function MainHeader() {
  const { resetSchedule } = useSchedule();
  const route = useLocation();
  const navigate = useNavigate();
  const { logout, isAuthorized, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);
  const [isSearching, setIsSearching] = useState(false);
  const isMobile = useMediaQuery("(max-width: 768px)");

  // Ensure mobile menu state is properly initialized
  useEffect(() => {
    if (!isMobile && isOpen) {
      setIsOpen(false);
    }
  }, [isMobile]);

  // Close mobile menu when route changes
  useEffect(() => {
    setIsOpen(false);
  }, [route.pathname]);

  // Close mobile menu when user scrolls
  useEffect(() => {
    const handleScroll = () => {
      if (isOpen && window.scrollY > 5) {
        setIsOpen(false);
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [isOpen]);

  function handleSearching() {
    setIsSearching(!isSearching);
  }

  const handleLogout = async () => {
    try {
      const flag = await logout();
      if (flag) {
        toast.success("تم تسجيل الخروج بنجاح");
        resetSchedule();
      }
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-screen overflow-visible shadow-md z-50 bg-transparent relative">
      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-20 md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <nav
        className="p-1 flex flex-col md:flex-row items-center justify-between bg-TAF-200 w-screen border-b border-gray-700  
        lg:min-h-[2rem] xl:min-h-[2rem] relative z-50 max-[810px]:min-[770px]:p-2 overflow-visible"
      >
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between w-full md:w-auto px-2">
          <h1 className="text-white font-bold text-xl md:text-2xl">
            <Link
              // to={isAuthorized ? (user?.isAdmin ? "/admin" : "/home") : "/"}
              to="/"
            >
              <div className="size-10 md:size-12 lg:size-12 xl:size-12 max-[810px]:min-[770px]:size-12 flex items-center justify-center">
                <motion.img
                  src={main_logo}
                  className="object-contain w-full h-full"
                  alt="TAFAWOUQ LOGO"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring" }}
                />
              </div>
            </Link>
          </h1>

          <div className="md:hidden flex items-center gap-2">
            <button
              className="text-TAF-100 focus:outline-none"
              onClick={() => setIsOpen(!isOpen)}
            >
              {isOpen ? (
                <X size={28} />
              ) : (
                <Menu size={28} className="me-0 sm:me-3" />
              )}
            </button>
          </div>
        </div>

        <div
          className="hidden md:flex md:items-center md:gap-5 md:ml-0 md:mr-4 md:static
         md:shadow-none md:border-none md:p-0 md:flex-row md:justify-start lg:gap-8 xl:gap-10 md:flex-1 max-w-[50%]
         w-full px-4 max-[810px]:min-[770px]:gap-2 max-[810px]:min-[770px]:mr-12 max-[810px]:min-[770px]:flex-grow-0 
         max-[810px]:min-[770px]:justify-start mr-12"
        >
          {/* General Navigation Links */}
          <GeneralNavigationLinks />
          {isAuthorized && !user?.isAdmin && <UserLinks />}
          {/* admin Links */}
          {isAuthorized && user?.isAdmin && <AdminLinks />}
          {isAuthorized && <InboxButton />}
        </div>

        {/* Mobile Menu - AnimatePresence for slide effect */}
        <AnimatePresence>
          {isOpen && isMobile && (
            <motion.div
              initial={{ y: -300, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              exit={{ y: -300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-4 absolute top-12 left-0 right-0 w-screen h-auto bg-TAF-200 p-6 shadow-lg border-t rounded-b-3xl border-gray-700 max-h-[calc(100vh-120px)] overflow-y-auto text-center items-center"
            >
              {/* Navigation Links */}
              <div className="flex flex-col w-full gap-4 mb-4">
                {/* General Navigation Links */}
                <GeneralNavigationLinks />
                {/*User links */}
                {isAuthorized && !user?.isAdmin && <UserLinks />}
                {/* admin Links */}
                {isAuthorized && user?.isAdmin && <AdminLinks />}
                {isAuthorized && <InboxButton />}
              </div>

              {/* Search Bar */}
              {isAuthorized && (
                <SearchBar isOpen={isOpen} setIsOpen={setIsOpen} />
              )}

              {/* Login/Logout Button */}
              <div className="w-full mt-1 pt-4 border-t border-gray-600">
                {isAuthorized ? (
                  <button
                    className="w-full bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors"
                    onClick={handleLogout}
                  >
                    تسجيل الخروج
                  </button>
                ) : (
                  <Link
                    to="/login"
                    className="w-full block text-center bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors"
                    onClick={() => setIsOpen(false)}
                  >
                    تسجيل الدخول
                  </Link>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Action buttons and search area */}
        <div className="flex ml-8 items-center justify-center relative md:flex-1 z-30 overflow-visible">
          {/* Search Bar that appears inline */}
          <AnimatePresence>
            {isSearching && (
              <motion.div
                initial={{ opacity: 0, width: 0 }}
                animate={{ opacity: 1, width: "100%" }}
                exit={{ opacity: 0, width: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
                className="hidden md:flex absolute left-0 top-1/2 -translate-y-1/2 w-full px-4 z-50 overflow-visible"
              >
                <SearchBarForDesktop handleSearching={handleSearching} />
              </motion.div>
            )}
          </AnimatePresence>

          <div className="flex items-center justify-end gap-6 w-full max-[810px]:min-[760px]:gap-4">
            {isAuthorized && (
              <div className="relative group z-20">
                <button
                  onClick={handleSearching}
                  className={`hidden md:flex md:items-center md:justify-center rounded-full w-10 h-10 md:ml-8 hover:bg-gray-200 transition-colors ${
                    isSearching ? "bg-gray-100 hover:bg-gray-200" : ""
                  }`}
                  aria-label="بحث"
                >
                  <Search size={20} />
                </button>
                <div className="absolute -bottom-8 left-0 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                  {isSearching ? "إلغاء البحث" : "بحث"}
                </div>
              </div>
            )}
            <div className="relative group z-20">
              <button
                onClick={
                  isAuthorized
                    ? handleLogout
                    : () => {
                        navigate("/login");
                        setIsOpen(false);
                      }
                }
                className="hidden md:flex md:items-center md:justify-center rounded-full w-9 h-9 hover:bg-gray-200 transition-colors"
                aria-label={isAuthorized ? "تسجيل الخروج" : "تسجيل الدخول"}
              >
                {isAuthorized ? <LogOut size={18} /> : <LogIn size={18} />}
              </button>
              <div className="absolute -bottom-8 left-1 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                {isAuthorized ? "تسجيل الخروج" : "تسجيل الدخول"}
              </div>
            </div>
          </div>
        </div>
      </nav>
    </div>
  );
}
