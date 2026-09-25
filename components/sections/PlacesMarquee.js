"use client";
// Place names sliding past like country from a train window. The drift has a
// base speed, the page's scroll velocity is added on top, and the direction
// follows the scroll — so it speeds up, slows down and turns with you.
import { useRef } from "react";
import { motion, useAnimationFrame, useMotionValue, useReducedMotion, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { placesMarquee } from "@/data/site";

const wrap = (min, max, v) => {
  const r = max - min;
  return ((((v - min) % r) + r) % r) + min;
};

function Row({ baseVelocity, outline }) {
  const reduce = useReducedMotion();
  const base = useMotionValue(0);
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { damping: 50, stiffness: 400 });
  const factor = useTransform(smooth, [-1500, 0, 1500], [-5, 0, 5], { clamp: false });
  const dir = useRef(1);
  const x = useTransform(base, (v) => `${wrap(-50, 0, v)}%`);

  useAnimationFrame((_, delta) => {
    if (reduce) return;
    const f = factor.get();
    if (f < 0) dir.current = -1;
    else if (f > 0) dir.current = 1;
    const move = dir.current * baseVelocity * (delta / 1000) * (1 + Math.abs(f));
    base.set(base.get() + move);
  });

  const items = [...placesMarquee, ...placesMarquee];
  return (
    <motion.div className="flex w-max whitespace-nowrap" style={{ x }}>
      {items.map((p, i) => (
        <span
          key={`${p}-${i}`}
          aria-hidden={i >= placesMarquee.length}
          className={`flex items-center font-display text-[13vw] leading-none md:text-[8vw] ${outline ? "text-outline" : "text-bone"}`}
        >
          {p}
          <span className="mx-[3vw] inline-block h-[1.2vw] w-[1.2vw] min-h-2 min-w-2 rounded-full bg-saffron align-middle" />
        </span>
      ))}
    </motion.div>
  );
}

export default function PlacesMarquee() {
  return (
    <section aria-label="Places in the archive" className="relative overflow-hidden border-y border-line bg-night py-8 md:py-12">
      <Row baseVelocity={-2.2} />
      <div className="mt-2 md:mt-4">
        <Row baseVelocity={1.6} outline />
      </div>
    </section>
  );
}
