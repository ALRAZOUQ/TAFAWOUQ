import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";

const BackButton = ({route}) => {
  const navigate = useNavigate();

  return (
    <button
      onClick={() => navigate(route)} // Navigates to the previous route
      className="absolute top-2 right-2 text-gray-700 hover:text-gray-900"
    >
      <ChevronRight size={16} strokeWidth={4} />
    </button>
  );
};

export default BackButton;
