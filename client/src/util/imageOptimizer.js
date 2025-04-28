/**
 * Image optimization utilities for the TAFAWOUQ application
 * This file contains helper functions to improve image loading performance
 */

/**
 * Generates a responsive image srcset for different viewport sizes
 * @param {string} baseUrl - The base URL of the image
 * @param {Array<number>} sizes - Array of image widths to generate
 * @param {string} format - Image format (jpg, png, webp)
 * @returns {string} - The srcset attribute string
 */
export function generateSrcSet(baseUrl, sizes = [320, 640, 960, 1280], format = 'jpg') {
  if (!baseUrl) return '';
  
  // Handle URLs that already have query parameters
  const separator = baseUrl.includes('?') ? '&' : '?';
  
  return sizes
    .map(size => `${baseUrl}${separator}w=${size} ${size}w`)
    .join(', ');
}

/**
 * Generates a low-quality image placeholder URL
 * @param {string} imageUrl - Original image URL
 * @param {number} quality - Quality percentage (1-100)
 * @param {number} width - Width of the placeholder
 * @returns {string} - URL for the low-quality placeholder
 */
export function getLowQualityImageUrl(imageUrl, quality = 10, width = 50) {
  if (!imageUrl) return '';
  
  // Handle URLs that already have query parameters
  const separator = imageUrl.includes('?') ? '&' : '?';
  
  return `${imageUrl}${separator}q=${quality}&w=${width}`;
}

/**
 * Preloads critical images to improve perceived performance
 * @param {Array<string>} imageUrls - Array of image URLs to preload
 */
export function preloadCriticalImages(imageUrls = []) {
  if (!imageUrls.length) return;
  
  imageUrls.forEach(url => {
    const link = document.createElement('link');
    link.rel = 'preload';
    link.as = 'image';
    link.href = url;
    document.head.appendChild(link);
  });
}

/**
 * Checks if an image exists and can be loaded
 * @param {string} url - Image URL to check
 * @returns {Promise<boolean>} - Promise resolving to true if image exists
 */
export function checkImageExists(url) {
  return new Promise((resolve) => {
    const img = new Image();
    img.onload = () => resolve(true);
    img.onerror = () => resolve(false);
    img.src = url;
  });
}

/**
 * Converts a file to a base64 data URL
 * @param {File} file - The file to convert
 * @returns {Promise<string>} - Promise resolving to the base64 data URL
 */
export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

/**
 * Resizes an image client-side before upload to reduce bandwidth
 * @param {File} file - The image file to resize
 * @param {number} maxWidth - Maximum width of the resized image
 * @param {number} maxHeight - Maximum height of the resized image
 * @param {number} quality - JPEG quality (0-1)
 * @returns {Promise<Blob>} - Promise resolving to the resized image blob
 */
export async function resizeImageBeforeUpload(file, maxWidth = 1200, maxHeight = 1200, quality = 0.8) {
  return new Promise((resolve, reject) => {
    if (!file.type.match(/image.*/)) {
      reject(new Error('Not an image file'));
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (readerEvent) => {
      const image = new Image();
      image.onload = () => {
        // Calculate new dimensions while maintaining aspect ratio
        let width = image.width;
        let height = image.height;
        
        if (width > height) {
          if (width > maxWidth) {
            height = Math.round(height * maxWidth / width);
            width = maxWidth;
          }
        } else {
          if (height > maxHeight) {
            width = Math.round(width * maxHeight / height);
            height = maxHeight;
          }
        }
        
        const canvas = document.createElement('canvas');
        canvas.width = width;
        canvas.height = height;
        
        const ctx = canvas.getContext('2d');
        ctx.drawImage(image, 0, 0, width, height);
        
        // Convert to blob
        canvas.toBlob(
          (blob) => resolve(blob),
          file.type,
          quality
        );
      };
      image.onerror = reject;
      image.src = readerEvent.target.result;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}