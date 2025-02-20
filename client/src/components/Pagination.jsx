import React from "react";

// Pagination component that handles page navigation
// Props:
// - currentPage: Current active page number
// - totalPages: Total number of pages available
// - setCurrentPage: Function to update the current page
export default function Pagination({
  currentPage,
  totalPages,
  setCurrentPage,
}) {
  // Don't render anything if there are no pages
  if (totalPages <= 0) return null;
  // Helper function to render individual page number buttons
  const renderPageButton = (pageNum) => (
    <button
      key={pageNum}
      onClick={() => setCurrentPage(pageNum)}
      className={`px-3 py-1 rounded-md transition-colors ${
        currentPage === pageNum
          ? "bg-blue-600 text-white" // Style for active page
          : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Style for inactive pages
      }`}>
      {pageNum}
    </button>
  );

  // Function to generate and render all pagination elements
  const renderPageNumbers = () => {
    const pageNumbers = [];

    // Add "Previous" button with disabled state when on first page
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 rounded-md transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
        السابق
      </button>
    );

    // Calculate the range of page numbers to display
    // Shows up to 2 pages before and after the current page
    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, currentPage + 2);

    // Generate and add page number buttons
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(renderPageButton(i));
    }

    // Add "Next" button with disabled state when on last page
    pageNumbers.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-md transition-colors bg-gray-100 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
        التالي
      </button>
    );

    return pageNumbers;
  };

  // Render the pagination container with all elements
  return (
    <div className="flex flex-row justify-center items-center gap-2 mt-6">
      {renderPageNumbers()}
    </div>
  );
}
