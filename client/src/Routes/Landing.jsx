import { Link } from "react-router-dom";
import main_logo from "../assets/mainLogo.svg";
import { motion } from "framer-motion";
import { features } from "../non-changeable-data/features.jsx";
import { useState, useEffect } from "react";
const Texts=["شارك","تعلم"," انطلق نحو النجاح","تعاون"];
export default function Landing() {
  const [buttonText, setButtonText] = useState("ساهم");
  const [textIndex, setTextIndex] = useState(0);
  const [dotPosition, setDotPosition] = useState(0);

  // Effect to cycle through the Texts array
  useEffect(() => {
    const textInterval = setInterval(() => {
      setTextIndex((prevIndex) => (prevIndex + 1) % Texts.length);
      setButtonText(Texts[textIndex]);
    }, 2000);

    return () => clearInterval(textInterval);
  }, [textIndex]);

  // Effect for the dot animation
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotPosition((prevPos) => (prevPos + 1) % 360);
    }, 30);

    return () => clearInterval(dotInterval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200 text-gray-800 min-h-screen flex flex-col items-center justify-center p-6 mt-0 font-alm">
      <div className="w-full max-w-[400px] min-w-[100px] mx-auto mt-12">
        <motion.img
          loading="lazy"
          src={main_logo}
          alt="KSU logo"
          className="w-full h-auto"
          animate={{ y: [0, -10, 0] }} // Moves up and down
          transition={{
            duration: 2.5, // 1.5 second for a full cycle
            repeat: Infinity, // Loops forever
            ease: "easeInOut", // Smooth easing
          }}
        />
      </div>

      <p className="text-center mb-10 text-2xl font-alm">
        بيئة تفاعلية تجمع طلاب الجامعة لتبادل الخبرات والمعارف ومشاركة الآراء
        حول المسارات الدراسية والمقررات الأكاديمية.
      </p>

      <div className="flex flex-col gap-10 w-full justify-center items-center">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 shadow-lg rounded-xl px-4 py-8 flex items-center gap-4 text-xl border-x-4 border-TAF-300 w-full md:w-2/5 font-alm"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: index * 0.4 }}
          >
            {feature.icon}
            <span>{feature.text}</span>
          </motion.div>
        ))}
      </div>
      <p className="text-center text-2xl font-semibold mt-8 font-alm">
        📢 انضم إلينا الآن وساهم في بناء مجتمع طلابي أكثر تفاعلًا ونجاحًا! 💙
      </p>
      <div className="relative mt-8 mb-6">
        <motion.div 
          className="absolute w-full h-full"
          animate={{ rotate: 360 }}
          transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        >
          <div 
            className="absolute w-4 h-4 rounded-full bg-purple-500 shadow-lg shadow-TAF-100"
            style={{ 
              left: `calc(50% + ${Math.cos(dotPosition * (Math.PI / 180)) * 40}px)`,
              top: `calc(50% + ${Math.sin(dotPosition * (Math.PI / 180)) * 40}px)`,
              transform: 'translate(-50%, -50%)'
            }}
          />
        </motion.div>
        
        <motion.button
          className="relative px-8 py-4 rounded-full bg-gradient-to-r from-TAF-300 to-TAF-100 text-white font-bold text-xl shadow-lg overflow-hidden group z-10"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          transition={{ type: "spring", stiffness: 400, damping: 17 }}
        >
          <Link to="/login" className="flex items-center justify-center gap-2">
          <span className="relative z-10"> إنضم الآن و</span>
            <span className="relative z-10">{buttonText}</span>
            
            <motion.div 
              className="absolute inset-0 bg-purple-600 opacity-0 group-hover:opacity-30 transition-opacity duration-300"
              initial={{ x: "-100%" }}
              whileHover={{ x: 0 }}
              transition={{ duration: 0.4 }}
            />
          </Link>
          <motion.div 
            className="absolute -inset-1 rounded-full blur-sm bg-gradient-to-r from-TAF-100 via-purple-400 to-TAF-300 opacity-70"
            animate={{ rotate: [0, 360] }}
            transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
          />
        </motion.button>
      </div>
      <p className="text-center text-2xl font-bold mt-2 font-alm">
        ⚡ تعلم، شارك، وانطلق نحو النجاح!
      </p>
    </div>
  );
}
