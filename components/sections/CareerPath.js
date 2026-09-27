"use client";
// Photography → Filmmaking → Tourism → Education → Hospitality → Entrepreneurship,
// drawn as a route: the line fills as the section scrolls past and each stop
// lights up as the line reaches it. Horizontal on desktop, vertical on a phone.
import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { path } from "@/data/about";

function Stop({ label, i, n, progress, vertical }) {
  const at = i / (n - 1);
  const on = useTransform(progress, [at - 0.04, at], [0, 1]);
  const color = useTransform(on, [0, 1], ["rgba(237,230,218,0.3)", "rgba(237,230,218,1)"]);
  const dot = useTransform(on, [0, 1], ["#0A0908", "#F0782D"]);
  return (
    <li
      className={vertical ? "relative flex items-center gap-5 py-4 pl-10" : "relative flex flex-col items-center text-center"}
      style={vertical ? undefined : { width: `${100 / n}%` }}
    >
      <motion.span
        className={`h-3.5 w-3.5 rounded-full border border-saffron ${vertical ? "absolute left-[5px]" : ""}`}
        style={{ background: dot }}
      />
      <span className={`font-mono text-[10px] text-bone/40 ${vertical ? "" : "mt-5"}`}>{String(i + 1).padStart(2, "0")}</span>
      <motion.span style={{ color }} className={`font-display text-2xl md:text-3xl ${vertical ? "" : "mt-2"}`}>
        {label}
      </motion.span>
    </li>
  );
}

export default function CareerPath() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.5"] });
  const fill = useTransform(scrollYProgress, (v) => (reduce ? 1 : v));
  const n = path.length;

  return (
    <div ref={ref}>
      {/* Desktop */}
      <div className="relative hidden md:block">
        <div className="absolute left-[8.33%] right-[8.33%] top-[7px] h-px bg-bone/15">
          <motion.div className="h-full origin-left bg-saffron" style={{ scaleX: fill }} />
        </div>
        <ol className="relative flex">
          {path.map((p, i) => (
            <Stop key={p} label={p} i={i} n={n} progress={fill} />
          ))}
        </ol>
      </div>
      {/* Phone */}
      <div className="relative md:hidden">
        <div className="absolute bottom-6 left-[11px] top-6 w-px bg-bone/15">
          <motion.div className="h-full w-full origin-top bg-saffron" style={{ scaleY: fill }} />
        </div>
        <ol className="relative">
          {path.map((p, i) => (
            <Stop key={p} label={p} i={i} n={n} progress={fill} vertical />
          ))}
        </ol>
      </div>
    </div>
  );
}
