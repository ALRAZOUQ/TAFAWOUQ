import { motion } from "framer-motion";

export default function LoadingScreen() {
  let circleCommonClasses = "h-12 w-12 bg-TAF-100 rounded-full mx-6";

  const containerVariants = {
    initial: { opacity: 0 },
    animate: { 
      opacity: 1,
      transition: { 
        staggerChildren: 0.2,
        delayChildren: 0.3
      }
    }
  };

  const circleVariants = {
    initial: { y: 0 },
    animate: { 
      y: [-20, 0, -20],
      transition: {
        repeat: Infinity,
        duration: 1.5,
        ease: "easeInOut"
      }
    }
  };

  return (
    <motion.div 
      className="h-screen w-full flex justify-center items-center bg-gradient-to-b from-TAF-200 via-gray-50 to-TAF-200"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="flex space-x-4"
        variants={containerVariants}
        initial="initial"
        animate="animate"
      >
        <motion.div 
          className={circleCommonClasses}
          variants={circleVariants}
        ></motion.div>
        <motion.div 
          className={circleCommonClasses}
          variants={circleVariants}
        ></motion.div>
        <motion.div 
          className={circleCommonClasses}
          variants={circleVariants}
        ></motion.div>
      </motion.div>
    </motion.div>
  );
}
