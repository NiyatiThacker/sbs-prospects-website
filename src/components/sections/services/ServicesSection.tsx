"use client";

import { useEffect } from "react";
import Link from "next/link";
const services = [
  {
    number: "1",
    title: "Mutual Funds & SIP Advisory",
    description:
      "Start your wealth-building journey with the right funds tailored to your goals and risk appetite.",
    features: [
      "Goal-based fund selection",
      "SIP planning & automation",
      "Regular portfolio tracking",
    ],
  },
  {
    number: "2",
    title: "Tax Planning & Advisory",
    description:
      "Minimise your tax burden legally while staying fully compliant with the latest regulations.",
    features: [
      "Income tax planning & filing",
      "Tax-saving investment guidance",
      "Capital gains optimisation",
    ],
  },
  {
    number: "3",
    title: "Insurance Solutions",
    description:
      "Protect what matters most with the right life, health, and general insurance coverage.",
    features: [
      "Life & term insurance advisory",
      "Health & critical illness plans",
      "Policy review & comparison",
    ],
  },
  {
    number: "4",
    title: "Financial Planning",
    description:
      "A comprehensive roadmap that connects every aspect of your finances toward a secure future.",
    features: [
      "Net worth & cash flow analysis",
      "Retirement & goal planning",
      "Emergency fund strategy",
    ],
  },
  {
    number: "5",
    title: "NRI Investment Services",
    description:
      "Invest in India confidently from abroad with fully compliant and hassle-free solutions.",
    features: [
      "NRE / NRO account guidance",
      "Repatriation & FEMA compliance",
      "India-based portfolio management",
    ],
  },
  {
    number: "6",
    title: "Portfolio Review & Rebalancing",
    description:
      "Keep your investments aligned to your goals with periodic, data-driven portfolio reviews.",
    features: [
      "In-depth portfolio health check",
      "Asset allocation rebalancing",
      "Performance benchmarking",
    ],
  },
];

