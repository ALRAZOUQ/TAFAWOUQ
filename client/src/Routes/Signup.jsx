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
    <div className="h-screen flex items-center justify-center flex-col bg-[#f7fbff]">
      {/* Responsive container */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8 mx-auto rounded shadow-md bg-gradient-to-t from-slate-100 to-slate-200">
        <div className="flex flex-col gap-2 mb-4 sm:mb-6">
          {/* Responsive heading */}
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-700 mb-4 sm:mb-6 font-cairo">
            التسجيل
          </h2>
          <form action={formAction}>
            {/* Responsive form fields */}
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="username"
                className="block text-sm sm:text-base text-gray-600 font-cairo"
              >
                الإسم
              </label>
              <input
                type="text"
                id="username"
                name="username"
                defaultValue={formState.enteredValues?.username}
                className="w-full p-2 sm:p-3 mt-1 sm:mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base text-gray-600 font-cairo"
              >
                الإيميل
              </label>
              <input
                type="text"
                id="email"
                name="email"
                defaultValue={formState.enteredValues?.email}
                className="w-full p-2 sm:p-3 mt-1 sm:mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="password"
                className="block text-sm sm:text-base text-gray-600 font-cairo"
              >
                كلمة المرور
              </label>
              <input
                type="password"
                id="password"
                name="password"
                defaultValue={formState.enteredValues?.password}
                className="w-full p-2 sm:p-3 mt-1 sm:mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="confirmPassword"
                className="block text-sm sm:text-base text-gray-600 font-cairo"
              >
                تأكيد كلمة المرور
              </label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                defaultValue={formState.enteredValues?.confirmPassword}
                className="w-full p-2 sm:p-3 mt-1 sm:mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>
            {/* Error messages */}
            <div className="mb-3 sm:mb-4">
              {formState.errors && (
                <ul className="list-decimal w-full p-2 sm:p-3 mt-1 sm:mt-2">
                  {formState.errors.map((error) => (
                    <li
                      className="text-red-600 text-sm sm:text-base font-cairo"
                      key={error}
                    >
                      {errorMapping(error)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Submit button */}
            <button className="w-full p-2 sm:p-3 mt-4 sm:mt-6 bg-TAF-100 text-white font-semibold rounded-lg hover:bg-TAF-300 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-cairo">
              تسجيل
            </button>
            {/* Login link */}
            <div className="flex justify-center mt-4 sm:mt-6">
              <Link
                to="/login"
                className="text-blue-500 text-sm sm:text-base hover:underline focus:outline-none font-cairo"
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
