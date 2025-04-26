import { useState } from "react";
import { useNavigate } from "react-router-dom";
import QuizOutline from "./QuizOutline";
import QuizOverview from "./QuizOverview";

const InteractiveQuiz = ({ quiz }) => {
  const [quizState, setQuizState] = useState("in-progress"); // 'overview', 'in-progress', 'results' 3 interface states
  const [quizData, setQuizData] = useState(quiz);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [userAnswers, setUserAnswers] = useState(
    Array(quizData.questions.length).fill("")
  );
  const navigate = useNavigate();

  // Handle handel store quiz
  const startQuiz = () => {
    setQuizState("in-progress");
    setCurrentQuestion(0);
    setUserAnswers(Array(quizData.questions.length).fill(""));
  };

  const updateQuizDataAttribute = (attributeName, attributeValue) => {
    setQuizData(prevData => ({
      ...prevData,
      [attributeName]: attributeValue
    }));
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
          
          {/* Question Overview */}
          <div className="mb-6 bg-gray-50 p-3 rounded-lg border border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-3">
              <h3 className="text-md font-semibold mb-1 sm:mb-0">نظرة عامة على الأسئلة</h3>
              <div className="flex items-center text-xs text-gray-600 space-x-2 rtl:space-x-reverse">
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-green-500 rounded-full mr-1"></span>
                  <span>تمت الإجابة</span>
                </div>
                <div className="flex items-center">
                  <span className="inline-block w-3 h-3 bg-red-500 rounded-full mr-1"></span>
                  <span>لم تتم الإجابة</span>
                </div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2 justify-center">
              {quizData.questions.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentQuestion(index)}
                  className={`
                    w-8 h-8 sm:w-10 sm:h-10 rounded-full flex items-center justify-center 
                    text-xs sm:text-sm font-medium transition-all duration-300 transform
                    ${currentQuestion === index ? 'ring-2 ring-blue-500 ring-offset-2 scale-110 shadow-md' : ''}
                    ${userAnswers[index] ? 'bg-green-500 text-white hover:bg-green-600' : 'bg-red-500 text-white hover:bg-red-600'}
                  `}
                  aria-label={`الانتقال إلى السؤال ${index + 1}`}
                >
                  {index + 1}
                </button>
              ))}
            </div>
          </div>

          {/* Question */}
          <div className="mb-6 transition-opacity duration-300 ease-in-out">
            <h2 className="text-xl font-semibold mb-4">{question.question}</h2>

            {/* Answer options */}
            <div className="space-y-3">
              {question.options.map((option, index) => (
                <div
                  key={index}
                  onClick={() => selectAnswer(option)}
                  className={`p-4 border rounded-lg cursor-pointer transition-all duration-200 transform hover:scale-[1.01] ${
                    userAnswers[currentQuestion] === option
                      ? "border-blue-500 bg-blue-50 shadow-sm"
                      : "border-gray-300 hover:border-blue-300 hover:bg-blue-50"
                  }`}
                >
                  {option}
                </div>
              ))}
            </div>
          </div>

          {/* Navigation buttons */}
          <div className="flex flex-col sm:flex-row justify-between gap-3 mt-8">
            <div className="flex justify-between sm:justify-start gap-2 sm:gap-3 w-full sm:w-auto">
              <button
                onClick={goToPrevious}
                disabled={currentQuestion === 0}
                className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${
                  currentQuestion === 0
                    ? "bg-gray-200 text-gray-400 cursor-not-allowed"
                    : "bg-gray-200 hover:bg-gray-300 text-gray-700 hover:shadow-md"
                }`}
              >
                <span className="flex items-center justify-center">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  السابق
                </span>
              </button>

              {isLastQuestion ? (
                <button
                  onClick={finishQuiz}
                  disabled={userAnswers.some((answer) => answer === "")}
                  className={`px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 flex-1 sm:flex-none ${
                    userAnswers.some((answer) => answer === "")
                      ? "bg-green-300 text-white cursor-not-allowed"
                      : "bg-green-600 hover:bg-green-700 text-white hover:shadow-md"
                  }`}
                >
                  <span className="flex items-center justify-center">
                    إنهاء
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              ) : (
                <button
                  onClick={goToNext}
                  className="px-4 sm:px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-all duration-200 hover:shadow-md flex-1 sm:flex-none"
                >
                  <span className="flex items-center justify-center">
                    التالي
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 rtl:rotate-180" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
                    </svg>
                  </span>
                </button>
              )}
            </div>
            
            <button
              className="w-full sm:w-auto bg-red-500 hover:bg-red-600 text-white px-4 sm:px-6 py-2 rounded-lg font-medium transition-all duration-200 hover:shadow-md"
              onClick={
                isLastQuestion || !userAnswers.includes("") 
                  ? finishQuiz
                  : () => {
                      navigate(-1);
                    }
              }
            >
              <span className="flex items-center justify-center">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
                {!userAnswers.includes("") ? "إنهاء الاختبار" : "خروج من الاختبار"}
              </span>
            </button>
          </div>
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
        updateQuizDataAttribute={updateQuizDataAttribute}
        userAnswers={userAnswers}
        startQuiz={startQuiz}
      />
    );
  }

  return null;
};

export default InteractiveQuiz;
