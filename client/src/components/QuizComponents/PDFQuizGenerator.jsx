import { useState, useEffect } from "react";
import { Upload, FileText, Loader, WandSparkles } from "lucide-react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion, AnimatePresence } from "framer-motion";
const backendURL = import.meta.env.VITE_SERVER_URL;
export default function PDFQuizGenerator() {
  const [quizTitle, setQuizTitle] = useState("");
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);
  const [buttonText, setButtonText] = useState("حان وقت إنشاء شيء رائع");
  const [selectedQuestionCount, setSelectedQuestionCount] = useState(null);
  const navigate = useNavigate();

  // Array of motivational button texts
  const buttonTexts = [
    "أنت الآن قريبًا من أنشاء اختبار رائع",
    "حان وقت إنشاء شيء رائع",
    "لنصمم اختباراً معاً",
    "حوّل ملف PDF إلى اختبار تفاعلي",
    "أنشئ تحفتك القادمة",
  ];

  // Change button text every 5 seconds
  useEffect(() => {
    const interval = setInterval(() => {
      const randomIndex = Math.floor(Math.random() * buttonTexts.length);
      setButtonText(buttonTexts[randomIndex]);
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const handelNavigateToQuiz = (quizData) => {
    navigate("/quiz/0", {
      state: {
        quizData: quizData,
      },
    });
  };
  const handleDragOver = (e) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleFileInput = (e) => {
    const files = e.target.files;
    handleFiles(files);
  };

  const handleFiles = (files) => {
    if (files.length > 0) {
      const file = files[0];
      if (file.type === "application/pdf") {
        setSelectedFile(file);
        setError("");
      } else {
        setError("Please upload a PDF file");
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!selectedFile) {
      setError("Please select a PDF file");
      return;
    }

    if (!quizTitle.trim()) {
      setError("Please enter a quiz title");
      return;
    }

    setIsLoading(true);
    setError("");

    try {
      const formData = new FormData();
      formData.append("title", quizTitle);
      formData.append("pdf", selectedFile);
      formData.append("numOfQuestions", selectedQuestionCount ?? 10);

      const response = await axios.post(
        `${backendURL}protected/generateQuiz`,
        formData,
        {
          withCredentials: true,
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      console.log("Generated quiz:", response.data.quiz);
      handelNavigateToQuiz(response.data.quiz);
      // Reset the form
      setQuizTitle("");
      setSelectedFile(null);
      setSelectedQuestionCount(null);

      // You might want to do something with the quiz data here
      // For example, redirect to the quiz page or show a success message
    } catch (err) {
      console.error("Error:", err);
      setError(
        err.response?.data?.message || err.message || "An error occurred"
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md border-x-4 border-x-TAF-300 border-y border-y-gray-100">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">
        لنصمم إختبارك
      </h2>

      {/* Eye-catching button with dynamic text */}
      <motion.button
        onClick={() => setShowModal(true)}
        className="w-full py-4 px-6 rounded-lg font-bold text-white bg-gradient-to-r from-TAF-100 via-purple-400 to-purple-600 hover:from-TAF-100 hover:via-purple-500 hover:to-purple-700 shadow-lg"
        whileHover={{ scale: 1.03 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 400, damping: 17 }}
      >
        <motion.div className="flex items-center justify-center">
          <motion.span
            key={buttonText}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
          >
            {buttonText}
          </motion.span>
          <WandSparkles className="h-5 w-5 mr-2" />
        </motion.div>
      </motion.button>

      {/* Modal */}
      <AnimatePresence>
        {showModal && (
          <>
            {/* Backdrop */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center"
              onClick={() => setShowModal(false)}
            >
              {/* Modal content */}
              <motion.div
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                transition={{ type: "spring", damping: 25, stiffness: 300 }}
                className="bg-white rounded-xl shadow-2xl p-6 w-full max-w-md mx-4 z-50"
                onClick={(e) => e.stopPropagation()}
              >
                <h3 className="text-2xl font-bold text-center mb-6 text-gray-800">
                  لنصمم إختبارك
                </h3>

                <form onSubmit={handleSubmit}>
                  <div className="mb-4">
                    <label
                      htmlFor="quizTitle"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      عنوان الإختبار
                    </label>
                    <input
                      type="text"
                      id="quizTitle"
                      value={quizTitle}
                      onChange={(e) => setQuizTitle(e.target.value)}
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                      placeholder="ادخل عنوان الإختبار"
                    />
                  </div>

                  <div className="mb-4">
                    <label
                      htmlFor="numberOfQuestions"
                      className="block text-sm font-medium text-gray-700 mb-1"
                    >
                      عدد الأسئلة
                    </label>

                    <div className="flex flex-wrap gap-2 mt-2">
                      {[5, 10, 15, 20, 25, 30].map((count) => (
                        <button
                          key={count}
                          type="button"
                          onClick={() => {
                            setSelectedQuestionCount(count);
                            setNumberOfQuestions("");
                          }}
                          className={`px-3 py-2 rounded-md text-sm font-medium transition-colors ${
                            selectedQuestionCount === count
                              ? "bg-blue-500 text-white"
                              : "bg-gray-200 text-gray-700 hover:bg-gray-300"
                          }`}
                        >
                          {count}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      حمل ملف PDF
                    </label>
                    <div
                      className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
                        isDragging
                          ? "border-blue-500 bg-blue-50"
                          : "border-gray-300"
                      } ${selectedFile ? "bg-green-50" : ""}`}
                      onDragOver={handleDragOver}
                      onDragLeave={handleDragLeave}
                      onDrop={handleDrop}
                      onClick={() =>
                        document.getElementById("fileInput").click()
                      }
                    >
                      <input
                        type="file"
                        id="fileInput"
                        className="hidden"
                        accept="application/pdf"
                        onChange={handleFileInput}
                      />

                      {selectedFile ? (
                        <div className="flex flex-col items-center">
                          <FileText className="h-12 w-12 text-green-500 mb-2" />
                          <p className="text-sm font-medium text-gray-900">
                            {selectedFile.name}
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                          </p>
                        </div>
                      ) : (
                        <div className="flex flex-col items-center">
                          <Upload className="h-12 w-12 text-gray-400 mb-2" />
                          <p className="text-sm font-medium text-gray-700">
                            إسحب وأسقط ملف PDF هنا أو إضغط لعرض الملفات
                          </p>
                          <p className="text-xs text-gray-500 mt-1">
                            نوع الملف المسموح به PDF فقط
                          </p>
                        </div>
                      )}
                    </div>
                  </div>

                  {error && (
                    <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
                      {error}
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <button
                      type="button"
                      onClick={() => setShowModal(false)}
                      className="flex-1 py-2 px-4 mx-2 rounded-md font-medium text-gray-700 bg-gray-200 hover:bg-gray-300 transition-colors"
                    >
                      إلغاء
                    </button>
                    <button
                      type="submit"
                      disabled={isLoading}
                      className={`flex-1 py-2 px-4 mx-2 rounded-md font-medium text-white ${
                        isLoading
                          ? "bg-blue-400 cursor-not-allowed"
                          : "bg-blue-600 hover:bg-blue-700"
                      } transition-colors flex items-center justify-center`}
                    >
                      {isLoading ? (
                        <>
                          <Loader className="animate-spin mr-2 h-4 w-4" />
                          جاري الإنشاء
                        </>
                      ) : (
                        "إنشاء الاختبار"
                      )}
                    </button>
                  </div>
                </form>
              </motion.div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </div>
  );
}
