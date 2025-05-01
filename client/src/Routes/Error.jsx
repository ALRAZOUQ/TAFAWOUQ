import { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useAuth } from "../context/authContext";

export default function Error404Page() {
  const { user, isAuthorized } = useAuth();
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10);

  // Determine the correct home page based on user role
  const homePath = user ? (user.isAdmin ? "/admin/admin-home" : "/home") : "/";

  // Auto-redirect after countdown
  useEffect(() => {
    if (countdown <= 0) {
      navigate(homePath);
      return;
    }

    const timer = setTimeout(() => {
      setCountdown((prev) => prev - 1);
    }, 1000);

    return () => clearTimeout(timer);
  }, [countdown, navigate, homePath]);
  // bg-gradient-to-b from-TAF-200 via-white to-TAF-200
  return (
    <div className="min-h-screen flex flex-col items-center justify-center  p-4">
      <div className="max-w-md w-full bg-white rounded-xl shadow-2xl overflow-hidden relative p-8">
        {/* Animated elements */}
        <motion.div
          className="absolute top-0 left-0 w-full h-1 bg-TAF-100"
          initial={{ width: 0 }}
          animate={{ width: "100%" }}
          transition={{ duration: 10 }}
        />

        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-center">
          <motion.div
            animate={{
              rotate: [0, 5, -5, 5, 0],
            }}
            transition={{
              duration: 1.5,
              repeat: Infinity,
              repeatType: "reverse",
            }}
            className="w-40 h-40 mx-auto mb-6">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 200 200" className="w-full h-full">
              <circle cx="100" cy="100" r="95" fill="white" stroke="#0b8eca" strokeWidth="6" />
              <motion.text
                x="50%"
                y="50%"
                dominantBaseline="middle"
                textAnchor="middle"
                fontSize="48"
                fontWeight="bold"
                fill="#0b8eca"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ delay: 0.3, duration: 0.5 }}>
                404
              </motion.text>
            </svg>
          </motion.div>

          <motion.h1
            className="text-2xl font-bold text-gray-800 mb-2"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2, duration: 0.5 }}>
            الصفحة غير موجودة
          </motion.h1>

          <motion.p
            className="text-gray-600 mb-6 text-lg"
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4, duration: 0.5 }}>
            المعذرة لم نجد الصفحة التي تبحث عنها
          </motion.p>

          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <motion.div
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}>
              <Link
                to={homePath}
                className="bg-TAF-100 hover:bg-TAF-200 text-white font-bold py-3 px-6 rounded-lg transition-all duration-300 inline-block">
                العودة للصفحة الرئيسية
              </Link>
            </motion.div>

            {isAuthorized && (
              <motion.div
                initial={{ y: 20, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.7, duration: 0.5 }}>
                <button
                  onClick={() => navigate(-1)}
                  className="border-2 border-TAF-100 text-TAF-100 hover:bg-TAF-100 hover:text-white font-bold py-3 px-6 rounded-lg transition-all duration-300">
                  الرجوع للصفحة السابقة
                </button>
              </motion.div>
            )}
          </div>

          <motion.p
            className="text-gray-500 mt-6 text-sm"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.5 }}>
            سيتم توجيهك تلقائياً خلال {countdown} ثواني
          </motion.p>
        </motion.div>
      </div>

      {/* Animated background elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {[...Array(10)].map((_, i) => (
          <motion.div
            key={i}
            className="absolute rounded-full bg-TAF-100 opacity-10"
            style={{
              width: Math.random() * 100 + 50,
              height: Math.random() * 100 + 50,
              top: `${Math.random() * 100}%`,
              left: `${Math.random() * 100}%`,
            }}
            animate={{
              y: [0, -20, 0],
              x: [0, Math.random() * 20 - 10, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: Math.random() * 5 + 3,
              repeat: Infinity,
              repeatType: "reverse",
            }}
          />
        ))}
      </div>
    </div>
  );
}
