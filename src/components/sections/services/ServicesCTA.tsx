"use client";

import { useEffect } from "react";

export default function ServicesCTA() {
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
        backgroundColor: "#FFFFFF",
        padding: "100px 24px",
        fontFamily: "'Inter', sans-serif",
        textAlign: "center",
      }}
    >
      <div style={{ maxWidth: "760px", margin: "0 auto" }}>

        {/* Eyebrow */}
        <p
          style={{
            fontSize: "0.65rem",
            letterSpacing: "0.35em",
            textTransform: "uppercase",
            color: "#B8956A",
            fontWeight: 400,
            marginBottom: "22px",
          }}
        >
          Ready to Grow?
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2.2rem, 5.5vw, 3.6rem)",
            fontWeight: 900,
            color: "#1A1714",
            lineHeight: 1.12,
            margin: "0 0 28px 0",
          }}
        >
          Let&apos;s Build Something Exceptional Together
        </h2>

        {/* Gold divider */}
        <div
          style={{
            width: "48px",
            height: "2px",
            backgroundColor: "#B8956A",
            margin: "0 auto 32px auto",
          }}
        />

        {/* Body */}
        <p
          style={{
            fontSize: "1rem",
            color: "#4A3F3A",
            lineHeight: 1.8,
            maxWidth: "580px",
            margin: "0 auto 52px auto",
          }}
        >
          Book a free discovery call and let&apos;s talk about how we can turn your
          financial position into your most powerful asset.
        </p>

        {/* Buttons */}
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "20px",
            flexWrap: "wrap",
          }}
        >
          <button
            style={{
              backgroundColor: "#7A6555",
              border: "1.5px solid #7A6555",
              color: "#FFFFFF",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              fontWeight: 500,
              padding: "18px 40px",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
              display: "flex",
              alignItems: "center",
              gap: "10px",
              minWidth: "220px",
              justifyContent: "center",
            }}
          >
            Book a Free Call <span style={{ fontSize: "1rem" }}>→</span>
          </button>

          <button
            style={{
              backgroundColor: "transparent",
              border: "1.5px solid #2C2420",
              color: "#2C2420",
              fontSize: "0.62rem",
              letterSpacing: "0.22em",
              fontWeight: 500,
              padding: "18px 40px",
              cursor: "pointer",
              fontFamily: "'Inter', sans-serif",
              textTransform: "uppercase",
              minWidth: "220px",
            }}
          >
            Learn About Us
          </button>
        </div>
      </div>
    </section>
  );
}