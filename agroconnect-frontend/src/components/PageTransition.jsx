import { motion } from "framer-motion";

const transition = {
  duration: 0.35,
  ease: [0.22, 1, 0.36, 1],
};

export default function PageTransition({ children, className = "" }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 28 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -18 }}
      transition={transition}
      className={className}
    >
      {children}
    </motion.div>
  );
}
