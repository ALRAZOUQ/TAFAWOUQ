import React, { useState } from 'react';
/**
 * @typedef {Object} ConfirmationComponentProps
 * @property {string} [title="Confirm Action"] - The title displayed in the confirmation dialog header
 * @property {string} [message="Are you sure you want to proceed with this action?"] - The message displayed in the confirmation dialog body
 * @property {Function} [onConfirm] - Callback function executed when the user confirms the action
 * @property {Function} [onCancel] - Callback function executed when the user cancels the action
 * @property {boolean} [isRTL=false] - Whether to display the dialog in right-to-left mode for languages like Arabic
 */

/**
 *
 * @component
 * @param {ConfirmationComponentProps} props - The component props
 * @returns {React.ReactElement|null} The confirmation dialog or null if closed
 * 
 * @example
 * // Basic usage
 * <ConfirmationComponent 
 *   onConfirm={() => handleDelete(id)} 
 *   onCancel={() => setShowDialog(false)} 
 * />
 * 
 * @example
 * // RTL usage with Arabic
 * <ConfirmationComponent 
 *   title="تأكيد الإجراء" 
 *   message="هل أنت متأكد أنك تريد المتابعة في هذا الإجراء؟"
 *   onConfirm={handleConfirm} 
 *   onCancel={handleCancel}
 *   isRTL={true}
 * />
 */
const ConfirmationComponent = ({ 
  title = "Confirm Action", 
  message = "Are you sure you want to proceed with this action?", 
  onConfirm, 
  onCancel,
  isRTL = false,
  isOpen = false  
}) => {
 
  if (!isOpen) return null;
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div 
        className={`bg-white rounded-lg shadow-xl w-full max-w-md overflow-hidden transform transition-all`}
        dir={isRTL ? "rtl" : "ltr"}
      >
        <div className="bg-white px-4 py-3 border-b">
          <h3 className="text-lg font-medium text-gray-900">{title}</h3>
        </div>
        
        <div className="bg-white p-6">
          <p className="text-gray-700">{message}</p>
        </div>
        
        <div className="bg-white px-4 py-3 flex justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 text-sm ml-2"
          >
            {isRTL ? "إلغاء" : "Cancel"}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className="inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-red-600 text-base font-medium text-white hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 text-sm"
          >
            {isRTL ? "تأكيد" : "Confirm"}
          </button>
        </div>
      </div>
    </div>
  );
};
export default ConfirmationComponent;  