"use client";

import { useEffect } from "react";

interface ContactToastProps {
  show: boolean;
  onClose: () => void;
}

export default function ContactToast({ show, onClose }: ContactToastProps) {
  useEffect(() => {
    if (!show) return;
    const timer = setTimeout(onClose, 5000);
    return () => clearTimeout(timer);
  }, [show, onClose]);

  return (
    <div
      role="status"
      aria-live="polite"
      className={`fixed bottom-6 right-6 z-50 flex items-start gap-4 bg-[#0d1b3e] text-white px-6 py-4 rounded-2xl shadow-2xl max-w-sm w-full transition-all duration-500 ease-out ${
        show ? "translate-y-0 opacity-100 pointer-events-auto" : "translate-y-8 opacity-0 pointer-events-none"
      }`}
    >
      <div className="flex-shrink-0 mt-0.5 w-8 h-8 rounded-full bg-[#b8974a] flex items-center justify-center">
        <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>
      <div className="flex-1 min-w-0">
        <p className="font-semibold text-sm">Message sent!</p>
        <p className="text-white/70 text-xs mt-0.5">We&apos;ll get back to you within 48 hours.</p>
      </div>
      <button onClick={onClose} aria-label="Dismiss notification"
        className="flex-shrink-0 text-white/50 hover:text-white transition-colors mt-0.5">
        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
  );
}