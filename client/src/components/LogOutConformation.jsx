import { useState, useEffect } from "react";
import { useAuth } from "../context/authContext";
import { useNavigate } from "react-router-dom";

export default function LogoutConformation({ closeMenu }) {
  const [showDialog, setShowDialog] = useState(false);
  const { logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    const success = await logout();
    if (success) {
      setShowDialog(true);
      setTimeout(() => {
        closeMenu(); // Now close the menu AFTER showing the message
      }, 500); // Small delay before closing menu
    } else {
      console.error("Logout failed, dialog not shown.");
    }
  };

  useEffect(() => {
    if (showDialog) {
      const timer = setTimeout(() => {
        setShowDialog(false);
        navigate("/");
      }, 4000);

      return () => clearTimeout(timer);
    }
  }, [showDialog, navigate]);

  return (
    <>
      {/* Logout Button */}
      <button
        onClick={handleLogout}
        className="block w-full px-4 py-2 hover:bg-gray-100 text-center rounded-md transition"
      >
        تسجيل الخروج
      </button>

      {/* Logout Feedback Dialog */}
      {showDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-80 text-center animate-fadeIn">
            <h2 className="text-lg font-semibold text-gray-800">
              تم تسجيل خروجك بنجاح 🎉
            </h2>
            <p className="text-gray-600 mt-2">
              شكراً لاستخدام منصتنا! نراك قريباً.
            </p>
            <button
              onClick={() => {
                setShowDialog(false);
                navigate("/");
              }}
              className="mt-4 bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-md transition"
            >
              حسناً
            </button>
          </div>
        </div>
      )}
    </>
  );
}
