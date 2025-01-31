import MainHeader from "../components/MainHeader";
<<<<<<< HEAD
import main_logo from "../assets/mainLogo.svg";

export default function Landing() {
  return (
    <>
      <MainHeader />
      <div className="bg-[#f7fbff] text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-[#0b8eca] mb-4">
            مرحباً بكم في
          </h1>
        </div>
        <div className="w-full max-w-[400px] min-w-[100px] mx-auto">
          <img src={main_logo} alt="KSU logo" className="w-full h-auto" />
        </div>
        <p className="text-xl font-semibold text-center text-gray-700 mb-6">
          اختر ما تريد القيام به
        </p>
        <div className="flex flex-col gap-4">
          <a
            href="/signup"
            className="bg-[#0b8eca] text-white text-center py-3 rounded-lg hover:bg-[#097bb3] transition duration-300"
          >
            الاشتراك
          </a>
          <a
            href="/login"
            className="bg-gray-100 text-[#0b8eca] text-center py-3 rounded-lg hover:bg-gray-200 transition duration-300"
          >
            تسجيل الدخول
          </a>
        </div>
      </div>
    </>
=======
import MainLogo from "../assets/mainLogo.svg";

export default function Landing() {
  return (
    <div className="bg-[#f7fbff] text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center px-4">
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-[#0b8eca] mb-4">
          مرحباً بكم في
        </h1>
      </div>
      <div className="w-full max-w-[400px] min-w-[100px] mx-auto">
        <img src={MainLogo} alt="KSU logo" className="w-full h-auto" />
      </div>
      <p className="text-xl font-semibold text-center text-gray-700 mb-6">
        اختر ما تريد القيام به
      </p>
      <div className="flex flex-col gap-4">
        <a
          href="/signup"
          className="bg-[#0b8eca] text-white text-center py-3 rounded-lg transition duration-200 hover:opacity-80 active:opacity-50 "
        >
          الاشتراك
        </a>
        <a
          href="/login"
          className="bg-gray-100 text-[#0b8eca] text-center py-3 rounded-lg hover:bg-gray-200 transition duration-300"
        >
          تسجيل الدخول
        </a>
      </div>
    </div>
>>>>>>> c9f060eebd4da8b8425364924101c6131b7d2671
  );
}
