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

  /* ── Custom cursor ── */
  useEffect(() => {
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
        * { cursor: none !important; }

        /* ── cursor ── */
        .sbs-cur-dot {
          position: fixed; border-radius: 50%;
          pointer-events: none; z-index: 9999;
          transform: translate(-50%, -50%);
          transition: width .25s, height .25s;
          mix-blend-mode: multiply;
          width: 10px; height: 10px;
          background: #C9A84C;
        }
        .sbs-cur-dot.big { width: 20px; height: 20px; }
        .sbs-cur-ring {
          position: fixed; border-radius: 50%;
          border: 1.5px solid rgba(201,168,76,0.55);
          pointer-events: none; z-index: 9998;
          transform: translate(-50%, -50%);
          transition: width .25s, height .25s;
          width: 36px; height: 36px;
        }
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
      `}</style>

      {/* ── Cursor dot ── */}
      <div ref={curDotRef} className={`sbs-cur-dot${curBig ? " big" : ""}`} />
      {/* ── Cursor ring ── */}
      <div ref={curRingRef} className={`sbs-cur-ring${curBig ? " big" : ""}`} />

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
        <div style={{
          display:"grid", gridTemplateColumns:"1fr 400px 1fr",
          padding:"48px 64px 0", position:"relative", zIndex:2,
          alignItems:"center",
        }}>

          {/* ── LEFT ── */}
          <div style={{ paddingRight:52 }}>
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
              Established in 2019, SBS Financial Services has emerged as a trusted financial services firm in Ahmedabad, Gujarat, committed to helping individuals and families make smarter financial decisions with confidence. With a client-centric approach and future-focused strategies, we strive to simplify financial planning and create solutions that support long-term growth, stability, and wealth creation.
            </p>
            <p style={{
              fontSize:14.5, color:"#5A5450", lineHeight:1.85, marginBottom:16,
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(-14px)",
              transition:"opacity .6s .68s, transform .6s .68s",
            }}>
              Our mission is to deliver transparent, personalized, and goal-oriented financial guidance that empowers clients at every stage of their financial journey. From investment planning and wealth management to insurance and tax-saving solutions.
            </p>
            <p style={{
              fontSize:14.5, color:"#5A5450", lineHeight:1.85, 
              opacity:active?1:0, transform:active?"translateX(0)":"translateX(-14px)",
              transition:"opacity .6s .68s, transform .6s .68s",
            }}>
               SBS Financial Services is dedicated to building lasting relationships through trust, expertise, and consistent financial growth.
            </p>

            {/* Buttons */}
            <div style={{
              display:"flex", flexDirection:"column", gap:10, marginTop:36,
              opacity:active?1:0, transform:active?"translateY(0)":"translateY(14px)",
              transition:"opacity .5s .85s, transform .5s .85s",
            }}>
              {[
                { label:"Read Our Full Story", primary:true  },
                { label:"Meet The Team", primary:false },
              ].map((b,i) => (
                <button
                  key={i} className="sbs-btn"
                  onMouseEnter={onEnter} onMouseLeave={onLeave}
                  style={{
                    display:"flex", alignItems:"center", justifyContent:"space-between",
                    width:"100%", padding:"11px 18px",
                    alignSelf:"center", borderRadius:4,
                    border: b.primary?"none":"1px solid rgba(26,26,26,.2)",
                    background: b.primary?"#1A1A1A":"transparent",
                    color: b.primary?"#F5F0E8":"#1A1A1A",
                    fontFamily:"'DM Sans',sans-serif", fontSize:11, letterSpacing:".14em",
                    textTransform:"uppercase", fontWeight:500,
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
          <div style={{ position:"relative", display:"flex", alignItems:"center", justifyContent:"center", padding:"20px 0" }}>
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
                  src="/image.png"
                  alt="Mr. Urval Shah"
                  fill
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

              {/* Gold 15+ badge — sticks to top-right corner of image */}
              <div
                className={active ? "sbs-badge-show" : "sbs-badge-hidden"}
                style={{
                  position:"absolute", top:0, right:0, zIndex:6,
                  background:"#C9A84C", padding:"14px 18px", textAlign:"center", minWidth:80,
                  transition:"opacity .5s .95s, transform .5s cubic-bezier(.34,1.56,.64,1) .95s",
                }}
              >
                <span style={{ fontFamily:"'Playfair Display',serif",fontSize:24,fontWeight:700,color:"#0A0906",display:"block",lineHeight:1 }}>15+</span>
                <span style={{ fontSize:8,letterSpacing:".14em",textTransform:"uppercase",color:"rgba(10,9,6,.6)",display:"block",marginTop:4 }}>Years</span>
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
                <span style={{ fontSize:10,letterSpacing:".1em",textTransform:"uppercase",color:"rgba(245,240,232,.7)" }}>SEBI Registered Advisor</span>
              </div>
            </div>
          </div>

          {/* ── RIGHT: Quote — vertically centered with image ── */}
          <div style={{
            paddingLeft:52,
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
                Financial confidence is built through disciplined planning, informed decisions, and trusted relationships.
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
        <div style={{
          display:"grid", gridTemplateColumns:"repeat(4,1fr)",
          marginTop:56, borderTop:"1px solid rgba(201,168,76,.18)",
          position:"relative", zIndex:2,
        }}>
          {[
            { num:`${counters.years}`,    suf:"+",   lbl:"Years of Trust", sub:"Since 2019"         },
            { num:`${counters.clients>=150?(counters.clients/150).toFixed(0)+"K":counters.clients}`, suf:"+", lbl:"Happy Clients", sub:"Across Gujarat" },
            { num:`₹${counters.assets}`,  suf:"Cr+", lbl:"Assets Managed", sub:"Growing every year" },
            { num:`${counters.retention}`,suf:"%",   lbl:"Retention Rate",  sub:"Clients for life"  },
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
        <div style={{
          background:"#C9A84C", padding:"15px 64px",
          display:"flex", alignItems:"center", justifyContent:"space-between",
          position:"relative", zIndex:2,
        }}>
          <div style={{
            position:"absolute", top:0, left:0, right:0, height:1,
            background:"linear-gradient(90deg,transparent,#C9A84C 30%,#C9A84C 70%,transparent)",
            opacity:.3,
          }}/>
          <span style={{ fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#1A1A1A" }}>
            SBS Financial Services · Ahmedabad, Gujarat
          </span>
          <div style={{ display:"flex" }}>
            {["Mutual Funds","Insurance","Wealth Planning","Tax Advisory"].map((s,i,arr) => (
              <span key={i} style={{
                fontSize:10, letterSpacing:".1em", textTransform:"uppercase",
                color:"#1A1A1A", padding:"0 16px",
                borderRight: i<arr.length-1?"1px solid rgba(255,255,255,.07)":"none",
              }}>{s}</span>
            ))}
          </div>
          <span style={{ fontSize:10,letterSpacing:".14em",textTransform:"uppercase",color:"#1A1A1A" }}>
            SEBI Registered
          </span>
        </div>

      </section>
    </>
  );
}