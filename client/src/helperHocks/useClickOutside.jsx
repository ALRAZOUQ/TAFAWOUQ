import { useEffect, useRef } from 'react';

/**
 * Custom hook to detect clicks outside of a specified element
 * @param {Function} handler - Function to call when a click outside is detected
 * @returns {Object} - Ref to attach to the element you want to detect clicks outside of
 */
const useClickOutside = (handler) => {
  const ref = useRef(null);

  useEffect(() => {
    const handleClickOutside = (event) => {
      // If the ref is attached to an element and the click is outside that element
      if (ref.current && !ref.current.contains(event.target)) {
        handler();
      }
    };

    // Add event listener to document
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('touchstart', handleClickOutside);

    // Clean up the event listeners when component unmounts
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('touchstart', handleClickOutside);
    };
  }, [handler]); // Re-run effect if handler changes

  return ref;
};

export default useClickOutside;