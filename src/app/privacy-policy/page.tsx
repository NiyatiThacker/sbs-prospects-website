"use client";

import React from "react";
import Link from "next/link";

const GOLD = "#b8963e";
const GOLD_LIGHT = "#d4af6a";
const CREAM = "#fff8ef";
const CHARCOAL = "#1a1a1a";
const DARK_GOLD = "#8a6a1f";

const sections = [
  {
    number: "1",
    title: "Information We Collect",
    content: (
      <>
        <p style={{ marginBottom: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          We may collect the following categories of information:
        </p>
        <div style={{ marginBottom: "24px" }}>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "10px", fontFamily: "var(--font-inter), sans-serif" }}>Personal Information</p>
          <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
            {["Full Name", "Email Address", "Mobile Number", "Company Name", "Job Title (where applicable)", "Business Address (where applicable)", "Any information voluntarily submitted through contact forms, enquiries, or consultations"].map(item => (
              <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
            ))}
          </ul>
        </div>
        <div>
          <p style={{ fontWeight: 600, color: CHARCOAL, marginBottom: "10px", fontFamily: "var(--font-inter), sans-serif" }}>Technical Information</p>
          <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
            {["IP Address", "Browser Type and Version", "Device Information", "Operating System", "Website Usage Data", "Cookies and Analytics Data"].map(item => (
              <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
            ))}
          </ul>
        </div>
        <p style={{ marginTop: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          We collect only the information reasonably necessary to provide our services, respond to enquiries, improve our Website, and comply with applicable legal obligations.
        </p>
      </>
    ),
  },
  {
    number: "2",
    title: "How We Use Your Information",
    content: (
      <>
        <p style={{ marginBottom: "18px", color: "#4a463d", lineHeight: 1.8 }}>Your information may be used to:</p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
          {[
            "Respond to your enquiries and service requests.",
            "Communicate regarding our products and services.",
            "Schedule consultations or business meetings.",
            "Improve our Website, services, and customer experience.",
            "Send important updates, newsletters, or promotional communications where permitted by law.",
            "Maintain Website security and prevent fraudulent activities.",
            "Comply with applicable legal and regulatory requirements.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "3",
    title: "Information Sharing",
    content: (
      <>
        <p style={{ marginBottom: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          We value your privacy and do not sell, rent, or trade your personal information. We may share your information with:
        </p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
          {[
            "Authorized employees and representatives of SBS Prospects.",
            "Trusted technology and cloud service providers.",
            "Marketing and communication service providers.",
            "Professional advisors, auditors, or legal consultants.",
            "Government authorities or regulatory bodies where required by law.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
        <p style={{ marginTop: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          Such disclosures are limited to the extent necessary for providing our services or complying with applicable legal obligations.
        </p>
      </>
    ),
  },
  {
    number: "4",
    title: "Data Security",
    content: (
      <>
        {[
          "SBS Prospects implements appropriate administrative, technical, and organizational security measures to protect your personal information against unauthorized access, alteration, disclosure, misuse, or destruction.",
          "Our Website uses Secure Socket Layer (SSL) encryption and follows industry-standard security practices to help protect information transmitted over the internet.",
          "However, no method of electronic transmission or storage is completely secure, and we cannot guarantee absolute security.",
        ].map((text, i) => (
          <p key={i} style={{ marginBottom: "14px", color: "#4a463d", lineHeight: 1.8 }}>{text}</p>
        ))}
      </>
    ),
  },
  {
    number: "5",
    title: "User Responsibilities",
    content: (
      <>
        <p style={{ marginBottom: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          If certain areas of the Website require account access, you are responsible for maintaining the confidentiality of your login credentials. We recommend that users:
        </p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
          {[
            "Use strong and unique passwords.",
            "Change passwords periodically.",
            "Never share login credentials.",
            "Log out after using shared or public devices.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
      </>
    ),
  },
  {
    number: "6",
    title: "Cookies and Website Analytics",
    content: (
      <>
        <p style={{ marginBottom: "18px", color: "#4a463d", lineHeight: 1.8 }}>Our Website may use cookies and similar technologies to:</p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
          {[
            "Improve Website performance.",
            "Remember user preferences.",
            "Analyze visitor behavior.",
            "Enhance user experience.",
            "Measure Website traffic and engagement.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
        <p style={{ marginTop: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          You may disable cookies through your browser settings; however, certain Website features may not function properly.
        </p>
      </>
    ),
  },
  {
    number: "7",
    title: "Third-Party Links",
    content: (
      <>
        <p style={{ marginBottom: "14px", color: "#4a463d", lineHeight: 1.8 }}>
          Our Website may contain links to third-party websites for informational or convenience purposes.
        </p>
        <p style={{ color: "#4a463d", lineHeight: 1.8 }}>
          SBS Prospects does not control and is not responsible for the privacy practices, content, or security of such third-party websites. Users should review the respective privacy policies before providing any personal information.
        </p>
      </>
    ),
  },
  {
    number: "8",
    title: "Legal Disclosure",
    content: (
      <p style={{ color: "#4a463d", lineHeight: 1.8 }}>
        We may disclose your information when required to do so by applicable law, court order, governmental authority, or regulatory agency, or when necessary to protect our legal rights and interests.
      </p>
    ),
  },
  {
    number: "9",
    title: "Data Retention",
    content: (
      <>
        <p style={{ marginBottom: "18px", color: "#4a463d", lineHeight: 1.8 }}>We retain personal information only for as long as necessary to:</p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
          {[
            "Provide our services.",
            "Respond to enquiries.",
            "Maintain business records.",
            "Comply with legal and regulatory obligations.",
            "Resolve disputes and enforce our agreements.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
        <p style={{ marginTop: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          After the applicable retention period, personal information will be securely deleted or anonymized where appropriate.
        </p>
      </>
    ),
  },
  {
    number: "10",
    title: "Your Rights",
    content: (
      <>
        <p style={{ marginBottom: "18px", color: "#4a463d", lineHeight: 1.8 }}>Subject to applicable laws, you may have the right to:</p>
        <ul style={{ paddingLeft: "20px", margin: 0, color: "#4a463d", lineHeight: 2 }}>
          {[
            "Request access to your personal information.",
            "Correct inaccurate or incomplete information.",
            "Update your personal details.",
            "Withdraw consent where legally permissible.",
            "Request deletion of your information, subject to legal or contractual obligations.",
          ].map(item => (
            <li key={item} style={{ listStyle: "disc", paddingLeft: "6px" }}>{item}</li>
          ))}
        </ul>
        <p style={{ marginTop: "18px", color: "#4a463d", lineHeight: 1.8 }}>
          To exercise these rights, please contact us using the details provided below.
        </p>
      </>
    ),
  },
  {
    number: "11",
    title: "Changes to this Privacy Policy",
    content: (
      <>
        <p style={{ marginBottom: "14px", color: "#4a463d", lineHeight: 1.8 }}>
          SBS Prospects reserves the right to modify or update this Privacy Policy at any time.
        </p>
        <p style={{ color: "#4a463d", lineHeight: 1.8 }}>
          Any revisions will be published on this page along with the updated Effective Date. Continued use of the Website following such changes constitutes your acceptance of the revised Privacy Policy.
        </p>
      </>
    ),
  },
];

export default function PrivacyPolicyPage() {
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
        {/* Decorative gold glow */}
        <div style={{
          position: "absolute", top: "-60px", left: "50%", transform: "translateX(-50%)",
          width: "600px", height: "300px",
          background: `radial-gradient(ellipse, ${GOLD}20 0%, transparent 70%)`,
          pointerEvents: "none",
        }} />
        {/* Gold top border line */}
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
            Privacy{" "}
            <em style={{ fontStyle: "italic", color: GOLD_LIGHT }}>Policy</em>
          </h1>

          <div style={{
            width: "48px", height: "2px",
            background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
            margin: "0 auto 24px",
            borderRadius: "2px",
          }} />

          <p style={{ color: "rgba(251,243,228,0.6)", fontSize: "15px", letterSpacing: "0.5px" }}>
            Effective Date: <strong style={{ color: GOLD_LIGHT }}>July 15, 2026</strong>
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
            At <strong style={{ color: CHARCOAL }}>SBS Prospects</strong>, we are committed to protecting your privacy and safeguarding the personal information you share with us through our website{" "}
            <a href="https://www.sbsprospects.com" style={{ color: GOLD, textDecoration: "none", fontWeight: 500 }}>
              https://www.sbsprospects.com
            </a>.
          </p>
          <p style={{ color: "#4a463d", lineHeight: 1.9, fontSize: "16px", margin: 0 }}>
            By accessing or using our Website, you acknowledge that you have read, understood, and agree to the collection, use, and disclosure of your information in accordance with this Privacy Policy.
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
                12
              </span>
              <h2 style={{
                fontFamily: "var(--font-playfair), serif",
                fontSize: "clamp(18px, 2.5vw, 22px)",
                fontWeight: 700, color: "#fbf3e4", margin: 0,
              }}>
                Contact Us
              </h2>
            </div>

            <p style={{ color: "rgba(251,243,228,0.65)", lineHeight: 1.8, marginBottom: "28px", paddingLeft: "54px", fontSize: "15px" }}>
              If you have any questions, concerns, or requests regarding this Privacy Policy or your personal information, please contact:
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
                  label: "Address",
                  value: "1003, Span Trade Centre, Paldi Rd, Near Bony Travels, Pritam Nagar, Paldi, Ahmedabad, Gujarat 380006",
                  full: true,
                },
              ].map((item, i) => (
                <div
                  key={i}
                  style={{
                    gridColumn: (item as {full?: boolean}).full ? "1 / -1" : undefined,
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
