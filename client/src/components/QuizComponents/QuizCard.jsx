import React , { useMemo , useCallback} from'react';
import {  Tag, ChevronRight,Trash2 ,MessageSquareWarning } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useAuth } from "../../context/authContext";
import GenericForm from "../GenericForm";
import axios from "../../api/axios";
import { toast } from "react-toastify";
// Custom Course Avatar component
const CourseAvatar = ({ code }) => {
  // Extract initials from course code (with null check)
  const initials = code ? code.substring(0, 2) : "--";
    
  // Generate consistent color based on the code
  const getColorClass = () => {
    const colors = [
      "bg-blue-500", "bg-emerald-500", "bg-amber-500", 
      "bg-rose-500", "bg-violet-500", "bg-cyan-500"
    ];
    // Add null check before using code
    if (!code) return colors[0]; // Default color if code is null
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



export default function QuizCard({ quiz, onDelete }) {
  const reportFields = useMemo(
    () => [
      {
        name: "reportContent",
        label: "سبب الإبلاغ",
        type: "textarea",
        required: true,
      },
    ],
    []
  );
  
  const deleteFields = useMemo(
    () => [
      {
        name: "reason",
        label: "سبب الاخفاء",
        type: "textarea",
        required: true,
      },
    ],
    []
  ); 

  const { user, isAuthorized } = useAuth();

  const handleHideQuiz = useCallback(async (formData) => {
    try {
      const response = await axios.put("/admin/hideQuiz", {
        quizId: formData.id,
        reason: formData.reason,
        reportId: formData.reportId, // formData has 'reportId', it can be null or undefined (optional)
      });

      if (response.data.success) {
        onDelete(formData.id); //to delete the quiz from the Quiz list  
        toast.success("تم إخفاء الاختبار بنجاح");
      }
    } catch (error) {
      if (error?.response?.status === 409) {
        toast.error(" هذا المقرر مخفي بالفعل");
        return;
      }
      console.error("Error submitting rating:", error);
      toast.error(error.response?.data?.message || "حدث خطأاثناء حذف الاختبار.");
      console.error("Error hiding quiz:", error);
    }
  }, []);

  const handleReportQuiz = useCallback(async (formData) => {
    try {
      // Prepare the data for the API call
      const reportData = {
        quizId: quiz.id,
        reportContent: formData.reportContent,
      };

      // Call the API endpoint
      const response = await axios.post("/protected/reportQuiz", reportData);

      if (response.data.success) {
        toast.success("تم الإبلاغ عن الاختبار بنجاح");
      }
      return { success: true };
    } catch (error) {
      console.error("Error reporting comment:", error);
      toast.error("حدث خطأ أثناء الإبلاغ عن الاختبار");
      return { success: false, error };
    }
  }, []);

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
            <span className="text-xs font-medium">{quiz.courseCode || "غير محدد"}</span>
          </div>
          {isAuthorized && !user.isAdmin &&(
            <GenericForm
              itemId={quiz.id}
              title="ابلاغ"
              fields={reportFields}
              submitButtonText="ابلاغ"
              onSubmit={(formData) => {
                handleReportQuiz(formData);
              }}>
              <button className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors">
                <MessageSquareWarning size={18} />
                <span className="text-sm">ابلاغ</span>
              </button>
            </GenericForm>
          )}
          {/* Make sure we're properly checking if the user is an admin */}
          {isAuthorized && user.isAdmin && (
            <GenericForm
              itemId={quiz?.id}
              title="اخفاءالالاختبار"
              fields={deleteFields}
              submitButtonText="اخفاء"
              onSubmit={(formData) => {
               handleHideQuiz(formData);
              }}>
              <button
                className="flex items-center gap-2 text-gray-600 hover:text-blue-600 transition-colors"
                type="button">
                <Trash2 size={18} />
                <span className="text-sm">اخفاء</span>
              </button>
            </GenericForm>
          )}
        </div>
        
        {/* Quiz start button with authorization check */}
        {isAuthorized ? (
          <Link to={`/quiz/${quiz.id}`}>
            <button
              className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
            >
              <span>ابدأ الاختبار</span>
              <ChevronRight size={16} className="transform rotate-180" />
            </button>
          </Link>
        ) : (
          <button
            onClick={() => toast.info("يجب تسجيل الدخول لبدء الاختبار")}
            className="px-4 py-1.5 bg-blue-600 text-white text-sm rounded-full hover:bg-blue-700 transition-colors flex items-center gap-1 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            <span>ابدأ الاختبار</span>
            <ChevronRight size={16} className="transform rotate-180" />
          </button>
        )}
      </div>
    </div>
  
  )
}
