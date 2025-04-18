import axios from "../../api/axios";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import { isWrongAnswer, isCorrectAnswer } from "../../util/QuizHelper";
import ShareQuizModal from "./ShareQuizModal";
export default function QuizOutline({
  score,
  quizData,
  userAnswers,
  startQuiz,
}) {
  const navigate = useNavigate();
  function handleShareQuiz() {}
  const storeQuiz = async (quizData) => {
    try {
      // If quizData has no ID, it hasn't been stored yet
      if (!quizData.id) {
        const response = await axios.post("protected/storeQuiz", {
          quiz: quizData,
        });
        quizData.id = response.data.quizId; // Get the ID from the response
      }

      console.log("quizId:", quizData?.id);

      const addQuizToMyQuizListResult = await axios.post(
        "protected/addQuizToMyQuizList",
        {
          quizId: quizData.id,
        }
      );

      return addQuizToMyQuizListResult.status === 201;
    } catch (error) {
      console.error("Error storing quiz or adding to list:", error);
      return false;
    }
  };
  const handeStoreQuiz = async () => {
    if (await storeQuiz(quizData)) {
      toast.success("تم اضافة الاختبار الى قائمتك بنجاح");
      navigate("/myquizzes");
    } else {
      toast.error("حدث خطأ عند محاولة اضافة الاختبار الى قائمتك");
    }
  };
  return (
    <div className="min-h-screen p-6 flex flex-col items-center" dir="rtl">
      <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
        {/* Score header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold mb-4">النتيجة النهائية</h1>
          <div className="text-5xl font-bold text-blue-600">
            {score} <span className="text-gray-500">من</span>{" "}
            {quizData.questions.length}
          </div>
          <div className="mt-2 text-lg text-gray-600">
            {score === quizData.questions.length
              ? "ممتاز! إجابات صحيحة بالكامل"
              : score >= quizData.questions.length * 0.7
              ? "أداء جيد جدًا!"
              : score >= quizData.questions.length * 0.5
              ? "أداء مقبول"
              : "حاول مرة أخرى"}
          </div>
        </div>

        {/* Action buttons */}
        <div className="flex gap-4 mb-8">
          <button
            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg"
            on
            onClick={handleShareQuiz}
          >
            مشاركة الكويز لمقرر
          </button>
          <button
            onClick={handeStoreQuiz}
            className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-medium py-2 px-4 rounded-lg"
          >
            حفظ الكويز في قائمتي
          </button>
        </div>

        {/* Question review */}
        <div className="space-y-8 mt-8">
          <h2 className="text-xl font-bold border-b pb-2">مراجعة الإجابات</h2>

          {quizData.questions.map((question, qIndex) => (
            <div key={qIndex} className="border-b pb-6">
              <h3 className="text-lg font-medium mb-3">
                {qIndex + 1}. {question.question}
              </h3>

              <div className="space-y-2">
                {question.options.map((option, oIndex) => (
                  <div
                    key={oIndex}
                    className={`p-3 border rounded-lg ${
                      isCorrectAnswer(qIndex, option, userAnswers, quizData)
                        ? "bg-green-100 border-green-500"
                        : isWrongAnswer(qIndex, option, userAnswers, quizData)
                        ? "bg-red-100 border-red-500"
                        : "border-gray-200"
                    }`}
                  >
                    {option}

                    {isCorrectAnswer(qIndex, option, userAnswers, quizData) && (
                      <span className="mr-2 text-green-600 text-sm">✓</span>
                    )}

                    {isWrongAnswer(qIndex, option, userAnswers, quizData) && (
                      <span className="mr-2 text-red-600 text-sm">✗</span>
                    )}
                  </div>
                ))}

                {userAnswers[qIndex] !== question.correctAnswer &&
                  userAnswers[qIndex] !== "" && (
                    <div className="mt-2 text-green-600 font-medium pr-2">
                      الإجابة الصحيحة: {question.correctAnswer}
                    </div>
                  )}
              </div>
            </div>
          ))}
        </div>

        {/* Retry button */}
        <button
          onClick={startQuiz}
          className="w-full mt-8 bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-4 rounded-lg transition duration-200"
        >
          محاولة مرة أخرى
        </button>
        <button
          className="w-full bg-red-500 text-white px-6 py-2 rounded-lg font-medium mt-3"
          onClick={() => {
            navigate(-1);
          }}
        >
          إنهاء
        </button>
      </div>
      <ShareQuizModal isOpen={true} />
    </div>
  );
}
