// 📁 src/components/LoadingPreview.jsx
import React from "react";
import { motion } from "framer-motion";

const LoadingPreview = () => {
  return (
    <div className="w-1/3 h-full bg-white flex flex-col items-center justify-center">
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ repeat: Infinity, repeatType: "reverse", duration: 0.8 }}
        className="text-xl font-semibold text-blue-700"
      >
        Analyzing...
      </motion.div>
      <motion.div
        className="w-10 h-10 mt-4 border-4 border-blue-600 border-t-transparent rounded-full"
        animate={{ rotate: 360 }}
        transition={{ repeat: Infinity, duration: 1, ease: "linear" }}
        style={{ borderTopColor: "transparent", borderRadius: "50%" }}
      />
    </div>
  );
};

export default LoadingPreview;
