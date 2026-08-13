"use client";

import React from "react";
import Link from "next/link";

const GOLD = "#b8963e";
const GOLD_LIGHT = "#d4af6a";
const CREAM = "#fff8ef";
const CHARCOAL = "#1a1a1a";

const sections = [
  {
    number: "1",
    title: "Eligibility & Registration",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "8px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>Eligibility</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
            By using this Website, you represent that you are at least 18 years of age and are legally competent to enter into a binding agreement under applicable Indian laws.
          </p>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "8px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>Accuracy of Information</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
            If you submit any enquiry, request information, register for any service, or create an account (where applicable), you agree to provide true, accurate, current, and complete information. Providing false or misleading information may result in the suspension or termination of your access.
          </p>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "8px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>Account Security</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
            Where account access is provided, you are solely responsible for maintaining the confidentiality of your login credentials, including your username, password, and any authentication codes. Any activity carried out using your account shall be deemed to have been authorized by you.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: "2",
    title: "Nature of Services & Disclaimer",
    content: (
      <div style={{ display: "flex", flexDirection: "column", gap: "20px" }}>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "8px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>Informational Purpose Only</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
            The information, content, case studies, articles, service descriptions, blog posts, and other materials available on this Website are provided solely for general informational purposes and do not constitute professional, legal, financial, technical, or business advice.
          </p>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "8px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>No Professional Advice</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
            Unless expressly agreed upon through a written service agreement, nothing contained on this Website shall be interpreted as consulting, legal, financial, or professional advice. Users should obtain independent professional advice before making business or technology-related decisions.
          </p>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "8px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>Service Availability</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
            Descriptions of services displayed on this Website are intended for informational purposes only and do not constitute a binding offer. All services remain subject to discussion, feasibility, availability, and mutual agreement.
          </p>
        </div>
      </div>
    ),
  },
  {
    number: "3",
    title: "Third-Party Links & Services",
    content: (
      <>
        <p style={{ color: "#4a463d", lineHeight: 1.85, marginBottom: "14px" }}>
          Our Website may contain links to third-party websites, software platforms, cloud providers, social media platforms, payment gateways, or other external resources for your convenience.
        </p>
        <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
          SBS Prospects does not own, control, endorse, or guarantee the content, products, services, security, or privacy practices of any third-party websites. Your use of such websites shall be governed solely by their respective terms and privacy policies.
        </p>
      </>
    ),
  },
  {
    number: "4",
    title: "Intellectual Property Rights",
    content: (
      <>
        <div style={{ marginBottom: "20px" }}>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "10px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>Ownership</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, marginBottom: "12px" }}>
            All content available on this Website, including but not limited to logos, trademarks, text, graphics, images, videos, icons, website design, source code, software, documentation, and business content, is the exclusive intellectual property of SBS Prospects or its licensors and is protected under applicable intellectual property laws.
          </p>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "10px", fontFamily: "var(--font-inter), sans-serif", fontSize: "15px" }}>Restrictions</p>
          <p style={{ color: "#4a463d", lineHeight: 1.85, marginBottom: "12px" }}>You may not copy, reproduce, modify, republish, distribute, sell, license, reverse engineer, or exploit any Website content for commercial purposes without obtaining our prior written consent.</p>
        </div>
      </>
    ),
  },
  {
    number: "5",
    title: "Limitation of Liability",
    content: (
      <>
        <p style={{ color: "#4a463d", lineHeight: 1.85, marginBottom: "16px" }}>
          To the fullest extent permitted under applicable law, SBS Prospects, its directors, employees, affiliates, partners, consultants, and representatives shall not be liable for any direct, indirect, incidental, consequential, special, or punitive damages arising from or relating to:
        </p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2.1 }}>
          {[
            "Your access to or use of the Website.",
            "Any interruption, delay, downtime, or unavailability of the Website.",
            "Loss of data, revenue, profits, or business opportunities.",
            "Errors, inaccuracies, or omissions in Website content.",
            "Unauthorized access to or alteration of your information.",
            "Reliance upon any information published on this Website.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "6",
    title: "Indemnification",
    content: (
      <>
        <p style={{ color: "#4a463d", lineHeight: 1.85, marginBottom: "16px" }}>
          You agree to indemnify, defend, and hold harmless SBS Prospects, its directors, employees, affiliates, partners, consultants, and representatives from and against any claims, liabilities, damages, losses, costs, or expenses (including reasonable legal fees) arising from:
        </p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2.1 }}>
          {[
            "Your violation of these Terms of Use.",
            "Your misuse of the Website.",
            "Your infringement of any intellectual property or legal rights of another person or entity.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "7",
    title: "Termination of Use",
    content: (
      <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
        We reserve the right, at our sole discretion and without prior notice, to suspend, restrict, or terminate your access to the Website or any part of our services for any reason, including violation of these Terms of Use or applicable law.
      </p>
    ),
  },
  {
    number: "8",
    title: "Governing Law & Jurisdiction",
    content: (
      <>
        <p style={{ color: "#4a463d", lineHeight: 1.85, marginBottom: "14px" }}>
          These Terms of Use shall be governed by and construed in accordance with the laws of India.
        </p>
        <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
          Any disputes arising out of or relating to these Terms or your use of the Website shall be subject to the exclusive jurisdiction of the competent courts located in Ahmedabad, Gujarat, India.
        </p>
      </>
    ),
  },
  {
    number: "9",
    title: "Modifications to Terms",
    content: (
      <>
        <p style={{ color: "#4a463d", lineHeight: 1.85, marginBottom: "14px" }}>
          SBS Prospects reserves the right to revise, modify, or update these Terms of Use at any time without prior notice.
        </p>
        <p style={{ color: "#4a463d", lineHeight: 1.85, margin: 0 }}>
          Any changes will become effective immediately upon being published on this page. Your continued use of the Website following such updates constitutes your acceptance of the revised Terms.
        </p>
      </>
    ),
  },
];

export default function TermsPage() {
  return (
    <main style={{ background: CREAM, minHeight: "100vh", fontFamily: "var(--font-inter), sans-serif" }}>

      {/* ── Hero Banner ── */}
      <section
        style={{
          background: "linear-gradient(135deg, #1a1610 0%, #2a2218 50%, #1a1610 100%)",
          paddingTop: "160px",
          paddingBottom: "80px",
          textAlign: "center",
          position: "relative",
          overflow: "hidden",
        }}
      >
        <div style={{
          position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: `radial-gradient(ellipse, ${GOLD}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        <div style={{
          position: "absolute", top: 0, left: 0, right: 0,
          height: "2px",
          background: `linear-gradient(90deg, transparent, ${GOLD}, transparent)`,
        }} />

        <div style={{ position: "relative", zIndex: 1, maxWidth: "780px", margin: "0 auto", padding: "0 24px" }}>
          <span style={{
            display: "inline-block",
            fontSize: "11px", fontWeight: 600,
            letterSpacing: "3.5px", textTransform: "uppercase",
            color: GOLD,
            background: `${GOLD}18`,
            border: `1px solid ${GOLD}40`,
            padding: "6px 18px", borderRadius: "20px",
            marginBottom: "28px",
          }}>
            Legal
          </span>

          <h1 style={{
            fontFamily: "var(--font-playfair), serif",
            fontSize: "clamp(36px, 5vw, 60px)",
            fontWeight: 700,
            color: "#fbf3e4",
            margin: "0 0 20px",
            lineHeight: 1.15,
            letterSpacing: "-0.5px",
          }}>
            Terms &{" "}
            <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>Conditions</em>
          </h1>

          <div style={{
            width: "48px", height: "2px",
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
            margin: "0 auto 24px",
            borderRadius: "2px",
          }} />

          <p style={{ color: "rgba(251,243,228,0.6)", fontSize: "15px", letterSpacing: "0.5px" }}>
            Last Updated: <strong style={{ color: GOLD_LIGHT }}>July 15, 2026</strong>
          </p>
        </div>
      </section>

      {/* ── Content ── */}
      <section style={{ padding: "72px 24px 100px", maxWidth: "860px", margin: "0 auto" }}>

        {/* Intro Card */}
        <div style={{
          background: "#fff",
          borderRadius: "20px",
          padding: "40px 48px",
          marginBottom: "48px",
          border: `1px solid ${GOLD}30`,
          boxShadow: "0 4px 32px rgba(0,0,0,0.06)",
        }}>
          <p style={{ color: "#4a463d", lineHeight: 1.9, fontSize: "16px", margin: "0 0 16px" }}>
            Welcome to{" "}
            <Link href="/" style={{ color: GOLD, textDecoration: "none", fontWeight: 500 }}>
              https://www.sbsprospects.com
            </Link>. The Website is owned, managed, and operated by <strong style={{ color: CHARCOAL }}>SBS Prospects</strong>, having its principal place of business in Ahmedabad, Gujarat, India.
          </p>
          <p style={{ color: "#4a463d", lineHeight: 1.9, fontSize: "16px", margin: 0 }}>
            By accessing, browsing, or using this Website, you acknowledge that you have read, understood, and agree to be bound by these Terms of Use, Disclaimer, and our{" "}
            <Link href="/privacy-policy" style={{ color: GOLD, textDecoration: "none", fontWeight: 500 }}>
              Privacy Policy
            </Link>. If you do not agree with any part of these Terms, please discontinue using the Website immediately.
          </p>
        </div>

        {/* Policy Sections */}
        <div style={{ display: "flex", flexDirection: "column", gap: "32px" }}>
          {sections.map((sec) => (
            <div
              key={sec.number}
              style={{
                background: "#fff",
                borderRadius: "20px",
                padding: "36px 48px",
                border: `1px solid ${GOLD}20`,
                boxShadow: "0 2px 20px rgba(0,0,0,0.04)",
                position: "relative",
                overflow: "hidden",
              }}
            >
              {/* Gold left accent bar */}
              <div style={{
                position: "absolute", left: 0, top: "28px", bottom: "28px",
                width: "3px",
                background: `linear-gradient(180deg, ${GOLD}, ${GOLD_LIGHT})`,
                borderRadius: "0 3px 3px 0",
              }} />

              {/* Section Header */}
              <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "20px" }}>
                <span style={{
                  display: "flex", alignItems: "center", justifyContent: "center",
                  width: "38px", height: "38px",
                  borderRadius: "50%",
                  background: `${GOLD}15`,
                  border: `1.5px solid ${GOLD}40`,
                  color: GOLD,
                  fontWeight: 700,
                  fontSize: "14px",
                  fontFamily: "var(--font-inter), sans-serif",
                  flexShrink: 0,
                }}>
                  {sec.number}
                </span>
                <h2 style={{
                  fontFamily: "var(--font-playfair), serif",
                  fontSize: "clamp(18px, 2.5vw, 22px)",
                  fontWeight: 700,
                  color: CHARCOAL,
                  margin: 0,
                  letterSpacing: "-0.2px",
                }}>
                  {sec.title}
                </h2>
              </div>

              <div style={{ paddingLeft: "54px", fontSize: "15px" }}>
                {sec.content}
              </div>
            </div>
          ))}

          {/* Contact Card */}
          <div style={{
            background: "linear-gradient(135deg, #1a1610 0%, #2a2218 100%)",
            borderRadius: "20px",
            padding: "40px 48px",
            border: `1px solid ${GOLD}40`,
            boxShadow: "0 8px 40px rgba(0,0,0,0.15)",
            position: "relative",
            overflow: "hidden",
          }}>
            <div style={{
              position: "absolute", top: "-40px", right: "-40px",
              width: "200px", height: "200px",
              background: `radial-gradient(circle, ${GOLD}20 0%, transparent 70%)`,
              pointerEvents: "none",
            }} />

            <div style={{ display: "flex", alignItems: "center", gap: "16px", marginBottom: "28px" }}>
              <span style={{
                display: "flex", alignItems: "center", justifyContent: "center",
                width: "38px", height: "38px", borderRadius: "50%",
                background: `${GOLD}25`, border: `1.5px solid ${GOLD}60`,
                color: GOLD_LIGHT, fontWeight: 700, fontSize: "14px", flexShrink: 0,
              }}>
                10
              </span>
              <h2 style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(18px, 2.5vw, 22px)",
                fontWeight: 700, color: "#fbf3e4", margin: 0,
              }}>
                Contact Information
              </h2>
            </div>

            <p style={{ color: "rgba(251,243,228,0.65)", lineHeight: 1.8, marginBottom: "28px", paddingLeft: "54px", fontSize: "15px" }}>
              If you have any questions, feedback, or concerns regarding these Terms of Use, please contact us:
            </p>

            <div style={{
              display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
              gap: "20px", paddingLeft: "54px",
            }}>
              {[
                { label: "Company", value: "SBS Prospects" },
                { label: "Phone", value: "+91 90813 53523" },
                {
                  label: "Website",
                  value: <Link href="/" style={{ color: GOLD_LIGHT, textDecoration: "none" }}>https://www.sbsprospects.com</Link>,
                },
                {
                  label: "Email",
                  value: <a href="mailto:prospectssbs@gmail.com" style={{ color: GOLD_LIGHT, textDecoration: "none" }}>prospectssbs@gmail.com</a>,
                },
                {
                  label: "Office Address",
                  value: "1003, Span Trade Centre, Paldi Rd, Near Bony Travels, Pritam Nagar, Paldi, Ahmedabad, Gujarat 380006",
                  full: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    gridColumn: (item as { full?: boolean }).full ? "1 / -1" : undefined,
                    background: "rgba(255,255,255,0.05)",
                    borderRadius: "12px",
                    padding: "16px 20px",
                    border: `1px solid ${GOLD}20`,
                  }}
                >
                  <p style={{
                    fontSize: "10px", fontWeight: 600,
                    letterSpacing: "2px", textTransform: "uppercase",
                    color: GOLD, margin: "0 0 6px",
                  }}>
                    {item.label}
                  </p>
                  <p style={{ color: "rgba(251,243,228,0.85)", margin: 0, fontSize: "14px", lineHeight: 1.6 }}>
                    {item.value}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
