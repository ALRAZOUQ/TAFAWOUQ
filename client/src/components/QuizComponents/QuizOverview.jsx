export default function QuizOverview({quizData, startQuiz}) {
  return (
    <div className="min-h-screen p-6 flex flex-col items-center" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        <h1 className="text-3xl font-bold text-center mb-6">
          {quizData.title}
        </h1>

        <div className="space-y-4 mb-8">
          <div className="flex justify-between text-gray-600">
            <span>اسم المنشئ:</span>
            <span className="font-medium">{quizData.authorName}</span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>تاريخ الإنشاء:</span>
            <span className="font-medium">
              {new Date(quizData.creationDate).toLocaleDateString("ar-EG")}
            </span>
          </div>
          <div className="flex justify-between text-gray-600">
            <span>عدد الأسئلة:</span>
            <span className="font-medium">{quizData.questions.length}</span>
          </div>
        </div>

        <button
          onClick={startQuiz}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          بدء حل الكويز
        </button>
      </div>
    </div>
  );
}
