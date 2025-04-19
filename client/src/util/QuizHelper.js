export function  isWrongAnswer(questionIndex, option,userAnswers,quizData) {
    return (
      userAnswers[questionIndex] === option &&
      option !== quizData.questions[questionIndex].correctAnswer
    );
  };
  export function  isCorrectAnswer (questionIndex, option,userAnswers,quizData) {
    return (
      userAnswers[questionIndex] === option &&
      option === quizData.questions[questionIndex].correctAnswer
    );
  };