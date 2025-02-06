import { Link } from "react-router-dom";
import MainHeader from "../components/MainHeader";
import main_logo from "../assets/mainLogo.svg";
import MainFooter from "../components/MainFooter";

export default function Landing() {
  return (
    <>
      <MainHeader />
      <div className="bg-gradient-to-b from-TAF-200 via-white to-TAF-200 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center px-4  mt-0">
        <div className="w-full max-w-[400px] min-w-[100px] mx-auto mt-12">
          <img src={main_logo} alt="KSU logo" className="w-full h-auto" />
        </div>
        <div className="shadow-md rounded-2xl p-6 max-w-2xl mx-auto mt-10 text-gray-800 shadow-gray-400">
          <p className="text-lg text-center mb-6">
            بيئة تفاعلية تجمع طلاب الجامعة لتبادل الخبرات والمعارف ومشاركة
            الآراء حول المسارات الدراسية والمقررات الأكاديمية.
          </p>
          <h3 className="text-xl font-semibold mb-4">
            &#x1F680; &#x1F4A1; ماذا نقدم؟
          </h3>
          <ul className="space-y-3 text-lg list-none">
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">&#x2705;</span> مراجعات
              المقررات: شارك تقييماتك وساعد زملاءك في اختيار الأنسب.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">&#x2705;</span> جدولة
              المقررات: قم بتثبيت المقررات في جدولك الدراسي لمتابعتها بسهولة.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">&#x2705;</span> حساب
              المعدل التراكمي: أداة لحساب ومتابعة معدلك بدقة.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">&#x2705;</span> مناقشات
              فعالة: تبادل المعرفة والنصائح الأكاديمية مع زملائك.
            </li>
            <li className="flex items-center gap-2">
              <span className="text-green-500 text-xl">&#x2705;</span> اختبارات
              تفاعلية: اختبر معلوماتك من خلال الاختبارات المخصصة.
            </li>
          </ul>
          <p className="text-center text-lg font-semibold mt-6">
            &#x1F4E2; انضم إلينا الآن وساهم في بناء مجتمع طلابي أكثر تفاعلًا
            ونجاحًا! &#x1F499;
          </p>
          <p className="text-center text-lg font-bold mt-2">
            &#x26A1; تعلم، شارك، وانطلق نحو النجاح!
          </p>
        </div>
        <div>
          <MainFooter />
        </div>
      </div>
    </>
  );
}
