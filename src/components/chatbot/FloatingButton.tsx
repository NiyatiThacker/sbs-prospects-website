"use client";

import { motion } from 'framer-motion';
import { X } from 'lucide-react';

interface FloatingButtonProps {
  isOpen: boolean;
  toggle: () => void;
}

export default function FloatingButton({ isOpen, toggle }: FloatingButtonProps) {
  return (
    <div id="sbs-floating-btn" style={{ position: 'relative', width: '60px', height: '60px' }}>
      <style>{`
        #sbs-floating-btn, #sbs-floating-btn * { cursor: pointer !important; }
      `}</style>
      {/* Pulsing Outer Ring (Only when closed) */}
      {!isOpen && (
        <motion.div
          animate={{
            scale: [1, 1.25, 1],
            opacity: [0.6, 0, 0.6]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            position: 'absolute',
            inset: '0',
            borderRadius: '9999px',
            backgroundColor: 'rgba(201, 168, 76, 0.3)',
            zIndex: 0,
            pointerEvents: 'none',
            width: '60px',
            height: '60px'
          }}
        />
      )}

      {/* Main Floating Button */}
      <motion.button
        whileHover={{ scale: 1.08 }}
        whileTap={{ scale: 0.92 }}
        animate={!isOpen ? {
          y: [0, -6, 0]
        } : { y: 0 }}
        transition={!isOpen ? {
          y: {
            duration: 2.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        } : {}}
        onClick={toggle}
        style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          width: '60px',
          height: '60px',
          padding: '0',
          cursor: 'pointer'
        }}
        className="relative z-10 bg-linear-to-br from-[#C9A84C] to-[#A18231] text-white rounded-full shadow-[0_8px_30px_rgba(26,22,10,0.2)] hover:shadow-[0_8px_30px_rgba(26,22,10,0.3)] transition-all"
        aria-label="Toggle chat"
      >
        <motion.div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '28px',
            height: '28px'
          }}
          initial={false}
          animate={{ rotate: isOpen ? 90 : 0, scale: isOpen ? 0.85 : 1 }}
          transition={{ type: "spring", stiffness: 260, damping: 15 }}
        >
          {isOpen ? (
            <X size={28} />
          ) : (
            <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ display: 'block' }}>
              {/* Custom Chat Bubble with rounded corners */}
              <path d="M21 15a2 2 0 0 1-2 2H7l-4 4V5a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2z" />
              {/* Golden line chart drawing itself inside the bubble */}
              <motion.path 
                d="M7 13l3-3 4 4 4-4" 
                stroke="#FAF6F0" 
                strokeWidth="2.5" 
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.6, ease: "easeOut" }}
              />
            </svg>
          )}
        </motion.div>
      </motion.button>
    </div>
  );
}
