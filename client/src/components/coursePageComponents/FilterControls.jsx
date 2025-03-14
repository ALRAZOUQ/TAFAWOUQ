import React from "react";
import { Search } from "lucide-react";

const tags = [
  "كل التصنيفات",
  "مراجعة",
  "عام",
  "ملاحظات",
  "عملي",
  "محاضرة",
  "سؤال",
];

const sortValues = [
  { label: "الأحدث", value: "recent" },
  { label: "الأكثر إعجابًا", value: "mostLikes" },
  { label: "الأكثر ردودًا", value: "mostReplies" },
];

export default function FilterControls({
  searchQuery,
  setSearchQuery,
  filterTag,
  setFilterTag,
  sortBy,
  setSortBy,
}) {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 my-6">
      {/* Search Input */}
      <div className="relative w-full md:w-1/3 min-h-[56px] flex items-center">
        <Search className="absolute right-3 text-gray-400 w-5 h-5" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="البحث في التعليقات"
          className="w-full h-10 p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Filter Tags */}
      <div className="w-full md:w-1/3 min-h-[56px] flex flex-wrap gap-2 justify-center md:justify-start">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => setFilterTag(tag === "كل التصنيفات" ? "" : tag)}
            className={`h-10 px-3 text-sm font-medium rounded-full transition-all border 
            ${
              filterTag === tag || (tag === "كل التصنيفات" && !filterTag)
                ? "bg-TAF-300 border-TAF-100 text-gray-700 shadow-md"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="w-full md:w-1/3 min-h-[56px] flex flex-wrap gap-2 justify-center md:justify-start md:items-start">
        {sortValues.map(({ label, value }) => (
          <button
            key={value}
            onClick={() => setSortBy(value === "recent" ? "" : value)}
            className={`h-10 px-3 text-sm font-medium rounded-full transition-all border 
            ${
              sortBy === value || (value === "recent" && !sortBy)
                ? "bg-TAF-300 border-TAF-100 text-gray-700 shadow-md"
                : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
            }`}
          >
            {label}
          </button>
        ))}
      </div>
    </div>
  );
}
