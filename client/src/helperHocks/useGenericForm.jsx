import { useState, useEffect } from "react";

export const useGenericForm = (fields, itemId, onSubmit, onSuccess) => {
  const [formData, setFormData] = useState({});
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const initialData = {};
    fields.forEach((field) => {
      initialData[field.name] = field.defaultValue || "";
    });
    if (itemId !== null && itemId !== undefined) {
      initialData.id = itemId;
    }
    setFormData(initialData);
  }, [fields, itemId]);

  const handleInputChange = (e, fieldName) => {
    setFormData({
      ...formData,
      [fieldName]: e.target.value,
    });
  };

  const handleFormSubmit = async () => {
    if (isLoading) return;

    const requiredFields = fields.filter((field) => field.required);
    for (const field of requiredFields) {
      if (!formData[field.name] || formData[field.name].trim() === "") {
        alert(`الحقل ${field.label} مطلوب`);
        return;
      }
    }

    setIsLoading(true);
    try {
      if (onSubmit) {
        await onSubmit(formData);
      }
      if (onSuccess) {
        onSuccess(formData);
      }
    } catch (error) {
      console.error("Error submitting form:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return { formData, isLoading, handleInputChange, handleFormSubmit, setFormData };
};