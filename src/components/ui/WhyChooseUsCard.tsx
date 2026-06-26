"use client";
import { motion } from "framer-motion";
import Image from "next/image";

interface ServiceCardProps {
  title: string;
  description: string;
  image: string;
}

export default function ServiceCard({ title, description, image }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{
        y: -6,
        boxShadow: "0 16px 48px rgba(233,195,73,0.25), 0 0 0 1px #e9c349",
      }}
      transition={{ duration: 0.1, ease: [0.22, 1, 0.36, 1] }}
      className="flex flex-col items-center w-full cursor-default transition-all duration-500"
      style={{
        background: "#f8f8f6",
        border: "1px solid #c9a84c",
        borderRadius: "2px",
        minHeight: "380px",
        padding: "52px 40px 48px",
        boxShadow: "0 2px 12px rgba(0,6,19,0.04)",
      }}
    >
      {/* IMAGE */}
      <motion.div
        whileHover={{ scale: 1.12, rotate: -4 }}
        transition={{ type: "spring", stiffness: 300 }}
        style={{ marginBottom: "28px" }}
        className="flex justify-center items-center"
      >
        <Image src={image} alt={title} width={80} height={80} className="object-contain" />
      </motion.div>

      {/* TITLE */}
      <h3
        className="text-center w-full"
        style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "22px",
          fontWeight: 600,
          lineHeight: 1.3,
          color: "#b8901a",
          marginBottom: "14px",
          letterSpacing: "-0.01em",
        }}
      >
        {title}
      </h3>

      {/* GOLD DIVIDER */}
      <motion.div
        whileHover={{ width: "64px" }}
        transition={{ duration: 0.4 }}
        style={{
          width: "32px",
          height: "1px",
          background: "#e9c349",
          marginBottom: "16px",
        }}
      />

      {/* DESCRIPTION */}
      <p
        className="text-center w-full"
        style={{
          fontSize: "15px",
          lineHeight: 1.8,
          color: "#6b6459",
          fontFamily: "var(--font-inter)",
        }}
      >
        {description}
      </p>
    </motion.div>
  );
}