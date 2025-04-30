import GenericForm from "../GenericForm";
import { useCallback } from "react";
import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";

export default function CreateTermModal({ children }) {
  const navigate = useNavigate();
  const handleCreateTerm = useCallback(async (formData) => {
    try {
      const termData = {
        name: formData.name,
        startDate: formData.startDate,
        endDate: formData.endDate,
      };

      // Call the API endpoint
      const response = await axios.post("/admin/addTerm", termData);

      if (response.data.success) {
        toast.success("تم إنشاء الترم بنجاح");
      }
      return { success: true };
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("حدث خطأ أثناء إنشاء الترم");
      return { success: false, error };
    }
  }, []);
  return (
    <GenericForm
      title="إنشاء ترم جديد"
      fields={[
        {
          label: "اسم الترم",
          type: "text",
          name: "name",
          placeholder: "الترم",
          required: true,
        },
        {
          label: "تاريخ بداية الترم",
          type: "date",
          name: "startDate",
          placeholder: "الترم",
          required: true,
        },
        {
          label: "تاريخ نهاية الترم",
          type: "date",
          name: "endDate",
          placeholder: "الترم",
          required: true,
        },
      ]}
      submitButtonText="إنشاء"
      loadingText="جاري إنشاء الترم"
      onSubmit={async (formData) => {
        const result = await handleCreateTerm(formData);
        if (result.success) {
          navigate(-1);
        }
      }}
    >
      {children}
    </GenericForm>
  );
}
