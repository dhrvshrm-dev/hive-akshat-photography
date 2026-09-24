"use client";
// A solid panel wipes away to uncover the image, while the image itself settles from a
// slight zoom. Uses scaleX rather than clip-path — cheaper and consistent across browsers.
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

export default function ImageReveal({ children, delay = 0, className = "" }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className={className}>{children}</div>;

  return (
    <motion.div
      className={`relative overflow-hidden ${className}`}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, margin: "-60px" }}
    >
      <motion.div
        variants={{
          hidden: { scale: 1.12 },
          show: { scale: 1, transition: { duration: 1.4, delay, ease } },
        }}
      >
        {children}
      </motion.div>
      <motion.span
        className="absolute inset-0 z-10 origin-right bg-ink"
        variants={{
          hidden: { scaleX: 1 },
          show: { scaleX: 0, transition: { duration: 0.9, delay, ease } },
        }}
      />
    </motion.div>
  );
}
