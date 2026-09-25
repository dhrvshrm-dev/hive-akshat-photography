"use client";
// Gives the floating WhatsApp button a delayed entrance and a slow attention pulse.
import { motion, useReducedMotion } from "framer-motion";

export default function WhatsAppMotionWrap({ children }) {
  const reduce = useReducedMotion();

  if (reduce) return <div className="fixed bottom-5 right-5 z-50 md:bottom-6 md:right-6">{children}</div>;

  return (
    <motion.div
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{ delay: 2.2, type: "spring", stiffness: 260, damping: 18 }}
      className="fixed bottom-5 right-5 z-50 md:bottom-6 md:right-6"
    >
      <motion.span
        className="absolute inset-0 rounded-full bg-[#25D366]"
        animate={{ scale: [1, 1.55], opacity: [0.45, 0] }}
        transition={{ duration: 2.4, repeat: Infinity, ease: "easeOut", delay: 2 }}
      />
      {children}
    </motion.div>
  );
}
