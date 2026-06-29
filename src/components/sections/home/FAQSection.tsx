"use client";

import { useState } from "react";

const faqs = [
  {
    id: 1,
    question: "What financial services does SBS Financial Services provide?",
    answer:
      "We offer a comprehensive range of services including Mutual Funds, SIP Planning, Insurance, Tax Planning, Fixed Deposits, Retirement Planning, and Wealth Management — all tailored to your personal financial goals.",
  },
  {
    id: 2,
    question: "How do I begin financial planning with SBS?",
    answer:
      "Simply book a private consultation with our advisors. We start with a detailed understanding of your current finances, goals, and risk appetite before crafting a personalized strategy.",
  },
  {
    id: 3,
    question: "Does SBS provide personalized investment guidance?",
    answer:
      "Yes. Every client receives a fully personalized investment plan. We do not believe in one-size-fits-all solutions — your portfolio is built around your unique life stage and financial objectives.",
  },
  {
    id: 4,
    question: "Can I schedule a consultation for retirement or tax planning?",
    answer:
      "Absolutely. Our advisors specialize in long-term retirement structuring and tax-efficient investment planning. Contact us to schedule a dedicated session at your convenience.",
  },
  {
    id: 5,
    question: "Is my financial information kept confidential?",
    answer:
      "Complete confidentiality is a cornerstone of our practice. All client data is handled with the highest level of privacy and is never shared with third parties.",
  },
  {
    id: 6,
    question: "What makes SBS different from other financial advisors?",
    answer:
      "We combine disciplined strategy with genuine personal relationships. Our clients trust us for transparency, consistency, and long-term financial clarity that goes beyond just numbers.",
  },
];

export default function FAQSectionV2() {
  const [openId, setOpenId] = useState<number | null>(1);

  const toggle = (id: number) => setOpenId(openId === id ? null : id);

  return (
    <>
      <style>{`
        .faq2-item {
          display: flex;
          gap: 24px;
          padding: 24px 0;
          border-bottom: 1px solid rgba(233,195,73,0.2);
          cursor: pointer;
          align-items: flex-start;
        }
        .faq2-item:first-child { border-top: 1px solid rgba(233,195,73,0.2); }
        .faq2-num {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 13px;
          color: #e9c349;
          font-weight: 600;
          flex-shrink: 0;
          margin-top: 2px;
          min-width: 28px;
        }
        .faq2-q {
          font-family: var(--font-playfair), Georgia, serif;
          font-size: 17px;
          font-weight: 400;
          color: #000613;
          line-height: 1.3;
          transition: color 0.25s;
        }
        .faq2-item:hover .faq2-q,
        .faq2-item.open .faq2-q { color: #735c00; }
        .faq2-a {
          font-family: var(--font-inter), sans-serif;
          font-size: 13px;
          line-height: 1.78;
          color: #43474e;
          font-weight: 300;
          overflow: hidden;
          max-height: 0;
          transition: max-height 0.45s cubic-bezier(0.22,1,0.36,1), margin-top 0.3s;
        }
        .faq2-item.open .faq2-a {
          max-height: 160px;
          margin-top: 12px;
        }
        .faq2-arr {
          flex-shrink: 0;
          width: 20px;
          height: 20px;
          margin-top: 2px;
          transition: transform 0.35s cubic-bezier(0.22,1,0.36,1);
        }
        .faq2-item.open .faq2-arr { transform: rotate(180deg); }
        .faq2-arr svg { width: 20px; height: 20px; stroke: #735c00; fill: none; stroke-width: 1.5; }
      `}</style>

      <section
        style={{
          background: "#fff8ef",
          padding: "80px 48px",
          position: "relative",
          fontFamily: "var(--font-inter), sans-serif",
        }}
      >
        {/* Top border */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "1px",
            background: "linear-gradient(90deg,transparent,rgba(233,195,73,0.5),transparent)",
          }}
        />

        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: "52px" }}>
          <span
            style={{
              fontSize: "10px",
              letterSpacing: "0.3em",
              textTransform: "uppercase",
              color: "#e9c349",
              fontWeight: 500,
              marginBottom: "20px",
              display: "block",
            }}
          >
            Frequently Asked Questions
          </span>

          {/* Ornament */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              gap: "12px",
              marginBottom: "24px",
            }}
          >
            <div style={{ width: "44px", height: "1px", background: "linear-gradient(90deg,transparent,rgba(233,195,73,0.6))" }} />
            <div style={{ width: "6px", height: "6px", background: "#e9c349", transform: "rotate(45deg)", opacity: 0.8 }} />
            <div style={{ width: "44px", height: "1px", background: "linear-gradient(270deg,transparent,rgba(233,195,73,0.6))" }} />
          </div>

          <h2
            style={{
              fontFamily: "var(--font-playfair), Georgia, serif",
              fontSize: "clamp(26px,3vw,40px)",
              fontWeight: 400,
              color: "#000613",
              lineHeight: 1.22,
              marginBottom: "14px",
            }}
          >
            Clarity &amp;{" "}
            <em style={{ fontStyle: "italic", color: "#735c00" }}>Confidence</em>{" "}
            For Every Financial Decision
          </h2>
          <p
            style={{
              fontSize: "13px",
              lineHeight: 1.75,
              color: "#43474e",
              fontWeight: 300,
              maxWidth: "480px",
              margin: "0 auto",
            }}
          >
            Everything you need to know about our services, approach, and
            long-term financial planning.
          </p>
        </div>

        {/* FAQ List */}
        <div style={{ maxWidth: "900px", margin: "0 auto" }}>
          {faqs.map((faq, index) => (
            <div
              key={faq.id}
              className={`faq2-item${openId === faq.id ? " open" : ""}`}
              onClick={() => toggle(faq.id)}
            >
              <span className="faq2-num">{String(index + 1).padStart(2, "0")}</span>
              <div style={{ flex: 1 }}>
                <p className="faq2-q">{faq.question}</p>
                <div className="faq2-a">{faq.answer}</div>
              </div>
              <div className="faq2-arr">
                <svg viewBox="0 0 24 24">
                  <polyline points="6 9 12 15 18 9" />
                </svg>
              </div>
            </div>
          ))}
        </div>
      </section>
    </>
  );
}