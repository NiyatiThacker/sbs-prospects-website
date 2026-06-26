"use client";

import { useEffect, useRef } from "react";

export default function ServicesIntro() {
  const arrowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Load Google Fonts dynamically
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,900;1,900&family=Inter:wght@300;400&display=swap";
    document.head.appendChild(link);

    // Floating arrow animation
    const el = arrowRef.current;
    if (!el) return;
    let frame: number;
    let start: number | null = null;
    const animate = (ts: number) => {
      if (!start) start = ts;
      const t = (ts - start) / 1000;
      el.style.transform = `translateY(${Math.sin(t * 2) * 5}px)`;
      frame = requestAnimationFrame(animate);
    };
    frame = requestAnimationFrame(animate);
    return () => cancelAnimationFrame(frame);
  }, []);

  return (
    <section
      className="min-h-screen flex flex-col items-center justify-center px-2 py-15 text-center margin-top-5"
      style={{ backgroundColor: "#F7F5F0" }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: ".78rem",
          letterSpacing: "0.28em",
          textTransform: "uppercase",
          color: "#B8956A",
          fontWeight: 300,
          marginBottom: "2.5rem",
          
        }}
      >
        We&apos;re not just another finance firm
      </p>

      {/* Main Headline */}
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "2.5rem",
          lineHeight: 1.07,
          fontWeight: 900,
          color: "#1A1714",
          maxWidth: "1000px",
          margin: "0 auto",
        }}
      >
        We turn{" "}
        <em
          style={{
            fontStyle: "italic",
            color: "#B8956A",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
          }}
        >
          financial complexity
        </em>{" "}
        from a burden into your biggest{" "}
        <em
          style={{
            fontStyle: "italic",
            color: "#B8956A",
            fontFamily: "'Playfair Display', Georgia, serif",
            fontWeight: 900,
            
          }}
        >
          competitive advantage
        </em>
      </h1>

      {/* Body copy */}
      <p
        style={{
          fontFamily: "'Inter', sans-serif",
          fontSize: "1.05rem",
          lineHeight: 1.8,
          color: "#3D3530",
          maxWidth: "560px",
          marginTop: "2.5rem",
          fontWeight: 400,
         
        }}
      >
        We understand that behind every number, statement, and balance sheet is
        a real person building something meaningful — and we&apos;re here to
        protect it.
      </p>
    </section>
  );
}