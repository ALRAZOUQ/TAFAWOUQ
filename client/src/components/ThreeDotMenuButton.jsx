export default function ThreeDotMenuButton({
  textColor,
  clickHandler,
  hoverColor,
  children,
}) {
  return (
    <button
      onClick={clickHandler}
      className={`flex items-center gap-2 whitespace-nowrap px-4 py-2 w-full ${textColor} ${hoverColor} p-2 hover:bg-gray-50 transition-colors`}
    >
      {children}
    </button>
  );
}
