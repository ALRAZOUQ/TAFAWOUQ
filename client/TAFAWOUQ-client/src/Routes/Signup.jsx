import { Link } from "react-router-dom";
export default function Signup() {
  return (
    <div className="h-screen flex items-center justify-center bg-gradient-to-br from-sky-50 to-sky-200">
      <div className="w-full max-w-sm p-8 mx-auto rounded shadow-md bg-gradient-to-t from-slate-100 to-slate-200">
        <div className="flex flex-col gap-2 mb-6">
          <h2 className="text-2xl font-semibold text-center text-gray-700 mb-6">
            التسجيل
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

            <button className="w-full p-3 mt-4 bg-blue-500 text-white font-semibold rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500">
              التسجيل
            </button>

            {/* Centering the Link */}
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
