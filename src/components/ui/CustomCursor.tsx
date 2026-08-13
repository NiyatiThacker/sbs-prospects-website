"use client";

import { useEffect, useRef, useState } from "react";

export default function CustomCursor() {
  const curDotRef = useRef<HTMLDivElement>(null);
  const curRingRef = useRef<HTMLDivElement>(null);
  const [isMobile, setIsMobile] = useState(false);

  useEffect(() => {
    const check = () => setIsMobile(window.innerWidth <= 768);
    check();
    window.addEventListener("resize", check);
    return () => window.removeEventListener("resize", check);
  }, []);

  useEffect(() => {
    if (isMobile) return;
    let rx = 0, ry = 0, mx = 0, my = 0, rafId: number;
    const onMove = (e: MouseEvent) => {
      mx = e.clientX; my = e.clientY;
      if (curDotRef.current) {
        curDotRef.current.style.left = mx + "px";
        curDotRef.current.style.top = my + "px";
      }
    };
    const animRing = () => {
      rx += (mx - rx) * 0.11;
      ry += (my - ry) * 0.11;
      if (curRingRef.current) {
        curRingRef.current.style.left = rx + "px";
        curRingRef.current.style.top = ry + "px";
      }
      rafId = requestAnimationFrame(animRing);
    };
    animRing();
    document.addEventListener("mousemove", onMove);
    return () => { document.removeEventListener("mousemove", onMove); cancelAnimationFrame(rafId); };
  }, [isMobile]);

  if (isMobile) return null;

  return (
    <>
      <style>{`
        /* ── Custom cursor: desktop only ── */
        @media (hover: hover) and (pointer: fine) {
          * { cursor: none !important; }
        }

        .sbs-cur-dot {
          position: fixed; border-radius: 50%;
          pointer-events: none; z-index: 999999;
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
          pointer-events: none; z-index: 999998;
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
      `}</style>
      <div ref={curDotRef} className="sbs-cur-dot" />
      <div ref={curRingRef} className="sbs-cur-ring" />
    </>
  );
}
