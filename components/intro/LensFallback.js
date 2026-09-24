"use client";
// The same idea for phones and low-power devices: layered SVG depth, no WebGL, ~nothing
// to download. Tilts to pointer/tilt, and the dive zooms the lens up into a whiteout.
import { useState } from "react";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { ease } from "@/lib/motion";

const GOLD = "#B98A3E";

export default function LensFallback({ onDone }) {
  const [diving, setDiving] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const sx = useSpring(mx, { stiffness: 120, damping: 18 });
  const sy = useSpring(my, { stiffness: 120, damping: 18 });
  const rotateY = useTransform(sx, [-1, 1], [-14, 14]);
  const rotateX = useTransform(sy, [-1, 1], [12, -12]);
  const worldX = useTransform(sx, [-1, 1], [14, -14]);
  const worldY = useTransform(sy, [-1, 1], [8, -8]);

  const track = (e) => {
    const p = e.touches?.[0] ?? e;
    mx.set((p.clientX / window.innerWidth) * 2 - 1);
    my.set(-((p.clientY / window.innerHeight) * 2 - 1));
  };

  const dive = () => {
    if (diving) return;
    setDiving(true);
    setTimeout(onDone, 1100);
  };

  return (
    <div
      className="absolute inset-0 flex items-center justify-center overflow-hidden bg-[#0B0806]"
      onPointerMove={track}
      onTouchMove={track}
      style={{ perspective: 1000 }}
    >
      <motion.button
        onClick={dive}
        aria-label="Enter the site"
        style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
        animate={diving ? { scale: 14, opacity: 0 } : { scale: 1, opacity: 1 }}
        transition={{ duration: 1.1, ease }}
        className="relative"
      >
        <svg width="290" height="290" viewBox="-150 -150 300 300" className="max-w-[74vw]">
          <defs>
            <clipPath id="lens-clip">
              <circle cx="0" cy="0" r="96" />
            </clipPath>
            <radialGradient id="glass" cx="35%" cy="30%">
              <stop offset="0%" stopColor="#fff" stopOpacity="0.34" />
              <stop offset="45%" stopColor={GOLD} stopOpacity="0.1" />
              <stop offset="100%" stopColor="#000" stopOpacity="0.5" />
            </radialGradient>
            <radialGradient id="barrel" cx="35%" cy="25%">
              <stop offset="0%" stopColor="#3A2E25" />
              <stop offset="100%" stopColor="#120E0B" />
            </radialGradient>
          </defs>

          {/* Barrel + gold rings */}
          <circle cx="0" cy="0" r="140" fill="url(#barrel)" />
          <circle cx="0" cy="0" r="128" fill="none" stroke={GOLD} strokeWidth="1.5" opacity="0.8" />
          <circle cx="0" cy="0" r="112" fill="none" stroke={GOLD} strokeWidth="0.75" opacity="0.45" />
          {Array.from({ length: 60 }, (_, i) => {
            const a = (i / 60) * Math.PI * 2;
            return (
              <line
                key={i}
                x1={Math.cos(a) * 130}
                y1={Math.sin(a) * 130}
                x2={Math.cos(a) * 139}
                y2={Math.sin(a) * 139}
                stroke="#0B0806"
                strokeWidth="3"
              />
            );
          })}

          {/* The world, parallaxing inside the glass */}
          <g clipPath="url(#lens-clip)">
            <rect x="-100" y="-100" width="200" height="200" fill="#1A120D" />
            <motion.g style={{ x: worldX, y: worldY }}>
              <circle cx="26" cy="-16" r="30" fill="#8E2C3A" opacity="0.45" />
              <path d="M-120 40 L-70 -18 L-34 26 L4 -32 L44 22 L86 -12 L120 40 Z" fill={GOLD} opacity="0.2" />
              <path d="M-120 58 L-78 8 L-40 46 L0 -4 L40 40 L80 6 L120 58 Z" fill={GOLD} opacity="0.3" />
              {/* Jharokha arches along the skyline */}
              {[-56, 0, 56].map((x, i) => (
                <path
                  key={x}
                  d={`M${x - 17} 74 L${x - 17} 34 Q${x - 17} 12 ${x} 4 Q${x + 17} 12 ${x + 17} 34 L${x + 17} 74 Z`}
                  fill={GOLD}
                  opacity={i === 1 ? 0.5 : 0.38}
                />
              ))}
              <path d="M-120 96 L-64 52 L-16 84 L30 48 L78 88 L120 60 L120 110 L-120 110 Z" fill="#241C17" />
            </motion.g>
            <circle cx="0" cy="0" r="96" fill="url(#glass)" />
          </g>

          {/* Aperture blades + bezel */}
          <circle cx="0" cy="0" r="97" fill="none" stroke="#0B0806" strokeWidth="10" />
          <circle cx="0" cy="0" r="103" fill="none" stroke={GOLD} strokeWidth="1" opacity="0.6" />
        </svg>

        <motion.span
          animate={{ opacity: [0.45, 1, 0.45] }}
          transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
          className="mt-6 block text-[10px] uppercase tracking-widest text-gold"
        >
          Tap to look through
        </motion.span>
      </motion.button>
    </div>
  );
}
