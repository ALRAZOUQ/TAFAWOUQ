import { Link } from "react-router-dom";
import { useActionState } from "react";
import { isEmail, isEmpty } from "../util/validation";
import { errorMapping } from "../util/errorMapping";
export default function Login() {
  function loginhandler(prevFormState, formData) {
    const email = formData.get("email");
    const password = formData.get("password");
    let errors = [];
    if (!isEmail(email)) {
      errors.push("not email");
    }

    if (isEmpty(email) || isEmpty(password)) {
      errors.push("email or password cannot be empty");
    }

    if (errors.length > 0) {
      return {
        errors,
        enteredValues: {
          email,
          password,
        },
      };
    }

    return { errors: null };
  }
  const [formState, formAction, pending] = useActionState(loginhandler, {
    errors: null,
  });
  return (
    <div className="h-screen flex items-center justify-center bg-TAF-300">
      {/* Responsive container */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8 mx-auto rounded shadow-md bg-TAF-300 border-2 border-gray-300">
        <div className="flex flex-col gap-2 mb-4 sm:mb-6">
          {/* Responsive heading */}
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-700  mb-4 sm:mb-6 font-cairo">
            تسجيل الدخول
          </h2>
          <form action={formAction}>
            {/* Email field */}
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="email"
                className="block text-sm sm:text-base text-gray-600 font-cairo"
              >
                الإيميل
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={formState.enteredValues?.email}
                className="w-full p-2 sm:p-3 mt-1 sm:mt-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base"
              />
            </div>

            {/* Password field */}
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

            {/* Error messages */}
            {formState.errors && (
              <ul>
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

            {/* Submit button */}
            <button className="w-full p-2 sm:p-3 mt-4 sm:mt-6 bg-TAF-100 text-white font-semibold rounded-lg hover:opacity-70 active:opacity-50 hover:outline-TAF-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base font-cairo">
              تسجيل الدخول
            </button>

            {/* Signup link */}
            <div className="flex justify-center mt-4 sm:mt-6">
              <Link
                to="/signup"
                className="text-blue-500 text-sm sm:text-base hover:underline focus:outline-none font-cairo"
              >
                ليس لديك حساب؟ التسجيل
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
