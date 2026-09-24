"use client";
// A soft dot + trailing ring that replaces the native cursor on fine-pointer devices.
// Elements tagged with data-cursor="View" make the ring expand and show that label.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";
import { springSoft } from "@/lib/motion";

export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [label, setLabel] = useState(null);
  const [down, setDown] = useState(false);

  const x = useMotionValue(-100);
  const y = useMotionValue(-100);
  const dotX = useSpring(x, { stiffness: 900, damping: 45, mass: 0.2 });
  const dotY = useSpring(y, { stiffness: 900, damping: 45, mass: 0.2 });
  const ringX = useSpring(x, springSoft);
  const ringY = useSpring(y, springSoft);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;

    const move = (e) => {
      x.set(e.clientX);
      y.set(e.clientY);
    };
    const over = (e) => {
      const hit = e.target.closest?.("[data-cursor]");
      setLabel(hit ? hit.dataset.cursor : null);
    };
    const press = () => setDown(true);
    const release = () => setDown(false);

    window.addEventListener("mousemove", move);
    document.addEventListener("mouseover", over);
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    return () => {
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
    };
  }, [enabled, x, y]);

  if (!enabled) return null;

  const active = Boolean(label);

  return (
    <div className="pointer-events-none fixed inset-0 z-[100] hidden md:block">
      <motion.div
        style={{ x: dotX, y: dotY }}
        className="absolute -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-rose"
        animate={{ opacity: active ? 0 : 1, scale: down ? 0.6 : 1 }}
        transition={{ duration: 0.2 }}
      />
      <motion.div
        style={{ x: ringX, y: ringY }}
        className="absolute flex items-center justify-center rounded-full border border-rose/60 backdrop-invert-0"
        animate={{
          width: active ? 76 : 32,
          height: active ? 76 : 32,
          marginLeft: active ? -38 : -16,
          marginTop: active ? -38 : -16,
          backgroundColor: active ? "rgba(142,44,58,0.92)" : "rgba(142,44,58,0)",
          scale: down ? 0.88 : 1,
        }}
        transition={springSoft}
      >
        <AnimatePresence>
          {active && (
            <motion.span
              key={label}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.8 }}
              transition={{ duration: 0.18 }}
              className="text-[9px] uppercase tracking-widest text-ivory"
            >
              {label}
            </motion.span>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
}
