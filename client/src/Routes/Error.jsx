export default function Error404Page() {
  return (
    <div className="h-screen flex flex-col items-center justify-center bg-gradient-to-br from-sky-100 to-sky-300">
      <div className="text-center">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 200 200"
          className="w-40 h-40 mx-auto mb-6"
        >
          <circle
            cx="100"
            cy="100"
            r="95"
            fill="white"
            stroke="gray"
            strokeWidth="4"
          />
          <text
            x="50%"
            y="50%"
            dominantBaseline="middle"
            textAnchor="middle"
            fontSize="48"
            fontWeight="bold"
            fill="gray"
          >
            404
          </text>
        </svg>
      </div>
      <div>
        المعذرة لم نجد الصفحة التي تبحث عنها الرجاء المحاولة مرة اخرى لاحقا
      </div>
    </div>
  );
}
