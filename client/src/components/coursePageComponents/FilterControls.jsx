import { useState } from "react";
import { Search, ListFilter, ArrowDownAZ } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
const items = ["التعليقات", "الإختبارات القصيرة"];
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
  const [filterTagOpen, setFilterTagOpen] = useState(false); // Initialize filterTag state
  const [sortByOpen, setSortByOpen] = useState(false); // Initialize sortBy state
  const [items, setItems] = useState("comments");
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
        <button
          className="flex items-center gap-2 py-4 px-3 text-sm font-medium rounded-full transition-all border whitespace-nowrap hover:bg-gray-100 active:scale-95"
          onClick={() => {
            setFilterTagOpen((filterTagOpen) => !filterTagOpen);
            // Close sort dropdown when opening filter dropdown
            if (!filterTagOpen) setSortByOpen(false);
          }}
        >
          تصفية <ListFilter size={20} />
        </button>
        <AnimatePresence>
          {filterTagOpen && (
            <motion.div
              className="w-full flex flex-wrap gap-2 mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {tags.map((tag) => (
                <motion.button
                  key={tag}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() =>
                    setFilterTag(tag === "كل التصنيفات" ? "" : tag)
                  }
                  className={`py-3 px-4 text-sm font-medium rounded-full transition-all border 
                  ${
                    filterTag === tag || (tag === "كل التصنيفات" && !filterTag)
                      ? "bg-TAF-300 border-TAF-100 text-gray-700 shadow-md"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {tag}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      <div className="w-full md:w-1/3 min-h-[56px] flex flex-wrap gap-2 justify-center md:justify-start md:items-start">
        <button
          className="flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-full transition-all border whitespace-nowrap hover:bg-gray-100 active:scale-95"
          onClick={() => {
            setSortByOpen((sortByOpen) => !sortByOpen);
            // Close filter dropdown when opening sort dropdown
            if (!sortByOpen) setFilterTagOpen(false);
          }}
        >
          الترتيب <ArrowDownAZ size={20} />
        </button>
        <AnimatePresence>
          {sortByOpen && (
            <motion.div
              className="w-full flex flex-wrap gap-2 mt-2"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3, ease: "easeInOut" }}
            >
              {sortValues.map(({ label, value }) => (
                <motion.button
                  key={value}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  onClick={() => setSortBy(value === "recent" ? "" : value)}
                  className={`h-10 px-3 text-sm font-medium rounded-full transition-all border 
                  ${
                    sortBy === value || (value === "recent" && !sortBy)
                      ? "bg-TAF-300 border-TAF-100 text-gray-700 shadow-md"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                >
                  {label}
                </motion.button>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </div>
      {false && (
        <div className="w-full md:w-1/3 min-h-[56px] flex flex-wrap gap-2 justify-center md:justify-start md:items-start">
          <button
            className="flex items-center gap-2 py-3 px-4 text-sm font-medium rounded-full transition-all border whitespace-nowrap hover:bg-gray-100 active:scale-95"
            onClick={() => {
              setSortByOpen((sortByOpen) => !sortByOpen);
              // Close filter dropdown when opening sort dropdown
              if (!sortByOpen) setFilterTagOpen(false);
            }}
          >
            الترتيب <ArrowDownAZ size={20} />
          </button>
          <AnimatePresence>
            {sortByOpen && (
              <motion.div
                className="w-full flex flex-wrap gap-2 mt-2"
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: "auto" }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              >
                {sortValues.map(({ label, value }) => (
                  <motion.button
                    key={value}
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.9 }}
                    transition={{ duration: 0.2 }}
                    onClick={() => setSortBy(value === "recent" ? "" : value)}
                    className={`h-10 px-3 text-sm font-medium rounded-full transition-all border 
                  ${
                    sortBy === value || (value === "recent" && !sortBy)
                      ? "bg-TAF-300 border-TAF-100 text-gray-700 shadow-md"
                      : "bg-gray-100 border-gray-300 text-gray-700 hover:bg-gray-200"
                  }`}
                  >
                    {label}
                  </motion.button>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}
    </div>
  );
}
