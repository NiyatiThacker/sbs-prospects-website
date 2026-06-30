"use client";

import { Playfair_Display } from "next/font/google";
import { useEffect, useRef, useState } from "react";

const playfair = Playfair_Display({
  subsets: ["latin"],
  weight: ["600", "700"],
  style: ["normal", "italic"],
});

function useInView<T extends HTMLElement>() {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          observer.disconnect();
        }
      },
      { threshold: 0.2 }
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

export default function ContactHero() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section
      ref={ref}
      style={{ paddingTop: "200px", paddingBottom: "100px" }}
      className="relative w-full overflow-hidden bg-[#16162B] px-6 pb-16 md:px-16 md:pb-24 scroll-mt-20 flex flex-col items-center justify-center"
    >
      {/* Background Image - Complete full background with faded dark overlay */}
      <div className="absolute inset-0 pointer-events-none z-0">
        <img
          src="images/contact us/contact-hero1.jpg"
          alt="String lights over a cobblestone alley"
          loading="eager"
          decoding="async"
          className="h-full w-full object-cover"
        />
        {/* Dark overlay to fade the image */}
        <div className="absolute inset-0 bg-black/10" />
      </div>

      {/* ambient pulsing glow accents */}
      <div className="glow-pulse pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#A9802F]/15 blur-3xl" />
      <div
        className="glow-pulse pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-white/5 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <div 
        style={{ margin: "0 auto" }}
        className="relative flex max-w-6xl w-full flex-col items-center justify-center gap-10"
      >
        {/* Center content */}
        <div
          className={`relative z-10 flex w-full flex-col items-center text-center max-w-2xl transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "200ms", transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          <span className="relative mb-4 inline-block text-xs font-semibold tracking-[0.25em] text-[#A9802F] md:text-sm" style={{ marginBottom: "16px", marginTop: "8px" }}>
            GET IN TOUCH
            <span
              className={`absolute -bottom-2 left-1/2 h-px -translate-x-1/2 bg-[#A9802F] transition-all duration-700 ease-out ${
                inView ? "w-10" : "w-0"
              }`}
              style={{ transitionDelay: "550ms" }}
            />
          </span>

          <h2 className={`${playfair.className} leading-[1.1] text-[#A9802F]`}>
            <span className="block text-4xl font-semibold sm:text-5xl md:text-6xl mask-right" style={{ marginBottom: "8px", marginTop: "8px" }}>
              Ready to
            </span>
            <span className="shimmer-text mt-1 block bg-clip-text text-4xl font-semibold italic text-transparent sm:text-5xl md:text-6xl">
              Take Control?
            </span>
          </h2>

          <p
            className={`mt-6 max-w-md text-base text-[#A9802F] md:text-lg transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms", marginTop: "24px", marginBottom: "0px", textAlign: "center" }}
          >
            We&apos;re here to guide you toward financial clarity and confidence.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes glowPulse {
          0%,
          100% {
            transform: scale(1);
            opacity: 0.7;
          }
          50% {
            transform: scale(1.25);
            opacity: 1;
          }
        }
        .glow-pulse {
          animation: glowPulse 5s ease-in-out infinite;
        }

        /* Updated: Shimmer base changed to gold (#a9802f) with a white highlight (#ffffff) */
        .shimmer-text {
          background-image: linear-gradient(
            100deg,
            #a9802f 30%,
            #ffffff 45%,
            #a9802f 60%
          );
          background-size: 250% 100%;
          animation: shimmer 4.5s ease-in-out infinite;
        }
        @keyframes shimmer {
          0% {
            background-position: 100% 0;
          }
          50% {
            background-position: 0% 0;
          }
          100% {
            background-position: -100% 0;
          }
        }

        @media (prefers-reduced-motion: reduce) {
          .glow-pulse,
          .shimmer-text {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}