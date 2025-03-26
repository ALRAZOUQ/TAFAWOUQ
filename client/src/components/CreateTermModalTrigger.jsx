import NavigationLink from "./RootLayoutComponents/NavigationLink";
import GenericForm from "./GenericForm";
export default function CreateTermModalTrigger() {
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
      <NavigationLink linkTo={"إنشاء ترم جديد"} route={"/admin/createTerm"} />
    </GenericForm>
  );
}
