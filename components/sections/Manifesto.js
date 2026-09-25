"use client";
// A paragraph read at the speed you scroll. Each word lights from ash to bone
// as the section passes, and small photographs sit inside the sentence, opening
// from a sliver to full width as their turn comes — the text *shows* what it says.
import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Container from "@/components/ui/Container";
import { manifesto } from "@/data/site";
import { photo } from "@/data/photos";

function Word({ children, range, progress, emphasis }) {
  const opacity = useTransform(progress, range, [0.14, 1]);
  return (
    <motion.span style={{ opacity }} className={`mr-[0.25em] inline-block ${emphasis ? "italic text-ember" : ""}`}>
      {children}
    </motion.span>
  );
}

function Frame({ id, range, progress }) {
  const p = photo(id);
  const width = useTransform(progress, range, ["0.4em", "1.9em"]);
  const opacity = useTransform(progress, range, [0.3, 1]);
  return (
    <motion.span
      style={{ width, opacity }}
      className="relative mr-[0.25em] inline-block h-[0.8em] overflow-hidden rounded-full align-[-0.05em]"
    >
      <Image src={p.src} alt={p.title} fill sizes="160px" className="object-cover" />
    </motion.span>
  );
}

export default function Manifesto() {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start 0.8", "end 0.45"] });

  // Flatten into a token list so every word and every frame gets its own slice
  // of the scroll range.
  const tokens = [];
  manifesto.forEach((seg) => {
    if (seg.image) tokens.push({ image: seg.image });
    else seg.text.split(" ").forEach((w) => tokens.push({ word: w, emphasis: seg.emphasis }));
  });
  const n = tokens.length;

  return (
    <section ref={ref} className="relative bg-night py-28 md:py-44">
      <Container>
        <p className="mb-10 flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/50">
          <span className="text-saffron">01</span>
          <span className="h-px w-8 bg-bone/25" />
          Field note
        </p>
        <p className="max-w-6xl font-display text-[clamp(1.9rem,4.6vw,4.6rem)] leading-[1.12] text-bone">
          {tokens.map((t, i) => {
            const range = [i / n, Math.min(1, (i + 1.5) / n)];
            if (reduce) {
              return t.image ? (
                <span key={i} className="relative mr-[0.25em] inline-block h-[0.8em] w-[1.9em] overflow-hidden rounded-full align-[-0.05em]">
                  <Image src={photo(t.image).src} alt={photo(t.image).title} fill sizes="160px" className="object-cover" />
                </span>
              ) : (
                <span key={i} className={`mr-[0.25em] inline-block ${t.emphasis ? "italic text-ember" : ""}`}>
                  {t.word}
                </span>
              );
            }
            return t.image ? (
              <Frame key={i} id={t.image} range={range} progress={scrollYProgress} />
            ) : (
              <Word key={i} range={range} progress={scrollYProgress} emphasis={t.emphasis}>
                {t.word}
              </Word>
            );
          })}
        </p>
        <p className="mt-12 font-mono text-[10px] uppercase tracking-hud text-bone/40">— Akshat, somewhere past Padum</p>
      </Container>
    </section>
  );
}
