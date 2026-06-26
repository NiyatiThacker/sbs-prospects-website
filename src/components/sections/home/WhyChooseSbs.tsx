"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Playfair_Display, DM_Sans } from "next/font/google";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-playfair",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-dm-sans",
});

interface BulletPoint {
  label: string;
  description: string;
}

interface CardData {
  id: number;
  title: string;
  image: string;
  bullets: BulletPoint[];
}

const CARDS: CardData[] = [
  {
    id: 1,
    title: "Trusted Financial Guidance",
    image: "/images/WhyChooseSbs/card1.jpg",
    bullets: [
      { label: "Fiduciary First", description: "Your interests always come before ours — legally and ethically." },
      { label: "Full Transparency", description: "No hidden fees, no surprises. Clear reporting at every step." },
      { label: "20+ Years", description: "Two decades of navigating markets for our clients' benefit." },
    ],
  },
  {
    id: 2,
    title: "Structured Wealth Planning",
    image: "/images/WhyChooseSbs/card2.jpg",
    bullets: [
      { label: "Data-Driven Frameworks", description: "Every strategy backed by rigorous quantitative analysis." },
      { label: "Regular Rebalancing", description: "Portfolios reviewed and realigned to your evolving goals." },
      { label: "₹500Cr+ Managed", description: "Proven scale with institutional-grade discipline." },
    ],
  },
  {
    id: 3,
    title: "Personalized Advisory",
    image: "/images/WhyChooseSbs/card3.jpg",
    bullets: [
      { label: "One Dedicated Advisor", description: "A single trusted expert who knows your complete financial picture." },
      { label: "Custom Strategy", description: "Tailored plans built around your life, not a template." },
      { label: "24hr Response", description: "Priority access whenever markets move or questions arise." },
    ],
  },
  {
    id: 4,
    title: "Long-Term Financial Vision",
    image: "/images/WhyChooseSbs/card4.jpg",
    bullets: [
      { label: "Generational Thinking", description: "Building wealth that outlasts you and benefits those who follow." },
      { label: "Compounding Focus", description: "Patient, disciplined strategies that let time do the heavy lifting." },
      { label: "10yr+ Avg Tenure", description: "Clients who stay because results speak for themselves." },
    ],
  },
];

const TOTAL = CARDS.length;
const CARD_W = 340;
const CARD_H = 440;
const AUTOPLAY_MS = 3000;
const GOLD = "#b8963e";
const GOLD_LIGHT = "#d4af6a";

// Shortest circular distance between two indices
function wrappedDiff(index: number, active: number, total: number): number {
  let d = index - active;
  while (d > total / 2) d -= total;
  while (d <= -total / 2) d += total;
  return d;
}

type SlotConfig = { x: number; scale: number; opacity: number; zIndex: number; rotateY: number };

const SLOTS: Record<number, SlotConfig> = {
  [-1]: { x: -240, scale: 0.84, opacity: 0.75, zIndex: 20, rotateY: 28 },
  [0]:  { x: 0,    scale: 1,    opacity: 1,    zIndex: 30, rotateY: 0  },
  [1]:  { x: 240,  scale: 0.84, opacity: 0.75, zIndex: 20, rotateY: -28 },
};

