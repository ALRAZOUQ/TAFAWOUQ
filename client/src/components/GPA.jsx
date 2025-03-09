export default function GPA({ value, heading }) {
  // HASSAN:color i changable you can change if you don't like it 
  function getColor(gpa) {
    if (gpa >= 4.75)
      return "bg-gradient-to-r from-green-400 via-lime-500 to-green-500 bg-clip-text text-transparent";
    if (gpa >= 4.25 && gpa <= 4.75)
      return "bg-gradient-to-right from-green-400 via-lime-500 to-green-500"; // Excellent
    if (gpa >= 3.5) return "text-blue-500"; // Good
    if (gpa >= 2.5) return "text-yellow-500"; // Average
    return "text-red-500"; // Poor
  }
  return (
    <div className="flex flex-col items-center justify-center p-4 bg-white rounded-2xl shadow-md border border-gray-200 w-fit">
      <h2 className="text-lg font-semibold text-gray-600">{heading}</h2>
      <p className={`text-3xl font-bold ${getColor(value)}`}>
        {value.toFixed(2)}
      </p>
    </div>
  );
}
