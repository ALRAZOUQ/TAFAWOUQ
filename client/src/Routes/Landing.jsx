export default function Landing() {
  return (
    <div className="bg-[#f7fbff] text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center px-4">
      {/* Header Section */}
      <div className="text-center mb-8 animate-fadeIn">
        <h1 className="text-4xl font-bold text-[#0b8eca] mb-4">
          مرحباً بكم في تفوُق
        </h1>
      </div>
      <img src="../assets/mainLogo.svg" alt="TAFAWOUQ Logo" />
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
  );
}
