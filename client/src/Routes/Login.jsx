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
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-200">
      <div className="w-full max-w-sm p-8 mx-auto rounded shadow-md bg-gradient-to-t from-slate-100 to-slate-200">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6 font-cairo">
            تسجيل الدخول
          </h2>
          <form action={formAction}>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600 font-cairo">
                الإيميل
              </label>
              <input
                type="email"
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
            {formState.errors && (
              <ul>
                {formState.errors.map((error) => (
                  <li className="text-red-600 font-cairo" key={error}>
                    {errorMapping(error)}
                  </li>
                ))}
              </ul>
            )}

            <button className="w-full p-3 mt-4 bg-TAF-100 text-white font-semibold rounded-lg hover:bg-TAF-300 focus:outline-none focus:ring-2 focus:ring-blue-500 font-cairo">
              تسجيل الدخول
            </button>

            {/* Centering the Link */}
            <div className="flex justify-center mt-4">
              <Link
                to="/signup"
                className="text-blue-500 hover:underline focus:outline-none font-cairo"
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
