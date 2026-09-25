"use client";
// Remounts on every navigation. The shutter (ShutterTransition) carries the
// visible change between pages; this only softens back/forward navigations,
// which skip the shutter.
import { motion, useReducedMotion } from "framer-motion";

export default function Template({ children }) {
  const reduce = useReducedMotion();
  return (
    <motion.div initial={reduce ? false : { opacity: 0 }} animate={{ opacity: 1 }} transition={{ duration: 0.4 }}>
      {children}
    </motion.div>
  );
}
