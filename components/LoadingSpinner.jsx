"use client";

import { motion } from "framer-motion";

export default function LoadingSpinner() {
  return (
    <motion.div
      className="flex items-center justify-center h-64"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
    >
      <motion.div
        className="w-12 h-12 border-4 border-t-4 border-t-white border-gray-500 rounded-full"
        animate={{ rotate: 360 }}
        transition={{ ease: "linear", repeat: Infinity, duration: 1 }}
      />
    </motion.div>
  );
}