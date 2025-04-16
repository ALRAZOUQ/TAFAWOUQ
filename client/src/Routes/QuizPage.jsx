import React, { useState, useEffect } from "react";
import Screen from "../components/Screen";
import { useParams, useNavigate ,useLocation } from "react-router-dom";
import axios from "../api/axios";
import InteractiveQuiz from "../components/InteractiveQuiz";
import { toast } from "react-toastify";
import  Page  from "../components/Page";

export default function QuizPage() {
    const { quizId } = useParams();
    const navigate = useNavigate();
    const [quiz, setQuiz] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const location = useLocation();
    const { quizData } = location.state || {}; // to retreve quiz data from url
    // API Calls
    const fetchQuiz = async () => {
        setLoading(true);
        try {
            const response = await axios.get(`protected/getQuiz/${quizId}`);
            if (response.status === 200) {
                console.log(response.data.quiz);
                setQuiz(response.data.quiz);
                setError(null);
                return true;
            }
        } catch (error) {
            if (error.response?.status === 404) {
                toast.error("الكويز غير موجود");
                setTimeout(() => navigate("/home"), 0); // Defer navigation
                setError("Quiz not found");
                return false;
            }
            setError("Error loading quiz");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (!quizData) {
            // No quiz data from navigation state, fetch from API
            fetchQuiz();
        } else {
            // Quiz data available from navigation state, use it directly it will happen we the user genrate the quiz(first time)
            console.log("quiz data available from navigation state",quizData)
            setQuiz(quizData);
            setLoading(false); 
        }
    }, [quizId, quizData]); 

    console.log(quiz);

    return (
        <Screen className={`p-4`} title="Quiz">
        <Page> {loading ? (
                <div className="flex justify-center items-center h-64">
                    <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-blue-500"></div>
                </div>
            ) : error ? (
                <div className="text-center text-red-500 p-4">
                    {error}
                </div>
            ) : quiz ? (
                <InteractiveQuiz quizData={quiz} />
            ) : (
                <div className="text-center p-4">
                    لا يوجد كويز
                </div>
            )}</Page>
           
           
        </Screen>
    );
}
