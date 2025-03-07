import React from 'react'
import { Search } from "lucide-react";
export default function FilterControls({ searchQuery, setSearchQuery, filterTag, setFilterTag, sortBy, setSortBy }) {
  return (
  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 my-6">
  <div className="relative">
    <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
    <input
      type="text"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
      placeholder="البحث في التعليقات"
      className="w-full p-2 pr-10 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent border-y border-y-gray-300 border-x-4 border-x-TAF-300 transition-all"
    />
  </div>

  <select
    value={filterTag}
    onChange={(e) => setFilterTag(e.target.value)}
    className="p-2 rounded-lg border-y border-y-gray-300 border-x-4 border-x-TAF-300 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
  >
    <option value="">كل التصنيفات</option>
    <option value="مراجعة">مراجعة</option>
    <option value="عام">عام</option>
    <option value="ملاحظات">ملاحظات</option>
    <option value="عملي">عملي</option>
    <option value="محاضرة">محاضرة</option>
  </select>

  <select
    value={sortBy}
    onChange={(e) => setSortBy(e.target.value)}
    className="p-2 rounded-lg border border-y border-y-gray-300 border-x-4 border-x-TAF-300 border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
  >
    <option value="recent">الأحدث</option>
    <option value="mostLikes">الأكثر إعجاباً</option>
    <option value="mostReplies">الأكثر تفاعلاً</option>
  </select>
</div>
  )
}
