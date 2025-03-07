import { useRef, useActionState } from "react";
import { isEmpty } from "../util/validation.js";
import axios from "../api/axios";
import { toast } from "react-toastify";
export default function CreateCourse({ handleAddNewCourse }) {
  const dialogRef = useRef(null);

  async function createCourseHandler(prevState, formData) {
    const courseCode = formData.get("courseCode");
    const courseName = formData.get("courseName");
    const overview = formData.get("overview");
    const creditHours = formData.get("creditHours");
    let errors = []; // Return an array with the error message it will be helpful when we going to show the error inside the form but for now it is usles(we might delete it)

    if (
      isEmpty(courseCode) ||
      isEmpty(courseName) ||
      isEmpty(overview) ||
      isEmpty(creditHours)
    ) {
      errors.push("some fields are empty fill it please");
    }
    if (errors.length > 0) {
      return errors;
    }

    try {
      const requestData = {
        code: courseCode,
        name: courseName,
        overview: overview,
        creditHours: parseInt(creditHours),
      };

      const response = await axios.post("admin/addCourse", requestData);
      if (response.status === 201) {
        const newCourseData = response.data.course;
        handleAddNewCourse(newCourseData); // to add the new course to the courses list
        dialogRef.current.close();
        toast.success("تم إنشاء المقرر بنجاح");
        return null;
      }
    } catch (error) {
      dialogRef.current?.close(); // to close the dialog to see the eror in tost notifcation
      // Handle specific error cases
      if (error.response?.status === 401) {
        const duplicateError = "هذا المقرر موجود بالفعل";
        toast.error(duplicateError);
        return [duplicateError]; // Return an array with the error message it will be helpful we going to show the error in the form
      }
      // Handle generic errors
      const errorMessage =
        error.response?.data?.message || "حدث خطأ أثناء إنشاء المقرر";
      // Close dialog and show error notification
      toast.error(errorMessage);
      return [errorMessage]; // Return an array with the error message it will be helpful we going to show the error in the form
    }
  }

  const [formState, formAction, pending] = useActionState(createCourseHandler, {
    errors: null,
  });

  return (
    <>
      <button
        onClick={() => dialogRef.current.showModal()}
        className=" bg-gray-50 border-2 border-TAF-100 border-dotted text-gray-700 shadow-lg rounded-2xl hover:opacity-75 active:opacity-55 px-4 py-2"
      >
        إنشاء مادة جديدة
      </button>

      <dialog
        ref={dialogRef}
        className="bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200 p-6 rounded-lg shadow-lg w-96"
      >
        <h2 className="text-xl font-semibold mb-4">Create Course</h2>
        <form action={formAction} className="space-y-4">
          <div>
            <label className="block text-sm font-medium mb-3">رمز المقرر</label>
            <input
              id="courseCode"
              name="courseCode"
              required
              className="w-full border p-2 rounded"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">إسم المقرر</label>
            <input
              required
              className="w-full border p-2 rounded"
              id="courseName"
              name="courseName"
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">
              نبذة عن المقرر
            </label>
            <textarea
              required
              id="overview"
              name="overview"
              className="w-full border p-2 rounded"
            ></textarea>
          </div>
          <div>
            <label className="block text-sm font-medium mb-3">
              ساعات المقرر
            </label>
            <input
              type="number"
              id="creditHours"
              name="creditHours"
              required
              className="w-full border p-2 rounded"
            />
          </div>

          <div className="flex justify-end space-x-2">
            <button
              type="button"
              onClick={() => dialogRef.current.close()}
              className="px-4 py-2 bg-gray-400 text-white rounded hover:bg-gray-500 ml-3"
            >
              إلغاء
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-TAF-100 text-white rounded hover:opacity-75 active:opacity-55"
            >
              إنشاء
            </button>
          </div>
        </form>
      </dialog>
    </>
  );
}
