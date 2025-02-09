import { Link } from "react-router-dom";
import main_logo from "../assets/mainLogo.svg";
import { motion } from "framer-motion";
import { features } from "../non-changeable-data/features.jsx";

export default function Landing() {
  return (
    <div className="bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200 text-gray-800 font-sans min-h-screen flex flex-col items-center justify-center p-6 mt-0 ">
      <div className="w-full max-w-[400px] min-w-[100px] mx-auto mt-12">
        <motion.img
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

      <p className="text-center mb-10 text-2xl">
        بيئة تفاعلية تجمع طلاب الجامعة لتبادل الخبرات والمعارف ومشاركة الآراء
        حول المسارات الدراسية والمقررات الأكاديمية.
      </p>

      <div className="flex flex-col gap-10 w-full justify-center items-center">
        {features.map((feature, index) => (
          <motion.div
            key={index}
            className="bg-gray-100 shadow-lg rounded-xl px-4 py-8 flex items-center gap-4 text-xl border-x-4 border-TAF-300 w-2/5"
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

      <p className="text-center text-2xl font-semibold mt-8">
        📢 انضم إلينا الآن وساهم في بناء مجتمع طلابي أكثر تفاعلًا ونجاحًا! 💙
      </p>
      <p className="text-center text-2xl font-bold mt-2">
        ⚡ تعلم، شارك، وانطلق نحو النجاح!
      </p>
    </div>
  );
}
