"use client";

import { Bold } from "lucide-react";
import { useEffect } from "react";

const reasons = [
  {
    title: "Results-Driven Strategy",
    description:
      "Every plan we build is tied to measurable outcomes — returns, savings, and long-term security.",
  },
  {
    title: "Done-For-You Execution",
    description:
      "We don't just hand you a plan. We manage the complexity so you stay focused on what matters.",
  },
  {
    title: "Client-First Approach",
    description:
      "Behind every portfolio is a real person with real goals. We put your interests above everything else.",
  },
  {
    title: "Boutique Precision",
    description:
      "We work with a select number of clients so you always receive our complete focus and expertise.",
  },
];

export default function WhyChooseServices() {
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
        background: "#f5edde",
        padding: "100px 24px",
        fontFamily: "'Inter', sans-serif",
      }}
    >
      <div style={{ maxWidth: "900px", margin: "0 auto" }}>

        {/* Eyebrow */}
        <p
          style={{
            textAlign: "center",
            fontSize: "0.65rem",
            letterSpacing: "0.38em",
            textTransform: "uppercase",
            color: "#5B3C0C",
            fontWeight: 450,
            marginBottom: "20px",
          }}
        >
          Why Work With Us
        </p>

        {/* Headline */}
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 5vw, 3.2rem)",
            fontWeight: 900,
            color: "#4b3516",
            textAlign: "center",
            lineHeight: 1.18,
            marginBottom: "72px",
          }}
        >
          Everything You Need to Grow — Under One Roof
        </h2>

        {/* 2×2 Grid */}
        <div
          style={{
            display: "grid",
            gridTemplateColumns: "1fr 1fr",
            rowGap: "52px",
            columnGap: "48px",
          }}
          className="why-grid"
        >
          {reasons.map((reason) => (
            <div key={reason.title} style={{ display: "flex", gap: "16px", alignItems: "flex-start" }}>
              {/* Diamond icon */}
              <span
                style={{
                  color: "#4b3516",
                  fontSize: "1rem",
                  flexShrink: 0,
                  marginTop: "3px",
                }}
              >
                ✦
              </span>

              <div>
                <h3
                  style={{
                    fontFamily: "'Inter', sans-serif",
                    fontSize: "1rem",
                    
                    fontWeight: 1000,
                    color: "#32230f",
                    marginBottom: "10px",
                    lineHeight: 1.3,
                  }}
                >
                  {reason.title}
                </h3>
                <p
                  style={{
                    fontSize: "0.88rem",
                    color: "#443014",
                    lineHeight: 1.75,
                    margin: 0,
                  }}
                >
                  {reason.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Mobile: stack to single column */}
      <style>{`
        @media (max-width: 600px) {
          .why-grid {
            grid-template-columns: 1fr !important;
            row-gap: 40px !important;
          }
        }
      `}</style>
    </section>
  );
}