"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";

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

export default function AboutSnippet() {
  const sectionRef = useRef<HTMLElement>(null);
  const canvasRef  = useRef<HTMLCanvasElement>(null);
  const curDotRef  = useRef<HTMLDivElement>(null);
  const curRingRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(false);
  const [curBig, setCurBig] = useState(false);
  const [counters, setCounters] = useState({ years: 0, clients: 0, assets: 0, retention: 0 });

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
    const targets = { years: 6, clients: 1500, assets: 50, retention: 95 };
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



  /* ── Parallax ── */
  useEffect(() => {
    const onScroll = () => {
      const img = document.querySelector<HTMLElement>(".sbs-founder-parallax");
      if (img) img.style.transform = `translateY(${window.scrollY * 0.03}px)`;
    };
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const onEnter = () => setCurBig(true);
  const onLeave = () => setCurBig(false);

  const words = [
    { text: "Career",     em: false },
    { text: "Confidence", em: false },
    { text: "Built",      em: false },
    { text: "On",         em: false },
    { text: "Skills,",    em: true  },
    { text: "Mentorship", em: true  },
    { text: "&",          em: false },
    { text: "Growth",     em: true  },
  ];

  return (
    <>
      <style>{`


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

        /* ── Responsive main grid ── */
        .sbs-about-grid {
          display: grid;
          grid-template-columns: 1fr 400px 1fr;
          padding: 80px 64px 0;
          position: relative;
          z-index: 2;
          align-items: center;
        }
        .sbs-about-grid-left {
          padding-right: 52px;
        }
        .sbs-about-grid-right {
          padding-left: 52px;
        }
        
        .sbs-stats-strip {
          display: grid;
          grid-template-columns: repeat(4, 1fr);
          margin-top: 56px;
          border-top: 1px solid rgba(201,168,76,.18);
          position: relative;
          z-index: 2;
        }
        
        .sbs-brand-strip {
          background: #C9A84C;
          padding: 15px 64px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          position: relative;
          z-index: 2;
        }
        
        .sbs-brand-services {
          display: flex;
        }

        /* Responsive Breakpoints */
        @media (max-width: 1024px) {
          .sbs-about-grid {
            grid-template-columns: 1fr;
            padding: 48px 32px 0;
            gap: 40px;
          }
          .sbs-about-grid-left {
            padding-right: 0 !important;
          }
          .sbs-about-grid-center {
            max-width: 400px;
            margin: 0 auto;
            width: 100%;
          }
          .sbs-about-grid-right {
            padding-left: 0 !important;
          }
          .sbs-stats-strip {
            grid-template-columns: repeat(2, 1fr);
            margin-top: 40px;
          }
          .sbs-bs {
            border-right: none !important;
            border-bottom: 1px solid rgba(201,168,76,.1);
            padding: 24px 20px !important;
          }
          .sbs-bs:nth-child(even) {
            border-left: 1px solid rgba(201,168,76,.1);
          }
          .sbs-brand-strip {
            padding: 20px 32px;
            flex-direction: column;
            gap: 16px;
            text-align: center;
          }
          .sbs-brand-services {
            flex-direction: column;
            gap: 8px;
          }
          .sbs-brand-services span {
            border-right: none !important;
            padding: 0 !important;
          }
        }

        @media (max-width: 480px) {
          .sbs-about-grid {
            padding: 32px 16px 0;
            gap: 32px;
          }
          .sbs-stats-strip {
            grid-template-columns: 1fr;
          }
          .sbs-bs:nth-child(even) {
            border-left: none !important;
          }
          .sbs-brand-strip {
            padding: 20px 16px;
          }
        }
      `}</style>



      {/* ═══════ SECTION ═══════ */}
      <section
        ref={sectionRef}
        className={active ? "sbs-active" : ""}
        style={{ background:"#fbf3e4", position:"relative", overflow:"hidden", fontFamily:"'DM Sans',sans-serif" }}
      >
        {/* Particles */}
        <canvas ref={canvasRef} style={{ position:"absolute",inset:0,width:"100%",height:"100%",pointerEvents:"none",zIndex:0,opacity:.45 }}/>

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
        <div className="sbs-about-grid">

          {/* ── LEFT ── */}
          <div className="sbs-about-grid-left">
            <span style={{
              fontSize:20, letterSpacing:".22em", textTransform:"uppercase", color:"#C9A84C",
              display:"block", marginBottom:18,
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(-18px)",
              transition:"opacity .5s .1s, transform .5s .1s",
            }}>About Us</span>

            <h2 style={{ fontFamily:"'Playfair Display',serif", fontSize:40, fontWeight:700, color:"#1A1A1A", lineHeight:1.15, marginBottom:4 }}>
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

            <p style={{
              fontSize:14.5, color:"#5A5450", lineHeight:1.85, marginBottom:16,
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(-14px)",
              transition:"opacity .6s .55s, transform .6s .55s",
            }}>
              Established in 2019, SBS Prospects has emerged as a trusted training and HR consultancy firm in Ahmedabad, Gujarat, committed to helping students and professionals navigate their career development with confidence. With an industry-first approach and hands-on exposure, we strive to simplify skill acquisition and create opportunities that support long-term job readiness.
            </p>
            <p style={{
              fontSize:14.5, color:"#5A5450", lineHeight:1.85, marginBottom:16,
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(-14px)",
              transition:"opacity .6s .68s, transform .6s .68s",
            }}>
              Our mission is to deliver transparent, high-quality, and goal-oriented training programs that empower trainees at every stage of their professional journey. From MBA skill development and internship support to direct placement solutions and recruitment drives.
            </p>
            <p style={{
              fontSize:14.5, color:"#5A5450", lineHeight:1.85, 
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(-14px)",
              transition:"opacity .6s .68s, transform .6s .68s",
            }}>
               SBS Prospects is dedicated to building lasting corporate relationships through trust, training excellence, and consistent talent placement.
            </p>

            {/* Buttons */}
            <div style={{
              display:"flex", flexDirection:"column", gap:10, marginTop:36,
              opacity:active?1:0, transform:active?"translateY(0)":"translateY(14px)",
              transition:"opacity .5s .85s, transform .5s .85s",
            }}>
              <Link
                href="/about"
                className="sbs-btn"
                onMouseEnter={onEnter} onMouseLeave={onLeave}
                style={{
                  display:"flex", alignItems:"center", justifyContent:"space-between",
                  width:"100%", padding:"11px 18px",
                  alignSelf:"center", borderRadius:4,
                  border: "none",
                  background: "#1A1A1A",
                  color: "#F5F0E8",
                  fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:".14em",
                  textTransform:"uppercase", fontWeight:500,
                  transition:"color .3s, border-color .3s",
                  textDecoration: "none",
                }}
              >
                <div className="sbs-btn-bg" style={{ background: "#C9A84C" }}/>
                <span style={{ position:"relative", zIndex:1 }}>Read Our Full Story</span>
                <span className="sbs-btn-arr" style={{ position:"relative", zIndex:1, fontSize:15 }}>→</span>
              </Link>
            </div>
          </div>

          {/* ── CENTER: Founder image ── */}
          <div className="sbs-about-grid-center" style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 0" }}>
            {/* Outer wrapper — controls fade + badge positioning relative to image */}
            <div style={{
              position:"relative", width:"100%",
              opacity:active?1:0, transform:active?"translateY(0) scale(1)":"translateY(40px) scale(.95)",
              transition:"opacity 1s .15s, transform 1s cubic-bezier(.16,1,.3,1) .15s",
            }}>

              {/* Gold border frame — sits exactly around image */}
              <div style={{
                position:"absolute",
                top:-10, left:-10, right:-10, bottom:-10,
                zIndex:0, pointerEvents:"none",
              }}>
                {/* top-left corner */}
                <div className="sbs-fl sbs-fl-top"/>
                <div className="sbs-fl sbs-fl-left"/>
                {/* bottom-right corner */}
                <div className="sbs-fl sbs-fl-bot"/>
                <div className="sbs-fl sbs-fl-right"/>
              </div>

              {/* Image box */}
              <div
                className="sbs-founder-box"
                style={{
                  position:"relative", zIndex:1,
                  width:"100%", aspectRatio:"3/4",
                  overflow:"hidden", background:"#D4CFC5",
                }}
              >
                {/* Replace src="/image.png" with actual founder image */}
                <Image
                  src="/images/about/founder.jpg"
                  alt="Mr. Urval Shah"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  style={{ objectFit:"cover", objectPosition:"center center" }}
                  priority
                />
                {/* Bottom fade */}
                <div style={{
                  position:"absolute", bottom:0, left:0, right:0, height:"42%",
                  background:"linear-gradient(to top, rgba(251,243,228,0.97) 0%, transparent 100%)",
                  zIndex:3,
                }}/>
                {/* Name tag */}
                <div style={{ position:"absolute",bottom:0,left:0,right:0,zIndex:4,padding:"20px 24px",textAlign:"center" }}>
                  <div style={{ fontFamily:"'Playfair Display',serif",fontSize:21,fontWeight:700,color:"#1A1A1A",marginBottom:4 }}>Mr. Urval Shah</div>
                  <div style={{ fontSize:9,letterSpacing:".2em",textTransform:"uppercase",color:"#C9A84C" }}>Founder &amp; Managing Director</div>
                </div>
              </div>

              {/* Gold 6+ badge — sticks to top-right corner of image */}
              <div
                className={active ? "sbs-badge-show" : "sbs-badge-hidden"}
                style={{
                  position:"absolute", top:0, right:0, zIndex:6,
                  background:"#C9A84C", padding:"14px 18px", textAlign:"center", minWidth:120,
                  transition:"opacity .5s .95s, transform .5s cubic-bezier(.34,1.56,.64,1) .95s",
                }}
              >
                <span style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#0A0906",display:"block",lineHeight:1 }}>6+</span>
                <span style={{ fontSize:8,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(10,9,6,.6)",display:"block",marginTop:4 }}>Years Experience*</span>
              </div>

              {/* SEBI tag — bottom left, outside image */}
              <div style={{
                position:"absolute", bottom:64, left:-20, zIndex:6,
                background:"#1A1A1A", padding:"10px 16px",
                display:"flex", alignItems:"center", gap:10,
                opacity:active?1:0, transform:active?"translateX(0)":"translateX(-20px)",
                transition:"opacity .5s 1.1s, transform .5s cubic-bezier(.16,1,.3,1) 1.1s",
              }}>
                <div className="sbs-award-dot" style={{ width:6,height:6,borderRadius:"50%",background:"#C9A84C",flexShrink:0 }}/>
                <span style={{ fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(245,240,232,.7)" }}>Career & HR Advisory</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Quote — vertically centered with image ── */}
          <div className="sbs-about-grid-right" style={{
            display:"flex", flexDirection:"column", justifyContent:"center",
            alignSelf:"stretch",
          }}>
            <div style={{
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(18px)",
              transition:"opacity .7s .4s, transform .7s .4s",
            }}>
              {/* Opening quote — large, dark, styled */}
              <div style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:96, fontWeight:700, lineHeight:1,
                color:"#1A1A1A", marginBottom:-24, marginLeft:-6,
                opacity: 0.12,
              }}>&ldquo;</div>

              <p style={{
                fontFamily:"'Cormorant Garamond',serif", fontStyle:"italic",
                fontSize:22, color:"#1A1A1A", lineHeight:1.68, marginBottom:6,
              }}>
                Professional confidence is built through practical skill acquisition, hands-on experience, and dedicated mentorship.
              </p>

              {/* Closing quote — right aligned, tight to text */}
              <div style={{
                fontFamily:"'Playfair Display',serif",
                fontSize:96, fontWeight:700, lineHeight:0.8,
                color:"#1A1A1A", textAlign:"right",
                marginTop:-12, marginBottom:16,
                opacity: 0.12,
              }}>&rdquo;</div>

              <span style={{ fontSize:10, letterSpacing:".16em", textTransform:"uppercase", color:"#C9A84C" }}>
                — Mr. Urval Shah, Founder
              </span>
            </div>
          </div>

        </div>{/* end main-grid */}

        {/* ── BOTTOM 4-STAT STRIP ── */}
        <div className="sbs-stats-strip">
          {[
            { num:`${counters.years}`,    suf:"+",   lbl:"Years of Trust", sub:"Since 2019"         },
            { num:`${counters.clients>=150?(counters.clients/1000).toFixed(1)+"K":counters.clients}`, suf:"+", lbl:"Students Trained", sub:"Across Gujarat" },
            { num:`${counters.assets}`,  suf:"+",   lbl:"Hiring Partners", sub:"Corporate Network" },
            { num:`${counters.retention}`,suf:"%",   lbl:"Placement Success",  sub:"Job Readiness"  },
          ].map((s,i) => (
            <div
              key={i} className="sbs-bs"
              onMouseEnter={onEnter} onMouseLeave={onLeave}
              style={{
                padding:"28px 40px",
                borderRight: i<3?"1px solid rgba(201,168,76,.1)":"none",
                display:"flex", flexDirection:"column", gap:5,
                opacity:active?1:0, transform:active?"translateY(0)":"translateY(18px)",
                transition:`opacity .4s ${1.0+i*0.13}s, transform .4s ${1.0+i*0.13}s`,
              }}
            >
              <span style={{ fontFamily:"'Playfair Display',serif",fontSize:36,fontWeight:700,color:"#1A1A1A",lineHeight:1 }}>
                {s.num}<span style={{color:"#C9A84C"}}>{s.suf}</span>
              </span>
              <span style={{ fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#9A9088" }}>{s.lbl}</span>
              <span style={{ fontSize:12,color:"#C9A84C",fontWeight:500 }}>{s.sub}</span>
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
          <span style={{ fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#1A1A1A" }}>
            SBS Prospects · Ahmedabad, Gujarat
          </span>
          <div className="sbs-brand-services">
            {["Industry Training","HR Consultancy","Recruitment","Internships"].map((s,i,arr) => (
              <span key={i} style={{
                fontSize:10, letterSpacing:".1em", textTransform:"uppercase",
                color:"#1A1A1A", padding:"0 16px",
                borderRight: i<arr.length-1?"1px solid rgba(255,255,255,.07)":"none",
              }}>{s}</span>
            ))}
          </div>
          <span style={{ fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#1A1A1A" }}>
            Career & HR Advisory
          </span>
        </div>

      </section>
    </>
  );
}