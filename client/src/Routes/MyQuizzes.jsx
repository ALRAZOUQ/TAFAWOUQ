import Screen from "../components/Screen";
import React, { useState } from 'react';
import QuizCard from "../components/QuizCard";
import Page from "../components/Page";
import PDFQuizGenerator from "../components/PDFQuizGenerator";
export default function MyQuizzes() {

  //this just for test but navegates to real quiz retreved from database
  const [MyQuizzes, setMyQuizzes] = useState( [
    {
        "id": 10,
        "title": "Chapter1_interodection_spm",
        "isShared": false,
        "authorId": 1,
        "authorName": "mohammed ",
        "courseId": 1,
        "courseCode": "CSC102",
        "creationDate": "2025-04-14T07:52:05.746Z"
    },
    {
        "id": 9,
        "title": "Chapter1_interodection_spm",
        "isShared": false,
        "authorId": 1,
        "authorName": "mohammed ",
        "courseId": 1,
        "courseCode": "CSC102",
        "creationDate": "2025-04-14T06:08:02.313Z"
    }
]
  );

  const handleStartQuiz = (quizId) => {
    console.log(`Starting quiz with ID: ${quizId}`);
    // Add your navigation or quiz start logic here
  };

return (
<Screen title="MyQuizzes">
<Page>
<PDFQuizGenerator></PDFQuizGenerator>
 <h1 className="text-2xl font-bold text-gray-800 mb-6">اختباراتي القصيرة</h1>
 {MyQuizzes.length === 0 ? (
        <div className="text-center py-10 rounded-lg shadow">
          <p className="text-gray-500">لا توجد اختبارت قصيرة مضافة في قائمتك بعد.</p>
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
       ) }
     </Page>
</Screen>

)
}