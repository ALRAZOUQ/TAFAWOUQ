import React, { useState, useEffect, memo } from 'react';

/**
 * OptimizedImage component for better image loading performance
 * Features:
 * - Lazy loading with IntersectionObserver
 * - Responsive sizing
 * - Blur-up loading effect
 * - Image error handling
 * 
 * @param {Object} props Component props
 * @param {string} props.src Image source URL
 * @param {string} props.alt Image alt text
 * @param {string} props.className Additional CSS classes
 * @param {number} props.width Image width
 * @param {number} props.height Image height
 * @param {string} props.placeholderColor Background color while loading (default: #f3f4f6)
 * @param {Function} props.onLoad Callback when image loads
 * @param {Function} props.onError Callback when image fails to load
 */
function OptimizedImage({
  src,
  alt,
  className = '',
  width,
  height,
  placeholderColor = '#f3f4f6',
  onLoad,
  onError,
  ...rest
}) {
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const [isInView, setIsInView] = useState(false);

  // Set up intersection observer for lazy loading
  useEffect(() => {
    const imgElement = document.getElementById(`img-${src}`);
    if (!imgElement) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setIsInView(true);
          observer.disconnect();
        }
      },
      { rootMargin: '200px 0px' } // Start loading when image is 200px from viewport
    );

    observer.observe(imgElement);

    return () => {
      if (imgElement) observer.unobserve(imgElement);
    };
  }, [src]);

  // Handle image load success
  const handleImageLoad = (e) => {
    setIsLoaded(true);
    if (onLoad) onLoad(e);
  };

  // Handle image load error
  const handleImageError = (e) => {
    setIsError(true);
    if (onError) onError(e);
  };

  // Styles for container and image
  const containerStyle = {
    position: 'relative',
    overflow: 'hidden',
    backgroundColor: placeholderColor,
    width: width ? `${width}px` : '100%',
    height: height ? `${height}px` : 'auto',
    display: 'inline-block',
  };

  const imageStyle = {
    transition: 'opacity 0.3s ease-in-out',
    opacity: isLoaded ? 1 : 0,
    width: '100%',
    height: '100%',
    objectFit: 'cover',
  };

  return (
    <div
      id={`img-${src}`}
      style={containerStyle}
      className={className}
      role="img"
      aria-label={alt}
    >
      {isError ? (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '100%',
            height: '100%',
            backgroundColor: '#f9f9f9',
            color: '#666',
            fontSize: '0.8rem',
          }}
        >
          {alt || 'Image failed to load'}
        </div>
      ) : (
        isInView && (
          <img
            src={src}
            alt={alt}
            onLoad={handleImageLoad}
            onError={handleImageError}
            style={imageStyle}
            loading="lazy"
            {...rest}
          />
        )
      )}
    </div>
  );
}

// Memoize the component to prevent unnecessary re-renders
export default memo(OptimizedImage);