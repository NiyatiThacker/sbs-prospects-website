"use client";

import { motion } from "framer-motion";

export default function AboutHero() {
  return (
    <section 
      className="relative min-h-[90vh] flex flex-col items-center justify-center text-center px-6 pt-36 pb-0  overflow-hidden"
      style={{
        // 1. ADD YOUR IMAGE PATH HERE (e.g., "/images/about-bg.jpg")
        marginTop: "65px",
        backgroundImage: "url('/images/services section/hero bg.png')", 
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* 2. DARK OVERLAY (Ensures text is highly readable) */}
      <div className="absolute inset-0 bg-[#0A0C14]/75 z-0" />

      {/* 3. CONTENT CONTAINER (Raised above the overlay) */}
      <div className="relative z-10 flex flex-col items-center justify-center">
        
        {/* Eyebrow */}
        <motion.p
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
          className="font-inter text-[0.6rem] tracking-[0.38em] uppercase text-[#C4A052] font-normal mb-10"
        >
          Boutique Wealth Advisory
        </motion.p>

        {/* Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
          className="font-playfair font-black text-[#F5F0E8] leading-[1.06] mb-8 max-w-3xl"
          style={{ fontSize: "clamp(2.8rem, 6.5vw, 5rem)" }}
        >
          Preserving legacies
          <br />
          through
          <br />
          <em className="italic text-[#C4A052] not-italic" style={{ fontStyle: "italic" }}>
            uncompromised
          </em>
          <br />
          counsel.
        </motion.h1>

        {/* Body */}
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.35, ease: [0.22, 1, 0.36, 1] }}
          className="font-inter text-[0.95rem] text-[#9A9085] leading-[1.8] max-w-md"
        >
          We deliver conflict-free, institutional-grade wealth management for
          families and institutions who demand transparency and absolute
          performance.
        </motion.p>

      </div>
    </section>
  );
}