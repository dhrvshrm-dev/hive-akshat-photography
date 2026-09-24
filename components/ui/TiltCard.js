"use client";
// Tilts its contents toward the cursor. Capped at a few degrees so it reads editorial,
// not gimmicky. Falls back to a plain wrapper when reduced motion is requested.
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from "framer-motion";
import { springSoft } from "@/lib/motion";

const MAX_DEG = 7;

export default function TiltCard({ children, className = "" }) {
  const reduce = useReducedMotion();
  const px = useMotionValue(0);
  const py = useMotionValue(0);
  const sx = useSpring(px, springSoft);
  const sy = useSpring(py, springSoft);
  const rotateX = useTransform(sy, [-0.5, 0.5], [MAX_DEG, -MAX_DEG]);
  const rotateY = useTransform(sx, [-0.5, 0.5], [-MAX_DEG, MAX_DEG]);

  if (reduce) return <div className={className}>{children}</div>;

  const onMove = (e) => {
    const r = e.currentTarget.getBoundingClientRect();
    px.set((e.clientX - r.left) / r.width - 0.5);
    py.set((e.clientY - r.top) / r.height - 0.5);
  };
  const onLeave = () => {
    px.set(0);
    py.set(0);
  };

  return (
    <motion.div
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d", perspective: 900 }}
      className={className}
    >
      {children}
    </motion.div>
  );
}
