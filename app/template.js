"use client";
// Remounts on every navigation, so page content eases in on route change.
// Navbar/Footer live in layout.js and are untouched by this boundary.
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

export default function Template({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div
      initial={reduce ? false : { opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease }}
    >
      {children}
    </motion.div>
  );
}
