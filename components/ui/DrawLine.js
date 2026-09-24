"use client";
// A hairline that draws itself across the process steps as they come into view.
import { motion, useReducedMotion } from "framer-motion";

export default function DrawLine({ delay = 0.3, className = "" }) {
  const reduce = useReducedMotion();

  return (
    <svg
      viewBox="0 0 100 1"
      preserveAspectRatio="none"
      aria-hidden="true"
      className={`h-px w-full ${className}`}
    >
      <motion.line
        x1="0"
        y1="0.5"
        x2="100"
        y2="0.5"
        stroke="currentColor"
        strokeWidth="1"
        vectorEffect="non-scaling-stroke"
        initial={reduce ? false : { pathLength: 0 }}
        whileInView={{ pathLength: 1 }}
        viewport={{ once: true, margin: "-80px" }}
        transition={{ duration: 1.2, delay, ease: "easeInOut" }}
      />
    </svg>
  );
}
