import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "../api/axios";
import { toast } from "react-toastify";

const InteractiveQuiz = ({ quizData }) => {
  const [quizState, setQuizState] = useState("in-progress"); // 'overview', 'in-progress', 'results' 3 interface states
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(quizData.questions.length).fill("")
  );
  const navigate = useNavigate();
  // Handle handel store quiz
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
  // Handle handel store quiz
  const handeStoreQuiz = async () => {
    if (await storeQuiz(quizData)) {
      toast.success("تم اضافة الاختبار الى قائمتك بنجاح");
      navigate("/myquizzes");
    } else {
      toast.error("حدث خطأ عند محاولة اضافة الاختبار الى قائمتك");
    }
  };

  // Handle starting the quiz
  const startQuiz = () => {
    setQuizState("in-progress");
    setCurrentQuestion(0);
    setUserAnswers(Array(quizData.questions.length).fill(""));
  };

  // Handle answer selection
  const selectAnswer = (answer) => {
    const newAnswers = [...userAnswers];
    newAnswers[currentQuestion] = answer;
    setUserAnswers(newAnswers);
  };

  // Navigate to previous question
  const goToPrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };

  // Navigate to next question
  const goToNext = () => {
    if (currentQuestion < quizData.questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    }
  };

  // Finish the quiz and show results
  const finishQuiz = () => {
    setQuizState("results");
  };

  // Calculate final score
  const calculateScore = () => {
    return userAnswers.reduce((score, answer, index) => {
      return answer === quizData.questions[index].correctAnswer
        ? score + 1
        : score;
    }, 0);
  };

  // Check if an answer is correct
  const isCorrectAnswer = (questionIndex, option) => {
    return (
      userAnswers[questionIndex] === option &&
      option === quizData.questions[questionIndex].correctAnswer
    );
  };

  // Check if an answer is wrong
  const isWrongAnswer = (questionIndex, option) => {
    return (
      userAnswers[questionIndex] === option &&
      option !== quizData.questions[questionIndex].correctAnswer
    );
  };

  // Render Quiz Overview
  if (quizState === "overview") {
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

  // Render Quiz Interface
  if (quizState === "in-progress") {
    const question = quizData.questions[currentQuestion];
    const isLastQuestion = currentQuestion === quizData.questions.length - 1;

    return (
      <div className="min-h-screen p-6 flex flex-col items-center" dir="rtl">
        <div className="bg-white rounded-lg shadow-lg p-8 w-full max-w-2xl">
          {/* Progress indicator */}
          <div className="mb-6">
            <div className="flex justify-between items-center mb-2">
              <span className="text-lg font-medium">
                السؤال {currentQuestion + 1} من {quizData.questions.length}
              </span>
              <span className="text-sm text-gray-500">
                {Math.round(
                  ((currentQuestion + 1) / quizData.questions.length) * 100
                )}
                %
              </span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5">
              <div
                className="bg-blue-600 h-2.5 rounded-full"
                style={{
                  width: `${
                    ((currentQuestion + 1) / quizData.questions.length) * 100
                  }%`,
                }}
              ></div>
            </div>
          </div>

          {/* Question */}
          <div className="mb-6">
            <h2 className="text-xl font-semibold mb-4">{question.question}</h2>

            {/* Answer options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    userAnswers[currentQuestion] === option
                      ? "border-blue-500 bg-blue-50"
                      : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex justify-between mt-8">
            <button
              onClick={goToPrevious}
              disabled={currentQuestion === 0}
              className={`px-6 py-2 rounded-lg font-medium ${
                currentQuestion === 0
                  ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                  : "bg-gray-200 hover:bg-gray-300 text-gray-700"
              }`}
            >
              السابق
            </button>

            {isLastQuestion ? (
              <button
                onClick={finishQuiz}
                disabled={userAnswers.some((answer) => answer === "")}
                className={`px-6 py-2 rounded-lg font-medium ${
                  userAnswers.some((answer) => answer === "")
                    ? "bg-green-300 text-white cursor-not-allowed"
                    : "bg-green-600 hover:bg-green-700 text-white"
                }`}
              >
                إنهاء
              </button>
            ) : (
              <button
                onClick={goToNext}
                className="px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium"
              >
                التالي
              </button>
            )}
          </div>
          <button
            className="w-full bg-red-500 text-white px-6 py-2 rounded-lg font-medium mt-5"
            onClick={() => {
              navigate(-1);
            }}
          >
            إنهاء
          </button>
        </div>
      </div>
    );
  }

  // Render Results Page
  if (quizState === "results") {
    const score = calculateScore();

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
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-lg">
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
                        isCorrectAnswer(qIndex, option)
                          ? "bg-green-100 border-green-500"
                          : isWrongAnswer(qIndex, option)
                          ? "bg-red-100 border-red-500"
                          : "border-gray-200"
                      }`}
                    >
                      {option}

                      {isCorrectAnswer(qIndex, option) && (
                        <span className="mr-2 text-green-600 text-sm">✓</span>
                      )}

                      {isWrongAnswer(qIndex, option) && (
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
        </div>
      </div>
    );
  }

  return null;
};

export default InteractiveQuiz;
