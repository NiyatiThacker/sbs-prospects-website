"use client";

import { useEffect, useRef, useState } from "react";

export default function CTABanner() {
  const s1Ref = useRef<HTMLSpanElement>(null);
  const s2Ref = useRef<HTMLSpanElement>(null);
  const s3Ref = useRef<HTMLSpanElement>(null);

  function animateCount(
    el: HTMLSpanElement,
    target: number,
    suffix: string,
    duration: number
  ) {
    let start = 0;
    const step = target / (duration / 16);
    const timer = setInterval(() => {
      start = Math.min(start + step, target);
      const num = Math.floor(start);
      el.innerHTML = num + '<span style="color:#e9c349">' + suffix + "</span>";
      if (start >= target) clearInterval(timer);
    }, 16);
  }

  const [particles, setParticles] = useState<
  {
    id: number;
    x: number;
    dur: number;
    delay: number;
    size: number;
  }[]
>([]);

useEffect(() => {
  const generatedParticles = Array.from({ length: 18 }).map((_, i) => ({
    id: i,
    x: Math.random() * 100,
    dur: 3 + Math.random() * 3,
    delay: Math.random() * 2,
    size: 1 + Math.random() * 2,
  }));

  requestAnimationFrame(() => {
    setParticles(generatedParticles);
  });
}, []);

  useEffect(() => {
    const timeout = setTimeout(() => {
      if (s1Ref.current) animateCount(s1Ref.current, 500, "+", 1800);
      if (s2Ref.current) animateCount(s2Ref.current, 12, "+", 1200);
      if (s3Ref.current) animateCount(s3Ref.current, 98, "%", 1600);
    }, 900);
    return () => clearTimeout(timeout);
  }, []);

  return (
    <>
      <style>{`
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(30px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to   { opacity: 1; }
        }
        @keyframes shimmer {
          0%   { left: -100%; }
          100% { left: 100%; }
        }
        @keyframes float-diamond {
          0%,100% { transform: rotate(45deg) scale(1) translateY(0); }
          50%     { transform: rotate(45deg) scale(1.4) translateY(-2px); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(0.85); opacity: 0.6; }
          50%  { transform: scale(1.25); opacity: 0; }
          100% { transform: scale(0.85); opacity: 0; }
        }
        @keyframes scanline {
          0%   { transform: translateY(-100%); }
          100% { transform: translateY(400%); }
        }
        @keyframes glow-breathe {
          0%,100% { opacity: 0.06; }
          50%     { opacity: 0.14; }
        }
        @keyframes particle-rise {
          0%   { transform: translateY(0) scale(1);  opacity: 0.7; }
          100% { transform: translateY(-80px) scale(0); opacity: 0; }
        }
        @keyframes line-draw {
          from { transform: scaleX(0); }
          to   { transform: scaleX(1); }
        }
        @keyframes rotate-slow {
          from { transform: rotate(0deg); }
          to   { transform: rotate(360deg); }
        }

        /* ── Animated BG ── */
        .sbs-cta-bg1 {
          position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse at 50% 120%,rgba(233,195,73,0.13) 0%,transparent 55%);
          animation:glow-breathe 4s ease-in-out infinite;
        }
        .sbs-cta-bg2 {
          position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse at 20% 50%,rgba(233,195,73,0.05) 0%,transparent 45%);
          animation:glow-breathe 5s 1s ease-in-out infinite;
        }
        .sbs-cta-bg3 {
          position:absolute;inset:0;pointer-events:none;
          background:radial-gradient(ellipse at 80% 50%,rgba(233,195,73,0.05) 0%,transparent 45%);
          animation:glow-breathe 5s 2s ease-in-out infinite;
        }

        /* ── Scanline ── */
        .sbs-scanline {
          position:absolute;left:0;right:0;height:1px;pointer-events:none;z-index:1;
          background:linear-gradient(90deg,transparent,rgba(233,195,73,0.18),transparent);
          animation:scanline 6s linear infinite;
        }

        /* ── Rotating rings ── */
        .sbs-ring1 {
          position:absolute;top:50%;left:50%;
          width:600px;height:600px;margin:-300px 0 0 -300px;
          border:1px solid rgba(233,195,73,0.06);border-radius:50%;
          animation:rotate-slow 30s linear infinite;pointer-events:none;
        }
        .sbs-ring2 {
          position:absolute;top:50%;left:50%;
          width:750px;height:750px;margin:-375px 0 0 -375px;
          border:1px solid rgba(233,195,73,0.04);border-radius:50%;
          animation:rotate-slow 45s linear infinite reverse;pointer-events:none;
        }

        /* ── Particles ── */
        .sbs-particle {
          position:absolute;width:2px;height:2px;border-radius:50%;
          background:#e9c349;pointer-events:none;
          animation:particle-rise var(--dur) var(--delay) ease-out infinite;
        }

        /* ── Box ── */
        .sbs-cta-box {
          max-width:820px;margin:0 auto;position:relative;
          border:1px solid rgba(233,195,73,0.28);
          padding:54px 58px;
          background:rgba(255,248,239,0.5);
          backdrop-filter:blur(8px);
          -webkit-backdrop-filter:blur(8px);
          text-align:center;
          transition:box-shadow 0.5s ease;
          animation:fadeUp 0.9s 0.2s both;
        }
        .sbs-cta-box:hover {
          box-shadow:0 0 60px rgba(233,195,73,0.08),0 20px 60px rgba(0,6,19,0.06);
        }
        .sbs-cta-box::before {
          content:'';position:absolute;top:10px;left:10px;right:10px;bottom:10px;
          border:1px solid rgba(233,195,73,0.1);pointer-events:none;
          transition:border-color 0.4s;
        }
        .sbs-cta-box:hover::before { border-color:rgba(233,195,73,0.18); }

        /* ── Corners ── */
        .sbs-corner {
          position:absolute;width:20px;height:20px;
          transition:all 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .sbs-corner.tl { top:-1px;left:-1px;  border-top:2px solid #e9c349;border-left:2px solid #e9c349; }
        .sbs-corner.tr { top:-1px;right:-1px; border-top:2px solid #e9c349;border-right:2px solid #e9c349; }
        .sbs-corner.bl { bottom:-1px;left:-1px;  border-bottom:2px solid #e9c349;border-left:2px solid #e9c349; }
        .sbs-corner.br { bottom:-1px;right:-1px; border-bottom:2px solid #e9c349;border-right:2px solid #e9c349; }
        .sbs-cta-box:hover .sbs-corner { width:32px;height:32px;filter:drop-shadow(0 0 4px rgba(233,195,73,0.5)); }

        .sbs-corner-dot {
          position:absolute;width:5px;height:5px;border-radius:50%;
          background:#e9c349;opacity:0;transition:opacity 0.4s;
        }
        .sbs-corner.tl .sbs-corner-dot { top:-2px;left:-2px; }
        .sbs-corner.tr .sbs-corner-dot { top:-2px;right:-2px; }
        .sbs-corner.bl .sbs-corner-dot { bottom:-2px;left:-2px; }
        .sbs-corner.br .sbs-corner-dot { bottom:-2px;right:-2px; }
        .sbs-cta-box:hover .sbs-corner-dot { opacity:1;box-shadow:0 0 8px rgba(233,195,73,0.8); }

        /* ── Label ── */
        .sbs-cta-label {
          font-size:10px;letter-spacing:0.32em;text-transform:uppercase;
          color:#e9c349;font-weight:500;margin-bottom:20px;display:block;
          animation:fadeUp 0.7s 0.4s both;
        }

        /* ── Ornament ── */
        .sbs-ornament {
          display:flex;align-items:center;justify-content:center;gap:14px;
          margin-bottom:26px;animation:fadeIn 0.8s 0.5s both;
        }
        .sbs-orn-line {
          width:56px;height:1px;
          background:linear-gradient(90deg,transparent,rgba(233,195,73,0.65));
          transform-origin:right;animation:line-draw 0.8s 0.6s both;
        }
        .sbs-orn-line.r {
          background:linear-gradient(270deg,transparent,rgba(233,195,73,0.65));
          transform-origin:left;
        }
        .sbs-diamond-wrap {
          position:relative;display:flex;align-items:center;
          justify-content:center;width:20px;height:20px;
        }
        .sbs-diamond {
          width:7px;height:7px;background:#e9c349;transform:rotate(45deg);
          position:relative;z-index:1;
          animation:float-diamond 2.8s ease-in-out infinite;
        }
        .sbs-diamond-ring {
          position:absolute;width:16px;height:16px;
          border:1px solid rgba(233,195,73,0.4);border-radius:50%;
          animation:pulse-ring 2.8s ease-out infinite;
        }

        /* ── Heading ── */
        .sbs-cta-heading {
          font-family:var(--font-playfair),Georgia,serif;
          font-size:clamp(22px,2.6vw,38px);font-weight:400;color:#000613;
          line-height:1.24;margin-bottom:16px;letter-spacing:-0.01em;
          animation:fadeUp 0.7s 0.6s both;
        }
        .sbs-cta-heading em { font-style:italic;color:#735c00;position:relative; }
        .sbs-cta-heading em::after {
          content:'';position:absolute;bottom:-2px;left:0;right:0;height:1px;
          background:linear-gradient(90deg,transparent,rgba(115,92,0,0.4),transparent);
          transform:scaleX(0);transform-origin:center;
          transition:transform 0.5s cubic-bezier(0.22,1,0.36,1);
        }
        .sbs-cta-box:hover .sbs-cta-heading em::after { transform:scaleX(1); }

        /* ── Subtext ── */
        .sbs-cta-sub {
          font-size:13px;line-height:1.78;color:#735c00;font-weight:800;
          max-width:490px;margin:0 auto 30px;letter-spacing:0.01em;
          animation:fadeUp 0.7s 0.7s both;
        }

        /* ── Buttons ── */
        .sbs-cta-btns {
          display:flex;gap:12px;justify-content:center;flex-wrap:wrap;
          margin-bottom:34px;animation:fadeUp 0.7s 0.8s both;
        }
        .sbs-btn-primary {
          padding:11px 22px;background:#43474e;color:#fff8ef;
          font-size:9.5px;letter-spacing:0.2em;text-transform:uppercase;
          font-weight:500;border:none;cursor:pointer;
          font-family:var(--font-inter),sans-serif;
          display:inline-flex;align-items:center;gap:8px;
          position:relative;overflow:hidden;
          transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .sbs-btn-primary .shine {
          position:absolute;top:0;bottom:0;width:40px;
          background:linear-gradient(90deg,transparent,rgba(255,255,255,0.15),transparent);
          left:-100%;transition:none;
        }
        .sbs-btn-primary:hover {
          background:#e9c349;color:#000613;
          transform:translateY(-2px);
          box-shadow:0 8px 24px rgba(233,195,73,0.25);
        }
        .sbs-btn-primary:hover .shine { animation:shimmer 0.5s ease forwards; }
        .sbs-btn-primary .arrow { transition:transform 0.35s cubic-bezier(0.22,1,0.36,1); }
        .sbs-btn-primary:hover .arrow { transform:translateX(5px); }

        .sbs-btn-secondary {
          padding:10px 22px;background:transparent;color:#000613;
          font-size:9.5px;letter-spacing:0.2em;text-transform:uppercase;
          font-weight:400;border:1px solid rgba(0,6,19,0.18);cursor:pointer;
          font-family:var(--font-inter),sans-serif;
          display:inline-flex;align-items:center;gap:8px;
          position:relative;overflow:hidden;
          transition:all 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .sbs-btn-secondary::before {
          content:'';position:absolute;inset:0;background:#e9c349;
          transform:translateX(-101%);
          transition:transform 0.4s cubic-bezier(0.22,1,0.36,1);z-index:0;
        }
        .sbs-btn-secondary span,
        .sbs-btn-secondary svg { position:relative;z-index:1;transition:color 0.4s; }
        .sbs-btn-secondary:hover::before { transform:translateX(0); }
        .sbs-btn-secondary:hover {
          border-color:#e9c349;color:#000613;
          transform:translateY(-2px);
          box-shadow:0 8px 24px rgba(233,195,73,0.15);
        }

        /* ── Stats ── */
        .sbs-cta-stats {
          display:flex;align-items:center;justify-content:center;
          padding-top:24px;border-top:1px solid rgba(233,195,73,0.2);
          animation:fadeUp 0.7s 0.9s both;
        }
        .sbs-cta-stat {
          display:flex;flex-direction:column;align-items:center;gap:4px;
          padding:0 30px;cursor:default;position:relative;
        }
        .sbs-cta-stat::after {
          content:'';position:absolute;bottom:-4px;left:50%;
          transform:translateX(-50%);width:0;height:1px;
          background:#e9c349;transition:width 0.4s cubic-bezier(0.22,1,0.36,1);
        }
        .sbs-cta-stat:hover::after { width:60%; }
        .sbs-cta-stat:hover .sbs-stat-num { color:#735c00; }
        .sbs-stat-num {
          font-family:var(--font-playfair),Georgia,serif;
          font-size:26px;font-weight:400;color:#000613;
          letter-spacing:-0.02em;line-height:1;transition:color 0.3s;
        }
        .sbs-stat-lbl {
          font-size:9px;letter-spacing:0.16em;text-transform:uppercase;
          color:#43474e;font-weight:400;
          font-family:var(--font-inter),sans-serif;
        }
        .sbs-stat-divider {
          width:1px;height:30px;
          background:linear-gradient(180deg,transparent,rgba(233,195,73,0.4),transparent);
        }
      `}</style>

      <section
        style={{
          background: "#fbf3e4",
          padding: "80px 40px",
          position: "relative",
          overflow: "hidden",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {/* Animated BG layers */}
        <div className="sbs-cta-bg1" />
        <div className="sbs-cta-bg2" />
        <div className="sbs-cta-bg3" />

        {/* Scanline */}
        <div className="sbs-scanline" />

        {/* Rotating rings */}
        <div className="sbs-ring1" />
        <div className="sbs-ring2" />

        {/* Gold particles */}
        {particles.map((p) => (
          <div
            key={p.id}
            className="sbs-particle"
            style={{
              left: `${p.x}%`,
              bottom: "10%",
              width: `${p.size}px`,
              height: `${p.size}px`,
              ["--dur" as string]: `${p.dur}s`,
              ["--delay" as string]: `${p.delay}s`,
            }}
          />
        ))}

        {/* Framed Box */}
        <div className="sbs-cta-box">
          <div className="sbs-corner tl"><div className="sbs-corner-dot" /></div>
          <div className="sbs-corner tr"><div className="sbs-corner-dot" /></div>
          <div className="sbs-corner bl"><div className="sbs-corner-dot" /></div>
          <div className="sbs-corner br"><div className="sbs-corner-dot" /></div>

          <div style={{ position: "relative", zIndex: 2 }}>
            {/* Label */}
            <span className="sbs-cta-label">Private Financial Advisory</span>

            {/* Ornament */}
            <div className="sbs-ornament">
              <div className="sbs-orn-line" />
              <div className="sbs-diamond-wrap">
                <div className="sbs-diamond-ring" />
                <div className="sbs-diamond" />
              </div>
              <div className="sbs-orn-line r" />
            </div>

            {/* Heading */}
            <h2 className="sbs-cta-heading">
              Build Long-Term Financial <em>Confidence</em>
              <br />
              With Structured Wealth Planning
            </h2>

            {/* Subtext */}
            <p className="sbs-cta-sub">
              SBS Financial Services provides disciplined planning and
              personalized advisory solutions designed around your long-term
              goals.
            </p>

            {/* Buttons */}
            <div className="sbs-cta-btns">
              <button className="sbs-btn-primary">
                <div className="shine" />
                Explore Financial Solutions
                <svg
                  className="arrow"
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path d="M5 12h14M12 5l7 7-7 7" />
                </svg>
              </button>
              <button className="sbs-btn-secondary">
                <span>Book a Private Consultation</span>
                <svg
                  width="11"
                  height="11"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                >
                  <path d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
              </button>
            </div>

            {/* Stats */}
            <div className="sbs-cta-stats">
              <div className="sbs-cta-stat">
                <span className="sbs-stat-num" ref={s1Ref}>
                  0<span style={{ color: "#e9c349" }}>+</span>
                </span>
                <span className="sbs-stat-lbl">Clients Served</span>
              </div>
              <div className="sbs-stat-divider" />
              <div className="sbs-cta-stat">
                <span className="sbs-stat-num" ref={s2Ref}>
                  0<span style={{ color: "#e9c349" }}>+</span>
                </span>
                <span className="sbs-stat-lbl">Years Experience</span>
              </div>
              <div className="sbs-stat-divider" />
              <div className="sbs-cta-stat">
                <span className="sbs-stat-num" ref={s3Ref}>
                  0<span style={{ color: "#e9c349" }}>%</span>
                </span>
                <span className="sbs-stat-lbl">Client Retention</span>
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}