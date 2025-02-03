import { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X } from "lucide-react"; // Icons for toggling
import main_logo from "../assets/mainLogo.svg";

export default function MainHeader() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#002F4B] p-4 flex flex-col md:flex-row items-center justify-between">
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
        className={`w-full md:flex md:items-center md:gap-8 ${
          isOpen ? "flex flex-col gap-4" : "hidden"
        } md:flex-row md:justify-center`}
      >
        {/* Search Bar */}
        <div className="w-full md:w-1/2 flex justify-center">
          <input
            type="text"
            placeholder="إبحث عن المواد"
            className="w-1/2 p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all font-cairo"
          />
        </div>

        
        <div>
          <Link
            to="/login"
            className="text-white bg-TAF-100 px-6 py-2 rounded-md hover:bg-blue-600 focus:ring-2 focus:ring-blue-300 focus:outline-none transition-all font-cairo"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </nav>
  );
}
