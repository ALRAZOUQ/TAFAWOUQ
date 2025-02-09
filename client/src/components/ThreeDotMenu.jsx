import { useState } from "react";
import { FiMoreVertical } from "react-icons/fi";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";
import LogoutConformation from "./LogOutConformation";

export default function ThreeDotMenu() {
  const navigate = useNavigate();
  const { logout, isAuthorized } = useAuth();
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative md:inline-block text-left hidden">
      {/* Three-dot button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="p-2 rounded-full hover:bg-gray-200"
      >
        <FiMoreVertical className="w-6 h-6" />
      </button>

      {/* Dropdown menu */}
      {isOpen && (
        <div className="absolute left-4 top-4 mt-2 w-40 bg-white border rounded-lg shadow-lg">
          {isAuthorized ? (
            <LogoutConformation />
          ) : (
            <button
              onClick={() => navigate("/login")} // Replace with actual sign-out logic
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
