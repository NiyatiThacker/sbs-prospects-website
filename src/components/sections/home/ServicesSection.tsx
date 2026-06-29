"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const SERVICES = [
  {
    id: "Industry Training Programs",
    label: "INDUSTRY TRAINING PROGRAMS",
    title: "Industry Training Programs",
    headline: "Curated funds, Long-term wealth creation.",
    body: "Transform your financial aspirations into reality with personalized mutual fund and SIP solutions designed for consistent growth, disciplined investing, and long-term wealth creation.",
    points: [
      "Strategic Fund Selection",
      "Goal-Based SIP Planning",
      "Performance Monitoring",
      "Portfolio Optimization",
    ],
    stat1: { val: "340+", label: "Fund Options" },
    stat2: { val: "₹500Cr+", label: "Assets Managed" },
  },
  {
    id: "MBA Skill Development Courses",
    label: "MBA SKILL DEVELOPMENT COURSES",
    title: "MBA Skill Development Courses",
    headline: "Discipline compounds silently, Brilliantly.",
    body: "Make smarter tax decisions with personalized planning, compliance-focused solutions, and expert guidance designed to optimize your savings and support your financial goals.",
    points: [
      "Strategic Tax Planning",
      "GST Compliance Support",
      "Income Tax Assistance",
      "Regulatory & Advisory Support",
    ],
    stat1: { val: "1,200+", label: "Active SIP Clients" },
    stat2: { val: "₹80L", label: "Avg. SIP Corpus at Maturity" },
  },
  {
    id: "HR Consultancy",
    label: "HR CONSULTANCY",
    title: "HR Consultancy",
    headline: "Protection designed around your exposure.",
    body: "Most clients are either under-insured or wrongly insured. We begin with a coverage audit — identifying gaps before recommending anything. Then we build a bespoke protection structure for your family and lifestyle.",
    points: [
      "Full coverage gap audit",
      "Pure term life coverage",
      "Critical illness & super top-up health",
      "Family & lifestyle protection",
      "Annual coverage review",
    ],
    stat1: { val: "99.1%", label: "Claim Settlement Rate" },
    stat2: { val: "50+", label: "Insurers Accessed" },
  },
  {
    id: "Career Guidance",
    label: "CAREER GUIDANCE",
    title: "Career Guidance",
    headline: "Tax planning begins at income, not at filing.",
    body: "The best tax outcome comes from structuring made months before the financial year ends — not in March. We work year-round across ELSS, NPS, PPF, and capital gains harvesting to minimise your liability.",
    points: [
      "Year-round tax structuring",
      "ELSS, NPS & PPF optimisation",
      "Capital gains harvesting",
      "HUF & business structuring",
      "ITR filing & audit support",
    ],
    stat1: { val: "₹1.2L", label: "Avg. Tax Saved / Year" },
    stat2: { val: "100%", label: "Compliance Rate" },
  },
  {
    id: "Recruitment Support",
    label: "RECRUITMENT SUPPORT",
    title: "Recruitment Support",
    headline: "Stable returns. Secure capital. Zero noise.",
    body: "For capital that needs certainty, we provide access to stable fixed-income solutions across trusted banks and institutions. Structured for secure capital preservation with optimal interest rate positioning.",
    points: [
      "Curated bank & NBFC FD options",
      "Laddering strategy for liquidity",
      "Highest-rated institution access",
      "Interest rate optimisation",
      "Auto-renewal management",
    ],
    stat1: { val: "25+", label: "Partner Institutions" },
    stat2: { val: "100%", label: "Capital Safety Record" },
  },
  {
    id: "Internship Programs",
    label: "INTERNSHIP PROGRAMS",
    title: "Internship Programs",
    headline: "Build the corpus. Then design the income.",
    body: "Retirement planning has two distinct phases: accumulation and distribution. We engineer both — building inflation-adjusted corpora during working years and designing SWP-based income structures that last a lifetime.",
    points: [
      "Inflation-adjusted corpus projections",
      "NPS & annuity planning",
      "SWP-based post-retirement income",
      "Healthcare cost provisioning",
      "Estate transfer built-in",
    ],
    stat1: { val: "₹2.4Cr", label: "Avg. Corpus Built" },
    stat2: { val: "500+", label: "Retirement Plans Active" },
  },
];

