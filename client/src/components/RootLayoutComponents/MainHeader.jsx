import { useState } from "react";
import { Menu, X, Search } from "lucide-react";
import main_logo from "../../assets/mainLogo.svg";
import { useAuth } from "../../context/authContext";
import { toast } from "react-toastify";
import { motion } from "framer-motion";
import ThreeDotMenu from "./ThreeDotMenu";
import NavigationLink from "./NavigationLink";
import SearchBar from "./SearchBarForMobile";
import SearchBarForDesktop from "./SearchBarForDesktop";
import CreateTermModal from "../CreateTermModal";
import { useLocation, useNavigate, Link } from "react-router-dom";
import InboxButton from "./InboxComponents/InboxButton";

export default function MainHeader() {
  const route = useLocation();

  const navigate = useNavigate();
  const { logout, isAuthorized, user } = useAuth();

  const [isOpen, setIsOpen] = useState(false);

  const [isSearching, setIsSearching] = useState(false);

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
    <div className="w-full shadow-md z-50 bg-transparent mb-0">
      <nav className="p-4 flex flex-col md:flex-row items-center justify-between bg-TAF-200 w-full border-b border-gray-700 lg:max-h-[100px] xl:max-h-[100px]">
        {/* Logo and Toggle Button */}
        <div className="flex items-center justify-between w-full md:w-auto">
          <h1 className="text-white font-bold text-xl md:text-2xl">
            <Link to={isAuthorized ? (user.isAdmin ? "/admin/admin-home" : "/home") : "/"}>
              <div className="w-16 h-16 md:w-20 md:h-20 lg:w-24 lg:h-24 xl:w-28 xl:h-28 flex items-center justify-center">
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

          <button className="md:hidden text-TAF-100 focus:outline-none " onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={28} /> : <Menu size={28} />}
          </button>
        </div>
        {/* Navigation Links */}
        <div
          className={`md:flex md:items-center md:gap-5 md:mx-5 ${
            isOpen ? "flex flex-col gap-4 mb-2" : "hidden"
          } md:flex-row md:justify-center`}>
          {/* admin Links */}
          <NavigationLink
            linkTo={"الصفحة الرئيسية"}
            route={isAuthorized ? (user.isAdmin ? "/admin/admin-home" : "/home") : "/"}
          />

          <NavigationLink linkTo={"المواد"} route={"/courses"} />
          {isAuthorized && !user.isAdmin && (
            <>
              <NavigationLink linkTo={"إختباراتي القصيرة"} route={"/myquizzes"} />
              <NavigationLink linkTo={"جداولي السابقة"} route={"mypreviousschedules"} />
            </>
          )}

          {isAuthorized && user.isAdmin && (
            <>
              <NavigationLink linkTo={"التقارير"} route={"/admin/reports"} />
              <NavigationLink linkTo={"الحسابات المحظورة"} route={"/admin/bannedaccounts"} />
              <NavigationLink linkTo={"التعليقات المخفية"} route={"/admin/hiddencomments"} />

              <CreateTermModal>
                <motion.button
                  onClick={() => navigate("/admin/createTerm")}
                  whileHover={{
                    scale: 1.04,
                  }}
                  transition={{ duration: 0.2 }}
                  className={`relative w-full whitespace-nowrap md:w-auto text-center py-1 px-3 text-gray-700 hover:text-gray-500 transition-colors border-b-4 border-TAF-100 ${
                    route.pathname === "/admin/createTerm" ? "border-opacity-100" : "border-opacity-0"
                  }`}>
                  إنشاء ترم
                </motion.button>
              </CreateTermModal>
            </>
          )}
          {isAuthorized && <InboxButton />}
        </div>
        {isAuthorized && <SearchBar isOpen={isOpen} />}
        {/* Sign Up Button mobile */}
        <div
          className={`w-full md:flex md:items-center md:gap-8 ${
            isOpen ? "flex flex-col gap-4" : "hidden"
          } md:flex-row md:justify-start`}>
          {isAuthorized ? (
            <button
              className="md:hidden bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors"
              onClick={handleLogout}>
              تسجيل الخروج
            </button>
          ) : (
            <Link
              to="/login"
              className="md:hidden bg-TAF-100 text-white px-4 py-2 rounded-md hover:opacity-75 active:opacity-50 transition-colors">
              تسجيل الدخول
            </Link>
          )}
        </div>
        {isAuthorized && (
          <button
            onClick={handleSearching}
            className={`hidden md:block md:ml-12 rounded-full p-2 hover:bg-gray-200 transition-colors ${
              isSearching ? "bg-gray-100 hover:bg-gray-200 p-2 ml-12" : ""
            }`}>
            {isSearching ? "إلغاء" : <Search size={18} />}
          </button>
        )}
        <ThreeDotMenu />
      </nav>

      {isSearching && <SearchBarForDesktop handleSearching={handleSearching} />}
    </div>
  );
}
