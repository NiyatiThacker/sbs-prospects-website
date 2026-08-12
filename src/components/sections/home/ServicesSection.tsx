"use client";
import { useState } from "react";
import { motion } from "framer-motion";
import Link from "next/link";

const SERVICES = [
  {
    id: "Industry Training Programs",
    label: "INDUSTRY TRAINING PROGRAMS",
    title: "Industry Training Programs",
    headline: "Hands-on projects, Direct industry exposure.",
    body: "Equip yourself with domain-specific practical skills. Work on active industry projects, case studies, and live scenarios to ensure absolute day-one corporate readiness.",
    points: [
      "Live Corporate Projects",
      "Practical Domain Skills",
      "Expert Industry Mentors",
      "Direct Recruiter Exposure",
    ],
    stat1: { val: "1,500+", label: "Students Trained" },
    stat2: { val: "15+", label: "Industry Modules" },
  },
  {
    id: "MBA Skill Development Courses",
    label: "MBA SKILL DEVELOPMENT COURSES",
    title: "MBA Skill Development Courses",
    headline: "Practical business mastery, Structured growth.",
    body: "Bridge academic frameworks with real-world corporate execution. Develop core skills in presentation, decision-making, tools, and business communication.",
    points: [
      "Presentation Skills Training",
      "Management Frameworks",
      "Case-Study Methodologies",
      "Corporate Communication Tools",
    ],
    stat1: { val: "120+", label: "Soft Skill Hours" },
    stat2: { val: "92%", label: "Placement Rate" },
  },
  {
    id: "HR Consultancy",
    label: "HR CONSULTANCY",
    title: "HR Consultancy",
    headline: "Talent alignment for enterprise scale.",
    body: "Helping organizations build high-performance teams. We audit corporate staffing needs, design custom recruitment filters, and match the best-suited candidates to accelerate business growth.",
    points: [
      "Talent Requirement Audit",
      "Bespoke Recruitment Filters",
      "Screening & Skill Validation",
      "Onboarding Coordination",
      "Annual Staffing Alignment",
    ],
    stat1: { val: "50+", label: "Hiring Partners" },
    stat2: { val: "95%+", label: "Placement Success" },
  },
  {
    id: "Career Guidance",
    label: "CAREER GUIDANCE",
    title: "Career Guidance",
    headline: "Your roadmap to long-term success.",
    body: "Navigate your professional journey with absolute clarity. Receive expert one-on-one counseling, evaluate your skill gaps, and map out pathways to highly lucrative roles.",
    points: [
      "One-on-One Counseling",
      "Skill Gap Assessment",
      "Career Path Alignment",
      "Resume & Profile Building",
      "Regular Mock Interviews",
    ],
    stat1: { val: "400+", label: "Sessions Hosted" },
    stat2: { val: "100%", label: "Mentorship Focus" },
  },
  {
    id: "Recruitment Support",
    label: "RECRUITMENT SUPPORT",
    title: "Recruitment Support",
    headline: "Connecting top talent with industry leaders.",
    body: "End-to-end support for corporate hiring drives and university placements. We coordinate selection processes, prepare candidate batches, and run placement events.",
    points: [
      "Coordination of Hiring Drives",
      "Interview Simulation Drills",
      "Resume Screening Automation",
      "Recruitment Event Setup",
      "Corporate Networking Days",
    ],
    stat1: { val: "30+", label: "Placement Drives" },
    stat2: { val: "95%+", label: "Placement Success" },
  },
  {
    id: "Internship Programs",
    label: "INTERNSHIP PROGRAMS",
    title: "Internship Programs",
    headline: "Apply learning. Gain practical experience.",
    body: "The best way to learn is by doing. Our internship programs place students directly in corporate environments to execute real workflows, build portfolios, and earn corporate certificates.",
    points: [
      "Live Workflow Experience",
      "Active Project Delivery",
      "Corporate Certification",
      "Performance Evaluation",
      "PPO Opportunities",
    ],
    stat1: { val: "650+", label: "Internships Secured" },
    stat2: { val: "50+", label: "Corporate Partners" },
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