import { motion } from "framer-motion";

export default function Screen({ children, className, applyAnimation = true }) {
  let motionConfig = applyAnimation
    ? {
        initial: { opacity: 0, scale: 0.95 },
        animate: { opacity: 1, scale: 1 },
        exit: { opacity: 0, scale: 0.95 },
        transition: { duration: 0.4 },
      }
    : {};
  return (
    <motion.div
      {...motionConfig}
      className={`min-h-screen max-h-max bg-gradient-to-b from-TAF-200 via-white to-TAF-200 ${className}`}
    >
      {children}
    </motion.div>
  );
}
