"use client";
// Reveals a heading one word at a time. Accepts either a plain string, or an array of
// { text, emphasis } segments so an accented phrase keeps its styling.
import { motion, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const toWords = (children) => {
  const segments = Array.isArray(children) ? children : [{ text: children }];
  return segments.flatMap((seg, s) =>
    String(seg.text)
      .split(" ")
      .filter(Boolean)
      .map((word, w) => ({ word, emphasis: seg.emphasis, key: `${s}-${w}` }))
  );
};

export default function SplitText({
  children,
  as: Tag = "span",
  className = "",
  stagger = 0.045,
  delay = 0,
  whileInView = false,
}) {
  const reduce = useReducedMotion();
  const words = toWords(children);
  const label = words.map((w) => w.word).join(" ");

  if (reduce) return <Tag className={className}>{label}</Tag>;

  const MotionTag = motion[Tag] || motion.span;
  const animateProps = whileInView
    ? { whileInView: "show", viewport: { once: true, margin: "-80px" } }
    : { animate: "show" };

  return (
    <MotionTag
      className={className}
      aria-label={label}
      initial="hidden"
      {...animateProps}
      transition={{ staggerChildren: stagger, delayChildren: delay }}
    >
      {words.map(({ word, emphasis, key }) => (
        <span key={key} aria-hidden="true" className="inline-block overflow-hidden align-bottom">
          <motion.span
            className={`inline-block ${emphasis ? "italic text-gold" : ""}`}
            variants={{
              hidden: { y: "110%", opacity: 0 },
              show: { y: "0%", opacity: 1, transition: { duration: 0.8, ease } },
            }}
          >
            {word}
            <span className="inline-block">&nbsp;</span>
          </motion.span>
        </span>
      ))}
    </MotionTag>
  );
}
