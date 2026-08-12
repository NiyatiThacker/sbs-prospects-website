"use client";

import { useEffect, useState } from "react";
import { motion, Variants } from "framer-motion";

export default function ServicesHero() {
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 50, damping: 15 } }
  };

  return (
    <section
      style={{
        backgroundColor: "#1e1b13",
        backgroundImage: "radial-gradient(circle at top, rgba(255,248,239,0.08) 0%, transparent 60%), radial-gradient(circle at bottom right, rgba(233,195,73,0.1) 0%, transparent 50%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        fontFamily: "'Inter', sans-serif",
        position: "relative",
        overflow: "hidden"
      }}
    >
      {/* Background Scrolling Marquee */}
      <div style={{ position: "absolute", top: "50%", left: 0, width: "100%", transform: "translateY(-50%)", zIndex: 0, overflow: "hidden", pointerEvents: "none", opacity: 0.04 }}>
        <motion.div
          animate={{ x: ["0%", "-50%"] }}
          transition={{ repeat: Infinity, ease: "linear", duration: 30 }}
          style={{ display: "flex", whiteSpace: "nowrap" }}
        >
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "15vw", fontWeight: 900, color: "#FFFFFF", margin: 0, paddingRight: "5vw" }}>
            CAREER SUPPORT • HR CONSULTANCY • TRAINING PROGRAMS • 
          </h1>
          <h1 style={{ fontFamily: "'Playfair Display', serif", fontSize: "15vw", fontWeight: 900, color: "#FFFFFF", margin: 0, paddingRight: "5vw" }}>
            CAREER SUPPORT • HR CONSULTANCY • TRAINING PROGRAMS • 
          </h1>
        </motion.div>
      </div>

      {/* Floating Ambient Particles (Gold Dust) */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 1 }}>
        {isClient && [...Array(12)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{
              y: ["100vh", "-10vh"],
              opacity: [0, 0.8, 0],
              x: [0, Math.sin(i) * 50, 0]
            }}
            transition={{
              duration: 10 + Math.random() * 10,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 5
            }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: "#e9c349",
              borderRadius: "50%",
              boxShadow: "0 0 8px 1px rgba(233,195,73,0.5)",
            }}
          />
        ))}
      </div>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="show"
        style={{ position: "relative", zIndex: 10, display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        {/* Eyebrow */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#e9c349",
            fontWeight: 500,
            marginBottom: "24px",
          }}
        >
          Our Services
        </motion.p>

        {/* Main Headline */}
        <motion.h1
          variants={itemVariants}
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.5rem, 6vw, 9rem)",
            fontWeight: 900,
            color: "#FFFFFF",
            lineHeight: 1.0,
            margin: "0 0 36px 0",
            maxWidth: "960px",
          }}
        >
          Career Support
        </motion.h1>

        {/* Sub-tagline */}
        <motion.p
          variants={itemVariants}
          style={{
            fontSize: "0.6rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "rgba(255,255,255,0.68)",
            fontWeight: 400,
            marginBottom: "52px",
          }}
        >
          Equip yourself with practical skills for career growth
        </motion.p>

        {/* Pill CTA Button */}
        <motion.a
          variants={itemVariants}
          whileHover={{ scale: 1.05, backgroundColor: "rgba(233,195,73,0.15)", borderColor: "#e9c349", color: "#e9c349" }}
          whileTap={{ scale: 0.98 }}
          href="/contact"
          style={{
            backgroundColor: "rgba(0,0,0,0)",
            border: "1.5px solid rgba(255,255,255,0.72)",
            color: "#FFFFFF",
            fontSize: "0.62rem",
            letterSpacing: "0.25em",
            fontWeight: 400,
            padding: "16px 48px",
            borderRadius: "999px",
            cursor: "pointer",
            fontFamily: "'Inter', sans-serif",
            textTransform: "uppercase",
            display: "inline-flex",
            alignItems: "center",
            gap: "10px",
            textDecoration: "none",
            transition: "border-color 0.2s ease",
          }}
        >
          Let&apos;s Talk <motion.span animate={{ x: [0, 5, 0] }} transition={{ repeat: Infinity, duration: 1.5, ease: "easeInOut" }} style={{ fontSize: "0.9rem" }}>→</motion.span>
        </motion.a>
      </motion.div>
    </section>
  );
}