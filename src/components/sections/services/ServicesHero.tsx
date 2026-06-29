"use client";

import { useEffect } from "react";

export default function ServicesHero() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:wght@700;900&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <section
      style={{
        background: "radial-gradient(ellipse at center, #B0A090 0%, #8A7A6A 45%, #6E6055 100%)",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        textAlign: "center",
        padding: "80px 24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      {/* Eyebrow */}
      <p
        style={{
          fontSize: "0.65rem",
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.72)",
          fontWeight: 400,
          marginBottom: "24px",
        }}
      >
        Our Services
      </p>

      {/* Main Headline — large display */}
      <h1
        style={{
          fontFamily: "'Playfair Display', Georgia, serif",
          fontSize: "clamp(2.5rem, 6vw, 9rem)",
          fontWeight: 900,
          color: "#FFFFFF",
          lineHeight: 1.0,
          margin: "0 0 36px 0",
          maxWidth: "960px",
        }}
      >
        Career Support
      </h1>

      {/* Sub-tagline */}
      <p
        style={{
          fontSize: "0.6rem",
          letterSpacing: "0.38em",
          textTransform: "uppercase",
          color: "rgba(255,255,255,0.68)",
          fontWeight: 400,
          marginBottom: "52px",
        }}
      >
        Grow your wealth with expert-led financial guidance
      </p>

      {/* Pill CTA Button */}
            {/* Pill CTA Button (Linked to contact page with original style) */}
      <a
        href="/contact"
        style={{
          backgroundColor: "transparent",
          border: "1.5px solid rgba(255,255,255,0.72)",
          color: "#FFFFFF",
          fontSize: "0.62rem",
          letterSpacing: "0.25em",
          fontWeight: 400,
          padding: "16px 48px",
          borderRadius: "999px",
          cursor: "pointer",
          fontFamily: "'Inter', sans-serif",
          textTransform: "uppercase",
          display: "inline-flex",
          alignItems: "center",
          gap: "10px",
          textDecoration: "none", // <-- Ensures no link underline
          transition: "background-color 0.2s ease, border-color 0.2s ease",
        }}
        onMouseEnter={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            "rgba(255,255,255,0.12)";
        }}
        onMouseLeave={(e) => {
          (e.currentTarget as HTMLAnchorElement).style.backgroundColor =
            "transparent";
        }}
      >
        Let&apos;s Talk <span style={{ fontSize: "0.9rem" }}>→</span>
      </a>
    </section>
  );
}