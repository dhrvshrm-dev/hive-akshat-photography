"use client";
// Link-styled button. variant: "solid" (dark) or "outline".
// On fine-pointer devices it leans slightly toward the cursor, then springs back.
import Link from "next/link";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { springSoft } from "@/lib/motion";

export default function Button({ href = "#", children, variant = "solid", className = "", ...rest }) {
  const reduce = useReducedMotion();
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const sx = useSpring(x, springSoft);
  const sy = useSpring(y, springSoft);

  const onMove = (e) => {
    if (reduce) return;
    const r = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - (r.left + r.width / 2)) * 0.25);
    y.set((e.clientY - (r.top + r.height / 2)) * 0.25);
  };
  const onLeave = () => {
    x.set(0);
    y.set(0);
  };

  const base =
    "group relative inline-flex items-center justify-center gap-2 overflow-hidden px-7 py-3 text-xs uppercase tracking-widest transition-colors duration-300";
  const styles =
    variant === "solid"
      ? "bg-ink text-ivory hover:text-ivory"
      : "border border-ink/30 text-ink hover:border-rose hover:text-rose";

  return (
    <motion.span
      style={{ x: sx, y: sy }}
      onMouseMove={onMove}
      onMouseLeave={onLeave}
      className="inline-block"
    >
      <Link href={href} className={`${base} ${styles} ${className}`} {...rest}>
        {variant === "solid" && (
          <span className="absolute inset-0 origin-bottom scale-y-0 bg-rose transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-y-100" />
        )}
        <span className="relative z-10">{children}</span>
      </Link>
    </motion.span>
  );
}
