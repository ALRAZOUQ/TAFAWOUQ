//import { useGenericForm } from "../helperHocks/useGenericForm"; // Import the hook
 /*const { formData, isLoading, handleInputChange, handleFormSubmit } = useGenericForm(
    fields,
    itemId,
    onSubmit,
    onSuccess
  );*/
  import React, { useRef, useEffect, useState } from "react";
  import { motion, AnimatePresence } from "framer-motion";
  
  /**
   * @typedef {Object} Field
   * @property {string} name - The name attribute for the form field
   * @property {string} label - The display label for the form field
   * @property {string} [type="text"] - The input type ('text', 'email', 'password', 'textarea', etc.)
   * @property {boolean} [required=false] - Whether the field is required
   * @property {string} [defaultValue=""] - Default value for the field
   * @property {string} [placeholder] - Placeholder text for the field
   * @property {Function} [validator] - Custom validation function that returns error message or null
   */
  
  /**
   * GenericForm - A reusable form component with validation and animation
   * 
   * @param {Object} props - Component props
   * @param {string} [props.title="النموذج"] - Form title
   * @param {Array<Field>} [props.fields=[{name:"content",label:"المحتوى",type:"textarea"}]] - Form fields configuration
   * @param {string} [props.submitButtonText="إرسال"] - Text for the submit button
   * @param {string} [props.cancelButtonText="إلغاء"] - Text for the cancel button
   * @param {string} [props.loadingText="جارٍ الإرسال..."] - Text shown while submitting
   * @param {Function} [props.onSubmit] - Function called on form submission (receives formData object)
   * @param {Function} [props.onCancel] - Function called when form is canceled
   * @param {Function} [props.onSuccess] - Function called after successful submission
   * @param {string|number} [props.itemId=null] - ID of item being edited (if applicable)
   * @param {React.ReactNode} [props.children] - Trigger element that opens the form
   * @returns {JSX.Element} Rendered form component
   */
  export default function GenericForm({
    title = "النموذج",
    fields = [{ name: "content", label: "المحتوى", type: "textarea" }],
    submitButtonText = "إرسال",
    cancelButtonText = "إلغاء",
    loadingText = "جارٍ الإرسال...",
    onSubmit,
    onCancel,
    onSuccess,
    itemId = null,
    children,
  }) {
    const [isOpen, setIsOpen] = useState(false);
    const dialogRef = useRef(null);
    const dialogContentRef = useRef(null);
  
    const [formData, setFormData] = useState({});
    const [isLoading, setIsLoading] = useState(false);
    const [fieldErrors, setFieldErrors] = useState({});
    const [formTouched, setFormTouched] = useState(false);
  
    // Initialize form data when opened
    useEffect(() => {
      if (isOpen) {
        const initialData = {};
        fields.forEach((field) => {
          initialData[field.name] = field.defaultValue || "";
        });
        if (itemId !== null && itemId !== undefined) {
          initialData.id = itemId;
        }
        setFormData(initialData);
        setFieldErrors({});
        setFormTouched(false);
      }
    }, [fields, itemId, isOpen]);
  
    /**
     * Handles changes to form inputs
     * @param {React.ChangeEvent} e - Change event
     * @param {string} fieldName - Name of the field being changed
     * @param {Object} field - Field configuration object
     */
    const handleInputChange = (e, fieldName, field) => {
      const value = e.target.value;
      
      setFormData(prevData => ({
        ...prevData,
        [fieldName]: value,
      }));
      
      // Run field-specific validation if available
      if (field?.validator) {
        const errorMessage = field.validator(value);
        setFieldErrors(prev => ({ 
          ...prev, 
          [fieldName]: errorMessage 
        }));
      } else {
        // Clear error on change for fields without custom validation
        setFieldErrors(prev => ({ 
          ...prev, 
          [fieldName]: undefined 
        }));
      }
      
      setFormTouched(true);
    };
  
    /**
     * Validates all form fields
     * @returns {boolean} True if form is valid, false otherwise
     */
    const validateForm = () => {
      const errors = {};
      let hasErrors = false;
  
      fields.forEach((field) => {
        // Required field validation
        if (field.required && (!formData[field.name] || formData[field.name].trim() === "")) {
          errors[field.name] = `الحقل ${field.label} مطلوب`;
          hasErrors = true;
        } 
        // Custom validation if provided
        else if (field.validator && formData[field.name]) {
          const errorMessage = field.validator(formData[field.name]);
          if (errorMessage) {
            errors[field.name] = errorMessage;
            hasErrors = true;
          }
        }
      });
  
      setFieldErrors(errors);
      return !hasErrors;
    };
  
    /**
     * Handles form submission
     */
    const handleFormSubmit = async () => {
      if (isLoading) return;
      
      setFormTouched(true);
      
      if (!validateForm()) {
        return; // Prevent submission if there are errors
      }
  
      setIsLoading(true);
      try {
        if (onSubmit) {
          await onSubmit(formData);
        }
        if (onSuccess) {
          onSuccess(formData);
        }
        setIsOpen(false);
      } catch (error) {
        console.error("Error submitting form:", error);
        // Option to handle submission errors (display error message, etc.)
      } finally {
        setIsLoading(false);
      }
    };
  
    // Handle click outside to close dialog
    useEffect(() => {
      const handleClickOutside = (e) => {
        if (
          dialogRef.current &&
          dialogContentRef.current &&
          !dialogContentRef.current.contains(e.target)
        ) {
          if (formTouched) {
            // Option: Add confirmation before closing if form has changes
            if (window.confirm("هل أنت متأكد من إغلاق النموذج؟ ستفقد التغييرات.")) {
              handleCancel();
            }
          } else {
            handleCancel();
          }
        }
      };
  
      if (isOpen) {
        document.addEventListener("mousedown", handleClickOutside);
      }
  
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
      };
    }, [isOpen, formTouched]);
  
    /**
     * Handle ESC key to close dialog
     */
    useEffect(() => {
      const handleEscKey = (e) => {
        if (e.key === "Escape" && isOpen) {
          handleCancel();
        }
      };
  
      if (isOpen) {
        window.addEventListener("keydown", handleEscKey);
      }
  
      return () => {
        window.removeEventListener("keydown", handleEscKey);
      };
    }, [isOpen]);
  
    /**
     * Handles form cancellation
     */
    const handleCancel = () => {
      setIsOpen(false);
      setFormData({});
      setFieldErrors({});
      setFormTouched(false);
      if (onCancel) {
        onCancel();
      }
    };
  
    /**
     * Renders the appropriate input field based on type
     * @param {Field} field - Field configuration
     * @returns {JSX.Element} Rendered input element
     */
    const renderField = (field) => {
      const commonProps = {
        id: field.name,
        name: field.name,
        value: formData[field.name] || "",
        onChange: (e) => handleInputChange(e, field.name, field),
        required: field.required,
        placeholder: field.placeholder || `أدخل ${field.label} هنا...`,
        className: `mt-1 p-2 border rounded-lg ${
          fieldErrors[field.name] ? "border-red-500" : ""
        }`,
        "aria-invalid": fieldErrors[field.name] ? "true" : "false",
        "aria-describedby": fieldErrors[field.name] ? `${field.name}-error` : undefined,
      };
  
      if (field.type === "textarea") {
        return <textarea {...commonProps} className={`${commonProps.className} h-32`} />;
      }
  
      return <input type={field.type || "text"} {...commonProps} />;
    };
  
    return (
      <>
        {children && React.cloneElement(children, { onClick: () => setIsOpen(true) })}
  
        <AnimatePresence>
          {isOpen && (
            <div 
              className="fixed inset-0 flex justify-center items-center bg-black bg-opacity-50 z-50"
              role="dialog"
              aria-modal="true"
              aria-labelledby="form-title"
            >
              <dialog
                ref={dialogRef}
                className="w-full max-w-md sm:max-w-lg md:max-w-xl bg-white shadow-2xl rounded-2xl p-0"
                open
              >
                <motion.div
                  ref={dialogContentRef}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.2 }}
                  className="w-full p-4"
                >
                  <div className="flex justify-between items-center pb-3 border-b">
                    <h2 id="form-title" className="text-2xl font-semibold">{title}</h2>
                    <button 
                      onClick={handleCancel} 
                      className="text-gray-500 text-xl hover:text-gray-700 transition-colors"
                      aria-label="إغلاق"
                    >
                      &times;
                    </button>
                  </div>
  
                  <form 
                    className="space-y-4 mt-4"
                    onSubmit={(e) => {
                      e.preventDefault();
                      handleFormSubmit();
                    }}
                  >
                    {itemId !== null && itemId !== undefined && (
                      <input type="hidden" name="id" value={itemId} />
                    )}
  
                    {fields.map((field) => (
                      <div key={field.name} className="flex flex-col">
                        <label htmlFor={field.name} className="text-sm font-medium">
                          {field.label}
                          {field.required ? " *" : ""}
                        </label>
                        
                        {renderField(field)}
                        
                        {fieldErrors[field.name] && (
                          <p 
                            id={`${field.name}-error`}
                            className="text-red-500 text-sm mt-1"
                          >
                            {fieldErrors[field.name]}
                          </p>
                        )}
                      </div>
                    ))}
  
                    <div className="flex justify-end pt-3 gap-4 border-t mt-4">
                      <button
                        type="button"
                        className="px-4 py-2 bg-gray-300 hover:bg-gray-400 rounded-lg transition-colors"
                        onClick={handleCancel}
                      >
                        {cancelButtonText}
                      </button>
                      <button
                        type="submit"
                        className={`px-4 py-2 rounded-lg text-white transition-colors ${
                          isLoading ? "bg-gray-400 cursor-not-allowed" : "bg-blue-600 hover:bg-blue-700"
                        }`}
                        disabled={isLoading}
                      >
                        {isLoading ? loadingText : submitButtonText}
                      </button>
                    </div>
                  </form>
                </motion.div>
              </dialog>
            </div>
          )}
        </AnimatePresence>
      </>
    );
  }