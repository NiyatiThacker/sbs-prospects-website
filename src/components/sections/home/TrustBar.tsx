"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";

const NODES = [
  { label: "AMFI Registered", title: "Trusted Advisory" },
  { label: "Client-Centric", title: "Long-Term Planning" },
  { label: "Personalized", title: "Wealth Strategies" },
  { label: "Financial Solutions", title: "Structured Guidance" },
];

const SPEED = 0.004;

// Node visual size constants
const NODE_CIRCLE = 52;   // px diameter of the circle
const NODE_LABEL_H = 40;  // px approximate height of label + title text below circle
const NODE_MARGIN = 8;    // extra breathing room

// Total "reach" from node center to outermost text edge
const NODE_HALF_H = NODE_CIRCLE / 2 + NODE_MARGIN + NODE_LABEL_H;
// Horizontal half — text can be wider, ~80px half for "Long-Term Planning"
const NODE_HALF_W = 90;

export default function TrustBar() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const nodeRefs = useRef<(HTMLDivElement | null)[]>([]);
  const pausedRef = useRef<boolean[]>([false, false, false, false]);
  const masterAngleRef = useRef<number>(Math.PI * 1.25); // start at 225° so nodes are symmetric
  const frameRef = useRef<number>(0);
  const containerRef = useRef<HTMLDivElement>(null);
  const [canvasSize, setCanvasSize] = useState(500);
  const [orbitRadius, setOrbitRadius] = useState(160);

  useEffect(() => {
    function compute() {
      const vw = window.innerWidth;
      // Available width for the canvas (section has 24px padding each side)
      const available = Math.min(vw - 48, 520);
      // orbitRadius must satisfy:
      //   orbitRadius + NODE_HALF_W  <= available/2   (left/right nodes)
      //   orbitRadius + NODE_HALF_H  <= available/2   (top/bottom nodes)
      const maxByW = available / 2 - NODE_HALF_W - 4;
      const maxByH = available / 2 - NODE_HALF_H - 4;
      const r = Math.floor(Math.min(maxByW, maxByH, 175));
      const size = (r + Math.max(NODE_HALF_W, NODE_HALF_H) + 8) * 2;
      setOrbitRadius(r);
      setCanvasSize(size);
    }
    compute();
    window.addEventListener("resize", compute);
    return () => window.removeEventListener("resize", compute);
  }, []);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const CX = canvasSize / 2;
    const CY = canvasSize / 2;
    const R = orbitRadius;

    let t = 0;

    function getPositions() {
      if (!pausedRef.current.some(Boolean)) {
        masterAngleRef.current += SPEED;
      }
      return NODES.map((_, i) => {
        const angle = masterAngleRef.current + (Math.PI / 2) * i;
        return {
          x: CX + R * Math.cos(angle),
          y: CY + R * Math.sin(angle),
        };
      });
    }

    function draw() {
      ctx!.clearRect(0, 0, canvasSize, canvasSize);

      // Single orbit ring
      ctx!.beginPath();
      ctx!.arc(CX, CY, R, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(184,144,26,0.22)";
      ctx!.lineWidth = 1;
      ctx!.setLineDash([5, 10]);
      ctx!.stroke();
      ctx!.setLineDash([]);

      // Inner decorative ring
      ctx!.beginPath();
      ctx!.arc(CX, CY, 72, 0, Math.PI * 2);
      ctx!.strokeStyle = "rgba(184,144,26,0.08)";
      ctx!.lineWidth = 1;
      ctx!.stroke();

      const positions = getPositions();

      // Lines center → node
      positions.forEach((p) => {
        ctx!.beginPath();
        ctx!.moveTo(CX, CY);
        ctx!.lineTo(p.x, p.y);
        ctx!.strokeStyle = "rgba(184,144,26,0.12)";
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      });

      // Lines node → next node
      positions.forEach((p, i) => {
        const next = positions[(i + 1) % 4];
        ctx!.beginPath();
        ctx!.moveTo(p.x, p.y);
        ctx!.lineTo(next.x, next.y);
        ctx!.strokeStyle = "rgba(184,144,26,0.08)";
        ctx!.lineWidth = 0.5;
        ctx!.stroke();
      });

      // Traveling dots
      positions.forEach((p, i) => {
        const prog = ((t * 0.012) + i * 0.25) % 1;
        ctx!.beginPath();
        ctx!.arc(CX + (p.x - CX) * prog, CY + (p.y - CY) * prog, 1.5, 0, Math.PI * 2);
        ctx!.fillStyle = "rgba(233,195,73,0.75)";
        ctx!.fill();
      });

      // Position DOM nodes
      positions.forEach((p, i) => {
        const el = nodeRefs.current[i];
        if (!el) return;
        el.style.left = p.x - el.offsetWidth / 2 + "px";
        el.style.top = p.y - el.offsetHeight / 2 + "px";
      });

      t++;
      frameRef.current = requestAnimationFrame(draw);
    }

    draw();
    return () => cancelAnimationFrame(frameRef.current);
  }, [canvasSize, orbitRadius]);

  return (
    <section style={{
      background: "#fbf3e4",
      padding: "64px 24px",
      fontFamily: "var(--font-inter)",
      position: "relative",
      overflow: "hidden",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      borderTop: "1px solid #e8e0d0",
      borderBottom: "1px solid #e8e0d0",
    }}>
      {/* Gold orb glow */}
      <div style={{
        position: "absolute", borderRadius: "50%",
        filter: "blur(80px)", pointerEvents: "none",
        width: 320, height: 320,
        background: "rgba(184,144,26,0.06)",
        top: "50%", left: "50%",
        transform: "translate(-50%,-50%)",
      }} />

      {/* Heading */}
      <div style={{ textAlign: "center", marginBottom: 32, position: "relative", zIndex: 2 }}>
        <p style={{
          fontSize: 10, letterSpacing: "0.32em", color: "#b8901a",
          textTransform: "uppercase", marginBottom: 10,
        }}>Connected Financial Planning</p>
        <h2 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(22px, 5vw, 28px)", fontWeight: 400,
          color: "#1e1b13", letterSpacing: "0.04em", margin: 0,
        }}>The SBS Wealth Ecosystem</h2>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: 8, marginTop: 14 }}>
          <div style={{ width: 28, height: 1, background: "#c9a84c" }} />
          <div style={{ width: 5, height: 5, background: "#e9c349", transform: "rotate(45deg)" }} />
          <div style={{ width: 28, height: 1, background: "#c9a84c" }} />
        </div>
      </div>

      {/* Canvas container — overflow visible so labels never clip */}
      <div
        ref={containerRef}
        style={{
          position: "relative",
          width: canvasSize,
          height: canvasSize,
          zIndex: 2,
          overflow: "visible",
        }}
      >
        <canvas
          ref={canvasRef}
          width={canvasSize}
          height={canvasSize}
          style={{ position: "absolute", top: 0, left: 0, zIndex: 1 }}
        />

        {/* Center badge */}
        <div style={{
          position: "absolute", top: "50%", left: "50%",
          transform: "translate(-50%,-50%)",
          width: 140, height: 140, borderRadius: "50%",
          border: "1px solid rgba(184,144,26,0.45)",
          display: "flex", alignItems: "center", justifyContent: "center",
          background: "#faf6ef", zIndex: 10,
          boxShadow: "0 0 40px rgba(184,144,26,0.14), inset 0 0 18px rgba(184,144,26,0.05)",
        }}>
          <div style={{
            width: 102, height: 102, borderRadius: "50%",
            border: "1px solid rgba(184,144,26,0.22)",
            display: "flex", alignItems: "center", justifyContent: "center",
            background: "rgba(255,255,255,0.35)", backdropFilter: "blur(8px)",
          }}>
            <Image src="/logo/Sbs-1.png" alt="SBS Trust"
              width={84} height={84}
              style={{ objectFit: "contain", borderRadius: "50%" }} />
          </div>
        </div>

        {/* Orbiting nodes */}
        {NODES.map((node, i) => (
          <div
            key={i}
            ref={(el) => { nodeRefs.current[i] = el; }}
            onMouseEnter={() => { pausedRef.current[i] = true; }}
            onMouseLeave={() => { pausedRef.current[i] = false; }}
            style={{
              position: "absolute",
              display: "flex", flexDirection: "column", alignItems: "center",
              cursor: "default", zIndex: 5,
              // Fixed width so offsetWidth is stable and text doesn't reflow
              width: 160,
            }}
          >
            <div style={{
              width: 52, height: 52, borderRadius: "50%",
              border: "1px solid rgba(184,144,26,0.4)",
              background: "#faf6ef",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 8,
              boxShadow: "0 0 12px rgba(184,144,26,0.1)",
              flexShrink: 0,
            }}>
              <div style={{ position: "relative", width: 16, height: 16, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{
                  position: "absolute", width: 16, height: 16, borderRadius: "50%",
                  border: "1px solid rgba(201,168,76,0.35)",
                  animation: "pulseOrb 2.8s ease-in-out infinite",
                }} />
                <div style={{
                  width: 8, height: 8, borderRadius: "50%",
                  background: "radial-gradient(circle, #f4d87a 0%, #c9a84c 70%)",
                  boxShadow: "0 0 14px rgba(201,168,76,0.45)",
                }} />
              </div>
            </div>
            <span style={{
              fontSize: 8.5, letterSpacing: "0.18em", color: "#b8901a",
              textTransform: "uppercase", textAlign: "center", marginBottom: 3,
              fontFamily: "var(--font-inter)", display: "block",
            }}>
              {node.label}
            </span>
            <span style={{
              fontFamily: "var(--font-playfair)", fontSize: 13, fontWeight: 400,
              color: "#1e1b13", textAlign: "center", display: "block",
            }}>
              {node.title}
            </span>
          </div>
        ))}
      </div>

      {/* Marquee */}
      <div style={{
        width: "100%", overflow: "hidden",
        borderTop: "1px solid rgba(184,144,26,0.14)",
        borderBottom: "1px solid rgba(184,144,26,0.14)",
        marginTop: 34, padding: "14px 0",
        position: "relative", zIndex: 2,
        background: "rgba(255,255,255,0.28)", backdropFilter: "blur(10px)",
      }}>
        <div style={{
          display: "flex", width: "max-content",
          animation: "sbsMarquee 26s linear infinite",
          gap: 48, whiteSpace: "nowrap",
        }}>
          {[
            "Legacy-Focused Wealth Planning", "Disciplined Financial Guidance",
            "Long-Term Relationship Driven Advisory", "Structured Investment Thinking",
            "Preserving Wealth Across Generations", "Clarity Through Every Financial Stage",
            "Legacy-Focused Wealth Planning", "Disciplined Financial Guidance",
            "Long-Term Relationship Driven Advisory", "Structured Investment Thinking",
            "Preserving Wealth Across Generations", "Clarity Through Every Financial Stage",
          ].map((text, i) => (
            <span key={i} style={{
              fontSize: 10, letterSpacing: "0.26em", textTransform: "uppercase",
              color: "#b8901a", fontFamily: "var(--font-inter)",
            }}>{text}</span>
          ))}
        </div>
      </div>
    </section>
  );
}