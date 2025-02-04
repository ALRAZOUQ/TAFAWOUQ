import { Link } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import main_logo from "../assets/mainLogo.svg";
//bg-gradient-to-l from-TAFb-200 to-TAFb-100   e4f4fe  #d2ebfa
export default function Landing() {
  return (
    <div className="bg-TAF-300 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center px-4 rounded-lg">
      <MainHeader />
      <div className="bg-gradient-to-l from-TAFb-200 to-TAFb-100 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center px-4">
        <div className="text-center mb-8 animate-fadeIn">
          <h1 className="text-4xl font-bold text-[#0b8eca] mb-4">
            مرحباً بكم في
          </h1>
        </div>
        <div className="w-full max-w-[400px] min-w-[100px] mx-auto">
          <img src={main_logo} alt="KSU logo" className="w-full h-auto" />
        </div>
        <div className="bg-white shadow-lg rounded-2xl p-6 max-w-2xl mx-auto mt-10 text-gray-800">
          <h2 className="text-2xl font-bold text-center mb-4">
            🎓 مرحبًا بكم في منصتنا الطلابية!
          </h2>
          <p className="text-lg text-center mb-6">
            منصتنا هي بيئة تفاعلية تجمع طلاب الجامعة لتبادل الخبرات والمعارف
            ومشاركة الآراء حول المسارات الدراسية والمقررات الأكاديمية.
          </p>
          <h3 className="text-xl font-semibold mb-4">🚀 💡 ماذا نقدم؟</h3>
          <ul className="space-y-3 text-lg">
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span> مراجعات
              المقررات: شارك تقييماتك وساعد زملاءك في اختيار الأنسب.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span> جدولة المقررات:
              قم بتثبيت المقررات في جدولك الدراسي لمتابعتها بسهولة.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span> حساب المعدل
              التراكمي: أداة لحساب ومتابعة معدلك بدقة.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span> مناقشات فعالة:
              تبادل المعرفة والنصائح الأكاديمية مع زملائك.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">✅</span> اختبارات
              تفاعلية: اختبر معلوماتك من خلال الاختبارات المخصصة.
            </li>
          </ul>
          <p className="text-center text-lg font-semibold mt-6">
            📢 انضم إلينا الآن وساهم في بناء مجتمع طلابي أكثر تفاعلًا ونجاحًا!
            💙
          </p>
          <p className="text-center text-lg font-bold mt-2">
            ⚡ تعلم، شارك، وانطلق نحو النجاح!
          </p>
        </div>

        <p className="text-xl font-semibold text-center text-gray-700 mb-6 mt-6">
          اختر ما تريد القيام به
        </p>
        <div className="flex flex-col gap-4">
          <Link
            to="/signup"
            className="bg-[#0b8eca] text-white text-center py-3 rounded-lg hover:opacity-75 active:opacity-50 transition duration-300"
          >
            الاشتراك
          </Link>
          <Link
            to="/login"
            className="bg-gray-100 text-[#0b8eca] px-2 text-center py-3 rounded-lg hover:bg-gray-200 transition duration-300 mb-6"
          >
            تسجيل الدخول
          </Link>
        </div>
      </div>
    </>
  );
}
