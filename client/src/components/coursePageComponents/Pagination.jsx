import React, { useCallback, useMemo, useState, useEffect } from "react";

/**
 * Pagination component that handles page navigation
 * @param  currentPage Current active page number
 * @param  totalPages Total number of pages available
 * @param  setCurrentPage Function to update the current page
 */
function Pagination({ currentPage, totalPages, setCurrentPage }) {
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 451);
  
  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth < 451);
    };
    
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Helper function to render individual page number buttons - memoized
  const renderPageButton = useCallback(
    (pageNum) => (
      <button
        key={pageNum}
        onClick={() => setCurrentPage(pageNum)}
        className={`px-3 py-1 text-xs md:text-base  rounded-md transition-colors ${
          currentPage === pageNum
            ? "bg-blue-500 text-white" // Style for active page
            : "bg-gray-100 text-gray-600 hover:bg-gray-200" // Style for inactive pages
        }`}>
        {pageNum}
      </button>
    ),
    [currentPage, setCurrentPage]
  );

  // Function to generate and render all pagination elements - memoized
  const paginationElements = useMemo(() => {
    if (totalPages <= 0) return [];
    const pageNumbers = [];

    // Add "Previous" button with disabled state when on first page
    pageNumbers.push(
      <button
        key="prev"
        onClick={() => setCurrentPage(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
        className="px-3 py-1 text-xs md:text-base  rounded-s-xl transition-colors bg-gray-200 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
        السابق
      </button>
    );

    // Calculate the range of page numbers to display
    // Shows fewer pages on mobile view
    let startPage = Math.max(1, currentPage - (isMobileView ? 1 : 2));
    let endPage = Math.min(totalPages, currentPage + (isMobileView ? 1 : 2));

    // Ensure we always show appropriate number of page numbers if possible
    const pagesVisible = isMobileView ? 3 : 5;
    if (endPage - startPage < (pagesVisible - 1) && totalPages > (pagesVisible - 1)) {
      if (startPage === 1) {
        endPage = Math.min(pagesVisible, totalPages);
      } else if (endPage === totalPages) {
        startPage = Math.max(1, totalPages - (pagesVisible - 1));
      }
    }

    // Add first page and ellipsis if needed
    if (startPage > 1) {
      pageNumbers.push(renderPageButton(1));
      if (startPage > 2) {
        pageNumbers.push(
          <span key="ellipsis1" className="px-2">
            ...
          </span>
        );
      }
    }

    // Add page numbers
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(renderPageButton(i));
    }

    // Add last page and ellipsis if needed
    if (endPage < totalPages) {
      if (endPage < totalPages - 1) {
        pageNumbers.push(
          <span key="ellipsis2" className="px-2">
            ...
          </span>
        );
      }
      pageNumbers.push(renderPageButton(totalPages));
    }

    // Add "Next" button with disabled state when on last page
    pageNumbers.push(
      <button
        key="next"
        onClick={() => setCurrentPage(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
        className="px-3 py-1 rounded-e-xl text-xs md:text-base transition-colors bg-gray-200 text-gray-600 hover:bg-gray-200 disabled:opacity-50">
        التالي
      </button>
    );

    return pageNumbers;
  }, [currentPage, totalPages, setCurrentPage, renderPageButton, isMobileView]);
  // Return empty div if no pages to show
  if (totalPages <= 0) {
    return <div className="mt-4"></div>;
  }

  return (
    <div className="flex justify-center items-center space-x-1 md:space-x-2  rtl:space-x-reverse mt-4">
      {paginationElements}
    </div>
  );
}

// Export memoized component to prevent unnecessary re-renders
export default React.memo(Pagination);
