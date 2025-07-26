import React from "react";
import { motion } from "framer-motion";

const AnimatedText3 = ({ text = "" }) => {
  return (
    <motion.span
      style={{
        display: "inline-block",
        whiteSpace: "normal",
        overflow: "visible",
        wordBreak: "break-word",
      }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      {text}
    </motion.span>
  );
};

export default AnimatedText3;
