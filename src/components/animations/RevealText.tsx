"use client";

import { motion } from "framer-motion";

interface RevealTextProps {
  text: string;
  className?: string;
}

export default function RevealText({
  text,
  className = "",
}: RevealTextProps) {
  const words = text.split(" ");

  return (
    <div
      className={`
        flex
        flex-wrap
        overflow-hidden
        ${className}
      `}
    >
      {words.map((word, index) => (
        <motion.span
          key={index}
          initial={{
            opacity: 0,
            y: 50,
          }}
          animate={{
            opacity: 1,
            y: 0,
          }}
          transition={{
            duration: 1,
            delay: index * 0.08,
            ease: [0.22, 1, 0.36, 1],
          }}
          className="mr-3"
        >
          {word}
        </motion.span>
      ))}
    </div>
  );
}