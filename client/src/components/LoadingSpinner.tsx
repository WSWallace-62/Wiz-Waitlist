import { motion } from "framer-motion";

interface LoadingSpinnerProps {
  size?: number;
}

export default function LoadingSpinner({ size = 40 }: LoadingSpinnerProps) {
  return (
    <div className="relative" style={{ width: size, height: size }}>
      {/* Outer circle - avocado skin */}
      <motion.div
        className="absolute inset-0 rounded-full bg-green-800"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [0.8, 1, 0.8],
          opacity: [0.5, 1, 0.5],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Inner circle - avocado flesh */}
      <motion.div
        className="absolute inset-2 rounded-full bg-green-300"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{
          scale: [1, 0.8, 1],
          opacity: [1, 0.5, 1],
        }}
        transition={{
          duration: 1.5,
          repeat: Infinity,
          ease: "easeInOut",
        }}
      />
      
      {/* Center pit */}
      <motion.div
        className="absolute rounded-full bg-amber-800"
        style={{
          inset: '35%',
        }}
        animate={{
          rotate: 360,
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "linear",
        }}
      />
    </div>
  );
}
