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

    //this is the code that will be executed if the form is valid
    try {
      const response = await axios.post("auth/register", {
        name: username,
        email: email,
        password: password,
      });

      if (response.status === 201) {
        toast.success("تم تسجيل الدخول بنجاح!");
        setUserStateLogin(response.data.user);
        return { success: true, message: response.data.message };
      }
    } catch (error) {
      if (error.response) {
        if (error.response.status === 409) {
          return { errors: ["An account with this email already exists"] };
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

  const [formState, formAction, pending] = useActionState(
    handle_Signup_Submission,
    { errors: null }
  );

  // Redirect to the homePage if the user is register sucsessfully
  useEffect(() => {
    if (formState.success) {
      navigate("/home");
    }
  }, [formState.success, navigate]);

  return (
    <div className="h-screen flex items-center justify-center flex-col bg-gradient-to-b from-TAF-200 via-white to-TAF-200">
      <BackButton route={-1}/>
      {/* Responsive container */}
      <div className="w-full max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg xl:max-w-xl p-4 sm:p-6 md:p-8 mx-auto border-y-8 border-TAF-300 bg-gray-50 rounded-lg shadow-md mt-6">
        <div className="flex flex-col gap-2 mb-4 sm:mb-6">
          {/* Responsive heading */}
          <h2 className="text-xl sm:text-2xl font-semibold text-center text-gray-700 mb-4 sm:mb-6">
            التسجيل
          </h2>
          <form action={formAction}>
            {/* Responsive form fields */}
            <div className="mb-3 sm:mb-4">
              <label
                htmlFor="username"
                className="block text-sm sm:text-base text-gray-600"
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
                className="block text-sm sm:text-base text-gray-600"
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
                className="block text-sm sm:text-base text-gray-600"
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
                className="block text-sm sm:text-base text-gray-600"
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
                      className="text-red-600 text-sm sm:text-base"
                      key={error}
                    >
                      {errorMapping(error)}
                    </li>
                  ))}
                </ul>
              )}
            </div>
            {/* Submit button */}
            <button className="w-full p-2 sm:p-3 mt-4 sm:mt-6 bg-TAF-100 text-white font-semibold rounded-lg hover:opacity-70 active:opacity-50 hover:outline-TAF-100 focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm sm:text-base">
              تسجيل
            </button>
            {/* Login link */}
            <div className="flex justify-center mt-4 sm:mt-6">
              <Link
                to="/login"
                className="text-blue-500 text-sm sm:text-base hover:underline focus:outline-none"

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
