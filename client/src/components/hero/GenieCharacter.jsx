import React from "react";
import { motion } from "framer-motion";

/**
 * Animated Book Genie character built with SVG.
 * A friendly genie emerging from an open book with magical particles.
 *
 * Props:
 *  - active: boolean — genie is engaged (chat open)
 *  - thinking: boolean — genie is processing
 *  - result: object|null — recommendation found
 */
export default function GenieCharacter({ active = false, thinking = false, result = false }) {
  return (
    <div className={`genie-character-wrap ${active ? "active" : ""} ${thinking ? "thinking" : ""} ${result ? "celebrating" : ""}`}>
      {/* Magical background glow */}
      <div className="genie-bg-magic">
        <div className="magic-ring ring-1" />
        <div className="magic-ring ring-2" />
        <div className="magic-ring ring-3" />
      </div>

      {/* Sparkle particles */}
      <div className="genie-sparkles">
        {Array.from({ length: 12 }).map((_, i) => (
          <i key={i} className={`sparkle s-${i + 1}`} />
        ))}
      </div>

      {/* The Genie SVG Character */}
      <motion.div
        className="genie-body"
        animate={
          active
            ? { y: [0, -8, 0], scale: 1.02 }
            : { y: 0, scale: 1 }
        }
        transition={{
          y: { duration: 3, repeat: Infinity, ease: "easeInOut" },
          scale: { duration: 0.5 },
        }}
      >
        <svg
          viewBox="0 0 300 420"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          className="genie-svg"
        >
          {/* ── Smoke/mist tail from book ── */}
          <motion.path
            d="M120 380 Q130 340 140 310 Q145 290 150 270 Q155 250 150 240"
            stroke="url(#smokeGrad)"
            strokeWidth="50"
            strokeLinecap="round"
            fill="none"
            opacity="0.25"
            animate={active ? { d: [
              "M120 380 Q130 340 140 310 Q145 290 150 270 Q155 250 150 240",
              "M120 380 Q140 340 135 310 Q140 290 150 270 Q160 250 150 240",
              "M120 380 Q130 340 140 310 Q145 290 150 270 Q155 250 150 240",
            ] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          />
          <motion.path
            d="M180 380 Q170 340 160 310 Q155 290 150 270 Q145 250 150 240"
            stroke="url(#smokeGrad)"
            strokeWidth="50"
            strokeLinecap="round"
            fill="none"
            opacity="0.2"
            animate={active ? { d: [
              "M180 380 Q170 340 160 310 Q155 290 150 270 Q145 250 150 240",
              "M180 380 Q160 340 165 310 Q160 290 150 270 Q140 250 150 240",
              "M180 380 Q170 340 160 310 Q155 290 150 270 Q145 250 150 240",
            ] } : {}}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          />

          {/* ── Body (robe/torso) ── */}
          <ellipse cx="150" cy="245" rx="55" ry="65" fill="url(#bodyGrad)" />

          {/* ── Left arm ── */}
          <motion.g
            animate={active ? { rotate: [0, -8, 0] } : { rotate: 0 }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "120px 220px" }}
          >
            <path d="M100 215 Q78 230 72 255 Q68 268 75 275" stroke="#d4813a" strokeWidth="14" strokeLinecap="round" fill="none" />
            {/* Left hand */}
            <circle cx="75" cy="275" r="10" fill="#e8a86b" />
            {/* Book in left hand */}
            <rect x="58" y="265" width="22" height="16" rx="2" fill="#5c6b4f" />
            <rect x="60" y="267" width="18" height="12" rx="1" fill="#f7f0df" opacity="0.6" />
          </motion.g>

          {/* ── Right arm ── */}
          <motion.g
            animate={thinking ? { rotate: [0, 5, 0] } : active ? { rotate: [0, 6, 0] } : { rotate: 0 }}
            transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
            style={{ transformOrigin: "180px 220px" }}
          >
            <path d="M200 215 Q222 228 228 250 Q232 262 225 270" stroke="#d4813a" strokeWidth="14" strokeLinecap="round" fill="none" />
            {/* Right hand - pointing/waving */}
            <circle cx="225" cy="270" r="10" fill="#e8a86b" />
            {/* Magic sparkle from hand when active */}
            {active && (
              <motion.g
                animate={{ opacity: [0.4, 1, 0.4], scale: [0.8, 1.2, 0.8] }}
                transition={{ duration: 1.2, repeat: Infinity }}
              >
                <text x="232" y="258" fontSize="18" fill="#ff8c42">✦</text>
              </motion.g>
            )}
          </motion.g>

          {/* ── Neck ── */}
          <rect x="140" y="188" width="20" height="18" rx="6" fill="#e8a86b" />

          {/* ── Head ── */}
          <ellipse cx="150" cy="155" rx="48" ry="52" fill="#e8a86b" />

          {/* ── Turban ── */}
          <path d="M100 140 Q100 90 150 80 Q200 90 200 140 Q190 115 150 110 Q110 115 100 140Z" fill="url(#turbanGrad)" />
          <path d="M108 138 Q108 100 150 92 Q192 100 192 138" fill="url(#turbanGrad2)" />
          {/* Turban jewel */}
          <circle cx="150" cy="108" r="8" fill="#ff8c42" />
          <circle cx="150" cy="108" r="5" fill="#ffe4a0" />
          <motion.circle
            cx="150" cy="108" r="12"
            fill="none"
            stroke="#ff8c42"
            strokeWidth="1"
            opacity="0.4"
            animate={active ? { r: [12, 18, 12], opacity: [0.4, 0, 0.4] } : {}}
            transition={{ duration: 1.5, repeat: Infinity }}
          />
          {/* Turban feather/plume */}
          <path d="M150 82 Q155 60 148 45 Q152 55 158 50 Q154 65 150 82" fill="#c95722" opacity="0.7" />

          {/* ── Face ── */}
          {/* Eyes */}
          <motion.g
            animate={thinking ? { scaleY: [1, 0.1, 1] } : {}}
            transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            style={{ transformOrigin: "150px 150px" }}
          >
            {/* Left eye */}
            <ellipse cx="132" cy="150" rx="7" ry="8" fill="white" />
            <motion.circle
              cx="133" cy="151" r="4.5"
              fill="#3b2118"
              animate={active ? { cx: [133, 135, 133] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="135" cy="149" r="1.5" fill="white" />

            {/* Right eye */}
            <ellipse cx="168" cy="150" rx="7" ry="8" fill="white" />
            <motion.circle
              cx="167" cy="151" r="4.5"
              fill="#3b2118"
              animate={active ? { cx: [167, 169, 167] } : {}}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            />
            <circle cx="169" cy="149" r="1.5" fill="white" />
          </motion.g>

          {/* Eyebrows */}
          <motion.path
            d="M122 138 Q132 132 142 136"
            stroke="#5c3a28"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={active ? { d: ["M122 138 Q132 132 142 136", "M122 136 Q132 128 142 133", "M122 138 Q132 132 142 136"] } : {}}
            transition={{ duration: 4, repeat: Infinity }}
          />
          <motion.path
            d="M158 136 Q168 132 178 138"
            stroke="#5c3a28"
            strokeWidth="2.5"
            strokeLinecap="round"
            fill="none"
            animate={active ? { d: ["M158 136 Q168 132 178 138", "M158 133 Q168 128 178 136", "M158 136 Q168 132 178 138"] } : {}}
            transition={{ duration: 4, repeat: Infinity }}
          />

          {/* Nose */}
          <path d="M148 162 Q150 168 152 162" stroke="#c9956b" strokeWidth="2" strokeLinecap="round" fill="none" />

          {/* Mouth - changes expression */}
          {result ? (
            /* Big happy smile for result */
            <path d="M130 175 Q140 192 150 192 Q160 192 170 175" stroke="#a0522d" strokeWidth="2.5" strokeLinecap="round" fill="#fff0e0" />
          ) : thinking ? (
            /* Thinking 'hmm' mouth */
            <motion.ellipse
              cx="150" cy="178" rx="6" ry="5"
              fill="#a0522d"
              animate={{ ry: [5, 7, 5] }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          ) : active ? (
            /* Friendly smile */
            <path d="M134 175 Q142 186 150 186 Q158 186 166 175" stroke="#a0522d" strokeWidth="2.5" strokeLinecap="round" fill="none" />
          ) : (
            /* Gentle smile - resting */
            <path d="M138 176 Q144 182 150 182 Q156 182 162 176" stroke="#a0522d" strokeWidth="2" strokeLinecap="round" fill="none" />
          )}

          {/* Beard */}
          <path d="M120 175 Q118 200 135 210 Q145 215 150 215 Q155 215 165 210 Q182 200 180 175" fill="none" stroke="#c9956b" strokeWidth="1.5" opacity="0.3" />

          {/* ── Earrings ── */}
          <circle cx="102" cy="162" r="4" fill="#ff8c42" />
          <circle cx="198" cy="162" r="4" fill="#ff8c42" />

          {/* ── Sash/belt ── */}
          <path d="M105 260 Q150 280 195 260" stroke="#c95722" strokeWidth="5" fill="none" />

          {/* ── Open Book at bottom ── */}
          <g>
            {/* Left page */}
            <path d="M80 370 Q85 340 148 345" fill="#f7f0df" stroke="#dfc9a7" strokeWidth="1" />
            {/* Right page */}
            <path d="M220 370 Q215 340 152 345" fill="#f7f0df" stroke="#dfc9a7" strokeWidth="1" />
            {/* Left cover */}
            <path d="M70 375 Q75 340 148 348" fill="#a9421d" stroke="#8a3515" strokeWidth="1" />
            {/* Right cover */}
            <path d="M230 375 Q225 340 152 348" fill="#a9421d" stroke="#8a3515" strokeWidth="1" />
            {/* Spine */}
            <rect x="146" y="342" width="8" height="35" rx="2" fill="#d5b888" />
            {/* Page lines */}
            <line x1="100" y1="355" x2="140" y2="350" stroke="#dfc9a7" strokeWidth="0.5" />
            <line x1="105" y1="360" x2="140" y2="355" stroke="#dfc9a7" strokeWidth="0.5" />
            <line x1="160" y1="350" x2="200" y2="355" stroke="#dfc9a7" strokeWidth="0.5" />
            <line x1="160" y1="355" x2="195" y2="360" stroke="#dfc9a7" strokeWidth="0.5" />
          </g>

          {/* ── Gradient definitions ── */}
          <defs>
            <linearGradient id="bodyGrad" x1="150" y1="180" x2="150" y2="310" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c95722" />
              <stop offset="0.5" stopColor="#a84018" />
              <stop offset="1" stopColor="#8a3010" stopOpacity="0.6" />
            </linearGradient>
            <linearGradient id="turbanGrad" x1="150" y1="80" x2="150" y2="140" gradientUnits="userSpaceOnUse">
              <stop stopColor="#c95722" />
              <stop offset="1" stopColor="#a84018" />
            </linearGradient>
            <linearGradient id="turbanGrad2" x1="150" y1="92" x2="150" y2="138" gradientUnits="userSpaceOnUse">
              <stop stopColor="#e06830" />
              <stop offset="1" stopColor="#c95722" />
            </linearGradient>
            <linearGradient id="smokeGrad" x1="150" y1="240" x2="150" y2="400" gradientUnits="userSpaceOnUse">
              <stop stopColor="#ff8c42" stopOpacity="0.6" />
              <stop offset="1" stopColor="#c95722" stopOpacity="0" />
            </linearGradient>
          </defs>
        </svg>
      </motion.div>

      {/* Thinking bubble */}
      {thinking && (
        <motion.div
          className="genie-think-bubble"
          initial={{ opacity: 0, scale: 0.5 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.5 }}
        >
          <span /><span /><span />
        </motion.div>
      )}
    </div>
  );
}
