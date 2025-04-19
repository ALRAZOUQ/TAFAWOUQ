import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizOutline from "./QuizOutline";
import QuizOverview from "./QuizOverview";

const InteractiveQuiz = ({ quizData }) => {
  const [quizState, setQuizState] = useState("in-progress"); // 'overview', 'in-progress', 'results' 3 interface states
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(quizData.questions.length).fill("")
  );
  const navigate = useNavigate();

  // Handle handel store quiz

  // Handle handel store quiz

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
  function calculateScore() {
    return userAnswers.reduce((score, answer, index) => {
      return answer === quizData.questions[index].correctAnswer
        ? score + 1
        : score;
    }, 0);
  }

  // Render Quiz Overview
  if (quizState === "overview") {
    return <QuizOverview quizData={quizData} startQuiz={startQuiz} />;
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
            onClick={
              isLastQuestion
                ? finishQuiz
                : () => {
                    navigate(-1);
                  }
            }
          >
            خروج من الاختبار
          </button>
        </div>
      </div>
    );
  }

  // Render Results Page
  if (quizState === "results") {
    const score = calculateScore();

    return (
      <QuizOutline
        score={score}
        quizData={quizData}
        userAnswers={userAnswers}
        startQuiz={startQuiz}
      />
    );
  }

  return null;
};

export default InteractiveQuiz;
