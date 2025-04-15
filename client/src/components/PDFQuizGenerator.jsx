import { useState } from 'react';
import { Upload, FileText, Loader } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
const backendURL = import.meta.env.VITE_SERVER_URL;
export default function PDFQuizGenerator() {
  const [quizTitle, setQuizTitle] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
const navigate = useNavigate();

const handelNavigateToQuiz = (quizData) => {
  navigate('/quiz/0', {
    state: {
      quizData: quizData,
    }
  });
}
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
      if (file.type === 'application/pdf') {
        setSelectedFile(file);
        setError('');
      } else {
        setError('Please upload a PDF file');
        setSelectedFile(null);
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!selectedFile) {
      setError('Please select a PDF file');
      return;
    }

    if (!quizTitle.trim()) {
      setError('Please enter a quiz title');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('title', quizTitle);
      formData.append('pdf', selectedFile); 

      const response = await axios.post(`${backendURL}protected/generateQuiz`, formData, {
        withCredentials: true,
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

  
      console.log('Generated quiz:', response.data.quiz);
      handelNavigateToQuiz(response.data.quiz);
      // Reset the form
      setQuizTitle('');
      setSelectedFile(null);
      
      // You might want to do something with the quiz data here
      // For example, redirect to the quiz page or show a success message
      
    } catch (err) {
      console.error('Error:', err);
      setError(err.response?.data?.message || err.message || 'An error occurred');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center mb-6 text-gray-800">Create a New Quiz</h2>
      
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="quizTitle" className="block text-sm font-medium text-gray-700 mb-1">
            Quiz Title
          </label>
          <input
            type="text"
            id="quizTitle"
            value={quizTitle}
            onChange={(e) => setQuizTitle(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            placeholder="Enter quiz title"
          />
        </div>

        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Upload PDF
          </label>
          <div
            className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer ${
              isDragging ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
            } ${selectedFile ? 'bg-green-50' : ''}`}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById('fileInput').click()}
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
                <p className="text-sm font-medium text-gray-900">{selectedFile.name}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                </p>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <Upload className="h-12 w-12 text-gray-400 mb-2" />
                <p className="text-sm font-medium text-gray-700">
                  Drag and drop your PDF here, or click to browse
                </p>
                <p className="text-xs text-gray-500 mt-1">PDF files only</p>
              </div>
            )}
          </div>
        </div>

        {error && (
          <div className="mb-4 p-2 bg-red-50 border border-red-200 rounded text-red-600 text-sm">
            {error}
          </div>
        )}

        <button
          type="submit"
          disabled={isLoading}
          className={`w-full py-2 px-4 rounded-md font-medium text-white ${
            isLoading ? 'bg-blue-400 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'
          } transition-colors flex items-center justify-center`}
        >
          {isLoading ? (
            <>
              <Loader className="animate-spin mr-2 h-4 w-4" />
              Processing...
            </>
          ) : (
            'Generate Quiz'
          )}
        </button>
      </form>
    </div>
  );
}