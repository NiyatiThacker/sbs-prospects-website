"use client";

import { useEffect, useRef, useState } from "react";

// Intersection Observer Hook for Scroll Animations
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
          observer.disconnect(); // Runs animation only once
        }
      },
      { threshold: 0.15 } // Triggers when 15% of the section is visible
    );

    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return { ref, inView };
}

export default function ContactCTA() {
  const { ref, inView } = useInView<HTMLDivElement>();

  return (
    <section 
      ref={ref} 
      /* Center alignment forces & prevents horizontal scrollbars during animation */
      style={{ marginTop:"50px", marginBottom:"50px", padding:"0 20px" }}
      className="pt-40 pb-20 px-6 text-center flex flex-col items-center w-full overflow-x-hidden"
    >  
    
      <div 
        /* Override global CSS overrides & apply smooth transition from LEFT when entering view */
        style={{ margin: "0 auto" }}
        className={`max-w-xl transition-all duration-1000 ease-out ${
          inView ? "opacity-100 translate-x-0" : "opacity-0 -translate-x-12"
        }`}
      >
        <h2 className="text-3xl md:text-4xl font-serif text-[#735c00] mb-4">
          Book a Free Consultation
        </h2>
        <p className="text-gray-500 text-base mb-8" style={{ marginBottom: "32px" ,marginTop: "10px"}}>
          Use this section to explain what happens after booking — link out to
          your scheduling tool, or embed a calendar widget directly here.
        </p>
        <a
         
  href="#booking"
  className="inline-flex items-center justify-center gap-3 w-80 bg-gradient-to-r from-[#e5c575] via-[#b8974a] to-[#a28238] text-white  text-xs font-semibold tracking-wider uppercase py-4 rounded-full shadow-lg hover:from-[#d1b058] hover:via-[#a08238] hover:to-[#8a6c2a] active:scale-98 transition-all duration-300"
>
  <span>Book a Free Consultation</span>
  <svg 
    className="w-10 h-12" 
    fill="none" 
    stroke="currentColor" 
    viewBox="0 0 24 24"
  >
    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M14 5l7 7m0 0l-7 7m7-7H3" />
  </svg>
</a>
        
      </div>
    </section>
  );
}