import { Link, useNavigate } from "react-router-dom";
import { useActionState, useEffect } from "react";
import { isEmail, isEmpty } from "../util/validation";
import { errorMapping } from "../util/errorMapping";
import axios from "../api/axios";
import { useAuth } from "../context/authContext";

export default function Login() {
  const { setUserStateLogin } = useAuth(); // to update the context of the user
  const navigate = useNavigate();

  async function login_handler(prevFormState, formData) {
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

    //this is the code that will be executed if the form is valid
    try {
      const response = await axios.post("auth/login", { email, password });

      if (response.status === 200) {
        setUserStateLogin(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 401) {
          return { errors: ["email or password is incorrect"] };
        } else {
          return { errors: [error.response.data.message] };
        }
      } else {
        console.error("An error occurred while sending the request");
        return {
          errors: [error.message] || [
            "An error occurred while sending the request",
          ],
        };
      }
    }
  }

  const [formState, formAction, pending] = useActionState(login_handler, {
    errors: null,
  });

  // Redirect to the After_login if the user is logged in
  useEffect(() => {
    if (formState.success) {
      navigate("/home");
    }
  }, [formState.success, navigate]);
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-b from-TAF-200 via-white to-TAF-200">
      {/* Responsive container */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8 mx-auto border-y-8 border-TAF-300 bg-gray-50 rounded-lg shadow-md">
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
