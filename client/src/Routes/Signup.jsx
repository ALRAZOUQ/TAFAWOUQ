import { useActionState } from "react";
import { Link } from "react-router-dom";
import { errorMapping } from "../util/errorMapping";
import {
  isEmail,
  isEqualToOtherValue,
  isEmpty,
  hasMinLength,
} from "../util/validation.js";
export default function Signup() {
  function handleSignupSubmission(prevFormState, formData) {
    const username = formData.get("name");
    const email = formData.get("email");
    const password = formData.get("password");
    const confirmPassword = formData.get("confirmPassword");

    let errors = [];
    //validate the name
    if (isEmpty(username)) {
      errors.push("name is empty");
    }

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
      return {
        errors,
        enteredValues: {
          username,
          email,
          password,
          confirmPassword,
        },
      };
    }

    // If no errors, return null errors
    return { errors: null };
  }

  const [formState, formAction, pending] = useActionState(
    handleSignupSubmission,
    { errors: null }
  );

  return (
    <div className="h-screen flex items-center justify-center flex-col bg-gradient-to-br from-sky-50 to-sky-200">
      <div className="w-full max-w-sm p-8 mx-auto rounded shadow-md bg-gradient-to-t from-slate-100 to-slate-200">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 font-cairo">
            التسجيل
          </h2>
          <form action={formAction}>
            <div className="mb-4">
              <label
                htmlFor="username"
                className="block text-gray-600 font-cairo"
              >
                الإسم
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={formState.enteredValues?.username}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 font-cairo">
                الإيميل
              </label>
              <input
                type="text"
                id="email"
                name="email"
                defaultValue={formState.enteredValues?.email}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-gray-600 font-cairo"
              >
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                defaultValue={formState.enteredValues?.password}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>

            <div className="mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-gray-600 font-cairo"
              >
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                defaultValue={formState.enteredValues?.confirmPassword}
                className="w-full p-3 mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              />
            </div>
            {formState.errors && (
              <ul className="list-decimal">
                {formState.errors.map((error) => (
                  <li className="text-red-600 font-cairo" key={error}>
                    {errorMapping(error)}
                  </li>
                ))}
              </ul>
            )}

            <button className="w-full p-3 mt-4 bg-TAF-100 text-white font-semibold rounded-lg hover:bg-TAF-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-cairo">
              تسجيل
            </button>

            {/* special react Link used to prevent the page from reloding */}
            <div className="flex justify-center mt-4">
              <Link
                to="/login"
                className="text-blue-500 hover:underline focus:outline-none font-cairo"
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
