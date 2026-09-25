"use client";
// Scroll progress, drawn as a lens's focus-distance scale down the right edge:
// the top of the page is the minimum focus distance, the bottom is infinity.
import { motion, useScroll, useSpring, useTransform } from "framer-motion";

const MARKS = ["0.5", "1", "2", "3", "5", "10", "∞"];

export default function ScrollProgress() {
  const { scrollYProgress } = useScroll();
  const p = useSpring(scrollYProgress, { stiffness: 200, damping: 40, restDelta: 0.001 });
  const top = useTransform(p, (v) => `${v * 100}%`);

  return (
    <>
      {/* A hairline at the very top for small screens, where the scale is hidden. */}
      <motion.div
        style={{ scaleX: p }}
        className="fixed inset-x-0 top-0 z-[80] h-px origin-left bg-saffron md:hidden"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none fixed right-4 top-1/2 z-[80] hidden h-[44vh] -translate-y-1/2 md:block"
      >
        <div className="relative h-full w-8">
          {/* Fine ticks */}
          <div
            className="absolute right-0 top-0 h-full w-2"
            style={{
              backgroundImage: "linear-gradient(to bottom, rgba(237,230,218,0.45) 1px, transparent 1px)",
              backgroundSize: "100% 8px",
            }}
          />
          {MARKS.map((m, i) => (
            <span
              key={m}
              className="absolute right-3 -translate-y-1/2 font-mono text-[9px] text-bone/60"
              style={{ top: `${(i / (MARKS.length - 1)) * 100}%` }}
            >
              {m}
            </span>
          ))}
          <motion.span
            className="absolute -right-1 h-px w-4 -translate-y-1/2 bg-saffron"
            style={{ top }}
          />
          <motion.span
            className="absolute -right-2 h-1.5 w-1.5 -translate-y-1/2 rounded-full bg-saffron"
            style={{ top }}
          />
        </div>
        <p className="mt-3 text-right font-mono text-[9px] text-bone/50">m</p>
      </div>
    </>
  );
}
