"use client";

import React, { useEffect, useState } from "react";
import Container from "@/components/ui/Container";
import { motion } from "framer-motion";

const HERO_IMAGE = "/images/hero/Hero-section.jpg";

const styles: Record<string, React.CSSProperties> = {
  hero: {
    position: "relative",
    width: "100%",
    minHeight: "100vh",
    display: "flex",
    alignItems: "center",
    overflow: "hidden",
    backgroundColor: "#111", 
  },
  eyebrow: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    marginBottom: "28px",
  },
  eyebrowLine: {
    width: "32px",
    height: "1px",
    backgroundColor: "#C9A84C",
    flexShrink: 0,
  },
  eyebrowText: {
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.2em",
    textTransform: "uppercase" as const,
    color: "#C9A84C",
  },
  headline: {
    fontFamily: "'Playfair Display', serif",
    lineHeight: 1.08,
    color: "#fbf3e4",
    fontWeight: 700,
    margin: 0,
    letterSpacing: "-0.01em",
  },
  headlineItalic: {
    fontStyle: "italic",
    fontWeight: 400,
    color: "rgba(255,255,255,0.92)",
    display: "block",
  },
  taglineWrap: {
    display: "flex",
    alignItems: "flex-start",
    gap: "16px",
    margin: "24px 0 36px",
  },
  taglineBar: {
    width: "3px",
    minHeight: "52px",
    backgroundColor: "#C9A84C",
    flexShrink: 0,
    marginTop: "2px",
  },
  taglineText: {
    fontSize: "15px",
    fontWeight: 400,
    color: "rgba(255,255,255,0.85)",
    lineHeight: 1.7,
    maxWidth: "440px",
    margin: 0,
  },
  buttons: {
    display: "flex",
    gap: "20px",
    flexWrap: "wrap" as const,
  },
  btnPrimary: {
    display: "inline-block",
    padding: "14px 32px",
    backgroundColor: "#C9A84C",
    color: "#111",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    cursor: "pointer",
    border: "none",
    fontFamily: "'Montserrat', sans-serif",
    transition: "background 0.2s, transform 0.15s",
  },
  btnSecondary: {
    display: "inline-block",
    padding: "13px 32px",
    backgroundColor: "transparent",
    color: "#fff",
    fontSize: "11px",
    fontWeight: 700,
    letterSpacing: "0.12em",
    textTransform: "uppercase" as const,
    textDecoration: "none",
    cursor: "pointer",
    borderWidth: "1px",
    borderStyle: "solid",
    borderColor: "rgba(255,255,255,0.4)",
    fontFamily: "'Montserrat', sans-serif",
    transition: "border-color 0.2s, background 0.2s",
  },
};

const HeroSection: React.FC = () => {
  const [isClient, setIsClient] = useState(false);
  const [primaryHover, setPrimaryHover] = React.useState(false);
  const [secondaryHover, setSecondaryHover] = React.useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  return (
    <motion.section
      style={styles.hero}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 1.2 }}
    >
      {/* 1. Cinematic Zoom Background Image */}
      <motion.div
        animate={{ scale: [1, 1.1] }}
        transition={{ duration: 25, ease: "linear", repeat: Infinity, repeatType: "mirror" }}
        style={{
          position: "absolute",
          inset: -20, // Negative inset to prevent edge clipping during zoom
          backgroundImage: `url(${HERO_IMAGE})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          zIndex: 0,
        }}
      />

      {/* 2. Dark Luxury Overlay */}
      <div style={{ position: "absolute", inset: 0, backgroundColor: "rgba(10, 8, 6, 0.65)", zIndex: 1 }} />

      {/* 3. Ambient Gold Dust Particles */}
      <div style={{ position: "absolute", inset: 0, overflow: "hidden", pointerEvents: "none", zIndex: 2 }}>
        {isClient && [...Array(15)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: "100vh", opacity: 0 }}
            animate={{
              y: ["100vh", "-10vh"],
              opacity: [0, 0.6, 0],
              x: [0, Math.sin(i) * 60, 0]
            }}
            transition={{
              duration: 12 + Math.random() * 15,
              repeat: Infinity,
              ease: "linear",
              delay: Math.random() * 8
            }}
            style={{
              position: "absolute",
              left: `${Math.random() * 100}%`,
              width: `${2 + Math.random() * 3}px`,
              height: `${2 + Math.random() * 3}px`,
              backgroundColor: "#E8C96A",
              borderRadius: "50%",
              boxShadow: "0 0 10px 2px rgba(232, 201, 106, 0.4)",
            }}
          />
        ))}
      </div>

      {/* 4. Text Content */}
      <Container className="relative z-10 pt-28 sm:pt-32">
        <div className="max-w-200 max-sm:max-w-[90%]">
          {/* Eyebrow */}
          <motion.div 
            style={styles.eyebrow}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
          >
            <div style={styles.eyebrowLine} />
            <span style={styles.eyebrowText}>Elevate Your Career</span>
          </motion.div>

          {/* Headline */}
          <motion.h1 
            style={styles.headline}
            className="text-[56px] leading-[0.92] tracking-[-0.03em] sm:text-5xl md:text-6xl xl:text-7xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
          >
            Together We Create 
            <span style={styles.headlineItalic}>SBS Prospects</span>
          </motion.h1>

          {/* Tagline */}
          <motion.div 
            style={styles.taglineWrap} className="mt-8 mb-10 md:mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            <div style={styles.taglineBar} />
            <p style={styles.taglineText} className="text-sm md:text-base">
              SBS Prospects provides professional industry training programs, 
              HR consultancy services, and career-focused courses for students and professionals.
            </p>
          </motion.div>

          {/* Buttons */}
          <motion.div 
            style={styles.buttons} className="flex flex-col sm:flex-row gap-4 w-full"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
          >
            <a
              href="#"
              style={{
                ...styles.btnPrimary,
                ...(primaryHover
                  ? { backgroundColor: "#E8C96A", transform: "translateY(-2px)", boxShadow: "0 10px 25px rgba(201,168,76,0.3)" }
                  : {}),
              }}
              onMouseEnter={() => setPrimaryHover(true)}
              onMouseLeave={() => setPrimaryHover(false)}
            >
              Explore Training Programs 
            </a>
            <a
              href="/contact"
              style={{
                ...styles.btnSecondary,
                ...(secondaryHover
                  ? {
                      borderColor: "#C9A84C",
                      color: "#C9A84C",
                      backgroundColor: "rgba(201,168,76,0.05)",
                      transform: "translateY(-2px)"
                    }
                  : {}),
              }}
              onMouseEnter={() => setSecondaryHover(true)}
              onMouseLeave={() => setSecondaryHover(false)}
            >
              Book Career Consultation 
            </a>
          </motion.div>
        </div>
      </Container>
    </motion.section>
  );
};

export default HeroSection;