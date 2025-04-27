import { useState, useEffect } from "react";
import { Menu, X, Search, LogOut, LogIn } from "lucide-react";
import main_logo from "../../assets/mainLogo.svg";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { motion, AnimatePresence } from "framer-motion";
import NavigationLink from "./NavigationLink";
import SearchBar from "./SearchBarForMobile";
import SearchBarForDesktop from "./SearchBarForDesktop";
import CreateTermModal from "../CreateTermModal";
import { useLocation, useNavigate, Link } from "react-router-dom";
import InboxButton from "./InboxComponents/InboxButton";
import { useMediaQuery } from "../../helperHocks/useMediaQuery";

export default function MainHeader() {
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

  function handleSearching() {
    setIsSearching(!isSearching);
  }

  const handleLogout = async () => {
    try {
      const flag = await logout();
      if (flag) {
        toast.success("تم تسجيل الخروج بنجاح");
      }
      navigate("/");
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };

  return (
    <div className="w-full shadow-md z-50 bg-transparent mb-0 relative">
      {/* Backdrop overlay for mobile menu */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black bg-opacity-50 z-[90] md:hidden"
            onClick={() => setIsOpen(false)}
          />
        )}
      </AnimatePresence>
      <nav
        className="p-4 flex flex-col md:flex-row items-center justify-between bg-TAF-200 w-full border-b border-gray-700 
lg:max-h-[100px] xl:max-h-[100px] relative z-50
max-[810px]:min-[770px]:p-2"
      >
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <h1 className="text-white font-bold text-xl md:text-2xl">
            <Link
              to={
                isAuthorized
                  ? user.isAdmin
                    ? "/admin/admin-home"
                    : "/home"
                  : "/"
              }
            >
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 max-[810px]:min-[766px]:w-16 max-[810px]:min-[770px]:h-16 flex items-center justify-center">
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

          <button
            className="md:hidden text-TAF-100 focus:outline-none "
            onClick={() => setIsOpen(!isOpen)}
          >
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {/* Navigation Links */}
        {/* Desktop Navigation - Always visible on desktop */}
        <div className="hidden md:flex md:items-center md:gap-5 md:mx-5 md:static md:w-auto md:shadow-none md:border-none md:p-0 md:flex-row md:justify-center lg:gap-5 lg:mx-5 max-[810px]:min-[770px]:gap-2 max-[810px]:min-[770px]:mx-1 max-[810px]:min-[770px]:flex-grow max-[810px]:min-[770px]:justify-center">
          {/* admin Links */}
          <NavigationLink
            linkTo={"الصفحة الرئيسية"}
            route={
              isAuthorized
                ? user.isAdmin
                  ? "/admin/admin-home"
                  : "/home"
                : "/"
            }
          />

          <NavigationLink linkTo={"المواد"} route={"/courses"} />
          {isAuthorized && !user.isAdmin && (
            <>
              <NavigationLink
                linkTo={"إختباراتي القصيرة"}
                route={"/myquizzes"}
              />
              <NavigationLink
                linkTo={"جداولي السابقة"}
                route={"mypreviousschedules"}
              />
            </>
          )}

          {isAuthorized && user.isAdmin && (
            <>
              <NavigationLink linkTo={"التقارير"} route={"/admin/reports"} />
              <NavigationLink
                linkTo={"الحسابات المحظورة"}
                route={"/admin/bannedaccounts"}
              />
              <NavigationLink
                linkTo={"العناصر المخفية"}
                route={"/admin/hiddenItems"}
              />

              <CreateTermModal>
                <motion.button
                  onClick={() => {
                    navigate("/admin/createTerm");
                  }}
                  whileHover={{
                    scale: 1.04,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`relative w-full whitespace-nowrap md:w-auto text-center py-1 px-3 text-gray-700 hover:text-gray-500 transition-colors border-b-4 border-TAF-100 ${
                    route.pathname === "/admin/createTerm"
                      ? "border-opacity-100"
                      : "border-opacity-0"
                  }`}
                >
                  إنشاء ترم
                </motion.button>
              </CreateTermModal>
            </>
          )}
          {isAuthorized && <InboxButton />}
        </div>

        {/* Mobile Navigation - Only visible when menu is open */}
        <AnimatePresence>
          {isOpen && isMobile && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
              className="flex flex-col gap-4 mb-2 fixed top-[100px] right-0 w-3/4 h-auto bg-TAF-200 p-4 shadow-lg z-[100] border-l border-gray-700 max-h-[calc(100vh-120px)] overflow-y-auto"
            >
              {/* admin Links */}
              <NavigationLink
                linkTo={"الصفحة الرئيسية"}
                route={
                  isAuthorized
                    ? user.isAdmin
                      ? "/admin/admin-home"
                      : "/home"
                    : "/"
                }
                onClick={() => setIsOpen(false)}
              />

              <NavigationLink
                linkTo={"المواد"}
                route={"/courses"}
                onClick={() => setIsOpen(false)}
              />
              {isAuthorized && !user.isAdmin && (
                <>
                  <NavigationLink
                    linkTo={"إختباراتي القصيرة"}
                    route={"/myquizzes"}
                    onClick={() => setIsOpen(false)}
                  />
                  <NavigationLink
                    linkTo={"جداولي السابقة"}
                    route={"mypreviousschedules"}
                    onClick={() => setIsOpen(false)}
                  />
                </>
              )}

              {isAuthorized && user.isAdmin && (
                <>
                  <NavigationLink
                    linkTo={"التقارير"}
                    route={"/admin/reports"}
                    onClick={() => setIsOpen(false)}
                  />
                  <NavigationLink
                    linkTo={"الحسابات المحظورة"}
                    route={"/admin/bannedaccounts"}
                    onClick={() => setIsOpen(false)}
                  />
                  <NavigationLink
                    linkTo={"العناصر المخفية"}
                    route={"/admin/hiddenItems"}
                    onClick={() => setIsOpen(false)}
                  />

                  <CreateTermModal>
                    <motion.button
                      onClick={() => {
                        navigate("/admin/createTerm");
                        setIsOpen(false);
                      }}
                      whileHover={{
                        scale: 1.04,
                      }}
                      transition={{ duration: 0.2 }}
                      className={`relative w-full whitespace-nowrap md:w-auto text-center py-1 px-3 text-gray-700 hover:text-gray-500 transition-colors border-b-4 border-TAF-100 ${
                        route.pathname === "/admin/createTerm"
                          ? "border-opacity-100"
                          : "border-opacity-0"
                      }`}
                    >
                      إنشاء ترم
                    </motion.button>
                  </CreateTermModal>
                </>
              )}
              {isAuthorized && <InboxButton />}
            </motion.div>
          )}
        </AnimatePresence>
        {isAuthorized && <SearchBar isOpen={isOpen} setIsOpen={setIsOpen} />}
        {/* Sign Up Button mobile */}
        <AnimatePresence>
          {isOpen && isMobile && (
            <motion.div
              initial={{ x: 300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 300, opacity: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut", delay: 0.1 }}
              className="flex flex-col gap-4 fixed bottom-0 right-0 w-3/4 bg-TAF-200 p-4 shadow-lg z-[100] border-l border-t border-gray-700"
            >
              {isAuthorized ? (
                <button
                  className="md:hidden bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors"
                  onClick={handleLogout}
                >
                  تسجيل الخروج
                </button>
              ) : (
                <Link
                  to="/login"
                  className="md:hidden bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors"
                >
                  تسجيل الدخول
                </Link>
              )}
            </motion.div>
          )}
        </AnimatePresence>
        {/* Action Icons with Tooltips */}
        <div
          className="flex items-center justify-end gap-4 ml-auto
                    max-[810px]:min-[760px]:gap-2 max-[810px]:min-[770px]:ml-1"
        >
          {isAuthorized && (
            <div className="relative group">
              <button
                onClick={handleSearching}
                className={`hidden md:flex md:items-center md:justify-center rounded-full w-9 h-9 hover:bg-gray-200 transition-colors ${
                  isSearching ? "bg-gray-100 hover:bg-gray-200" : ""
                }`}
                aria-label="بحث"
              >
                {isSearching ? "إلغاء" : <Search size={18} />}
              </button>
              <div className="absolute -bottom-8 right-0 w-max bg-gray-800 text-white text-xs rounded py-1 px-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                بحث
              </div>
            </div>
          )}
          <div className="relative group">
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
      </nav>

      {isSearching && <SearchBarForDesktop handleSearching={handleSearching} />}
    </div>
  );
}
