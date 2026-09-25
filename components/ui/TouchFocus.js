"use client";
// The phone's answer to the AF cursor: tap anywhere and a focus box appears
// where your finger was, hunts for a beat and locks saffron — exactly what a
// phone's own camera app does when you tap to focus. Only on touch screens; a
// mouse gets the full cursor instead.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

let nextId = 0;

export default function TouchFocus() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [taps, setTaps] = useState([]);

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: coarse)").matches) return;
    setEnabled(true);
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    let startX = 0;
    let startY = 0;
    let startT = 0;
    const down = (e) => {
      if (e.pointerType !== "touch") return;
      startX = e.clientX;
      startY = e.clientY;
      startT = performance.now();
    };
    // Only a real tap — not the start of a scroll or a swipe.
    const up = (e) => {
      if (e.pointerType !== "touch") return;
      if (Math.hypot(e.clientX - startX, e.clientY - startY) > 10) return;
      if (performance.now() - startT > 500) return;
      const id = ++nextId;
      setTaps((t) => [...t.slice(-2), { id, x: e.clientX, y: e.clientY }]);
      setTimeout(() => setTaps((t) => t.filter((p) => p.id !== id)), 1100);
    };
    window.addEventListener("pointerdown", down, { passive: true });
    window.addEventListener("pointerup", up, { passive: true });
    return () => {
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
    };
  }, [enabled]);

  if (!enabled) return null;

  return (
    <div aria-hidden="true" className="pointer-events-none fixed inset-0 z-[120]">
      <AnimatePresence>
        {taps.map((t) => (
          <motion.div
            key={t.id}
            className="absolute -ml-8 -mt-8 h-16 w-16"
            style={{ left: t.x, top: t.y }}
            initial={{ scale: 1.7, opacity: 0 }}
            animate={{ scale: [1.7, 0.92, 1.06, 1], opacity: 1 }}
            exit={{ opacity: 0, scale: 0.9, transition: { duration: 0.3 } }}
            transition={{ duration: 0.55, times: [0, 0.45, 0.75, 1] }}
          >
            <motion.div
              className="brackets absolute inset-0"
              initial={{ "--c": "rgba(237,230,218,0.95)" }}
              animate={{ "--c": ["rgba(237,230,218,0.95)", "rgba(237,230,218,0.95)", "#F0782D"] }}
              transition={{ duration: 0.55, times: [0, 0.8, 1] }}
              style={{ "--b": "12px", "--t": "1.5px" }}
            />
            <motion.span
              className="absolute left-1/2 top-1/2 -ml-[3px] -mt-[3px] h-1.5 w-1.5 rounded-full bg-saffron"
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5, duration: 0.2 }}
            />
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
}
