"use client";
// A photograph that arrives the way a lens finds focus: blurred, pulled in past
// sharp, hunted back, then locked. Used wherever a frame changes or scrolls into
// view outside the WebGL hero — the same beat, done with a CSS filter so it
// works on every phone.
//
// `className` owns positioning (default "relative"); pass "absolute inset-0" to fill a box.
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

const HUNT = {
  filter: ["blur(18px)", "blur(1.5px)", "blur(6px)", "blur(0px)"],
  scale: [1.06, 1.0, 1.015, 1],
};
const HUNT_T = { duration: 1.15, times: [0, 0.45, 0.7, 1], ease: "easeOut" };

export default function FocusImage({ p, sizes = "100vw", priority = false, inView = false, className = "relative", imgClassName = "object-cover" }) {
  const reduce = useReducedMotion();
  if (reduce) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <Image src={p.src} alt={`${p.title} — ${p.place}`} fill sizes={sizes} priority={priority} className={imgClassName} />
      </div>
    );
  }
  // Scroll-triggered: focus in once as it enters.
  if (inView) {
    return (
      <div className={`overflow-hidden ${className}`}>
        <motion.div
          className="absolute inset-0"
          initial={{ filter: "blur(18px)", scale: 1.06, opacity: 0.4 }}
          whileInView={{ ...HUNT, opacity: 1 }}
          viewport={{ once: true, margin: "-15%" }}
          transition={HUNT_T}
        >
          <Image src={p.src} alt={`${p.title} — ${p.place}`} fill sizes={sizes} priority={priority} className={imgClassName} />
        </motion.div>
      </div>
    );
  }
  // Change-triggered: the old frame defocuses out while the new one hunts in.
  return (
    <div className={`overflow-hidden ${className}`}>
      <AnimatePresence initial={false}>
        <motion.div
          key={p.id}
          className="absolute inset-0"
          initial={{ opacity: 0, filter: "blur(18px)", scale: 1.06 }}
          animate={{ opacity: 1, ...HUNT }}
          exit={{ opacity: 0, filter: "blur(14px)", transition: { duration: 0.45 } }}
          transition={{ opacity: { duration: 0.35 }, filter: HUNT_T, scale: HUNT_T }}
        >
          <Image src={p.src} alt={`${p.title} — ${p.place}`} fill sizes={sizes} priority={priority} className={imgClassName} />
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
