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
      style={{ paddingTop: "150px", paddingBottom: "100px" }}
      /* ADDED: flex flex-col items-center to force horizontal centering of children */
      className="relative w-full overflow-hidden bg-[#FBF2EA] px-6 pb-16 md:px-16 md:pb-24 scroll-mt-20 flex flex-col items-center"
    >
      {/* ambient pulsing glow accents */}
      <div className="glow-pulse pointer-events-none absolute -top-24 left-1/4 h-72 w-72 rounded-full bg-[#A9802F]/10 blur-3xl" />
      <div
        className="glow-pulse pointer-events-none absolute -bottom-24 right-1/4 h-72 w-72 rounded-full bg-[#16162B]/5 blur-3xl"
        style={{ animationDelay: "2s" }}
      />

      <div 
        /* ADDED: inline style margin to override any global CSS resets */
        style={{ margin: "0 auto" }}
        className="relative flex max-w-6xl w-full flex-col items-center gap-10 md:flex-row md:justify-center md:gap-8 lg:gap-12"
      >
        {/* Left image */}
        <div
          className={`order-2 shrink-0 md:order-1 transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "100ms", transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          <div className="float-img group relative w-40 overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:ring-[#A9802F]/30 sm:w-48 md:w-56 lg:w-64" style={{ aspectRatio: "5 / 4" }}>
            <img
              src="/images/contact us/contact 1.1.jpg"
              alt="Starry night sky"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </div>

        {/* Center content */}
        <div
          className={`order-1 flex w-full flex-col items-center text-center md:order-2 md:max-w-md transition-all duration-700 ease-out ${
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

          <h2 className={`${playfair.className} leading-[1.1] text-[#16162B]`}>
            <span className="block text-4xl font-semibold sm:text-5xl md:text-6xl mask-right" style={{ marginBottom: "8px", marginTop: "8px" }}>
              Ready to
            </span>
            <span className="shimmer-text mt-1 block bg-clip-text text-4xl font-semibold italic text-transparent sm:text-5xl md:text-6xl">
              Take Control?
            </span>
          </h2>

          <p
            className={`mt-6 max-w-md text-base text-gray-600 md:text-lg transition-all duration-700 ease-out ${
              inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-6"
            }`}
            style={{ transitionDelay: "400ms" }}
          >
            We&apos;re here to guide you toward financial clarity and confidence.
          </p>
        </div>

        {/* Right image */}
        <div
          className={`order-3 shrink-0 transition-all duration-700 ease-out ${
            inView ? "opacity-100 translate-y-0" : "opacity-0 translate-y-10"
          }`}
          style={{ transitionDelay: "300ms", transitionTimingFunction: "cubic-bezier(0.34, 1.56, 0.64, 1)" }}
        >
          <div className="float-img-delayed group relative w-40 overflow-hidden rounded-2xl shadow-md ring-1 ring-black/5 transition-all duration-500 hover:-translate-y-2 hover:scale-[1.03] hover:shadow-2xl hover:ring-[#A9802F]/30 sm:w-48 md:w-56 lg:w-64" style={{ aspectRatio: "5 / 4" }}>
            <img
              src="images/contact us/contact-hero1.jpg"
              alt="String lights over a cobblestone alley"
              loading="eager"
              decoding="async"
              className="h-full w-full object-cover transition-transform duration-700 ease-out group-hover:scale-110"
            />
            <div className="absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
          </div>
        </div>
      </div>

      <style jsx>{`
        @keyframes float {
          0%,
          100% {
            transform: translateY(0px) rotate(0deg);
          }
          50% {
            transform: translateY(-16px) rotate(-1deg);
          }
        }
        .float-img {
          animation: float 4.5s ease-in-out infinite;
        }
        .float-img-delayed {
          animation: float 4.5s ease-in-out infinite;
          animation-delay: 1.4s;
        }

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

        .shimmer-text {
          background-image: linear-gradient(
            100deg,
            #16162b 30%,
            #a9802f 45%,
            #16162b 60%
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
          .float-img,
          .float-img-delayed,
          .glow-pulse,
          .shimmer-text {
            animation: none;
          }
        }
      `}</style>
    </section>
  );
}