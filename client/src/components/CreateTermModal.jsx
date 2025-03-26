import GenericForm from "./GenericForm";
import Screen from "./Screen";

export default function CreateTermModal({ children }) {
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
    >
      {children}
    </GenericForm>
  );
}