export default function WhyChooseSBS() {
  const [activeIndex, setActiveIndex] = useState(0);
  const [flippedIndex, setFlippedIndex] = useState<number | null>(null);
  const isPausedRef = useRef(false);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Autoplay — uses ref so interval always sees latest state
  const startAutoplay = useCallback(() => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      if (isPausedRef.current) return;
      setFlippedIndex(null);
      setActiveIndex((prev) => (prev + 1) % TOTAL);
    }, AUTOPLAY_MS);
  }, []);

  useEffect(() => {
    startAutoplay();
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [startAutoplay]);

  const pause = useCallback(() => { isPausedRef.current = true; }, []);
  const resume = useCallback(() => { isPausedRef.current = false; }, []);

  const goTo = useCallback((index: number) => {
    setActiveIndex(index);
    setFlippedIndex(null);
    // Reset timer so next tick is 3s from now
    startAutoplay();
  }, [startAutoplay]);

  const handleCardClick = useCallback((index: number) => {
    if (index !== activeIndex) {
      goTo(index);
    } else {
      // Toggle detail overlay on center card
      setFlippedIndex((prev) => {
        const next = prev === index ? null : index;
        isPausedRef.current = next !== null; // pause while details open
        return next;
      });
    }
  }, [activeIndex, goTo]);

  const getCardStyle = (index: number): React.CSSProperties => {
    const diff = wrappedDiff(index, activeIndex, TOTAL);
    const absDiff = Math.abs(diff);

    // Cards not in visible slots (-1, 0, 1) sit off-screen for smooth slide-in
    if (absDiff >= 2) {
      const offX = diff > 0 ? 560 : -560;
      return {
        position: "absolute",
        left: "50%", top: "50%",
        marginLeft: `-${CARD_W / 2}px`,
        marginTop: `-${CARD_H / 2}px`,
        width: `${CARD_W}px`, height: `${CARD_H}px`,
        transform: `translateX(${offX}px) scale(0.65) rotateY(${diff > 0 ? -35 : 35}deg) translateZ(-200px)`,
        opacity: 0,
        zIndex: 5,
        transition: "all 0.55s cubic-bezier(0.34, 1.26, 0.64, 1)",
        pointerEvents: "none",
      };
    }

    const s = SLOTS[diff];
    return {
      position: "absolute",
      left: "50%", top: "50%",
      marginLeft: `-${CARD_W / 2}px`,
      marginTop: `-${CARD_H / 2}px`,
      width: `${CARD_W}px`, height: `${CARD_H}px`,
      transform: `translateX(${s.x}px) scale(${s.scale}) rotateY(${s.rotateY}deg) translateZ(${diff === 0 ? 0 : -120}px)`,
      opacity: s.opacity,
      zIndex: s.zIndex,
      transition: "all 0.55s cubic-bezier(0.34, 1.26, 0.64, 1)",
      cursor: index !== activeIndex ? "pointer" : "default",
    };
  };

  return (
    <section
      className={`${playfair.variable} ${dmSans.variable}`}
      style={{
        backgroundColor: "#fff8ef",
        minHeight: "100vh",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        padding: "80px 24px",
        fontFamily: "var(--font-dm-sans), sans-serif",
        overflow: "hidden",
      }}
    >
      {/* Header */}
      <div style={{ textAlign: "center", marginBottom: "64px", maxWidth: "680px" }}>
        <span style={{
          display: "inline-block",
          fontSize: "11px", fontWeight: 600,
          letterSpacing: "3.5px", textTransform: "uppercase",
          color: GOLD,
          background: `${GOLD}15`,
          border: `1px solid ${GOLD}40`,
          padding: "6px 18px", borderRadius: "20px",
          marginBottom: "22px",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}>
          Why Choose SBS
        </span>

        <h2 style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "clamp(28px, 4vw, 46px)",
          fontWeight: 700, lineHeight: 1.18,
          color: "#1a1a1a", margin: 0, letterSpacing: "-0.5px",
        }}>
          Financial Strategies{" "}
          <em style={{ fontStyle: "italic", color: "#8a6a1f" }}>Rooted In</em>
          <br />Trust, Precision &amp; Stability
        </h2>

        <div style={{
          width: "48px", height: "2px",
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
          margin: "24px auto 0", borderRadius: "2px",
        }} />
      </div>

      {/* Carousel */}
      <div
        onMouseEnter={pause}
        onMouseLeave={resume}
        style={{
          position: "relative",
          width: "100%", maxWidth: "1100px",
          height: `${CARD_H + 20}px`,
          perspective: "1200px",
          transformStyle: "preserve-3d",
        }}
      >
        {CARDS.map((card, index) => (
          <div
            key={card.id}
            style={getCardStyle(index)}
            onClick={() => handleCardClick(index)}
            role="button"
            tabIndex={0}
            aria-label={index !== activeIndex ? `View ${card.title}` : `Toggle details for ${card.title}`}
            onKeyDown={(e) => { if (e.key === "Enter" || e.key === " ") handleCardClick(index); }}
          >
            <CardItem
              card={card}
              isActive={index === activeIndex}
              isFlipped={flippedIndex === index}
            />
          </div>
        ))}
      </div>

      {/* Navigation */}
      <div style={{ display: "flex", alignItems: "center", gap: "28px", marginTop: "52px" }}>
        <NavButton direction="prev" onClick={() => goTo((activeIndex - 1 + TOTAL) % TOTAL)} />

        {/* Dots */}
        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          {CARDS.map((_, i) => (
            <button
              key={i}
              onClick={() => goTo(i)}
              aria-label={`Go to card ${i + 1}`}
              style={{
                height: "7px",
                width: i === activeIndex ? "26px" : "7px",
                borderRadius: "4px",
                background: i === activeIndex ? GOLD : "#c8bfad",
                border: "none", cursor: "pointer", padding: 0,
                transition: "all 0.4s cubic-bezier(0.34, 1.26, 0.64, 1)",
              }}
            />
          ))}
        </div>

        <NavButton direction="next" onClick={() => goTo((activeIndex + 1) % TOTAL)} />
      </div>
    </section>
  );
}

