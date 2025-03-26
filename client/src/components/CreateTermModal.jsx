import GenericForm from "./GenericForm";
import Screen from "./Screen";

export default function CreateTermModal() {
  return (
    <Screen>
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
        <button className="w-full bg-black h-2">إنشاء ترم دراسي جديد</button>
      </GenericForm>
    </Screen>
  );
}
