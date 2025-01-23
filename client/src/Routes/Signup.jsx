import {
  isEmail,
  isEqualToOtherValue,
  isEmpty,
  hasMinLength,
} from "../util/validation";
import { useActionState } from "react";
import { Link } from "react-router-dom";
import { errorMapping } from "../util/errorMapping";
export default function Signup() {
  function handleSignupSubmission(prevFormState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    let errors = [];

    // Validate email
    if (!isEmail(email)) {
      errors.push("not email");
    }

    // Validate password length and emptiness
    if (!hasMinLength(password, 8) || isEmpty(password)) {
      errors.push(
        "password is empty or has characters less than minimum length"
      );
    }

    // Validate password and confirm password match
    if (!isEqualToOtherValue(password, confirmPassword)) {
      errors.push("password and confirm password does not match");
    }

    // Return errors if any exist
    if (errors.length > 0) {
      console.log(errors);
      return { errors };
    }

    // If no errors, return null errors
    return { errors: null };
  }

  const [formState, formAction, pending] = useActionState(
    handleSignupSubmission,
    { errors: null }
  );
  console.log(formState.errors);

  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-200">
      <div className="w-full max-w-sm p-8 mx-auto rounded shadow-md bg-gradient-to-t from-slate-100 to-slate-200">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            التسجيل
          </h2>
          <form action={formAction}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600">
                الإيميل
              </label>
              <input
                type="text"
                id="email"
                name="email"
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="password" className="block text-gray-600">
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label htmlFor="confirmPassword" className="block text-gray-600">
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                required
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {formState.errors && (
              <ul>
                {formState.errors.map((error) => (
                  <li key={error}>
                    {errorMapping(error)}
                  </li>
                ))}
              </ul>
            )}

            <button className="w-full p-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              التسجيل
            </button>

            {/* special react Link used to prevent the page from reloding */}
            <div className="flex justify-center mt-4">
              <Link
                to="/login"
                className="text-blue-500 hover:underline focus:outline-none"
              >
                لديك حساب؟ تسجيل الدخول
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