function VisualPanel({ service }: { service: typeof SERVICES[0] }) {
  return (
    <div style={{
      position: "relative",
      height: "100%",
      padding: "1.5rem",
      display: "flex",
      flexDirection: "column",
      justifyContent: "space-between",
      gap: "1.2rem",
    }}>
      {/* Top content */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 14 }}>
          <div style={{ width: 16, height: 1, background: "rgba(184,144,26,0.5)" }} />
          <span style={{
            fontFamily: "var(--font-inter)", fontSize: "0.56rem",
            letterSpacing: "0.32em", fontWeight: 700,
            color: "#b8901a", textTransform: "uppercase" as const,
          }}>
            {service.label}
          </span>
        </div>

        <h3 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(1.15rem, 3vw, 1.9rem)",
          fontWeight: 400, color: "#1e1b13",
          letterSpacing: "-0.02em", lineHeight: 1.25,
          margin: "0 0 10px", maxWidth: 480,
        }}>
          {service.headline}
        </h3>

        <div style={{
          height: 1, width: 48,
          background: "linear-gradient(90deg, #c9a84c, transparent)",
          marginBottom: 14,
        }} />

        <p style={{
          fontFamily: "var(--font-inter)", fontSize: "0.74rem",
          lineHeight: 1.8, color: "#5f5a52", maxWidth: 500, margin: 0,
        }}>
          {service.body}
        </p>
      </div>

      {/* Points */}
      <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
        {service.points.map((pt, i) => (
          <div key={i} style={{ display: "flex", alignItems: "center", gap: 12 }}>
            <div style={{
              width: 4, height: 4, borderRadius: "50%",
              background: "#c9a84c", flexShrink: 0,
            }} />
            <span style={{
              fontFamily: "var(--font-inter)", fontSize: "0.7rem",
              color: "#6b6459", lineHeight: 1.5,
            }}>
              {pt}
            </span>
          </div>
        ))}
      </div>

      {/* Stats + CTA */}
      <div style={{
        display: "flex", alignItems: "center",
        justifyContent: "space-between", flexWrap: "wrap", gap: "1rem",
        paddingTop: "1.2rem", borderTop: "1px solid rgba(184,144,26,0.15)",
      }}>
        <div style={{ display: "flex", gap: 28, flexWrap: "wrap" }}>
          {[service.stat1, service.stat2].map(st => (
            <div key={st.label}>
              <p style={{
                fontFamily: "var(--font-playfair)", fontSize: "1.2rem",
                fontWeight: 400, color: "#1e1b13", margin: "0 0 3px",
              }}>
                {st.val}
              </p>
              <p style={{
                fontFamily: "var(--font-inter)", fontSize: "0.5rem",
                letterSpacing: "0.2em", color: "#b8901a",
                textTransform: "uppercase" as const, margin: 0,
              }}>
                {st.label}
              </p>
            </div>
          ))}
        </div>

        <Link href="/services">
          <motion.button
            whileHover={{ y: -2, boxShadow: "0 8px 24px rgba(184,144,26,0.2)", backgroundColor: "rgba(184,144,26,0.08)" }}
            transition={{ duration: 0.3 }}
            style={{
              display: "flex", alignItems: "center", gap: 10,
              padding: "0.65rem 1.4rem", borderRadius: 100,
              background: "transparent", border: "1px solid rgba(184,144,26,0.35)",
              color: "#b8901a", fontSize: "0.56rem", letterSpacing: "0.2em",
              fontWeight: 700, textTransform: "uppercase" as const,
              cursor: "pointer", fontFamily: "var(--font-inter)",
            }}
          >
            <span>Explore service</span>
            <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="5" y1="12" x2="19" y2="12" /><polyline points="12 5 19 12 12 19" />
            </svg>
          </motion.button>
        </Link>
      </div>
    </div>
  );
}

