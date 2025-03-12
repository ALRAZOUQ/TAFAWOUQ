export const getColor = (rating) => {
    if (rating <= 1) return "bg-green-400";
    if (rating <= 2) return "bg-green-800";
    if (rating <= 3) return "bg-orange-600";
    if (rating <= 4) return "bg-red-500";
    return "bg-red-600";
  };