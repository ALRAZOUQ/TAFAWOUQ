import React from'react';
import {  Tag, ChevronRight } from 'lucide-react';
import { Link } from 'react-router-dom';

// Custom Course Avatar component
const CourseAvatar = ({ code }) => {
  // Extract initials from course code
  const initials = code.substring(0, 2);
    
  // Generate consistent color based on the code
  const getColorClass = () => {
    const colors = [
      "bg-blue-500", "bg-emerald-500", "bg-amber-500", 
      "bg-rose-500", "bg-violet-500", "bg-cyan-500"
    ];
    const hash = code.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return colors[hash % colors.length];
  };
  
  return (
    <div className={`flex items-center justify-center rounded-full w-10 h-10 text-white font-medium ${getColorClass()}`}>
      {initials}
    </div>
  );
};

// Format date function
const formatDate = (dateString) => {
  return new Date(dateString).toLocaleDateString("ar-SA", {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};



export default function QuizCard({ quiz, onStartQuiz }) {
  return (
    <div 
      className=" border-gray-100 rounded-2xl p-5 bg-white shadow hover:shadow-md transition-all duration-300 mb-4"
    >
      {/* Main information */}
      <div className="flex justify-between items-start mb-4">
        <div className="flex items-center gap-3 ">
          <CourseAvatar code={quiz.courseCode} />
          <div>
            <h3 className="font-bold text-gray-800">{quiz.title}</h3>
            <div className="flex items-center gap-2 text-gray-500 text-xs">
              <span>{quiz.courseCode}</span>
              <span className="text-gray-400">•</span>
              <span>بواسطة {quiz.authorName}</span>
              <span className="text-gray-400">•</span>
              <span>{formatDate(quiz.creationDate)}</span>
            </div>
          </div>
        </div>
       
      </div>
      
      {/* Quiz description */}
      <p className="text-gray-700 py-2 text-right break-words whitespace-normal leading-relaxed">{quiz.description}</p>
      
      {/* Actions and additional information */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
        <div className="flex items-center gap-5">
       
          <div className="flex items-center gap-2 text-gray-500">
            <Tag size={16} />
            <span className="text-xs font-medium">{quiz.courseCode}</span>
          </div>
        </div>
        
        <Link to={`/quiz/${quiz.id}`}>
       
          <button
          onClick={() => onStartQuiz(quiz.id)}
          className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
        >
          <span>ابدأ الاختبار</span>
          <ChevronRight size={16} className="transform rotate-180" />
        </button>
        </Link>
        
      </div>
    </div>
  
  )
}
