import { Link } from "react-router-dom";
import main_logo from "../assets/mainLogo.svg";
import { motion } from "framer-motion";
import { features } from "../non-changeable-data/features.jsx";
import { useState, useEffect } from "react";
// import TafawouqMainCanvas from "../components/TAFAWOUQ-Canvas";
import Screen from "@/components/Screen";
const Texts = ["شارك", "تعلم", " انطلق نحو النجاح", "تعاون"];
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

  // Effect for the dot animation around button perimeter
  useEffect(() => {
    const dotInterval = setInterval(() => {
      setDotPosition((prevPos) => (prevPos + 1) % 400); // Using 400 steps for smoother animation
    }, 30);

    return () => clearInterval(dotInterval);
  }, []);

  // Function to calculate dot position along button perimeter
  const calculateDotPosition = (position) => {
    // Button dimensions (approximated)
    const buttonWidth = 180;
    const buttonHeight = 60;
    const borderRadius = 30; // For rounded corners

    // Adjusted dimensions for the path
    const pathWidth = buttonWidth + 20; // Slightly larger than button
    const pathHeight = buttonHeight + 20;

    // Calculate position based on which side of the rectangle
    const totalPerimeter = 2 * (pathWidth + pathHeight);
    const normalizedPos = (position / 400) * totalPerimeter;

    // Top side
    if (normalizedPos < pathWidth) {
      return {
        x: normalizedPos - pathWidth / 2,
        y: -pathHeight / 2,
      };
    }
    // Right side
    else if (normalizedPos < pathWidth + pathHeight) {
      return {
        x: pathWidth / 2,
        y: normalizedPos - pathWidth - pathHeight / 2,
      };
    }
    // Bottom side
    else if (normalizedPos < 2 * pathWidth + pathHeight) {
      return {
        x: pathWidth / 2 - (normalizedPos - pathWidth - pathHeight),
        y: pathHeight / 2,
      };
    }
    // Left side
    else {
      return {
        x: -pathWidth / 2,
        y: pathHeight / 2 - (normalizedPos - 2 * pathWidth - pathHeight),
      };
    }
  };

  return (
    <Screen>
      <div className=" text-gray-800 min-h-screen flex flex-col items-center justify-center p-6 mt-0 font-alm overflow-hidden">
        <div className="w-full max-w-[400px] min-w-[100px] mx-auto mt-12 z-[2]">
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
        <p className="text-center mb-10 text-2xl font-alm z-[2]">
          بيئة تفاعلية تجمع طلاب الجامعة لتبادل الخبرات والمعارف ومشاركة الآراء حول المسارات الدراسية
          والمقررات الأكاديمية.
        </p>

        <div className="flex flex-col gap-10 w-full justify-center items-center z-[2]">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              className="bg-gray-100 z-[2] shadow-lg rounded-xl px-4 py-8 flex items-center gap-4 text-xl border-x-4 border-TAF-300 w-full md:w-2/5 font-alm"
              initial={{ opacity: 0, y: 50 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.4 }}>
              {feature.icon}
              <span>{feature.text}</span>
            </motion.div>
          ))}
        </div>
        <p className="text-center text-2xl z-[2] font-semibold mt-8 font-alm">
          📢 انضم إلينا الآن وساهم في بناء مجتمع طلابي أكثر تفاعلًا ونجاحًا! 💙
        </p>
        <div className="relative z-[2] mt-8 mb-6">
          <motion.div
            className="absolute z-[2] w-full h-full"
            animate={{ rotate: 360 }}
            transition={{ duration: 8, repeat: Infinity, ease: "linear" }}>
            <div
              className="absolute w-4 h-4 rounded-full z-[2] bg-TAF-100 shadow-lg shadow-TAF-100"
              style={{
                left: `calc(50% + ${calculateDotPosition(dotPosition).x}px)`,
                top: `calc(50% + ${calculateDotPosition(dotPosition).y}px)`,
                transform: "translate(-50%, -50%)",
              }}
            />
          </motion.div>

          <motion.button
            className="relative px-8 py-4 rounded-full bg-gradient-to-r z-[2] from-TAF-300 to-TAF-100 text-white font-bold text-xl shadow-lg overflow-hidden group"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            transition={{ type: "spring", stiffness: 400, damping: 17 }}>
            <Link to="/login" className="flex items-center z-[2] justify-center gap-2">
              <span className="relative z-10"> إنضم الآن و</span>
              <span className="relative z-10">{buttonText}</span>

              <motion.div
                className="absolute inset-0 bg-gray-600 opacity-0 z-[2] group-hover:opacity-30 transition-opacity duration-300"
                initial={{ x: "-100%" }}
                whileHover={{ x: 0 }}
                transition={{ duration: 0.4 }}
              />
            </Link>
            <motion.div
              className="absolute -inset-1 rounded-full blur-sm z-[2] bg-gradient-to-l from-TAF-100 via-gray-400 to-TAF-100 opacity-70"
              animate={{ rotate: [0, 360] }}
              transition={{ duration: 3, repeat: Infinity, ease: "linear" }}
            />
          </motion.button>
        </div>
        <p className="text-center text-2xl z-[2] font-bold mt-2 font-alm">
          ⚡ تعلم، شارك، وانطلق نحو النجاح!
        </p>
      </div>
    </Screen>
  );
}
