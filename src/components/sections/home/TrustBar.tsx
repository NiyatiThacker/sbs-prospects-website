"use client";

import { useEffect, useRef } from "react";
import Image from "next/image";

export default function TrustBar() {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const gridCanvasRef = useRef<HTMLDivElement>(null);
  const gridBackgroundRef = useRef<HTMLDivElement>(null);
  const scrollHintRef = useRef<HTMLDivElement>(null);
  const connectionPathRef = useRef<SVGPathElement>(null);

  useEffect(() => {
    if (
      !gridCanvasRef.current ||
      !gridBackgroundRef.current ||
      !scrollHintRef.current ||
      !connectionPathRef.current
    )
      return;

    const gridCanvas = gridCanvasRef.current;
    const gridBackground = gridBackgroundRef.current;
    const scrollHint = scrollHintRef.current;
    const connectionPath = connectionPathRef.current;

    // Respect reduced motion preference
    const prefersReducedMotion = window.matchMedia(
      "(prefers-reduced-motion: reduce)"
    ).matches;

    const orbitRings = gridCanvas.querySelectorAll(
      ".sbs-orbit-ring"
    ) as NodeListOf<HTMLElement>;
    const items = gridCanvas.querySelectorAll(
      ".sbs-grid-item"
    ) as NodeListOf<HTMLElement>;

    let idleRotation = 0;
    let scrollProgress = 0;
    let easedProgress = 0;
    let layoutData: {
      element: HTMLElement;
      gridX: number;
      gridY: number;
      indicatorGridX: number;
      indicatorGridY: number;
      currentTx: number;
      currentTy: number;
      isCard: boolean;
      isHub: boolean;
      baseAngle: number;
    }[] = [];
    let isMobile = false;
    let isTablet = false;
    let cx = 0;
    let cy = 0;
    let radius = 0;
    let animationFrameId: number;
    let ticking = false;

    function easeInOutCubic(x: number) {
      return x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2;
    }

    function createGridBackground() {
      if (!gridBackground) return;
      gridBackground.innerHTML = "";

      isMobile = window.innerWidth <= 768;
      isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      const cols = isMobile ? 4 : 8;
      const rows = isMobile ? 7 : 8;
      const totalCells = cols * rows;

      gridBackground.style.gridTemplateColumns = `repeat(${cols}, 1fr)`;
      gridBackground.style.gridTemplateRows = `repeat(${rows}, 1fr)`;

      for (let i = 0; i < totalCells; i++) {
        const cell = document.createElement("div");
        cell.classList.add("sbs-grid-bg-cell");
        gridBackground.appendChild(cell);
      }
    }

    function measureLayout() {
      if (!gridCanvas) return;

      items.forEach((item) => {
        item.style.transform = "none";
        item.style.opacity = "";
      });

      const canvasRect = gridCanvas.getBoundingClientRect();
      isMobile = window.innerWidth <= 768;
      isTablet = window.innerWidth > 768 && window.innerWidth <= 1024;

      cx = canvasRect.width / 2;
      cy = canvasRect.height / 2;

      // Tighter radius on tablet, balanced on mobile
      const radiusFactor = isMobile ? 0.26 : isTablet ? 0.27 : 0.28;
      radius = Math.min(canvasRect.width, canvasRect.height) * radiusFactor;

      layoutData = [];
      items.forEach((item) => {
        const rect = item.getBoundingClientRect();
        const gridX = rect.left - canvasRect.left + rect.width / 2;
        const gridY = rect.top - canvasRect.top + rect.height / 2;

        let indicatorGridX = gridX;
        let indicatorGridY = gridY;

        if (item.classList.contains("sbs-orbit-card")) {
          const indicator = item.querySelector(".sbs-card-indicator");
          if (indicator) {
            const indRect = indicator.getBoundingClientRect();
            indicatorGridX = indRect.left - canvasRect.left + indRect.width / 2;
            indicatorGridY = indRect.top - canvasRect.top + indRect.height / 2;
          }
        }

        layoutData.push({
          element: item,
          gridX,
          gridY,
          indicatorGridX,
          indicatorGridY,
          currentTx: 0,
          currentTy: 0,
          isCard: item.classList.contains("sbs-orbit-card"),
          isHub: item.id === "centerHub",
          baseAngle: parseFloat(item.getAttribute("data-angle") || "0"),
        });
      });
    }

    let resizeTimeout: ReturnType<typeof setTimeout>;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        createGridBackground();
        measureLayout();
        updateLayout();
      }, 150);
    };
    window.addEventListener("resize", handleResize, { passive: true });

    // Passive scroll for iOS performance
    const handleScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          const container = scrollContainerRef.current;
          if (!container) {
            ticking = false;
            return;
          }

          const rect = container.getBoundingClientRect();
          const scrollRange = rect.height - window.innerHeight;

          if (scrollRange > 0) {
            const progress = -rect.top / scrollRange;
            scrollProgress = Math.max(0, Math.min(1, progress));
          } else {
            scrollProgress = 0;
          }

          const startRange = 0.4;
          const endRange = 0.85;

          if (scrollProgress < startRange) {
            easedProgress = 0;
          } else if (scrollProgress > endRange) {
            easedProgress = 1;
          } else {
            const u = (scrollProgress - startRange) / (endRange - startRange);
            easedProgress = easeInOutCubic(u);
          }

          ticking = false;
        });
        ticking = true;
      }
    };
    window.addEventListener("scroll", handleScroll, { passive: true });

    function updateLayout() {
      if (layoutData.length === 0) return;

      // --- CONFIGURABLE: Set expansion limit here ---
      // 0.80 means phone expands 80% of the way (keeping it safe), 1.16 is for desktop
      const expansionFactor = isMobile ? 0.80 : 1.16; 

      const hintOpacity = Math.max(0, 1 - scrollProgress * 5);
      if (scrollHint) {
        scrollHint.style.opacity = String(hintOpacity);
        scrollHint.style.pointerEvents = hintOpacity <= 0 ? "none" : "auto";
      }

      const cells = gridCanvas.querySelectorAll(
        ".sbs-grid-bg-cell"
      ) as NodeListOf<HTMLElement>;
      cells.forEach((cell, idx) => {
        const progressThreshold = 0.05 + (idx % 10) * 0.015;
        if (easedProgress > progressThreshold) {
          cell.style.opacity = String(
            Math.min(0.7, (easedProgress - progressThreshold) * 3)
          );
        } else {
          cell.style.opacity = "0";
        }
      });

      orbitRings.forEach((ring) => {
        ring.style.opacity = String(1 - easedProgress);
      });

      layoutData.forEach((item) => {
        const el = item.element;
        const t = easedProgress;

        if (item.isHub) {
          const targetTx = cx - item.gridX;
          const targetTy = cy - item.gridY;
          const tx = targetTx * (1 - t);
          const ty = targetTy * (1 - t);
          item.currentTx = tx;
          item.currentTy = ty;
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
          el.style.opacity = "1";
        } else if (item.isCard) {
          const currentAngle =
            item.baseAngle +
            (idleRotation + easedProgress * 90) * (1 - t);
          const rad = (currentAngle * Math.PI) / 180;

          const circleX = cx + radius * Math.cos(rad);
          const circleY = cy + radius * Math.sin(rad);

          const targetTx = circleX - item.gridX;
          const targetTy = circleY - item.gridY;

          // Applied expansionFactor here
          const tx = targetTx * (1 - t * expansionFactor);
          const ty = targetTy * (1 - t * expansionFactor);
          item.currentTx = tx;
          item.currentTy = ty;

          const scale = 0.88 + 0.12 * t;
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
          el.style.opacity = "1";
        } else {
          const targetTx = cx - item.gridX;
          const targetTy = cy - item.gridY;

          // Applied expansionFactor here for images and quotes
          const tx = targetTx * (1 - t * expansionFactor);
          const ty = targetTy * (1 - t * expansionFactor);
          item.currentTx = tx;
          item.currentTy = ty;

          const scale = t;
          const opacity = t;
          el.style.transform = `translate3d(${tx}px, ${ty}px, 0) scale(${scale})`;
          el.style.opacity = String(opacity);
          el.style.pointerEvents = t > 0.95 ? "auto" : "none";
        }
      });

      const c1 = layoutData.find((d) => d.element.id === "card1");
      const c2 = layoutData.find((d) => d.element.id === "card2");
      const c3 = layoutData.find((d) => d.element.id === "card3");
      const c4 = layoutData.find((d) => d.element.id === "card4");

      if (c1 && c2 && c3 && c4 && connectionPath) {
        const x1 = c1.indicatorGridX + c1.currentTx;
        const y1 = c1.indicatorGridY + c1.currentTy;
        const x2 = c2.indicatorGridX + c2.currentTx;
        const y2 = c2.indicatorGridY + c2.currentTy;
        const x3 = c3.indicatorGridX + c3.currentTx;
        const y3 = c3.indicatorGridY + c3.currentTy;
        const x4 = c4.indicatorGridX + c4.currentTx;
        const y4 = c4.indicatorGridY + c4.currentTy;

        let pathD = "";
        if (isMobile) {
          pathD = `M ${x1} ${y1} L ${x2} ${y2} L ${x3} ${y3} L ${x4} ${y4}`;
        } else {
          pathD = `M ${x1} ${y1} L ${x3} ${y3} M ${x2} ${y2} L ${x4} ${y4}`;
        }

        connectionPath.setAttribute("d", pathD);
        connectionPath.style.opacity = String(easedProgress);
      }
    }

    function animate() {
      if (!prefersReducedMotion) {
        const rotationSpeed = 0.35 * (1 - easedProgress);
        idleRotation += rotationSpeed;
      }

      updateLayout();
      animationFrameId = requestAnimationFrame(animate);
    }

    createGridBackground();
    // Slightly longer init delay to let Next.js finish painting layout
    setTimeout(() => {
      measureLayout();
      animate();
    }, 150);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("scroll", handleScroll);
      cancelAnimationFrame(animationFrameId);
      clearTimeout(resizeTimeout);
    };
  }, []);

  return (
    <>
      <style>{`
        /* ─── SBS TRUST BAR — NAMESPACED DESIGN SYSTEM ─── */
        :root {
          --sbs-bg-color: #fbf3e4;
          --sbs-text-color: #1e1b13;
          --sbs-gold-color: #b8901a;
          --sbs-gold-light: rgba(184, 144, 26, 0.15);
          --sbs-border-color: rgba(184, 144, 26, 0.22);
          --sbs-card-bg: #faf6ef;
          --sbs-font-serif: var(--font-playfair), Georgia, serif;
          --sbs-font-sans: var(--font-inter), system-ui, sans-serif;
          --sbs-font-mono: 'Share Tech Mono', 'Courier New', monospace;
        }

        /* ── Scroll Container ── */
        .sbs-scroll-container {
          height: 350vh;
          position: relative;
          width: 100%;
          background-color: var(--sbs-bg-color);
          border-top: 1px solid #e8e0d0;
          border-bottom: 1px solid #e8e0d0;
        }

        /* ── Sticky Viewport ── */
        .sbs-sticky-viewport {
          position: sticky;
          top: 0;
          height: 100vh;
          height: 100dvh;
          width: 100%;
          overflow: hidden;
          display: grid;
          /* Header shrinks to content; canvas stretches to fill remaining space; marquee shrinks to content */
          grid-template-rows: auto 1fr auto;
          justify-items: center;
          padding-top: max(20px, env(safe-area-inset-top));
          box-sizing: border-box;
        }

        /* ── Header ── */
        .sbs-header-block {
          grid-row: 1;
          text-align: center;
          z-index: 10;
          pointer-events: none;
          padding: 0 16px;
        }

        .sbs-header-label {
          font-family: var(--sbs-font-sans);
          font-size: 10px;
          letter-spacing: 0.32em;
          color: var(--sbs-gold-color);
          text-transform: uppercase;
          margin-bottom: 10px;
          display: block;
        }

        .sbs-header-title {
          font-family: var(--sbs-font-serif);
          font-size: clamp(18px, 4vw, 28px);
          font-weight: 400;
          color: var(--sbs-text-color);
          letter-spacing: 0.04em;
          margin: 0;
          line-height: 1.2;
        }

        .sbs-header-ornament {
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
          margin-top: 12px;
        }

        .sbs-header-line {
          width: 28px;
          height: 1px;
          background: #c9a84c;
          flex-shrink: 0;
        }

        .sbs-header-diamond {
          width: 5px;
          height: 5px;
          background: #e9c349;
          transform: rotate(45deg);
          flex-shrink: 0;
        }

        /* ── Grid Canvas ── */
        .sbs-grid-container {
          grid-row: 2;
          align-self: center;
          justify-self: center;
          margin-top: 12px;
          position: relative;
          width: min(92vw, 1020px);  /* Wider screen layout to fill spaces */
          height: min(65vh, 560px);  /* Expanded vertical footprint to fill viewport */
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
          gap: 0;
          box-sizing: border-box;
          z-index: 2;
        }

        /* ── Background Grid Lines (Solid background, borders removed) ── */
        .sbs-grid-background {
          position: absolute;
          inset: 0;
          display: grid;
          grid-template-columns: repeat(8, 1fr);
          grid-template-rows: repeat(8, 1fr);
          pointer-events: none;
          z-index: 1;
        }

        .sbs-grid-bg-cell {
          opacity: 0;
          /* Borders removed to ensure a solid background design */
          border: none;
          box-sizing: border-box;
          transition: opacity 0.8s cubic-bezier(0.16, 1, 0.3, 1);
        }

        /* ── SVG Overlay ── */
        .sbs-connection-canvas {
          position: absolute;
          inset: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 3;
          overflow: visible;
        }

        #connectionPath {
          stroke: var(--sbs-gold-color);
          stroke-opacity: 0.08; /* More faded connection line */
          stroke-width: 1.2px;  /* Slightly finer line weight */
          fill: none;
          stroke-dasharray: 4 4; /* Finer dash pattern */
          animation: sbsDashMove 30s linear infinite;
          opacity: 0;
          transition: opacity 0.4s ease;
        }

        @keyframes sbsDashMove {
          to { stroke-dashoffset: -100; }
        }

        /* ── Shared Grid Item ── */
        .sbs-grid-container .sbs-grid-item {
          position: relative;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          will-change: transform, opacity;
          opacity: 1;
        }

        /* ── Center Hub ── */
        .sbs-center-hub {
          grid-column: 4 / span 2;
          grid-row: 4 / span 2;
          z-index: 15;
        }

        .sbs-center-circle {
          width: 140px;
          height: 140px;
          border-radius: 50%;
          border: 1px solid rgba(184, 144, 26, 0.45);
          background-color: var(--sbs-card-bg);
          box-shadow:
            0 0 40px rgba(184, 144, 26, 0.14),
            inset 0 0 18px rgba(184, 144, 26, 0.05);
          display: flex;
          align-items: center;
          justify-content: center;
          cursor: pointer;
          flex-shrink: 0;
        }

        .sbs-center-circle-inner {
          width: 102px;
          height: 102px;
          border-radius: 50%;
          border: 1px solid rgba(184, 144, 26, 0.22);
          display: flex;
          align-items: center;
          justify-content: center;
          background: rgba(255, 255, 255, 0.35);
          backdrop-filter: blur(8px);
          -webkit-backdrop-filter: blur(8px);
          overflow: hidden;
        }

        .sbs-center-circle img {
          width: auto;
          height: auto;
          max-width: 100%;
          max-height: 100%;
          object-fit: contain;
          border-radius: 50%;
        }

        /* ── Orbit Rings ── */
        .sbs-orbit-ring {
          position: absolute;
          border: 1px dashed rgba(184, 144, 26, 0.2);
          border-radius: 50%;
          pointer-events: none;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          will-change: opacity;
        }

        .sbs-ring-1 {
          width: 300px;
          height: 300px;
          animation: sbsRotateRing 40s linear infinite;
        }

        .sbs-ring-2 {
          width: 560px;
          height: 560px;
          animation: sbsRotateRingBack 60s linear infinite;
        }

        @keyframes sbsRotateRing {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(360deg); }
        }

        @keyframes sbsRotateRingBack {
          from { transform: translate(-50%, -50%) rotate(0deg); }
          to   { transform: translate(-50%, -50%) rotate(-360deg); }
        }

        @media (prefers-reduced-motion: reduce) {
          .sbs-ring-1, .sbs-ring-2,
          .sbs-card-indicator-ring,
          .sbs-wheel,
          .sbs-marquee-inner,
          #connectionPath {
            animation: none !important;
          }
        }

        .sbs-orbit-card {
          align-self: start; /* Keeps text cards aligned high to prevent vertical conflicts */
        }

        /* ── Orbit Cards (Borderless Floating Text) ── */
        .sbs-card {
          background-color: transparent;
          border: none;
          padding: 12px 16px;
          width: max-content;
          max-width: 140px;
          height: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 6px;
          cursor: pointer;
          transition: transform 0.3s ease;
        }

        .sbs-card:hover {
          transform: translateY(-2px);
        }

        .sbs-card-indicator {
          width: 52px;
          height: 52px;
          border-radius: 50%;
          border: 1px solid rgba(184, 144, 26, 0.4);
          background-color: var(--sbs-card-bg);
          box-shadow: 0 0 12px rgba(184, 144, 26, 0.1);
          display: flex;
          align-items: center;
          justify-content: center;
          flex-shrink: 0;
          margin-bottom: 4px;
        }

        .sbs-card-indicator-inner {
          position: relative;
          width: 16px;
          height: 16px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .sbs-card-indicator-ring {
          position: absolute;
          width: 16px;
          height: 16px;
          border-radius: 50%;
          border: 1px solid rgba(201, 168, 76, 0.35);
          animation: sbsPulseOrb 2.8s ease-in-out infinite;
        }

        .sbs-card-indicator-dot {
          width: 8px;
          height: 8px;
          border-radius: 50%;
          background: radial-gradient(circle, #f4d87a 0%, #c9a84c 70%);
          box-shadow: 0 0 14px rgba(201, 168, 76, 0.45);
        }

        @keyframes sbsPulseOrb {
          0%   { transform: scale(0.6); opacity: 1; }
          100% { transform: scale(1.6); opacity: 0; }
        }

        .sbs-card-content {
          display: flex;
          flex-direction: column;
          align-items: center;
        }

        .sbs-card-category {
          font-family: var(--sbs-font-sans);
          font-size: 8.5px;
          font-weight: 500;
          letter-spacing: 0.18em;
          color: var(--sbs-gold-color);
          text-transform: uppercase;
          text-align: center;
        }

        .sbs-card-title {
          font-family: var(--sbs-font-serif);
          font-weight: 400;
          font-size: 13px;
          color: var(--sbs-text-color);
          margin-top: 3px;
          white-space: normal;
          text-align: center;
          line-height: 1.35;
        }

        .sbs-card:hover .sbs-card-title {
          color: var(--sbs-gold-color);
        }

        /* Desktop card placements - pulled inwards horizontally to prevent side overlaps */
        #card1 { grid-column: 2 / span 2; grid-row: 2 / span 2; justify-self: end; }
        #card2 { grid-column: 6 / span 2; grid-row: 2 / span 2; justify-self: start; }
        #card3 { grid-column: 2 / span 2; grid-row: 6 / span 2; justify-self: end; }
        #card4 { grid-column: 6 / span 2; grid-row: 6 / span 2; justify-self: start; }

        /* ── Halftone Images ── */
        .sbs-grid-image {
          width: 100%;
          height: 100%;
          max-width: 220px;  /* Size caps to ensure overlap protection on wide screens */
          max-height: 140px;
          overflow: hidden;
          border: 1px solid var(--sbs-border-color);
          opacity: 0;
          pointer-events: none;
          background-color: var(--sbs-card-bg);
          padding: 8px;
          box-sizing: border-box;
          transition: border-color 0.3s ease;
        }

        .sbs-grid-image img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          mix-blend-mode: multiply;
          filter: grayscale(100%) contrast(1.05);
          transition: transform 0.5s ease, filter 0.5s ease;
          display: block;
        }

        .sbs-grid-image:hover { border-color: var(--sbs-gold-color); }
        .sbs-grid-image:hover img {
          transform: scale(1.04);
          filter: grayscale(0%) contrast(1.05);
        }

        /* Desktop image placements with safety alignments */
        #imgSculpture { grid-column: 4 / span 2; grid-row: 1 / span 2; align-self: start; }
        #imgCamera    { grid-column: 7 / span 2; grid-row: 4 / span 2; justify-self: end; }
        #imgHourglass { grid-column: 4 / span 2; grid-row: 7 / span 2; align-self: end; }
        #imgSphere    { grid-column: 1 / span 2; grid-row: 4 / span 2; justify-self: start; }

        /* ── Quote Blocks ── */
        .sbs-grid-quote {
          width: 100%;
          height: 100%;
          padding: 16px;
          opacity: 0;
          pointer-events: none;
          display: flex;
          align-items: center;
        }

        .sbs-quote-text {
          font-family: var(--sbs-font-sans);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          line-height: 1.5;
          font-weight: 600;
          color: var(--sbs-text-color);
          border-left: 2px solid var(--sbs-gold-color);
          padding-left: 14px;
        }

        #quote1 { grid-column: 1 / span 3; grid-row: 1 / span 1; }
        #quote2 { grid-column: 1 / span 3; grid-row: 8 / span 1; }

        /* ── Decor Text ── */
        .sbs-decor-text {
          font-family: var(--sbs-font-mono);
          font-size: 0.65rem;
          color: rgba(28, 24, 20, 0.45);
          opacity: 0;
          pointer-events: none;
          width: 100%;
          height: 100%;
        }

        #decorUrl      { grid-column: 1 / span 1; grid-row: 3 / span 1; display: flex; align-items: flex-end; justify-content: flex-start; padding: 8px; }
        #decorLocation { grid-column: 8 / span 1; grid-row: 6 / span 1; display: flex; align-items: flex-start; justify-content: flex-end; text-align: right; padding: 8px; }
        #decorSystem   { grid-column: 6 / span 3; grid-row: 8 / span 1; display: flex; align-items: center; justify-content: flex-end; padding: 16px; letter-spacing: 1px; }

        /* ── Brand Logos ── */
        .sbs-brand-logo {
          color: rgba(28, 24, 20, 0.35);
          opacity: 0;
          pointer-events: none;
          width: 100%;
          height: 100%;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: color 0.3s ease;
        }

        .sbs-brand-logo svg { width: 20px; height: 20px; }
        .sbs-brand-logo:hover { color: var(--sbs-gold-color); }

        #logo1 { grid-column: 1 / span 1; grid-row: 7 / span 1; }
        #logo2 { grid-column: 8 / span 1; grid-row: 1 / span 1; }
        #logo3 { grid-column: 8 / span 1; grid-row: 5 / span 1; }

        /* ── Scroll Hint ── */
        .sbs-scroll-hint {
          position: absolute;
          bottom: 80px;
          left: 50%;
          transform: translateX(-50%);
          display: flex;
          flex-direction: column;
          align-items: center;
          gap: 12px;
          font-family: var(--sbs-font-mono);
          font-size: 0.65rem;
          letter-spacing: 2px;
          color: var(--sbs-gold-color);
          transition: opacity 0.5s ease;
          z-index: 20;
          white-space: nowrap;
        }

        .sbs-mouse-icon {
          width: 22px;
          height: 36px;
          border: 1.5px solid var(--sbs-gold-color);
          border-radius: 12px;
          position: relative;
          flex-shrink: 0;
        }

        .sbs-mouse-icon .sbs-wheel {
          width: 3px;
          height: 6px;
          background-color: var(--sbs-gold-color);
          border-radius: 50%;
          position: absolute;
          top: 6px;
          left: 50%;
          transform: translateX(-50%);
          animation: sbsScrollWheel 2s ease-in-out infinite;
        }

        @keyframes sbsScrollWheel {
          0%   { top: 6px;  opacity: 1; }
          50%  { top: 16px; opacity: 0; }
          100% { top: 6px;  opacity: 1; }
        }

        /* ── Marquee (Untouched positioning per request) ── */
        .sbs-marquee-block {
          grid-row: 3;
          width: 100%;
          overflow: hidden;
          border-top: 1px solid rgba(184, 144, 26, 0.14);
          padding: 14px 0;
          position: relative;
          z-index: 10;
          background: rgba(255, 255, 255, 0.28);
          backdrop-filter: blur(10px);
          -webkit-backdrop-filter: blur(10px);
          /* Keep above safe-area at bottom */
          padding-bottom: max(14px, env(safe-area-inset-bottom));
        }

        .sbs-marquee-inner {
          display: flex;
          width: max-content;
          animation: sbsMarqueeAnim 26s linear infinite;
          gap: 48px;
          white-space: nowrap;
        }

        .sbs-marquee-text {
          font-family: var(--sbs-font-sans);
          font-size: 10px;
          letter-spacing: 0.26em;
          text-transform: uppercase;
          color: var(--sbs-gold-color);
          flex-shrink: 0;
        }

        @keyframes sbsMarqueeAnim {
          0%   { transform: translate3d(0, 0, 0); }
          100% { transform: translate3d(-50%, 0, 0); }
        }

        /* ════════════════════════════════════
           TABLET  (769px – 1024px)
           ════════════════════════════════════ */
        @media (min-width: 769px) and (max-width: 1024px) {
          .sbs-grid-container {
            width: min(95vw, 840px);
            height: min(60vh, 480px);
          }

          .sbs-center-circle       { width: 120px; height: 120px; }
          .sbs-center-circle-inner { width: 88px;  height: 88px; }

          .sbs-ring-1 { width: 260px; height: 260px; }
          .sbs-ring-2 { width: 460px; height: 460px; }

          .sbs-card           { padding: 10px 12px; max-width: 140px; }
          .sbs-card-title     { font-size: 12px; }
          .sbs-card-indicator { width: 44px; height: 44px; }

          .sbs-quote-text { font-size: 9px; }
        }

        /* ════════════════════════════════════
           MOBILE  (≤ 768px)
           4-column × 7-row symmetric layout
           ════════════════════════════════════ */
        @media (max-width: 768px) {
          .sbs-sticky-viewport {
            padding-top: max(76px, env(safe-area-inset-top));
          }

          .sbs-header-block  { margin-top: 0; }
          .sbs-header-title  { font-size: clamp(16px, 4.5vw, 22px); }

          /* Grid switches to 4-col × 7-row */
          .sbs-grid-container {
            width: 96vw;
            height: min(60vh, 440px); /* Spacious height to fill mobile space nicely */
            align-self: center;
            margin-top: 8px;
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(7, 1fr);
            gap: 0;
          }

          .sbs-grid-background {
            grid-template-columns: repeat(4, 1fr);
            grid-template-rows: repeat(7, 1fr);
          }

          /* ── Mobile card placements ── */
          #card1 { grid-column: 1 / span 3; grid-row: 2 / span 1; }
          #card2 { grid-column: 2 / span 3; grid-row: 3 / span 1; }
          #card3 { grid-column: 1 / span 3; grid-row: 5 / span 1; }
          #card4 { grid-column: 2 / span 3; grid-row: 6 / span 1; }

          /* ── Mobile center hub ── */
          .sbs-center-hub {
            grid-column: 2 / span 2;
            grid-row: 4 / span 1;
          }
          .sbs-center-circle       { width: 80px; height: 80px; }
          .sbs-center-circle-inner { width: 60px; height: 60px; }

          /* ── Mobile image placements – shown as small squares ── */
          #imgSculpture { grid-column: 4 / span 1; grid-row: 2 / span 1; }
          #imgCamera    { grid-column: 1 / span 1; grid-row: 3 / span 1; }
          #imgHourglass { grid-column: 4 / span 1; grid-row: 5 / span 1; }
          #imgSphere    { grid-column: 1 / span 1; grid-row: 6 / span 1; }

          .sbs-grid-image {
            width: 70px !important;
            height: 70px !important;
            margin: auto;
            padding: 5px;
            border-radius: 4px;
          }

          /* ── Mobile quotes ── */
          #quote1 { grid-column: 1 / span 4; grid-row: 1 / span 1; padding: 0 10px; }
          #quote2 { grid-column: 1 / span 4; grid-row: 7 / span 1; padding: 0 10px; }

          .sbs-quote-text {
            font-size: 8px;
            letter-spacing: 0.18em;
            padding-left: 8px;
          }

          .sbs-orbit-card {
            align-self: center;
          }

          /* ── Mobile cards ── */
          .sbs-card {
            padding: 4px 0;
            gap: 6px;
            max-width: none;
          }

          .sbs-card-indicator {
            width: 36px;
            height: 36px;
            margin-bottom: 2px;
          }

          .sbs-card-title {
            font-size: 11px;
            max-width: 110px;
            white-space: normal;
            line-height: 1.2;
            margin-top: 2px;
          }

          .sbs-card-category {
            font-size: 7px;
            letter-spacing: 0.15em;
          }

          /* ── Orbit rings – sized for mobile canvas ── */
          .sbs-ring-1 { width: 200px; height: 200px; }
          .sbs-ring-2 { width: 350px; height: 350px; }

          /* ── Scroll hint repositioned for mobile ── */
          .sbs-scroll-hint { bottom: 70px; }

          /* ── Hide decorative-only elements ── */
          #decorUrl, #decorLocation, #decorSystem,
          #logo1, #logo2, #logo3 {
            display: none !important;
          }
        }

        /* ── Very small phones (≤ 375px) ── */
        @media (max-width: 375px) {
          .sbs-grid-container {
            /* height inherited from stretch — no override needed */
          }

          .sbs-center-circle       { width: 68px; height: 68px; }
          .sbs-center-circle-inner { width: 50px; height: 50px; }

          .sbs-ring-1 { width: 170px; height: 170px; }
          .sbs-ring-2 { width: 300px; height: 300px; }

          .sbs-card-title { font-size: 10px; max-width: 90px; }

          .sbs-grid-image {
            width: 60px !important;
            height: 60px !important;
          }
        }
      `}</style>

      {/* ─── Circle-to-Grid Sticky Scroll Section ─── */}
      <div className="sbs-scroll-container" ref={scrollContainerRef}>
        <div className="sbs-sticky-viewport">

          {/* Header */}
          <div className="sbs-header-block">
            <span className="sbs-header-label">Connected Financial Planning</span>
            <h2 className="sbs-header-title">The SBS Wealth Ecosystem</h2>
            <div className="sbs-header-ornament">
              <div className="sbs-header-line" />
              <div className="sbs-header-diamond" />
              <div className="sbs-header-line" />
            </div>
          </div>

          {/* Grid Canvas */}
          <div className="sbs-grid-container" id="gridCanvas" ref={gridCanvasRef}>

            {/* Background Cell Matrix */}
            <div className="sbs-grid-background" id="gridBackground" ref={gridBackgroundRef} />

            {/* SVG Connection Lines */}
            <svg className="sbs-connection-canvas" id="connectionCanvas" aria-hidden="true">
              <path id="connectionPath" ref={connectionPathRef} />
            </svg>

            {/* Center Logo Hub */}
            <div className="sbs-center-hub sbs-grid-item" id="centerHub">
              <div className="sbs-center-circle">
                <div className="sbs-center-circle-inner">
                  <Image
                    src="/logo/Sbs-1.png"
                    alt="SBS Trust"
                    width={84}
                    height={84}
                    priority
                  />
                </div>
              </div>
            </div>

            {/* Orbit Card 1 */}
            <div className="sbs-grid-item sbs-orbit-card" id="card1" data-angle="-135">
              <div className="sbs-card">
                <div className="sbs-card-indicator">
                  <div className="sbs-card-indicator-inner">
                    <div className="sbs-card-indicator-ring" />
                    <div className="sbs-card-indicator-dot" />
                  </div>
                </div>
                <div className="sbs-card-content">
                  <span className="sbs-card-category">AMFI Registered</span>
                  <h3 className="sbs-card-title">Trusted Advisory</h3>
                </div>
              </div>
            </div>

            {/* Orbit Card 2 */}
            <div className="sbs-grid-item sbs-orbit-card" id="card2" data-angle="-45">
              <div className="sbs-card">
                <div className="sbs-card-indicator">
                  <div className="sbs-card-indicator-inner">
                    <div className="sbs-card-indicator-ring" />
                    <div className="sbs-card-indicator-dot" />
                  </div>
                </div>
                <div className="sbs-card-content">
                  <span className="sbs-card-category">Client-Centric</span>
                  <h3 className="sbs-card-title">Long-Term Planning</h3>
                </div>
              </div>
            </div>

            {/* Orbit Card 3 */}
            <div className="sbs-grid-item sbs-orbit-card" id="card3" data-angle="135">
              <div className="sbs-card">
                <div className="sbs-card-indicator">
                  <div className="sbs-card-indicator-inner">
                    <div className="sbs-card-indicator-ring" />
                    <div className="sbs-card-indicator-dot" />
                  </div>
                </div>
                <div className="sbs-card-content">
                  <span className="sbs-card-category">Financial Solutions</span>
                  <h3 className="sbs-card-title">Structured Guidance</h3>
                </div>
              </div>
            </div>

            {/* Orbit Card 4 */}
            <div className="sbs-grid-item sbs-orbit-card" id="card4" data-angle="45">
              <div className="sbs-card">
                <div className="sbs-card-indicator">
                  <div className="sbs-card-indicator-inner">
                    <div className="sbs-card-indicator-ring" />
                    <div className="sbs-card-indicator-dot" />
                  </div>
                </div>
                <div className="sbs-card-content">
                  <span className="sbs-card-category">Personalized</span>
                  <h3 className="sbs-card-title">Wealth Strategies</h3>
                </div>
              </div>
            </div>

            {/* Halftone Images */}
            <div className="sbs-grid-item sbs-grid-image" id="imgSculpture">
              <img src="/images/scrollgrid/sclupture.jpg" alt="Sculpture" />
            </div>
            <div className="sbs-grid-item sbs-grid-image" id="imgCamera">
              <img src="/images/scrollgrid/camera.jpg" alt="Camera" />
            </div>
            <div className="sbs-grid-item sbs-grid-image" id="imgHourglass">
              <img src="/images/scrollgrid/hourglass.jpg" alt="Hourglass" />
            </div>
            <div className="sbs-grid-item sbs-grid-image" id="imgSphere">
              <img src="/images/scrollgrid/sphere.jpg" alt="Sphere" />
            </div>

            {/* Quotes */}
            <div className="sbs-grid-item sbs-grid-quote" id="quote1">
              <p className="sbs-quote-text">EVERYTHING AROUND YOU THAT YOU CALLED LIFE</p>
            </div>
            <div className="sbs-grid-item sbs-grid-quote" id="quote2">
              <p className="sbs-quote-text">WAS MADE BY PEOPLE THAT WERE NO SMARTER THAN YOU.</p>
            </div>

            {/* Corner Decor Texts */}
            <div className="sbs-grid-item sbs-decor-text" id="decorUrl">WWW.SBSPROSPECT.COM</div>
            <div className="sbs-grid-item sbs-decor-text" id="decorLocation">EST. 2019 / PALDI-AHMEDABAD</div>
            <div className="sbs-grid-item sbs-decor-text" id="decorSystem">UPDATE YOUR PROSPECTS WITH US </div>

            {/* Corner Brand Elements */}
            <div className="sbs-grid-item sbs-brand-logo" id="logo1" aria-hidden="true">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 22h20L12 2zm0 3.99L18.47 19H5.53L12 5.99z"/></svg>
            </div>
            <div className="sbs-grid-item sbs-brand-logo" id="logo2" aria-hidden="true">
              <svg fill="currentColor" viewBox="0 0 24 24"><circle cx="12" cy="12" r="8"/></svg>
            </div>
            <div className="sbs-grid-item sbs-brand-logo" id="logo3" aria-hidden="true">
              <svg fill="currentColor" viewBox="0 0 24 24"><path d="M12 2L2 12l10 10 10-10L12 2zm0 3.42L18.58 12 12 18.58 5.42 12 12 5.42z"/></svg>
            </div>

            {/* Orbit Rings */}
            <div className="sbs-orbit-ring sbs-ring-1" aria-hidden="true" />
            <div className="sbs-orbit-ring sbs-ring-2" aria-hidden="true" />

          </div>

          {/* Marquee */}
          <div className="sbs-marquee-block">
            <div className="sbs-marquee-inner" aria-hidden="true">
              {[
                "Legacy-Focused Wealth Planning",
                "Disciplined Financial Guidance",
                "Long-Term Relationship Driven Advisory",
                "Structured Investment Thinking",
                "Preserving Wealth Across Generations",
                "Clarity Through Every Financial Stage",
                "Legacy-Focused Wealth Planning",
                "Disciplined Financial Guidance",
                "Long-Term Relationship Driven Advisory",
                "Structured Investment Thinking",
                "Preserving Wealth Across Generations",
                "Clarity Through Every Financial Stage",
              ].map((text, i) => (
                <span key={i} className="sbs-marquee-text">{text}</span>
              ))}
            </div>
          </div>

          {/* Scroll Hint */}
          <div className="sbs-scroll-hint" id="scrollHint" ref={scrollHintRef} aria-hidden="true">
            <div className="sbs-mouse-icon">
              <div className="sbs-wheel" />
            </div>
            <span>SCROLL TO UNIFY</span>
          </div>

        </div>
      </div>
    </>
  );
}