/* ── NavButton ── */
function NavButton({ direction, onClick }: { direction: "prev" | "next"; onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      aria-label={direction === "prev" ? "Previous" : "Next"}
      style={{
        width: "46px", height: "46px", borderRadius: "50%",
        border: `1.5px solid ${GOLD}`,
        background: "transparent", cursor: "pointer",
        display: "flex", alignItems: "center", justifyContent: "center",
        color: GOLD, transition: "all 0.2s ease", flexShrink: 0,
      }}
    >
      <svg width="17" height="17" viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
        {direction === "prev"
          ? <path d="M15 18l-6-6 6-6" />
          : <path d="M9 18l6-6-6-6" />}
      </svg>
    </button>
  );
}

/* ── CardItem ── */
function CardItem({ card, isActive, isFlipped }: { card: CardData; isActive: boolean; isFlipped: boolean }) {
  return (
    <div style={{
      width: "100%", height: "100%",
      borderRadius: "22px", overflow: "hidden",
      position: "relative",
      boxShadow: isActive
        ? "0 28px 64px rgba(0,0,0,0.28), 0 4px 16px rgba(0,0,0,0.12)"
        : "0 6px 20px rgba(0,0,0,0.10)",
      transition: "box-shadow 0.5s ease",
      userSelect: "none",
    }}>
      {/* Background image */}
      <div style={{
        position: "absolute", inset: 0,
        backgroundImage: `url(${card.image})`,
        backgroundSize: "cover", backgroundPosition: "center",
        transform: isFlipped ? "scale(1.04)" : "scale(1)",
        transition: "transform 0.6s ease",
      }} />

      {/* Bottom gradient always visible */}
      <div style={{
        position: "absolute", inset: 0,
        background: "linear-gradient(to top, rgba(10,8,5,0.82) 0%, rgba(10,8,5,0.18) 55%, transparent 100%)",
      }} />

      {/* Title at bottom */}
      <div style={{
        position: "absolute", bottom: 0, left: 0, right: 0,
        padding: "0 24px 28px",
        transform: isFlipped ? "translateY(-6px)" : "translateY(0)",
        transition: "transform 0.45s cubic-bezier(0.34, 1.26, 0.64, 1)",
      }}>
        <h3 style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "22px", fontWeight: 700, fontStyle: "italic",
          color: "#fbf3e4", margin: 0, lineHeight: 1.25,
          letterSpacing: "-0.2px",
          textShadow: "0 2px 8px rgba(0,0,0,0.45)",
        }}>
          {card.title}
        </h3>
      </div>

      {/* Glassmorphic detail overlay */}
      <div style={{
        position: "absolute", inset: 0, borderRadius: "22px",
        background: "rgba(10,8,5,0.74)",
        backdropFilter: isFlipped ? "blur(14px)" : "blur(0px)",
        WebkitBackdropFilter: isFlipped ? "blur(14px)" : "blur(0px)",
        opacity: isFlipped ? 1 : 0,
        transition: "opacity 0.4s ease, backdrop-filter 0.4s ease",
        display: "flex", flexDirection: "column", justifyContent: "center",
        padding: "32px 28px",
        pointerEvents: isFlipped ? "auto" : "none",
      }}>
        <div style={{
          width: "36px", height: "2px",
          background: `linear-gradient(90deg, ${GOLD}, ${GOLD_LIGHT})`,
          borderRadius: "2px", marginBottom: "18px",
        }} />

        <h3 style={{
          fontFamily: "var(--font-playfair), serif",
          fontSize: "20px", fontWeight: 700, fontStyle: "italic",
          color: "#fff", margin: "0 0 20px", lineHeight: 1.25,
        }}>
          {card.title}
        </h3>

        <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
          {card.bullets.map((bullet, i) => (
            <div key={i} style={{ display: "flex", flexDirection: "column", gap: "3px" }}>
              <span style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "9px", fontWeight: 700,
                letterSpacing: "2.5px", textTransform: "uppercase",
                color: GOLD_LIGHT,
              }}>
                {bullet.label}
              </span>
              <span style={{
                fontFamily: "var(--font-dm-sans), sans-serif",
                fontSize: "13px", fontWeight: 400,
                color: "rgba(255,255,255,0.78)", lineHeight: 1.55,
              }}>
                {bullet.description}
              </span>
            </div>
          ))}
        </div>

        <p style={{
          marginTop: "22px", fontSize: "10px",
          color: "rgba(255,255,255,0.32)",
          letterSpacing: "1.5px", textTransform: "uppercase",
          fontFamily: "var(--font-dm-sans), sans-serif",
        }}>
          Click to close
        </p>
      </div>
    </div>
  );
}