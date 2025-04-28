/**
 * Performance optimization utilities for the TAFAWOUQ application
 * This file contains helper functions to improve application performance
 */

import { useCallback, useEffect, useMemo, useRef, useState } from 'react';

/**
 * Custom hook for debouncing function calls
 * @param {Function} fn - The function to debounce
 * @param {number} delay - Delay in milliseconds
 * @returns {Function} - Debounced function
 */
export function useDebounce(fn, delay = 300) {
  const timeoutRef = useRef(null);
  
  const debouncedFn = useCallback((...args) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    
    timeoutRef.current = setTimeout(() => {
      fn(...args);
    }, delay);
  }, [fn, delay]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return debouncedFn;
}

/**
 * Custom hook for throttling function calls
 * @param {Function} fn - The function to throttle
 * @param {number} limit - Limit in milliseconds
 * @returns {Function} - Throttled function
 */
export function useThrottle(fn, limit = 300) {
  const lastRunRef = useRef(0);
  const timeoutRef = useRef(null);
  
  const throttledFn = useCallback((...args) => {
    const now = Date.now();
    const elapsed = now - lastRunRef.current;
    
    if (elapsed >= limit) {
      lastRunRef.current = now;
      fn(...args);
    } else {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      
      timeoutRef.current = setTimeout(() => {
        lastRunRef.current = Date.now();
        fn(...args);
      }, limit - elapsed);
    }
  }, [fn, limit]);
  
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
    };
  }, []);
  
  return throttledFn;
}

/**
 * Custom hook to detect if component is mounted
 * Helps prevent memory leaks from state updates on unmounted components
 * @returns {React.MutableRefObject<boolean>} - Ref to check if component is mounted
 */
export function useIsMounted() {
  const isMountedRef = useRef(false);
  
  useEffect(() => {
    isMountedRef.current = true;
    return () => {
      isMountedRef.current = false;
    };
  }, []);
  
  return isMountedRef;
}

/**
 * Custom hook for memoizing expensive filter operations
 * @param {Array} items - Array of items to filter
 * @param {string} searchQuery - Search query string
 * @param {Function} filterFn - Custom filter function
 * @returns {Array} - Filtered array
 */
export function useMemoizedFilter(items, searchQuery, filterFn) {
  return useMemo(() => {
    if (!items || items.length === 0) return [];
    if (!searchQuery && !filterFn) return items;
    
    return filterFn ? items.filter(filterFn) : items.filter(item => 
      Object.values(item).some(val => 
        typeof val === 'string' && val.toLowerCase().includes(searchQuery.toLowerCase())
      )
    );
  }, [items, searchQuery, filterFn]);
}

/**
 * Creates a pagination slice from an array
 * @param {Array} items - Array to paginate
 * @param {number} currentPage - Current page number (1-based)
 * @param {number} itemsPerPage - Number of items per page
 * @returns {Array} - Paginated array slice
 */
export function usePaginatedItems(items, currentPage, itemsPerPage) {
  return useMemo(() => {
    if (!items || items.length === 0) return [];
    
    const startIndex = (currentPage - 1) * itemsPerPage;
    return items.slice(startIndex, startIndex + itemsPerPage);
  }, [items, currentPage, itemsPerPage]);
}

/**
 * Optimizes data fetching by preventing unnecessary API calls
 * @param {Function} fetchFn - Async function to fetch data
 * @param {Array} dependencies - Array of dependencies that trigger refetch
 * @param {Object} options - Additional options
 * @returns {Object} - { data, loading, error, refetch }
 */
export function useOptimizedFetch(fetchFn, dependencies = [], options = {}) {
  const { initialData = null, cacheKey = null, cacheTime = 5 * 60 * 1000 } = options;
  const cache = useRef({});
  const isMountedRef = useIsMounted();
  const [state, setState] = useState({
    data: initialData,
    loading: true,
    error: null
  });

  const fetchData = useCallback(async () => {
    // Check cache first if cacheKey is provided
    if (cacheKey && cache.current[cacheKey]) {
      const { data, timestamp } = cache.current[cacheKey];
      const isExpired = Date.now() - timestamp > cacheTime;
      
      if (!isExpired) {
        setState({ data, loading: false, error: null });
        return;
      }
    }
    
    setState(prev => ({ ...prev, loading: true }));
    
    try {
      const result = await fetchFn();
      
      if (isMountedRef.current) {
        setState({ data: result, loading: false, error: null });
        
        // Cache the result if cacheKey is provided
        if (cacheKey) {
          cache.current[cacheKey] = {
            data: result,
            timestamp: Date.now()
          };
        }
      }
    } catch (error) {
      if (isMountedRef.current) {
        setState({ data: initialData, loading: false, error });
      }
    }
  }, [fetchFn, cacheKey, cacheTime, initialData]);

  const refetch = useCallback(() => {
    fetchData();
  }, [fetchData]);

  useEffect(() => {
    fetchData();
  }, [...dependencies, fetchData]);

  return { ...state, refetch };
}