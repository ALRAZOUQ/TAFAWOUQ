import { Link } from "react-router-dom";
import main_logo from "../assets/mainLogo.svg";

export default function MainHeader() {
  return (
    <nav className="bg-TAF-100 p-4 flex items-center justify-between">
      <div className="order-3 md:order-1 max-w-[150px] min-w-[75px]">
        <img src={main_logo} className="w-max h-auto" alt="TAFAWOUQ LOGO" />
      </div>

      {/* Search Bar */}
      <div className="flex-grow mx-4 order-2">
        <input
          type="text"
          placeholder="Search..."
          className="w-full p-2 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-300"
        />
      </div>

      {/* Login/Signup Link */}
      <div className="order-1 md:order-3">
        <Link
          to="/login"
          className="text-white bg-blue-500 px-4 py-2 rounded-md hover:bg-blue-700"
        >
          Login / Signup
        </Link>
      </div>
    </nav>
  );
}
