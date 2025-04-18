import Screen from "../components/Screen";
import { useState, useEffect } from "react";
import QuizCard from "../components/QuizComponents/QuizCard";
import Page from "../components/Page";
import PDFQuizGenerator from "../components/QuizComponents/PDFQuizGenerator";
import axios from "../api/axios";

export default function MyQuizzes() {
  //this just for test but navegates to real quiz retreved from database
  const [MyQuizzes, setMyQuizzes] = useState([]);

  useEffect(() => {
    async function fetchMyQuizzes() {
      try {
        const response = await axios.get("/protected/myQuizList");

        if (response.status === 200) {
          setMyQuizzes(response.data.quiz);
        } else {
          console.error("Failed to fetch quizzes:", response.statusText);
        }
      } catch (error) {
        console.error("Error fetching quizzes:", error);
      }
    }

    fetchMyQuizzes();
  }, []);

  const handleStartQuiz = (quizId) => {
    // Add your navigation or quiz start logic here
  };

  return (
    <Screen className={`p-4`} title="MyQuizzes">
      <Page>
        <PDFQuizGenerator />
        <h1 className="text-2xl font-bold text-gray-800 mb-6">
          اختباراتي القصيرة
        </h1>
        {MyQuizzes.length === 0 ? (
          <div className="text-center py-10 rounded-lg shadow">
            <p className="text-gray-500">
              لا توجد اختبارت قصيرة مضافة في قائمتك بعد.
            </p>
          </div>
        ) : (
          <div className="mx-auto ">
            {MyQuizzes.map((quiz) => (
              <QuizCard
                key={quiz.id}
                quiz={quiz}
                onStartQuiz={handleStartQuiz}
              />
            ))}
          </div>
        )}
      </Page>
    </Screen>
  );
}
