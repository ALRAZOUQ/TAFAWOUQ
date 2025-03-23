import { MoreVertical } from "lucide-react";
export default function KababMenu({
  menuOpen,
  setMenuOpen,
  children,
  position,
  reverse=false
}) {
  return (
    <div className={`${position}`}>
      <button
        onClick={() => {
          setMenuOpen((menuOpen) => !menuOpen);
        }}
        className="absolute top-2 right-2 hover:shadow-lg rounded-full hover:bg-gray-200 text-gray-500 hover:text-gray-700"
      >
        <MoreVertical size={20} className="text-gray-500 hover:text-gray-700" />
      </button>
      {menuOpen && (
        <div className={`absolute ${reverse?"left-0":"right-0"} top-3 mt-2 w-fit z-10 bg-white shadow-md rounded-md py-2 border border-gray-200`}>
          {children}
        </div>
      )}
    </div>
  );
}
