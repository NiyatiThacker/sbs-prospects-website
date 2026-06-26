"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

interface Particle {
  x: number; y: number; size: number;
  speedX: number; speedY: number;
  opacity: number; life: number; maxLife: number;
}

function resetParticle(p: Particle, W: number, H: number, init = false) {
  p.x = Math.random() * W;
  p.y = init ? Math.random() * H : H + 10;
  p.size = Math.random() * 2 + 0.5;
  p.speedY = -(Math.random() * 0.4 + 0.2);
  p.speedX = (Math.random() - 0.5) * 0.3;
  p.opacity = Math.random() * 0.5 + 0.1;
  p.life = 0;
  p.maxLife = Math.random() * 300 + 200;
}

export default function AboutCTA() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const curDotRef  = useRef<HTMLDivElement>(null);
  const curRingRef = useRef<HTMLDivElement>(null);
  const [active, setActive]     = useState(false);
  const [curBig, setCurBig]     = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [counters, setCounters] = useState({ years: 0, clients: 0, assets: 0, retention: 0 });

  /* ── Detect mobile ── */
  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  /* ── Intersection observer ── */
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([entry]) => { if (entry.isIntersecting) { setActive(true); obs.disconnect(); } },
      { threshold: 0.05 }
    );
    obs.observe(el);
    setTimeout(() => setActive(true), 150);
    return () => obs.disconnect();
  }, []);

  /* ── Count-up ── */
  useEffect(() => {
    if (!active) return;
    const targets = { years: 15, clients: 2000, assets: 500, retention: 98 };
    const duration = 1800;
    const start = performance.now();
    let rafId: number;
    const tick = (now: number) => {
      const p    = Math.min((now - start) / duration, 1);
      const ease = 1 - Math.pow(1 - p, 4);
      setCounters({
        years:     Math.floor(ease * targets.years),
        clients:   Math.floor(ease * targets.clients),
        assets:    Math.floor(ease * targets.assets),
        retention: Math.floor(ease * targets.retention),
      });
      if (p < 1) rafId = requestAnimationFrame(tick);
    };
    const t = setTimeout(() => { rafId = requestAnimationFrame(tick); }, 600);
    return () => { clearTimeout(t); cancelAnimationFrame(rafId); };
  }, [active]);

  /* ── Particles ── */
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d")!;
    let W = 0, H = 0, raf: number;
    const particles: Particle[] = [];
    const resize = () => {
      W = canvas.width  = canvas.offsetWidth;
      H = canvas.height = canvas.offsetHeight;
    };
    resize();
    window.addEventListener("resize", resize);
    for (let i = 0; i < 60; i++) {
      const p = {} as Particle;
      resetParticle(p, W, H, true);
      particles.push(p);
    }
    const loop = () => {
      ctx.clearRect(0, 0, W, H);
      particles.forEach(p => {
        p.x += p.speedX; p.y += p.speedY; p.life++;
        if (p.life > p.maxLife) resetParticle(p, W, H, false);
        const alpha = p.life < 30 ? p.life / 30 : p.life > p.maxLife - 30 ? (p.maxLife - p.life) / 30 : 1;
        ctx.save();
        ctx.globalAlpha = p.opacity * alpha;
        ctx.fillStyle = "#C9A84C";
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        ctx.restore();
      });
      raf = requestAnimationFrame(loop);
    };
    loop();
    return () => { cancelAnimationFrame(raf); window.removeEventListener("resize", resize); };
  }, []);

  /* ── Custom cursor (desktop only) ── */
  useEffect(() => {
    if (isMobile) return;
    let rx = 0, ry = 0, mx = 0, my = 0, rafId: number;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (curDotRef.current) {
        curDotRef.current.style.left = mx + "px";
        curDotRef.current.style.top  = my + "px";
      }
    };
    const animRing = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      if (curRingRef.current) {
        curRingRef.current.style.left = rx + "px";
        curRingRef.current.style.top  = ry + "px";
      }
      rafId = requestAnimationFrame(animRing);
    };
    animRing();
    document.addEventListener("mousemove", onMove);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId); };
  }, [isMobile]);

  /* ── Parallax ── */
  useEffect(() => {
    if (isMobile) return;
    const onScroll = () => {
      const img = document.querySelector<HTMLElement>(".sbs-founder-parallax");
      if (img) img.style.transform = `translateY(${window.scrollY * 0.03}px)`;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, [isMobile]);

  const onEnter = () => !isMobile && setCurBig(true);
  const onLeave = () => !isMobile && setCurBig(false);

  const words = [
    { text: "Financial", em: false },
    { text: "Guidance",  em: false },
    { text: "Built",     em: false },
    { text: "On",        em: false },
    { text: "Trust,",    em: true  },
    { text: "Stability", em: true  },
    { text: "&",         em: false },
    { text: "Legacy",    em: true  },
  ];

  return (
    <>
      <style>{`
        /* ── Custom cursor: desktop only ── */
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }

        .sbs-cur-dot {
          position: fixed; border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width .25s, height .25s;
          mix-blend-mode: multiply;
          width: 10px; height: 10px;
          background: #C9A84C;
          display: none;
        }
        .sbs-cur-ring {
          position: fixed; border-radius: 50%;
          border: 1.5px solid rgba(201,168,76,0.55);
          pointer-events: none; z-index: 9998;
          transform: translate(-50%, -50%);
          transition: width .25s, height .25s;
          width: 36px; height: 36px;
          display: none;
        }
        @media (hover: hover) and (pointer: fine) {
          .sbs-cur-dot { display: block; }
          .sbs-cur-ring { display: block; }
        }
        .sbs-cur-dot.big  { width: 20px; height: 20px; }
        .sbs-cur-ring.big { width: 56px; height: 56px; }

        /* ── word animation ── */
        .sbs-word-outer { display:inline-block; overflow:hidden; }
        .sbs-word-inner {
          display:inline-block; margin-right:0.22em;
          opacity:0; transform:translateY(105%);
          transition:opacity .6s, transform .6s cubic-bezier(.16,1,.3,1);
        }
        .sbs-active .sbs-word-inner { opacity:1; transform:translateY(0); }

        /* ── gold rule ── */
        .sbs-gold-rule {
          height:2px;
          background:linear-gradient(90deg,#C9A84C,rgba(201,168,76,.15));
          width:0; margin:20px 0 24px;
          transition:width .9s cubic-bezier(.16,1,.3,1) .7s;
        }
        .sbs-active .sbs-gold-rule { width:80px; }

        /* ── corner frame lines ── */
        .sbs-fl { position:absolute; background:#C9A84C; }
        .sbs-fl-top   { top:0; left:0; height:1.5px; width:0;  transition:width  .7s cubic-bezier(.16,1,.3,1) .8s;  }
        .sbs-fl-left  { top:0; left:0; width:1.5px;  height:0; transition:height .7s cubic-bezier(.16,1,.3,1) .9s;  }
        .sbs-fl-bot   { bottom:0; right:0; height:1.5px; width:0;  transition:width  .7s cubic-bezier(.16,1,.3,1) 1.0s; }
        .sbs-fl-right { bottom:0; right:0; width:1.5px;  height:0; transition:height .7s cubic-bezier(.16,1,.3,1) 1.1s; }
        .sbs-active .sbs-fl-top, .sbs-active .sbs-fl-bot   { width:55%;  }
        .sbs-active .sbs-fl-left,.sbs-active .sbs-fl-right { height:55%; }

        /* ── shimmer ── */
        .sbs-founder-box::after {
          content:''; position:absolute; inset:0; z-index:2;
          background:linear-gradient(105deg,transparent 40%,rgba(255,255,255,.15) 50%,transparent 60%);
          transform:translateX(-100%);
          transition:transform 1s ease 1.2s;
        }
        .sbs-active .sbs-founder-box::after { transform:translateX(200%); }

        /* ── buttons ── */
        .sbs-btn { position:relative; overflow:hidden; }
        .sbs-btn-bg {
          position:absolute; inset:0;
          transform:translateX(-101%);
          transition:transform .4s cubic-bezier(.16,1,.3,1);
        }
        .sbs-btn:hover .sbs-btn-bg  { transform:translateX(0); }
        .sbs-btn:hover .sbs-btn-arr { transform:translateX(6px); }
        .sbs-btn-arr { transition:transform .3s; }

        /* ── bottom stat hover ── */
        .sbs-bs { position:relative; overflow:hidden; }
        .sbs-bs::before {
          content:''; position:absolute; top:0; left:0; right:0; height:2px;
          background:#C9A84C;
          transform:scaleX(0); transform-origin:left;
          transition:transform .4s cubic-bezier(.16,1,.3,1);
        }
        .sbs-bs:hover::before { transform:scaleX(1); }

        /* ── badge ── */
        .sbs-badge-hidden { opacity:0; transform:scale(0) rotate(-10deg); }
        .sbs-badge-show   { opacity:1; transform:scale(1) rotate(0deg);   }

        /* ── rings ── */
        @keyframes sbsRingPulse { 0%,100%{transform:scale(1);opacity:.5} 50%{transform:scale(1.05);opacity:1} }
        .sbs-ring { animation:sbsRingPulse 6s ease-in-out infinite; }

        /* ── award dot ── */
        @keyframes sbsDotPulse { 0%,100%{opacity:1;transform:scale(1)} 50%{opacity:.4;transform:scale(.7)} }
        .sbs-award-dot { animation:sbsDotPulse 2s ease infinite; }

        /* ══════════════════════════════════
           RESPONSIVE LAYOUT
        ══════════════════════════════════ */

        /* Main grid */
        .sbs-main-grid {
          display: grid;
          grid-template-columns: 1fr 400px 1fr;
          padding: 48px 64px 0;
          position: relative;
          z-index: 2;
          align-items: center;
        }
        .sbs-left  { padding-right: 52px; }
        .sbs-right { padding-left: 52px; display:flex; flex-direction:column; justify-content:center; align-self:stretch; }

        /* Stats strip */
        .sbs-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 56px;
          border-top: 1px solid rgba(201,168,76,.18);
          position: relative;
          z-index: 2;
        }
        .sbs-stat-item {
          padding: 28px 40px;
        }
        .sbs-stat-item:not(:last-child) {
          border-right: 1px solid rgba(201,168,76,.1);
        }

        /* Brand strip */
        .sbs-brand-strip {
          background: #C9A84C;
          padding: 15px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
          flex-wrap: wrap;
          gap: 10px;
        }
        .sbs-brand-services {
          display: flex;
          flex-wrap: wrap;
        }

        /* ── TABLET: max 1024px ── */
        @media (max-width: 1024px) {
          .sbs-main-grid {
            grid-template-columns: 1fr 320px 1fr;
            padding: 40px 40px 0;
            gap: 0;
          }
          .sbs-left  { padding-right: 32px; }
          .sbs-right { padding-left: 32px; }
          .sbs-stat-item { padding: 24px 24px; }
          .sbs-brand-strip { padding: 15px 40px; }
        }

        /* ── SMALL TABLET: max 900px ── */
        @media (max-width: 900px) {
          .sbs-main-grid {
            grid-template-columns: 1fr;
            padding: 36px 32px 0;
            gap: 0;
          }
          .sbs-left  { padding-right: 0; padding-bottom: 36px; order: 1; }
          .sbs-center-col { order: 2; max-width: 340px; margin: 0 auto; width: 100%; }
          .sbs-right { padding-left: 0; padding-top: 36px; order: 3; align-self: auto; }

          .sbs-stats-strip {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 40px;
          }
          .sbs-stat-item:nth-child(2) { border-right: none; }
          .sbs-stat-item:nth-child(1),
          .sbs-stat-item:nth-child(2) {
            border-bottom: 1px solid rgba(201,168,76,.1);
          }

          .sbs-brand-strip {
            padding: 14px 32px;
            gap: 8px;
          }
        }

        /* ── MOBILE: max 640px ── */
        @media (max-width: 640px) {
          .sbs-main-grid {
            padding: 28px 20px 0;
          }
          .sbs-left { padding-bottom: 28px; }
          .sbs-right { padding-top: 28px; }

          .sbs-stats-strip {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 32px;
          }
          .sbs-stat-item {
            padding: 20px 18px;
          }

          .sbs-brand-strip {
            padding: 14px 20px;
            flex-direction: column;
            align-items: flex-start;
            gap: 6px;
          }
          .sbs-brand-services {
            gap: 0;
          }
          .sbs-brand-services span {
            padding: 2px 10px 2px 0 !important;
            border-right: none !important;
          }

          /* Reduce deco rings on mobile */
          .sbs-ring { display: none; }
        }

        /* ── SMALL MOBILE: max 400px ── */
        @media (max-width: 400px) {
          .sbs-main-grid { padding: 24px 16px 0; }
          .sbs-brand-strip { padding: 14px 16px; }
          .sbs-stat-item { padding: 16px 14px; }
        }

        @media (prefers-reduced-motion: reduce) {
          *, *::before, *::after {
            animation-duration: 0.01ms !important;
            animation-iteration-count: 1 !important;
            transition-duration: 0.01ms !important;
          }
        }
      `}</style>

      {/* ── Cursor dot ── */}
      <div ref={curDotRef} className={`sbs-cur-dot${curBig ? " big" : ""}`} />
      <div ref={curRingRef} className={`sbs-cur-ring${curBig ? " big" : ""}`} />

      {/* ═══════ SECTION ═══════ */}
      <section
        ref={sectionRef}
        className={active ? "sbs-active" : ""}
        style={{ background:"#fbf3e4", position:"relative", overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}
      >
        {/* Particles */}
        <canvas
          ref={canvasRef}
          style={{ position:"absolute", inset:0, width:"100%", height:"100%", pointerEvents:"none", zIndex:0, opacity:.45 }}
        />

        {/* Deco rings */}
        {[600,400,200].map((s,i) => (
          <div key={i} className="sbs-ring" style={{
            position:"absolute", borderRadius:"50%",
            border:"1px solid rgba(201,168,76,0.1)",
            pointerEvents:"none", zIndex:0,
            width:s, height:s, top:-s*0.33, right:-s*0.25,
            animationDelay:`${i}s`,
          }}/>
        ))}

        {/* ── MAIN GRID ── */}
        <div className="sbs-main-grid">

          {/* ── LEFT ── */}
          <div className="sbs-left">
            <span style={{
              fontSize: "clamp(10px, 1.5vw, 12px)",
              letterSpacing:".22em", textTransform:"uppercase", color:"#C9A84C",
              display:"block", marginBottom:18,
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(-18px)",
              transition:"opacity .5s .1s, transform .5s .1s",
            }}>About Us</span>

            <h2 style={{
              fontFamily:"'Playfair Display',serif",
              fontSize:"clamp(26px, 3.5vw, 40px)",
              fontWeight:700, color:"#1A1A1A", lineHeight:1.15, marginBottom:4,
            }}>
              {words.map((w,i) => (
                <span key={i} className="sbs-word-outer">
                  <span className="sbs-word-inner" style={{
                    fontStyle: w.em?"italic":"normal",
                    color: w.em?"#C9A84C":"#1A1A1A",
                    transitionDelay:`${0.2+i*0.1}s`,
                  }}>{w.text}</span>
                </span>
              ))}
            </h2>

            <div className="sbs-gold-rule"/>

            {[
              { delay:".55s", text:"Established in 2019, SBS Financial Services has emerged as a trusted financial services firm in Ahmedabad, Gujarat, committed to helping individuals and families make smarter financial decisions with confidence. With a client-centric approach and future-focused strategies, we strive to simplify financial planning and create solutions that support long-term growth, stability, and wealth creation." },
              { delay:".68s", text:"Our mission is to deliver transparent, personalized, and goal-oriented financial guidance that empowers clients at every stage of their financial journey. From investment planning and wealth management to insurance and tax-saving solutions." },
              { delay:".78s", text:"SBS Financial Services is dedicated to building lasting relationships through trust, expertise, and consistent financial growth." },
            ].map((para, i) => (
              <p key={i} style={{
                fontSize:"clamp(13px, 1.3vw, 14.5px)", color:"#5A5450", lineHeight:1.85,
                marginBottom: i < 2 ? 16 : 0,
                opacity:active?1:0, transform:active?"translateX(0)":"translateX(-14px)",
                transition:`opacity .6s ${para.delay}, transform .6s ${para.delay}`,
              }}>{para.text}</p>
            ))}

            {/* Buttons */}
            <div style={{
              display:"flex", flexDirection:"column", gap:10, marginTop:36,
              opacity:active?1:0, transform:active?"translateY(0)":"translateY(14px)",
              transition:"opacity .5s .85s, transform .5s .85s",
            }}>
              {[
                { label:"Read Our Full Story", primary:true  },
                { label:"Meet The Team",       primary:false },
              ].map((b,i) => (
                <button
                  key={i} className="sbs-btn"
                  onMouseEnter={onEnter} onMouseLeave={onLeave}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    width:"100%", padding:"15px 22px",
                    border: b.primary?"none":"1px solid rgba(26,26,26,.2)",
                    background: b.primary?"#1A1A1A":"transparent",
                    color: b.primary?"#F5F0E8":"#1A1A1A",
                    fontFamily:"'DM Sans',sans-serif",
                    fontSize:"clamp(9px, 1vw, 11px)",
                    letterSpacing:".14em", textTransform:"uppercase", fontWeight:500,
                    transition:"color .3s, border-color .3s",
                  }}
                >
                  <div className="sbs-btn-bg" style={{ background:b.primary?"#C9A84C":"rgba(201,168,76,.12)" }}/>
                  <span style={{ position:"relative", zIndex:1 }}>{b.label}</span>
                  <span className="sbs-btn-arr" style={{ position:"relative", zIndex:1, fontSize:15 }}>→</span>
                </button>
              ))}
            </div>
          </div>

          {/* ── CENTER: Founder image ── */}
          <div className="sbs-center-col" style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 0" }}>
            <div style={{
              position:"relative", width:"100%",
              opacity:active?1:0, transform:active?"translateY(0) scale(1)":"translateY(40px) scale(.95)",
              transition:"opacity 1s .15s, transform 1s cubic-bezier(.16,1,.3,1) .15s",
            }}>
              {/* Gold border frame */}
              <div style={{ position:"absolute", top:-10, left:-10, right:-10, bottom:-10, zIndex:0, pointerEvents:"none" }}>
                <div className="sbs-fl sbs-fl-top"/>
                <div className="sbs-fl sbs-fl-left"/>
                <div className="sbs-fl sbs-fl-bot"/>
                <div className="sbs-fl sbs-fl-right"/>
              </div>

              {/* Image box */}
              <div
                className="sbs-founder-box"
                style={{ position:"relative", zIndex:1, width:"100%", aspectRatio:"3/4", overflow:"hidden", background:"#D4CFC5" }}
              >
                <Image
                  src="/images/about/founder.jpg"
                  alt="Mr. Urval Shah"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit:"cover", objectPosition:"center center" }}
                  priority
                />
                <div style={{
                  position:"absolute", bottom:0, left:0, right:0, height:"42%",
                  background:"linear-gradient(to top, rgba(251,243,228,0.97) 0%, transparent 100%)",
                  zIndex:3,
                }}/>
                <div style={{ position:"absolute", bottom:0, left:0, right:0, zIndex:4, padding:"20px 24px", textAlign:"center" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(16px, 2vw, 21px)", fontWeight:700, color:"#1A1A1A", marginBottom:4 }}>Mr. Urval Shah</div>
                  <div style={{ fontSize:"clamp(8px, 1vw, 9px)", letterSpacing:".2em", textTransform:"uppercase", color:"#C9A84C" }}>Founder &amp; Managing Director</div>
                </div>
              </div>

              {/* 15+ badge */}
              <div
                className={active ? "sbs-badge-show" : "sbs-badge-hidden"}
                style={{
                  position:"absolute", top:0, right:0, zIndex:6,
                  background:"#C9A84C", padding:"14px 18px", textAlign:"center", minWidth:80,
                  transition:"opacity .5s .95s, transform .5s cubic-bezier(.34,1.56,.64,1) .95s",
                }}
              >
                <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(18px,2.5vw,24px)", fontWeight:700, color:"#0A0906", display:"block", lineHeight:1 }}>15+</span>
                <span style={{ fontSize:8, letterSpacing:".14em", textTransform:"uppercase", color:"rgba(10,9,6,.6)", display:"block", marginTop:4 }}>Years</span>
              </div>

              {/* SEBI tag */}
              <div style={{
                position:"absolute", bottom:64, left:-20, zIndex:6,
                background:"#1A1A1A", padding:"10px 16px",
                display:"flex", alignItems:"center", gap:10,
                opacity:active?1:0, transform:active?"translateX(0)":"translateX(-20px)",
                transition:"opacity .5s 1.1s, transform .5s cubic-bezier(.16,1,.3,1) 1.1s",
              }}>
                <div className="sbs-award-dot" style={{ width:6, height:6, borderRadius:"50%", background:"#C9A84C", flexShrink:0 }}/>
                <span style={{ fontSize:"clamp(8px,1vw,10px)", letterSpacing:".1em", textTransform:"uppercase", color:"rgba(245,240,232,.7)" }}>SEBI Registered Advisor</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Quote ── */}
          <div className="sbs-right">
            <div style={{
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(18px)",
              transition:"opacity .7s .4s, transform .7s .4s",
            }}>
              <div style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(60px, 8vw, 96px)",
                fontWeight:700, lineHeight:1,
                color:"#1A1A1A", marginBottom:-24, marginLeft:-6,
                opacity: 0.12,
              }}>&ldquo;</div>

              <p style={{
                fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                fontSize:"clamp(16px, 2vw, 22px)",
                color:"#1A1A1A", lineHeight:1.68, marginBottom:6,
              }}>
                Financial confidence is built through disciplined planning, informed decisions, and trusted relationships.
              </p>

              <div style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:"clamp(60px, 8vw, 96px)",
                fontWeight:700, lineHeight:0.8,
                color:"#1A1A1A", textAlign:"right",
                marginTop:-12, marginBottom:16,
                opacity: 0.12,
              }}>&rdquo;</div>

              <span style={{ fontSize:"clamp(8px, 1vw, 10px)", letterSpacing:".16em", textTransform:"uppercase", color:"#C9A84C" }}>
                — Mr. Urval Shah, Founder
              </span>
            </div>
          </div>

        </div>{/* end main-grid */}

        {/* ── BOTTOM 4-STAT STRIP ── */}
        <div className="sbs-stats-strip">
          {[
            { num:`${counters.years}`,    suf:"+",   lbl:"Years of Trust",  sub:"Since 2019"          },
            { num:`${counters.clients >= 150 ? (counters.clients / 1000).toFixed(1) + "K" : counters.clients}`, suf:"+", lbl:"Happy Clients", sub:"Across Gujarat" },
            { num:`₹${counters.assets}`,  suf:"Cr+", lbl:"Assets Managed", sub:"Growing every year"   },
            { num:`${counters.retention}`,suf:"%",   lbl:"Retention Rate",  sub:"Clients for life"     },
          ].map((s,i) => (
            <div
              key={i} className="sbs-bs sbs-stat-item"
              onMouseEnter={onEnter} onMouseLeave={onLeave}
              style={{
                display:"flex", flexDirection:"column", gap:5,
                opacity:active?1:0, transform:active?"translateY(0)":"translateY(18px)",
                transition:`opacity .4s ${1.0+i*0.13}s, transform .4s ${1.0+i*0.13}s`,
              }}
            >
              <span style={{ fontFamily:"'Playfair Display',serif", fontSize:"clamp(24px, 3vw, 36px)", fontWeight:700, color:"#1A1A1A", lineHeight:1 }}>
                {s.num}<span style={{ color:"#C9A84C" }}>{s.suf}</span>
              </span>
              <span style={{ fontSize:"clamp(8px, 1vw, 10px)", letterSpacing:".14em", textTransform:"uppercase", color:"#9A9088" }}>{s.lbl}</span>
              <span style={{ fontSize:"clamp(10px, 1.1vw, 12px)", color:"#C9A84C", fontWeight:500 }}>{s.sub}</span>
            </div>
          ))}
        </div>

        {/* ── BRAND STRIP ── */}
        <div className="sbs-brand-strip">
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:1,
            background:"linear-gradient(90deg,transparent,#C9A84C 30%,#C9A84C 70%,transparent)",
            opacity:.3,
          }}/>
          <span style={{ fontSize:"clamp(8px, 1vw, 10px)", letterSpacing:".14em", textTransform:"uppercase", color:"#1A1A1A" }}>
            SBS Financial Services · Ahmedabad, Gujarat
          </span>
          <div className="sbs-brand-services">
            {["Mutual Funds","Insurance","Wealth Planning","Tax Advisory"].map((s,i,arr) => (
              <span key={i} style={{
                fontSize:"clamp(8px, 1vw, 10px)", letterSpacing:".1em", textTransform:"uppercase",
                color:"#1A1A1A", padding:"0 16px",
                borderRight: i < arr.length - 1 ? "1px solid rgba(255,255,255,.2)" : "none",
              }}>{s}</span>
            ))}
          </div>
          <span style={{ fontSize:"clamp(8px, 1vw, 10px)", letterSpacing:".14em", textTransform:"uppercase", color:"#1A1A1A" }}>
            SEBI Registered
          </span>
        </div>

      </section>
    </>
  );
}