"use client";

import { motion } from "framer-motion";
import { ReactNode } from "react";

interface AnimatedCardProps {
  children: ReactNode;
  className?: string;
}

export default function AnimatedCard({
  children,
  className = "",
}: AnimatedCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -4,
      }}
      transition={{
        duration: 0.3,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={`
        bg-white/70
        backdrop-blur-sm
        rounded
        ambient-shadow
        transition-all
        duration-500
        hover:-translate-y-2
        hover:bg-white
        ${className}
      `}
    >
      {children}
    </motion.div>
  );
}