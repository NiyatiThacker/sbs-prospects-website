"use client";

import { useEffect, useRef, useState } from "react";

const stats = [
  { num: "15+", label: "Years of Practice" },
  { num: "98%", label: "Client Retention" },
  { num: "₹0", label: "Hidden Commissions" },
];

const marqueeItems = [
  "INDUSTRY TRAINING PROGRAMS",
  "MBA SKILL DEVELOPMENT COURSES",
  "HR CONSULTANCY",
  "Ahmedabad",
  "6 Years",
  "CAREER GUIDANCE",
  "RECRUITMENT SUPPORT",
  "INTERNSHIP PROGRAMS",
];

export default function AboutSection() {
  const sectionRef = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) setVisible(true); },
      { threshold: 0.05 }
    );
    if (sectionRef.current) observer.observe(sectionRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <section
      ref={sectionRef}
      style={{ fontFamily: "'Outfit', sans-serif", background: "#fff8ef", overflow: "hidden", position: "relative" }}
    >
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Libre+Baskerville:ital,wght@0,700;1,400&family=Outfit:wght@300;400;500&display=swap');

        /* ── Keyframes ── */
        @keyframes sbsFadeUp {
          from { opacity: 0; transform: translateY(36px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes sbsSlideLeft {
          from { opacity: 0; transform: translateX(-48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sbsSlideRight {
          from { opacity: 0; transform: translateX(48px); }
          to   { opacity: 1; transform: translateX(0); }
        }
        @keyframes sbsFadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes sbsExpandLine {
          from { width: 0; }
          to   { width: 52px; }
        }
        @keyframes sbsBarScale {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes sbsMarquee {
          from { transform: translateX(0); }
          to   { transform: translateX(-50%); }
        }
        @keyframes sbsPulse {
          0%, 100% { opacity: 1; transform: scale(1); }
          50% { opacity: 0.3; transform: scale(0.6); }
        }
        @keyframes sbsSpin {
          to { transform: rotate(360deg); }
        }
        @keyframes sbsCountUp {
          from { opacity: 0; transform: translateY(24px); }
          to   { opacity: 1; transform: translateY(0); }
        }

        /* ── Animation classes ── */
        .sbs-fade-up     { animation: sbsFadeUp    0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .sbs-slide-left  { animation: sbsSlideLeft  1s   cubic-bezier(0.22,1,0.36,1) both; }
        .sbs-slide-right { animation: sbsSlideRight 0.8s cubic-bezier(0.22,1,0.36,1) both; }
        .sbs-fade-in     { animation: sbsFadeIn     1s   ease both; }
        .sbs-count-up    { animation: sbsCountUp    0.7s cubic-bezier(0.22,1,0.36,1) both; }
        .sbs-gold-line   { animation: sbsExpandLine 0.8s ease both; }
        .sbs-spin        { animation: sbsSpin 24s linear infinite; }
        .sbs-pulse       { animation: sbsPulse 2.2s ease infinite; }
        .sbs-marquee     { animation: sbsMarquee 22s linear infinite; white-space: nowrap; }
        .sbs-marquee:hover { animation-play-state: paused; }

        /* ── Stat top bar ── */
        .sbs-stat-bar { position: relative; }
        .sbs-stat-bar::before {
          content: '';
          position: absolute;
          top: 0; left: 0; right: 0;
          height: 2px;
          background: #7A6A1E;
          transform-origin: left;
        }
        .sbs-stat-bar-0::before { animation: sbsBarScale 0.55s ease both; animation-delay: 1.1s; }
        .sbs-stat-bar-1::before { animation: sbsBarScale 0.55s ease both; animation-delay: 1.28s; }
        .sbs-stat-bar-2::before { animation: sbsBarScale 0.55s ease both; animation-delay: 1.46s; }

        /* ── Layout: top label row ── */
        .sbs-top-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          padding: 48px 64px 0;
        }

        /* ── Layout: headline section ── */
        .sbs-headline-wrap {
          position: relative;
          padding: 52px 64px 0;
          text-align: center;
          overflow: hidden;
        }

        /* ── Layout: 3-col body ── */
        .sbs-body-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          gap: 48px;
          padding: 60px 64px 0;
          align-items: center;
        }

        /* ── Layout: stats grid ── */
        .sbs-stats-grid {
          display: grid;
          grid-template-columns: 1fr 1fr 1fr;
          margin: 60px 64px 0;
          border-top: 1px solid rgba(122,106,30,0.18);
        }

        .sbs-stat-cell {
          padding-top: 28px;
          padding-bottom: 20px;
        }
        .sbs-stat-cell:not(:first-child) {
          padding-left: 40px;
          border-left: 1px solid rgba(122,106,30,0.12);
        }
        .sbs-stat-cell:not(:last-child) {
          padding-right: 40px;
        }

        /* ── Layout: marquee ── */
        .sbs-marquee-wrap {
          margin-top: 48px;
          border-top: 1px solid rgba(122,106,30,0.12);
          overflow: hidden;
          padding: 20px 0;
        }

        /* ── Ornament hidden on mobile ── */
        .sbs-ornament { display: flex; align-items: center; justify-content: center; }

        /* ========== TABLET (max 1024px) ========== */
        @media (max-width: 1024px) {
          .sbs-top-row         { padding: 40px 40px 0; }
          .sbs-headline-wrap   { padding: 44px 40px 0; }
          .sbs-body-grid       { gap: 32px; padding: 48px 40px 0; }
          .sbs-stats-grid      { margin: 48px 40px 0; }
          .sbs-stat-cell:not(:first-child) { padding-left: 28px; }
          .sbs-stat-cell:not(:last-child)  { padding-right: 28px; }
        }

        /* ========== MOBILE (max 768px) ========== */
        @media (max-width: 768px) {
          .sbs-top-row {
            flex-direction: column;
            align-items: flex-start;
            gap: 10px;
            padding: 32px 24px 0;
          }

          .sbs-headline-wrap {
            padding: 36px 24px 0;
          }

          .sbs-body-grid {
            grid-template-columns: 1fr;
            gap: 32px;
            padding: 40px 24px 0;
          }

          .sbs-ornament {
            order: -1;
          }

          .sbs-stats-grid {
            grid-template-columns: 1fr;
            margin: 40px 24px 0;
            gap: 0;
          }

          .sbs-stat-cell {
            padding: 20px 0 20px 0 !important;
            border-left: none !important;
            border-top: 1px solid rgba(122,106,30,0.12);
          }
          .sbs-stat-cell:first-child {
            border-top: none;
            padding-top: 24px !important;
          }

          .sbs-stat-bar::before {
            right: auto;
            width: 100%;
          }

          .sbs-marquee-wrap {
            margin-top: 32px;
          }
        }

        /* ========== SMALL MOBILE (max 480px) ========== */
        @media (max-width: 480px) {
          .sbs-top-row       { padding: 28px 20px 0; }
          .sbs-headline-wrap { padding: 28px 20px 0; }
          .sbs-body-grid     { padding: 32px 20px 0; }
          .sbs-stats-grid    { margin: 32px 20px 0; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after { animation-duration: 0.01ms !important; animation-iteration-count: 1 !important; }
        }
      `}</style>

      {/* ── 1. TOP LABEL ROW ── */}
      <div className="sbs-top-row">
        <div
          className={visible ? "sbs-fade-up" : "opacity-0"}
          style={{ animationDelay: "0.05s", display: "flex", alignItems: "center", gap: 12 }}
        >
          <span style={{ display: "block", width: 20, height: 1, background: "#7A6A1E", flexShrink: 0 }} />
          <span style={{ fontSize: 14, letterSpacing: "0.22em", textTransform: "uppercase", fontWeight: 500, color: "#b8901a" }}>
            About SBS Prospects
          </span>
        </div>
        <div
          className={visible ? "sbs-fade-up" : "opacity-0"}
          style={{ animationDelay: "0.15s", display: "flex", alignItems: "center", gap: 8 }}
        >
          <span className="sbs-pulse" style={{ display: "inline-block", width: 6, height: 6, borderRadius: "50%", background: "#7A6A1E", flexShrink: 0 }} />
          <span style={{ fontSize: 14, letterSpacing: "0.16em", textTransform: "uppercase", fontWeight: 500, color: "#b8901a" }}>
            Ahmedabad (Gujarat), 2019
          </span>
        </div>
      </div>

      {/* ── 2. HERO HEADLINE ── */}
      <div className="sbs-headline-wrap">
        {/* Decorative spinning circles */}
        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center", opacity: 0.05, pointerEvents: "none" }}>
          <div className="sbs-spin" style={{ position: "absolute", width: 560, height: 560, borderRadius: "50%", border: "1px dashed #7A6A1E" }} />
          <div style={{ position: "absolute", width: 360, height: 360, borderRadius: "50%", border: "1px solid #7A6A1E" }} />
        </div>

        <h2
          className={visible ? "sbs-slide-left" : "opacity-0"}
          style={{
            position: "relative", zIndex: 1,
            fontFamily: "'Libre Baskerville', serif",
            fontSize: "clamp(28px, 5.5vw, 72px)",
            fontWeight: 700,
            lineHeight: 1.1,
            letterSpacing: "-0.025em",
            color: "#1a160a",
            animationDelay: "0.2s",
          }}
        >
          We manage wealth with{" "}
          <em style={{ color: "#7A6A1E", fontStyle: "italic", fontWeight: 400 }}>discipline</em>{" "}
          &amp; conviction.
        </h2>

        {/* Gold divider */}
        <div style={{ display: "flex", justifyContent: "center", marginTop: 24 }}>
          <span
            className={visible ? "sbs-gold-line" : ""}
            style={{ display: "block", height: 1, background: "#b8901a", width: visible ? undefined : 0, animationDelay: "0.72s" }}
          />
        </div>
  
        {/* Description */}
        <p
          className={visible ? "sbs-fade-up" : "opacity-0"}
          style={{
            position: "relative", zIndex: 1,
            margin: "24px auto 0",
            maxWidth: 580,
            fontSize: "clamp(13px, 1.6vw, 16px)",
            fontWeight: 300,
            lineHeight: 1.85,
            color: "#1a160a",
            fontFamily: "'Outfit', sans-serif",
            animationDelay: "0.45s",
          }}
        >
          A boutique wealth advisory firm built on a single belief — that every financial decision
          must serve the long-term prosperity of those we advise.
        </p>
      </div>

      {/* ── 3. THREE-COLUMN BODY ── */}
      <div className="sbs-body-grid">
        {/* Left */}
        <div className={visible ? "sbs-fade-up" : "opacity-0"} style={{ animationDelay: "0.65s" }}>
          <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", fontWeight: 300, lineHeight: 1.95, color: "#1a160a", fontFamily: "'Outfit', sans-serif" }}>
            Founded in Ahmedabad (Gujarat), we combine the analytical rigour of institutional finance
            with the personal attention only a boutique firm can offer.
          </p>
        </div>

        {/* Center ornament */}
        <div
          className={`sbs-ornament ${visible ? "sbs-fade-in" : "opacity-0"}`}
          style={{ animationDelay: "0.82s" }}
        >
          <div style={{ position: "relative", width: 120, height: 120, display: "flex", alignItems: "center", justifyContent: "center" }}>
            <div style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px solid rgba(122,106,30,0.35)" }} />
            <div style={{ position: "absolute", inset: 10, borderRadius: "50%", border: "1px solid rgba(122,106,30,0.2)" }} />
            <div className="sbs-spin" style={{ position: "absolute", inset: 0, borderRadius: "50%", border: "1px dashed rgba(122,106,30,0.22)" }} />
            <div style={{ textAlign: "center", fontFamily: "'Libre Baskerville', serif", zIndex: 1 }}>
              <span style={{ display: "block", fontSize: 11, fontStyle: "italic", color: "#7A6A1E", lineHeight: 1.3 }}>Since</span>
              <span style={{ display: "block", fontSize: 20, fontWeight: 700, color: "#7A6A1E" }}>2019</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className={visible ? "sbs-slide-right" : "opacity-0"} style={{ animationDelay: "0.65s" }}>
          <p style={{ fontSize: "clamp(13px, 1.4vw, 15px)", fontWeight: 300, lineHeight: 1.95, color: "#1a160a", fontFamily: "'Outfit', sans-serif" }}>
            No hidden commissions. No cookie-cutter portfolios. No compromises.
            Fiercely independent, conflict-free, answerable only to our clients.
          </p>
        </div>
      </div>

      {/* ── 4. STATS ROW ── */}
      <div
        className={`sbs-stats-grid ${visible ? "sbs-fade-up" : "opacity-0"}`}
        style={{ animationDelay: "0.95s" }}
      >
        {stats.map((s, i) => (
          <div key={i} className={`sbs-stat-bar sbs-stat-bar-${i} sbs-stat-cell`}>
            <div className="sbs-count-up" style={{ animationDelay: `${1.05 + i * 0.18}s` }}>
              <p style={{
                fontFamily: "'Libre Baskerville', serif",
                fontSize: "clamp(36px, 4vw, 48px)",
                fontWeight: 700,
                color: "#1a160a",
                lineHeight: 1,
              }}>
                {s.num}
              </p>
              <p style={{
                marginTop: 10,
                fontSize: 10,
                letterSpacing: "0.15em",
                textTransform: "uppercase",
                fontWeight: 500,
                color: "#1a160a",
                fontFamily: "'Outfit', sans-serif",
              }}>
                {s.label}
              </p>
            </div>
          </div>
        ))}
      </div>

      {/* ── 5. MARQUEE ── */}
      <div className="sbs-marquee-wrap">
        <div style={{ display: "flex" }}>
          {[0, 1].map((d) => (
            <div key={d} className="sbs-marquee" aria-hidden={d === 1} style={{ display: "flex", flexShrink: 0 }}>
              {[...marqueeItems, ...marqueeItems].map((item, i) => (
                <span
                  key={i}
                  style={{
                    display: "inline-flex", alignItems: "center", gap: 20, padding: "0 36px",
                    fontSize: 11, letterSpacing: "0.22em", textTransform: "uppercase",
                    fontWeight: 500, color: "#1a160a", fontFamily: "'Outfit', sans-serif",
                    whiteSpace: "nowrap",
                  }}
                >
                  <span style={{ fontSize: 6 }}>◆</span>
                  {item}
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}