export default function ServicesSection() {
  useEffect(() => {
    const link = document.createElement("link");
    link.rel = "stylesheet";
    link.href =
      "https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,700;0,900;1,700;1,900&family=Inter:wght@300;400;500&display=swap";
    document.head.appendChild(link);
  }, []);

  return (
    <div style={{ fontFamily: "'Inter', sans-serif" }}>
      {/* ── Section Header ── */}
      <div
        style={{
          width: "100%",
          textAlign: "center",
          backgroundColor: "#FFFFFF",
          padding: "64px 24px 56px",
        }}
      >
        <h2
          style={{
            fontFamily: "'Playfair Display', Georgia, serif",
            fontSize: "clamp(2rem, 4vw, 2.8rem)",
            fontWeight: 700,
            fontStyle: "italic",
            color: "#2C2420",
            margin: "0 0 18px 0",
            lineHeight: 1,
          }}
        >
          Services
        </h2>
        {/* Gold underline accent */}
        <div
          style={{
            width: "40px",
            height: "2px",
            backgroundColor: "#B8956A",
            margin: "0 auto",
          }}
        />
      </div>

      {/* ── Service Rows ── */}
      {services.map((service, index) => {
        const isEven = index % 2 === 1;
        const bg = isEven ? "#FFFFFF" : "#f5edde";

        return (
          <div key={service.number} style={{ backgroundColor: bg }}>
            <div
              style={{
                maxWidth: "860px",
                margin: "0 auto",
                padding: "56px 24px",
                display: "flex",
                flexDirection: "row",
                alignItems: "flex-start",
                gap: "48px",
              }}
              className="services-row"
            >
              {/* ── Text block ── */}
              <div
                style={{
                  flex: "1 1 0",
                  minWidth: 0,
                  order: isEven ? 2 : 1,
                }}
              >
                {/* Number + Title */}
                <div
                  style={{
                    display: "flex",
                    alignItems: "baseline",
                    gap: "10px",
                    marginBottom: "12px",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "2.4rem",
                      fontWeight: 900,
                      fontStyle: "italic",
                      color: "#2C2420",
                      lineHeight: 1,
                      flexShrink: 0,
                    }}
                  >
                    {service.number}.
                  </span>
                  <h3
                    style={{
                      fontFamily: "'Playfair Display', Georgia, serif",
                      fontSize: "1.45rem",
                      fontWeight: 700,
                      fontStyle: "italic",
                      color: "#2C2420",
                      lineHeight: 1.25,
                      margin: 0,
                    }}
                  >
                    {service.title}
                  </h3>
                </div>

                {/* Divider */}
                <div
                  style={{
                    height: "1px",
                    backgroundColor: "#C8BFB5",
                    marginBottom: "16px",
                  }}
                />

                {/* Description */}
                <p
                  style={{
                    fontSize: "0.9rem",
                    color: "#4A3F3A",
                    lineHeight: 1.75,
                    marginBottom: "18px",
                  }}
                >
                  {service.description}
                </p>

                {/* Features */}
                <ul
                  style={{
                    listStyle: "none",
                    padding: 0,
                    margin: "0 0 28px 0",
                    display: "flex",
                    flexDirection: "column",
                    gap: "8px",
                  }}
                >
                  {service.features.map((f) => (
                    <li
                      key={f}
                      style={{
                        display: "flex",
                        alignItems: "flex-start",
                        gap: "10px",
                        fontSize: "0.88rem",
                        color: "#4A3F3A",
                      }}
                    >
                      <span style={{ color: "#8A7060", flexShrink: 0 }}>✓</span>
                      {f}
                    </li>
                  ))}
                </ul>

                {/* Buttons */}
                <div style={{ display: "flex", gap: "12px", flexWrap: "wrap" }}>
                  <button
                  className="sbs-book-btn"
                    style={{
                      backgroundColor: "#7A6555",
                    border: "1.5px solid #7A6555",
                    color: "#FFFFFF",
                    fontSize: "0.62rem",
                    letterSpacing: "0.2em",
                    fontWeight: 500,
                    padding: "11px 20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    whiteSpace: "nowrap",
                    textDecoration: "none",
                    }}
                  >
                    Read More
                  </button>
                  
                  {/* Replace the Book Now <button> with <Link> */}
                  <Link
                    href="/contact" // <-- Path to your contact page
                     className="sbs-book-btn"
                    style={{
                    backgroundColor: "#7A6555",
                    border: "1.5px solid #7A6555",
                    color: "#FFFFFF",
                    fontSize: "0.62rem",
                    letterSpacing: "0.2em",
                    fontWeight: 500,
                    padding: "11px 20px",
                    cursor: "pointer",
                    fontFamily: "'Inter', sans-serif",
                    textTransform: "uppercase",
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    whiteSpace: "nowrap",
                    textDecoration: "none", // <-- ADD THIS to remove standard link underline
                  }}
                  >
                    Book Now <span style={{ fontSize: "0.9rem" }}>→</span>
                  </Link>
                 </div> 
               </div>
              {/* ── Image box ── */}
              <div
                style={{
                  width: "280px",
                  flexShrink: 0,
                  height: "320px",
                  border: "1px solid #C8BFB5",
                  backgroundColor: "transparent",
                  display: "flex",
                  alignItems: "flex-start",
                  padding: "12px 14px",
                  order: isEven ? 1 : 2,
                }}
              >
                <span
                  style={{
                    fontSize: "0.75rem",
                    color: "#8A7060",
                    fontFamily: "'Inter', sans-serif",
                  }}
                >
                  {service.title}
                </span>
              </div>
            </div>
          </div>
        );
      })}

      {/* ── Responsive styles ── */}
      {/* ── Book Now Button Hover Styles ── */}
       <style>{`
        
        .sbs-book-btn {
          background: linear-gradient(90deg, #7D6039 0%, #C0A580 25%, #DEC6A4 50%, #C0A580 75%, #7D6039 100%);
          background-size: 200% auto;
          border: 1.5px solid #7D6039;
          color: #FFFFFF;
          font-size: 0.62rem;
          letter-spacing: 0.2em;
          font-weight: 600;
          padding: 11px 20px;
          cursor: pointer;
          font-family: 'Inter', sans-serif;
          text-transform: uppercase;
          display: inline-flex;
          align-items: center;
          gap: 8px;
          white-space: nowrap;
          text-decoration: none;
          box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
          transition: all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1);
        }
        .sbs-book-btn:hover {
          background-position: right center;
          transform: translateY(-2px);
          filter: brightness(1.06);
          box-shadow: 0 6px 14px rgba(125, 96, 57, 0.35);
        }
        .sbs-book-btn span {
          transition: transform 0.3s ease;
          display: inline-block;
        }
        .sbs-book-btn:hover span {
          transform: translateX(4px);
        }
        @media (max-width: 640px) {
          .services-row {
            flex-direction: column !important;
            padding: 40px 20px !important;
            gap: 28px !important;
          }
          .services-row > div {
            order: unset !important;
            width: 100% !important;
          }
          .services-row > div[style*="width: 280px"] {
            width: 100% !important;
            height: 220px !important;
          }
        }
      `}</style>
    </div>
  );
}