export default function ServicesSection() {
  const [activeIndex, setActiveIndex] = useState(0);         // desktop
  const [mobileOpen, setMobileOpen] = useState<number | null>(null); // mobile: all closed

  return (
    <div style={{
      width: "100%",
      background: "#fff8ef",
      fontFamily: "var(--font-inter)",
      position: "relative",
      borderTop: "1px solid rgba(184,144,26,0.2)",
      borderBottom: "1px solid rgba(184,144,26,0.2)",
    }}>

      {/* Header */}
      <div style={{
        maxWidth: 1100, margin: "0 auto",
        padding: "3rem 1.5rem 2rem",
        position: "relative", zIndex: 1,
      }}>
        <div style={{ display: "flex", alignItems: "center", gap: 10, marginBottom: 12 }}>
          <div style={{ width: 20, height: 1, background: "rgba(184,144,26,0.4)" }} />
          <span style={{
            fontSize: "0.56rem", letterSpacing: "0.35em", fontWeight: 700,
            color: "#b8901a", textTransform: "uppercase" as const,
          }}>
            SBS Prospects
          </span>
        </div>
        <h2 style={{
          fontFamily: "var(--font-playfair)",
          fontSize: "clamp(2rem, 5vw, 3rem)",
          fontWeight: 400, color: "#1e1b13",
          letterSpacing: "-0.025em", lineHeight: 1.1, margin: 0,
        }}>
          Our Services
        </h2>
        <div style={{
          marginTop: 20, height: 1,
          background: "linear-gradient(90deg, rgba(184,144,26,0.3), transparent 55%)",
        }} />
      </div>

      {/* ── MOBILE: accordion-style stacked list ── */}
      <div className="block md:hidden" style={{ padding: "0 1.5rem 3rem", maxWidth: 1100, margin: "0 auto" }}>
        {SERVICES.map((s, i) => {
          const isActive = i === mobileOpen;
          return (
            <div key={s.id} style={{ borderBottom: "1px solid rgba(184,144,26,0.15)" }}>
              {/* Tab header */}
              <button
                onClick={() => setMobileOpen(mobileOpen === i ? null : i)}
                style={{
                  width: "100%", background: "transparent", border: "none",
                  padding: "1rem 0", cursor: "pointer",
                  display: "flex", alignItems: "center", justifyContent: "space-between",
                  gap: 12, textAlign: "left",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                  <span style={{
                    fontFamily: "var(--font-playfair)",
                    fontSize: isActive ? "1.1rem" : "1rem", fontWeight: 400,
                    color: isActive ? "#1e1b13" : "rgba(30,27,19,0.45)",
                    letterSpacing: "0.005em",
                  }}>
                    {s.title}
                  </span>
                </div>
                {/* Chevron */}
                <svg
                  width="14" height="14" viewBox="0 0 24 24" fill="none"
                  stroke={isActive ? "#b8901a" : "rgba(30,27,19,0.3)"}
                  strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
                  style={{ transform: isActive ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.3s", flexShrink: 0 }}
                >
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </button>

              {/* Expanded panel */}
              {isActive && (
                <div style={{
                  background: "rgba(184,144,26,0.04)",
                  borderRadius: 8, marginBottom: "1rem",
                  border: "1px solid rgba(184,144,26,0.12)",
                }}>
                  <VisualPanel service={s} />
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── DESKTOP: original 2-col sticky layout ── */}
      <div
        className="hidden md:grid"
        style={{
          maxWidth: 1100, margin: "0 auto",
          gridTemplateColumns: "260px 1fr",
          gap: 0, padding: "0 2.5rem 3rem",
          position: "relative", zIndex: 1,
        }}
      >
        {/* LEFT NAV */}
        <div style={{
          position: "sticky", top: "2rem",
          height: "fit-content", alignSelf: "start",
          paddingRight: "2rem", paddingTop: "1rem",
        }}>
          <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
            {SERVICES.map((s, i) => {
              const isActive = i === activeIndex;
              return (
                <button
                  key={s.id}
                  onClick={() => setActiveIndex(i)}
                  style={{
                    background: isActive ? "rgba(184,144,26,0.06)" : "transparent",
                    border: "none",
                    padding: "0.85rem 1rem", borderRadius: 6, cursor: "pointer",
                    textAlign: "left", display: "flex", alignItems: "center", gap: 14,
                    transition: "all 0.35s ease",
                  }}
                >
                  <div style={{
                    width: isActive ? 20 : 8, height: 1,
                    background: isActive ? "#c9a84c" : "rgba(30,27,19,0.2)",
                    transition: "all 0.4s cubic-bezier(0.23,1,0.32,1)", flexShrink: 0,
                  }} />
                  <div style={{ display: "flex", flexDirection: "column", gap: 2 }}>
                    <span style={{
                      fontFamily: "var(--font-playfair)",
                      fontSize: isActive ? "1.05rem" : "0.9rem", fontWeight: 400,
                      color: isActive ? "#1e1b13" : "rgba(30,27,19,0.35)",
                      letterSpacing: "0.005em", lineHeight: 1.2, transition: "all 0.35s ease",
                    }}>
                      {s.title}
                    </span>
                  </div>
                </button>
              );
            })}
          </div>
          <div style={{ marginLeft: "1rem", marginTop: "1.5rem" }}>
            <div style={{ height: 1, background: "rgba(184,144,26,0.15)", marginLeft: 22 }} />
            <div style={{ padding: "0.5rem 1rem 0" }}>
              <span style={{
                fontSize: "0.52rem", letterSpacing: "0.2em",
                color: "rgba(184,144,26,0.5)", fontWeight: 700,
                textTransform: "uppercase" as const,
              }}>
                {String(Math.max(activeIndex, 0) + 1).padStart(2, "0")} / {String(SERVICES.length).padStart(2, "0")}
              </span>
            </div>
          </div>
        </div>

        {/* RIGHT PANEL */}
        <div style={{ borderLeft: "1px solid rgba(184,144,26,0.15)" }}>
          <div style={{
            minHeight: "auto",
            position: "relative",
            background: "rgba(184,144,26,0.04)",
            transition: "background 0.4s ease",
          }}>
            <VisualPanel service={SERVICES[activeIndex]} />
          </div>
        </div>
      </div>
    </div>
  );
}