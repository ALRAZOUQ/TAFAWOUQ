import { Star } from "lucide-react";
export default function Course({ code, name, overview, avgRating }) {
  return (
    <div className="bg-white shadow-lg rounded-2xl p-4 border border-gray-200 w-full max-w-sm sm:max-w-md md:max-w-lg lg:max-w-xl xl:max-w-2xl 2xl:max-w-4xl mx-auto">
      {/* Course Code */}
      <h3 className="text-base sm:text-lg font-bold text-gray-700 text-center sm:text-left">
        {code}
      </h3>
      {/* Course Name */}
      <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mt-1 text-center sm:text-left">
        {name}
      </h2>
      {/* actually we don't need overview in the courses page we will just show name and code and rate and maybe avg grade Hassan is writing it  */}
      <div className="flex flex-col sm:flex-row justify-between items-center sm:items-end mt-2">
        {/*<p className="text-gray-600 text-xs sm:text-sm w-full sm:w-3/4 text-center sm:text-left">
          {overview}
        </p>*/}
        <div className="flex items-center text-yellow-500 mt-2 sm:mt-0">
          <Star size={16} fill="currentColor" />
          <span className="text-xs sm:text-sm font-medium text-gray-700 ml-1">
            {avgRating}
          </span>
        </div>
      </div>
    </div>
  );
}
