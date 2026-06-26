"use client";

import { motion } from "framer-motion";
import { ReactNode, CSSProperties } from "react";


interface FadeInUpProps {
  children: ReactNode;
  delay?: number;
  className?: string;
  style?: CSSProperties;
}

export default function FadeInUp({
  children,
  delay = 0,
  className = "",
  style,
}: FadeInUpProps) {
  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 40,
      }}
      whileInView={{
        opacity: 1,
        y: 0,
      }}
      viewport={{
        once: true,
        amount: 0.2,
      }}
      transition={{
        duration: 1.1,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      style={style} 
    >
      {children}
    </motion.div>
  );
}