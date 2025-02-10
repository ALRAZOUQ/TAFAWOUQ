import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import LogoutConformation from "./LogOutConformation";
import { toast } from "react-toastify";

export default function ThreeDotMenu() {
  const navigate = useNavigate();
  const { logout, isAuthorized } = useAuth();
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false); // New state to prevent unmounting
const handleLogout = async () => {
    
    try {
      const flag=await logout();
      console.log("Logout successful"); // Debugging log
      if(flag){toast.success('تم تسجيل الخروج بنجاح', { // Arabic success message
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
        rtl: true, // Key for RTL support
      });}
      
    } catch (error) {
      console.error("Logout failed:", error);
    }
  };
  return (
    <div className="relative md:inline-block text-left hidden">
      {/* Kebab Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <FiMoreVertical className="w-6 h-6" />
      </button>

      {/* Dropdown menu */}
      {isOpen && !isLoggingOut && (
        <div className="absolute left-4 top-4 mt-2 w-40 bg-white border rounded-lg shadow-lg">
          {isAuthorized ? (
            // <LogoutConformation
            //   closeMenu={() => {
            //     setIsLoggingOut(true); // Keep logout message visible
            //     setTimeout(() => setIsOpen(false), 500); // Close menu slightly later
            //   }}
            // />
            <button
              onClick={(handleLogout) }
              className="block w-full text-center px-4 py-2 hover:bg-gray-100"
            >
              تسجيل الخروج
            </button>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="block w-full text-center px-4 py-2 hover:bg-gray-100"
            >
              تسجيل الدخول
            </button>
          )}
        </div>
      )}
    </div>
  );
}
