"use client";

import React, { useState } from "react";
import Image from "next/image";
import Link from "next/link";

export default function Footer() {
  const [phoneCopied, setPhoneCopied] = useState(false);

  const handlePhoneClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    // Detect mobile or tablet screens
    const isMobile = window.innerWidth < 768 || /Mobi|Android|iPhone/i.test(navigator.userAgent);
    
    if (isMobile) {
      // Let the native dialer trigger
      return;
    }

    // On desktop/laptop, copy to clipboard instead of dialing
    e.preventDefault();
    navigator.clipboard.writeText("9081353523");
    setPhoneCopied(true);
    setTimeout(() => setPhoneCopied(false), 2000);
  };

  return (
    <>
      <style>{`
        @keyframes sbs-footer-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        .sbs-footer-marquee {
          display: flex;
          gap: 0;
          white-space: nowrap;
          animation: sbs-footer-scroll 22s linear infinite;
        }
        .sbs-footer-link {
          display: block;
          font-size: 12.5px;
          color: #43474e;
          text-decoration: none;
          margin-bottom: 10px;
          font-weight: 300;
          position: relative;
          padding-bottom: 2px;
          transition: color 0.25s ease, letter-spacing 0.25s ease;
          font-family: var(--font-inter), sans-serif;
        }
        .sbs-footer-link::after {
          content: '';
          position: absolute;
          bottom: 0; left: 0;
          width: 0; height: 1px;
          background: #e9c349;
          transition: width 0.35s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sbs-footer-link:hover {
          color: #735c00;
          letter-spacing: 0.05em;
        }
        .sbs-footer-link:hover::after {
          width: 100%;
        }
        .sbs-footer-legal-link {
          font-size: 11px;
          color: rgba(67,71,78,0.45);
          text-decoration: none;
          transition: color 0.2s;
          position: relative;
          font-family: var(--font-inter), sans-serif;
        }
        .sbs-footer-legal-link::after {
          content: '';
          position: absolute;
          bottom: -1px; left: 0;
          width: 0; height: 1px;
          background: #e9c349;
          transition: width 0.3s;
        }
        .sbs-footer-legal-link:hover { color: #735c00; }
        .sbs-footer-legal-link:hover::after { width: 100%; }

        .sbs-social-btn {
          width: 34px; height: 34px;
          border: 1px solid rgba(233,195,73,0.35);
          display: flex; align-items: center; justify-content: center;
          cursor: pointer;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          background: transparent;
          position: relative;
          overflow: hidden;
          text-decoration: none;
        }
        .sbs-social-btn::before {
          content: '';
          position: absolute; inset: 0;
          background: #e9c349;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sbs-social-btn:hover::before { transform: translateY(0); }
        .sbs-social-btn:hover {
          border-color: #e9c349;
          transform: translateY(-3px);
          box-shadow: 0 6px 16px rgba(233,195,73,0.2);
        }
        .sbs-social-btn svg {
          width: 14px; height: 14px;
          fill: #735c00;
          position: relative; z-index: 1;
          transition: fill 0.3s;
        }
        .sbs-social-btn:hover svg { fill: #000613; }

        .sbs-contact-item {
          display: flex; gap: 10px;
          margin-bottom: 13px;
          align-items: flex-start;
          cursor: default;
        }
        .sbs-contact-icon {
          width: 30px; height: 30px;
          flex-shrink: 0;
          border: 1px solid rgba(233,195,73,0.28);
          display: flex; align-items: center; justify-content: center;
          transition: all 0.3s cubic-bezier(0.22, 1, 0.36, 1);
          position: relative; overflow: hidden;
        }
        .sbs-contact-icon::before {
          content: '';
          position: absolute; inset: 0;
          background: #e9c349;
          transform: translateY(100%);
          transition: transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
        }
        .sbs-contact-item:hover .sbs-contact-icon::before { transform: translateY(0); }
        .sbs-contact-item:hover .sbs-contact-icon {
          border-color: #e9c349;
          transform: translateY(-2px);
        }
        .sbs-contact-icon svg {
          width: 13px; height: 13px;
          stroke: #735c00; fill: none; stroke-width: 1.5;
          position: relative; z-index: 1;
          transition: stroke 0.3s;
        }
        .sbs-contact-item:hover .sbs-contact-icon svg { stroke: #000613; }

        /* Tooltips */
        .sbs-tooltip {
          position: absolute;
          bottom: 100%;
          left: 50%;
          transform: translateX(-50%) translateY(-6px);
          background: #0d1b3e;
          color: #fff;
          font-size: 10px;
          padding: 4px 8px;
          border-radius: 4px;
          white-space: nowrap;
          box-shadow: 0 4px 12px rgba(0,0,0,0.15);
          pointer-events: none;
          z-index: 10;
          transition: opacity 0.2s, transform 0.2s;
        }
        .sbs-tooltip::after {
          content: '';
          position: absolute;
          top: 100%;
          left: 50%;
          transform: translateX(-50%);
          border-width: 4px;
          border-style: solid;
          border-color: #0d1b3e transparent transparent transparent;
        }
        .sbs-tooltip-success {
          background: #735c00 !important;
        }
        .sbs-tooltip-success::after {
          border-color: #735c00 transparent transparent transparent !important;
        } /* <── FIXED: Added this missing closing brace */

        /* ── RESPONSIVE GRID ── */
        .sbs-footer-grid {
          display: grid;
          grid-template-columns: 1.8fr 1fr 1fr 1.3fr;
          gap: 44px;
          padding-bottom: 48px;
          position: relative;
          z-index: 1;
        }

        /* Tablet: 2-column layout */
        @media (max-width: 900px) {
          .sbs-footer-grid {
            grid-template-columns: 1fr 1fr;
            gap: 32px;
          }
          /* Brand column spans full width on tablet */
          .sbs-footer-brand-col {
            grid-column: 1 / -1;
            display: flex;
            flex-direction: column;
            align-items: flex-start;
          }
        }

        /* Mobile: single column */
        @media (max-width: 540px) {
          .sbs-footer-grid {
            grid-template-columns: 1fr;
            gap: 28px;
          }
          .sbs-footer-brand-col {
            grid-column: auto;
          }
        }

        /* Footer outer padding responsive */
        .sbs-footer-outer {
          background: #fff8ef;
          padding: 60px 48px 0;
          position: relative;
          overflow: hidden;
          font-family: var(--font-inter), sans-serif;
        }
        @media (max-width: 900px) {
          .sbs-footer-outer {
            padding: 48px 28px 0;
          }
        }
        @media (max-width: 540px) {
          .sbs-footer-outer {
            padding: 36px 18px 0;
          }
        }

        /* Bottom bar responsive */
        .sbs-footer-bottom {
          border-top: 1px solid rgba(233,195,73,0.2);
          padding: 18px 0;
          display: flex;
          align-items: center;
          justify-content: space-between;
          flex-wrap: wrap;
          gap: 10px;
          position: relative;
          z-index: 1;
        }
        @media (max-width: 600px) {
          .sbs-footer-bottom {
            flex-direction: column;
            align-items: flex-start;
            gap: 8px;
          }
          .sbs-footer-bottom-links {
            display: flex;
            flex-wrap: wrap;
            gap: 14px;
          }
        }

        /* Logo fix */
        .sbs-footer-logo-wrap {
          display: block;
          margin-bottom: 14px;
          line-height: 0;
        }
        .sbs-footer-logo-wrap img {
          width: 200px;
          height: auto;
          display: block;
        }
        @media (max-width: 900px) {
          .sbs-footer-logo-wrap img {
            width: 180px;
            height: auto;
          }
        }
        @media (max-width: 540px) {
          .sbs-footer-logo-wrap img {
            width: 160px;
            height: auto;
          }
        }

        /* Social icons row */
        .sbs-social-row {
          display: flex;
          gap: 8px;
          flex-wrap: wrap;
        }

        /* Marquee container */
        .sbs-marquee-wrap {
          overflow: hidden;
          position: relative;
          border-top: 1px solid rgba(233,195,73,0.25);
          border-bottom: 1px solid rgba(233,195,73,0.25);
          padding: 14px 0;
          margin-bottom: 52px;
          background-color: #fbf3e4;
        }
        @media (max-width: 540px) {
          .sbs-marquee-wrap {
            margin-bottom: 32px;
          }
        }
      `}</style>

      <footer className="sbs-footer-outer">
        {/* Top gold border */}
        <div
          style={{
            position: "absolute",
            top: 0, left: 0, right: 0,
            height: "2px",
            background: "linear-gradient(90deg, transparent, #e9c349 30%, #e9c349 70%, transparent)",
          }}
        />

        {/* Marquee */}
        <div className="sbs-marquee-wrap">
          {/* Fade edges */}
          <div style={{ position: "absolute", top: 0, bottom: 0, left: 0, width: "60px", background: "linear-gradient(90deg,#fbf3e4,transparent)", zIndex: 2, pointerEvents: "none" }} />
          <div style={{ position: "absolute", top: 0, bottom: 0, right: 0, width: "60px", background: "linear-gradient(270deg,#fbf3e4,transparent)", zIndex: 2, pointerEvents: "none" }} />

          <div className="sbs-footer-marquee">
            {[...Array(2)].map((_, i) => (
              <span key={i} style={{ display: "flex", alignItems: "center" }}>
                <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "13px", fontWeight: 600, color: "#000613", letterSpacing: "0.38em", textTransform: "uppercase", paddingRight: "40px", userSelect: "none" }}>SBS Financial Services</span>
                <span style={{ fontSize: "13px", color: "#e9c349", paddingRight: "40px", opacity: 0.9 }}>✦</span>
                <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "13px", fontWeight: 600, color: "#000613", letterSpacing: "0.38em", textTransform: "uppercase", paddingRight: "40px", userSelect: "none" }}>Wealth · Clarity · Discipline</span>
                <span style={{ fontSize: "13px", color: "#e9c349", paddingRight: "40px", opacity: 0.9 }}>✦</span>
                <span style={{ fontFamily: "var(--font-playfair), Georgia, serif", fontSize: "13px", fontWeight: 600, color: "#000613", letterSpacing: "0.38em", textTransform: "uppercase", paddingRight: "40px", userSelect: "none" }}>Trusted Since 2012</span>
                <span style={{ fontSize: "13px", color: "#e9c349", paddingRight: "40px", opacity: 0.9 }}>✦</span>
              </span>
            ))}
          </div>
        </div>

        {/* Main Grid */}
        <div className="sbs-footer-grid">

          {/* Brand Column */}
          <div className="sbs-footer-brand-col">
            {/* Logo — natural size, no whitespace */}
            <div className="sbs-footer-logo-wrap">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src="/logo/Sbs-1.png"
                alt="SBS Financial Services"
                width={220}
                height={72}
                style={{
                  width: "220px",
                  height: "auto",
                  objectFit: "contain",
                }}
                loading="eager"
              />
            </div>

            <span style={{ fontSize: "9px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#735c00", display: "block", marginBottom: "16px", fontWeight: 500 }}>
              Financial Services
            </span>
            <p style={{ fontSize: "12px", lineHeight: 1.78, color: "#43474e", fontWeight: 300, maxWidth: "260px", marginBottom: "22px" }}>
              SBS Financial Services delivers personalized financial advisory and wealth management solutions focused on long-term financial confidence and stability.
            </p>

            {/* Social Icons */}
            <div className="sbs-social-row">
              <a href="https://www.instagram.com/sbsfinancial?igsh=MW01ZG9pM29obW0xbg==" target="_blank" rel="noopener noreferrer" className="sbs-social-btn" title="Instagram">
                <svg viewBox="0 0 24 24"><rect x="2" y="2" width="20" height="20" rx="5" fill="none" stroke="#735c00" strokeWidth="1.8"/><circle cx="12" cy="12" r="4" fill="none" stroke="#735c00" strokeWidth="1.8"/><circle cx="17.5" cy="6.5" r="1.2" fill="#735c00"/></svg>
              </a>
              <a href="https://www.facebook.com/share/1ETodRg3J2/" target="_blank" rel="noopener noreferrer" className="sbs-social-btn" title="Facebook">
                <svg viewBox="0 0 24 24"><path d="M18 2h-3a5 5 0 00-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 011-1h3z"/></svg>
              </a>
              <a href="https://x.com/services5272" target="_blank" rel="noopener noreferrer" className="sbs-social-btn" title="Twitter / X">
                <svg viewBox="0 0 24 24"><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.744l7.73-8.835L1.254 2.25H8.08l4.253 5.622 5.912-5.622z"/></svg>
              </a>
              <a href="https://www.linkedin.com/company/sbs-financials/" target="_blank" rel="noopener noreferrer" className="sbs-social-btn" title="LinkedIn">
                <svg viewBox="0 0 24 24"><path d="M16 8a6 6 0 016 6v7h-4v-7a2 2 0 00-4 0v7h-4v-7a6 6 0 016-6zM2 9h4v12H2z"/><circle cx="4" cy="4" r="2"/></svg>
              </a>
              <a href="https://youtube.com/@sbsfinancials?si=dKQ9457BVXpHwCHK" target="_blank" rel="noopener noreferrer" className="sbs-social-btn" title="YouTube">
                <svg viewBox="0 0 24 24"><path d="M22.54 6.42a2.78 2.78 0 00-1.95-1.96C18.88 4 12 4 12 4s-6.88 0-8.59.46A2.78 2.78 0 001.46 6.42 29 29 0 001 12a29 29 0 00.46 5.58 2.78 2.78 0 001.95 1.96C5.12 20 12 20 12 20s6.88 0 8.59-.46a2.78 2.78 0 001.95-1.96A29 29 0 0023 12a29 29 0 00-.46-5.58z"/><polygon points="9.75 15.02 15.5 12 9.75 8.98 9.75 15.02" fill="#fbf3e4"/></svg>
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <span style={{ fontSize: "12px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#000613", fontWeight: 500, marginBottom: "20px", display: "block", position: "relative", paddingBottom: "10px" }}>
              Quick Links
              <span style={{ position: "absolute", bottom: 0, left: 0, width: "22px", height: "1px", background: "#e9c349", display: "block" }} />
            </span>
            {["Home", "About", "Services", "Calculators", "Blog", "Contact"].map((item) => (
              <Link key={item} href={`/${item.toLowerCase()}`} className="sbs-footer-link">{item}</Link>
            ))}
          </div>

          {/* Services */}
          <div>
            <span style={{ fontSize: "12px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#000613", fontWeight: 500, marginBottom: "20px", display: "block", position: "relative", paddingBottom: "10px" }}>
              Services
              <span style={{ position: "absolute", bottom: 0, left: 0, width: "22px", height: "1px", background: "#e9c349", display: "block" }} />
            </span>
            {["Mutual Funds", "SIP Planning", "Insurance", "Tax Planning", "Fixed Deposits", "Retirement Planning", "Wealth Management"].map((item) => (
              <Link key={item} href="/services" className="sbs-footer-link">{item}</Link>
            ))}
          </div>

          {/* Contact */}
          <div>
            <span style={{ fontSize: "12px", letterSpacing: "0.28em", textTransform: "uppercase", color: "#000613", fontWeight: 500, marginBottom: "20px", display: "block", position: "relative", paddingBottom: "10px" }}>
              Contact
              <span style={{ position: "absolute", bottom: 0, left: 0, width: "22px", height: "1px", background: "#e9c349", display: "block" }} />
            </span>

            {/* Address */}
            {/* Address (Clickable link to Google Maps) */}
            <a
              href="https://www.google.com/maps/search/?api=1&query=1003%2C+Span+Trade+Center%2C+Pritam+Nagar%2C+Paldi%2C+Ahmedabad%2C+Gujarat+380006"
              target="_blank"
              rel="noopener noreferrer"
              className="sbs-contact-item"
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              <div className="sbs-contact-icon">
                <svg viewBox="0 0 24 24"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"/><circle cx="12" cy="10" r="3"/></svg>
              </div>
              <span style={{ fontSize: "12px", color: "#43474e", lineHeight: 1.65, fontWeight: 300 }}>
                1003,Span Trade Center,<br />
                Pritam Nagar,<br />
                Paldi,<br />
                Ahmedabad, Gujarat 380006
              </span>
            </a>


            {/* Clickable/Copyable Mobile No. */}
            <a
              href="tel:9081353523"
              onClick={handlePhoneClick}
              className="sbs-contact-item group"
              style={{ textDecoration: "none", color: "inherit", cursor: "pointer" }}
            >
              <div className="sbs-contact-icon">
                <svg viewBox="0 0 24 24"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07A19.5 19.5 0 013.07 9.81 19.79 19.79 0 01.01 1.19 2 2 0 012 .01h3a2 2 0 012 1.72c.127.96.361 1.903.7 2.81a2 2 0 01-.45 2.11L6.09 7.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0122 14.92z"/></svg>
              </div>
              <div style={{ position: "relative" }}>
                <span style={{ fontSize: "12px", color: "#43474e", lineHeight: 1.65, fontWeight: 300 }} className="hover:text-[#735c00] transition-colors">
                  9081353523
                </span>
                
                {/* Hover Tooltip: Desktop only */}
                <span className="sbs-tooltip opacity-0 group-hover:md:opacity-100 transition-opacity duration-200 hidden md:block">
                  Click to copy
                </span>
                
                {/* Success Tooltip: Triggers on successful copy */}
                <span className={`sbs-tooltip sbs-tooltip-success opacity-0 transition-opacity duration-200 ${phoneCopied ? "opacity-100" : ""}`}>
                  Copied!
                </span>
              </div>
            </a>

            {/* Email */}
            <div className="sbs-contact-item">
              <div className="sbs-contact-icon">
                <svg viewBox="0 0 24 24"><path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"/><polyline points="22,6 12,13 2,6"/></svg>
              </div>
              <span style={{ fontSize: "12px", color: "#735c00", lineHeight: 1.65, fontWeight: 300 }}>Sbsfin27@gmail.com</span>
            </div>

            {/* Blended Timings Row */}
            <div className="sbs-contact-item">
              <div className="sbs-contact-icon">
                <svg viewBox="0 0 24 24">
                  <path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <span style={{ fontSize: "12px", color: "#43474e", lineHeight: 1.65, fontWeight: 300 }}>
                Mon – Sat, 9 AM – 6 PM
              </span>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="sbs-footer-bottom">
          <span style={{ fontSize: "11px", color: "rgba(67,71,78,0.5)" }}>
            © 2026 SBS Financial Services. All rights reserved.
          </span>
          <div className="sbs-footer-bottom-links" style={{ display: "flex", gap: "20px", flexWrap: "wrap" }}>
            <Link href="/privacy-policy" className="sbs-footer-legal-link">Privacy Policy</Link>
            <Link href="/terms" className="sbs-footer-legal-link">Terms &amp; Conditions</Link>
            <Link href="/disclaimer" className="sbs-footer-legal-link">Disclaimer</Link>
          </div>
        </div>
      </footer>
    </>
  );
}