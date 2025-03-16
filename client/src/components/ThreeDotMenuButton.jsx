export default function ThreeDotMenuButton({
  clickHandler,
  purpose,
  children,
}) {
  function getColor(purpose) {
    if (purpose === "warning") {
      return "text-orange-400 hover:text-orange-500";
    } else if (purpose === "dangerous") {
      return "text-red-500 hover:text-red-600";
    } else {
      return "text-gray-600 hover:text-gray-700";
    }
  }
  return (
    <button
      onClick={clickHandler}
      className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 w-full ${getColor(
        purpose
      )} p-2 hover:bg-gray-50 transition-colors`}
    >
      {children}
    </button>
  );
}
