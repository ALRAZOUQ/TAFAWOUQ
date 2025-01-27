import { Link } from "react-router-dom";
export default function Login() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-200">
      <div className="w-full max-w-sm p-8 mx-auto rounded shadow-md bg-gradient-to-t from-slate-100 to-slate-200">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            تسجيل الدخول
          </h2>
          <form>
            <div className="mb-4">
              <label htmlFor="email" className="block text-gray-600">
                الإيميل
              </label>
              <input
                type="email"
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

            <button className="w-full p-3 mt-4 bg-TAF-100 text-white font-semibold rounded-lg hover:bg-TAF-300 focus:outline-none focus:ring-2 focus:ring-blue-500">
              تسجيل الدخول
            </button>

            {/* Centering the Link */}
            <div className="flex justify-center mt-4">
              <Link
                to="/signup"
                className="text-blue-500 hover:underline focus:outline-none"
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
