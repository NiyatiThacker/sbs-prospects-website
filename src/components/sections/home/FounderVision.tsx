"use client";
import React, { useRef, useEffect, useState } from "react";
import Image from "next/image";
import { motion, useInView } from "framer-motion";

const CREDENTIALS = [
  { value: "SEBI", label: "Registered Advisor" },
  { value: "6+",  label: "Years of Experience" },
  { value: "NISM", label: "Certified Planner" },
  { value: "AIF",  label: "Wealth Specialist" },
];

const PILLARS = [
  {
    icon: "◈",
    title: "Discipline",
    desc: "Every portfolio is guided by a structured process—no shortcuts, no speculation.",
  },
  {
    icon: "◈",
    title: "Transparency",
    desc: "We communicate clearly. You always know what is happening with your money and why.",
  },
  {
    icon: "◈",
    title: "Legacy",
    desc: "Wealth built for one generation becomes the foundation for the next.",
  },
];

export default function FounderVision() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: "-80px 0px" });

  return (
    <section
      ref={ref}
      className="relative w-full overflow-hidden"
      style={{ background: "#0C0B08" }}
    >
      {/* ── TOP GOLD RULE ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C 40%, #C9A84C 60%, transparent)" }} />

      <div className="max-w-[90rem] mx-auto px-6 lg:px-16 py-20 lg:py-32">

        {/* ═══════════════════════════════════
            TOP LABEL
        ═══════════════════════════════════ */}
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
          className="flex items-center gap-4 mb-16 lg:mb-24"
        >
          <div style={{ width: 32, height: 1, background: "#C9A84C", opacity: 0.5 }} />
          <span style={{ fontSize: 11, letterSpacing: "0.28em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600 }}>
            The Founder
          </span>
        </motion.div>

        {/* ═══════════════════════════════════
            MAIN GRID:  IMAGE  |  CONTENT
        ═══════════════════════════════════ */}
        <div className="grid grid-cols-1 lg:grid-cols-[5fr_7fr] gap-12 lg:gap-20 items-start">

          {/* ── LEFT: Portrait Column ── */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            className="relative w-full"
          >
            {/* Portrait frame */}
            <div className="relative w-full" style={{ aspectRatio: "4/5", maxWidth: 400, margin: "0 auto" }}>
              {/* Gold corner brackets */}
              <div style={{ position: "absolute", top: -8, left: -8, width: 32, height: 32, borderTop: "1.5px solid #C9A84C", borderLeft: "1.5px solid #C9A84C", zIndex: 10, pointerEvents: "none" }} />
              <div style={{ position: "absolute", top: -8, right: -8, width: 32, height: 32, borderTop: "1.5px solid #C9A84C", borderRight: "1.5px solid #C9A84C", zIndex: 10, pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -8, left: -8, width: 32, height: 32, borderBottom: "1.5px solid #C9A84C", borderLeft: "1.5px solid #C9A84C", zIndex: 10, pointerEvents: "none" }} />
              <div style={{ position: "absolute", bottom: -8, right: -8, width: 32, height: 32, borderBottom: "1.5px solid #C9A84C", borderRight: "1.5px solid #C9A84C", zIndex: 10, pointerEvents: "none" }} />

              {/* Image */}
              <div style={{ position: "absolute", inset: 0, overflow: "hidden", borderRadius: 2 }}>
                <Image
                  src="/images/about/founder.jpg"
                  alt="Mr. Urval Shah — Founder"
                  fill
                  style={{ objectFit: "cover", objectPosition: "center top", filter: "grayscale(30%) contrast(1.05)" }}
                  sizes="(max-width: 768px) 100vw, 400px"
                  priority
                />
                {/* Bottom fade into black */}
                <div style={{
                  position: "absolute", bottom: 0, left: 0, right: 0, height: "45%",
                  background: "linear-gradient(to top, #0C0B08 0%, transparent 100%)",
                  zIndex: 3
                }} />
              </div>

              {/* Name overlay at bottom */}
              <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, zIndex: 5, padding: "24px 20px", textAlign: "center" }}>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#F5F0E8", marginBottom: 4 }}>
                  Mr. Urval Shah
                </div>
                <div style={{ fontSize: 9, letterSpacing: ".22em", textTransform: "uppercase", color: "#C9A84C" }}>
                  Founder & Managing Director
                </div>
              </div>
            </div>

            {/* Credentials grid below portrait */}
            <div className="grid grid-cols-2 gap-px mt-8 lg:mt-10" style={{ background: "rgba(201,168,76,0.12)", borderRadius: 2, overflow: "hidden" }}>
              {CREDENTIALS.map((c, i) => (
                <motion.div
                  key={c.value}
                  initial={{ opacity: 0 }}
                  animate={inView ? { opacity: 1 } : {}}
                  transition={{ duration: 0.5, delay: 0.6 + i * 0.1 }}
                  style={{
                    background: "rgba(15,13,9,0.95)",
                    padding: "20px 16px",
                    textAlign: "center",
                  }}
                >
                  <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 22, fontWeight: 700, color: "#C9A84C", marginBottom: 4 }}>
                    {c.value}
                  </div>
                  <div style={{ fontSize: 9, letterSpacing: ".18em", textTransform: "uppercase", color: "#6E6860" }}>
                    {c.label}
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>

          {/* ── RIGHT: Vision Letter ── */}
          <div className="flex flex-col justify-start pt-0 lg:pt-4">
            
            {/* Heading */}
            <motion.h2
              initial={{ opacity: 0, y: 24 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              style={{
                fontFamily: "'Playfair Display', serif",
                fontSize: "clamp(36px, 5vw, 58px)",
                fontWeight: 700,
                color: "#F5F0E8",
                lineHeight: 1.12,
                marginBottom: 20,
                letterSpacing: "-0.01em",
              }}
            >
              My Vision For<br />
              <em style={{ color: "#C9A84C", fontWeight: 400 }}>Your Wealth.</em>
            </motion.h2>

            {/* Gold divider */}
            <motion.div
              initial={{ scaleX: 0, originX: 0 }}
              animate={inView ? { scaleX: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.3 }}
              style={{ height: 1, background: "linear-gradient(90deg, #C9A84C 0%, transparent 80%)", marginBottom: 32, width: "100%" }}
            />

            {/* Letter body */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.35 }}
              style={{ marginBottom: 36 }}
            >
              <p style={{ fontSize: 15, color: "#8E877E", lineHeight: 1.85, marginBottom: 16 }}>
                When I founded SBS Financial Services, I had one goal: to build a firm where every client is treated as a partner—not a portfolio number. I believe that great financial planning is born from trust, shaped by discipline, and sustained through transparency.
              </p>
              <p style={{ fontSize: 15, color: "#8E877E", lineHeight: 1.85 }}>
                Wealth creation is not just about market returns. It is about building a framework that weathers every economic cycle, protects what you have built, and leaves a lasting legacy for the people you love.
              </p>
            </motion.div>

            {/* Three Pillars */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.8, delay: 0.5 }}
              className="space-y-5 mb-12"
            >
              {PILLARS.map((p, i) => (
                <div
                  key={p.title}
                  style={{
                    display: "flex",
                    gap: 16,
                    alignItems: "flex-start",
                    paddingBottom: 20,
                    borderBottom: i < PILLARS.length - 1 ? "1px solid rgba(201,168,76,0.08)" : "none",
                  }}
                >
                  <span style={{ color: "#C9A84C", fontSize: 14, marginTop: 2, flexShrink: 0 }}>{p.icon}</span>
                  <div>
                    <div style={{ fontSize: 11, letterSpacing: ".18em", textTransform: "uppercase", color: "#C9A84C", fontWeight: 600, marginBottom: 6 }}>{p.title}</div>
                    <div style={{ fontSize: 14, color: "#6E6860", lineHeight: 1.7 }}>{p.desc}</div>
                  </div>
                </div>
              ))}
            </motion.div>

            {/* Signature block */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={inView ? { opacity: 1 } : {}}
              transition={{ duration: 0.7, delay: 0.7 }}
              className="flex items-center gap-8"
            >
              {/* Animated SVG Signature */}
              <div style={{ flexShrink: 0 }}>
                <svg viewBox="0 0 220 72" width="180" height="60" fill="none" strokeLinecap="round" strokeLinejoin="round">
                  <motion.path
                    stroke="#C9A84C"
                    strokeWidth="2"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 2.5, delay: 0.9, ease: "easeInOut" }}
                    d="M12 56 C12 28, 28 8, 38 18 C48 28, 40 56, 30 56 C20 56, 10 44, 18 34 C26 24, 54 14, 62 14
                       M70 34 C78 14, 96 14, 92 34 C88 54, 70 54, 80 34 C90 14, 112 14, 120 16
                       M130 16 C122 52, 134 60, 144 44
                       M156 26 C148 58, 164 60, 172 28
                       M180 22 L204 22 C196 42, 210 52, 218 38"
                  />
                  <motion.line
                    stroke="#C9A84C"
                    strokeWidth="1"
                    strokeOpacity={0.4}
                    x1="8" y1="68" x2="212" y2="68"
                    initial={{ pathLength: 0 }}
                    animate={inView ? { pathLength: 1 } : { pathLength: 0 }}
                    transition={{ duration: 1, delay: 3.4, ease: "easeInOut" }}
                  />
                </svg>
              </div>

              {/* Attribution */}
              <div>
                <div style={{ fontFamily: "'Playfair Display', serif", fontSize: 17, fontWeight: 600, color: "#F5F0E8", marginBottom: 4 }}>
                  Mr. Urval Shah
                </div>
                <div style={{ fontSize: 9, letterSpacing: ".2em", textTransform: "uppercase", color: "#6E6860" }}>
                  Founder & Managing Director
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </div>

      {/* ── BOTTOM GOLD RULE ── */}
      <div style={{ height: 1, background: "linear-gradient(90deg, transparent, #C9A84C 40%, #C9A84C 60%, transparent)" }} />
    </section>
  );
}
