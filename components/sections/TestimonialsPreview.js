"use client";
// One voice at a time, large. Auto-advances, pauses on hover, and can be
// swiped on a phone or dragged with a mouse.
import { useEffect, useState } from "react";
import Link from "next/link";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import { testimonials } from "@/data/testimonials";
import { ease } from "@/lib/motion";

const HOLD = 7000;

export default function TestimonialsPreview() {
  const [i, setI] = useState(0);
  const [dir, setDir] = useState(1);
  const [paused, setPaused] = useState(false);
  const reduce = useReducedMotion();
  const n = testimonials.length;

  const go = (d) => {
    setDir(d);
    setI((v) => (v + d + n) % n);
  };

  useEffect(() => {
    if (paused || reduce) return;
    const id = setTimeout(() => go(1), HOLD);
    return () => clearTimeout(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused, reduce]);

  const t = testimonials[i];

  return (
    <section
      className="relative overflow-hidden bg-night py-28 md:py-40"
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
    >
      <Container>
        <div className="flex items-center justify-between">
          <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/50">
            <span className="text-saffron">05</span>
            <span className="h-px w-8 bg-bone/25" />
            Word from the road
          </p>
          <p className="font-mono text-[10px] tracking-hud text-bone/50">
            {String(i + 1).padStart(2, "0")} / {String(n).padStart(2, "0")}
          </p>
        </div>

        <div className="relative mt-12 min-h-[18rem] md:min-h-[20rem]">
          <AnimatePresence mode="wait" custom={dir}>
            <motion.figure
              key={i}
              custom={dir}
              drag={reduce ? false : "x"}
              dragConstraints={{ left: 0, right: 0 }}
              dragElastic={0.25}
              onDragEnd={(_, info) => {
                if (info.offset.x < -60) go(1);
                else if (info.offset.x > 60) go(-1);
              }}
              initial={reduce ? false : { opacity: 0, x: dir * 60, filter: "blur(8px)" }}
              animate={{ opacity: 1, x: 0, filter: "blur(0px)" }}
              exit={reduce ? undefined : { opacity: 0, x: dir * -60, filter: "blur(8px)" }}
              transition={{ duration: 0.6, ease }}
              className="cursor-grab touch-pan-y active:cursor-grabbing"
            >
              <blockquote className="max-w-5xl font-display text-[clamp(1.7rem,3.8vw,3.6rem)] leading-[1.15] text-bone">
                <span className="text-saffron">“</span>
                {t.quote}
                <span className="text-saffron">”</span>
              </blockquote>
              <figcaption className="mt-10 flex flex-wrap items-center gap-x-4 gap-y-1 font-mono text-[11px] uppercase tracking-hud">
                <span className="text-bone">{t.name}</span>
                <span className="h-px w-6 bg-bone/30" />
                <span className="text-bone/50">{t.org}</span>
              </figcaption>
            </motion.figure>
          </AnimatePresence>
        </div>

        <div className="mt-12 flex items-center justify-between gap-6">
          <div className="flex flex-1 gap-1.5">
            {testimonials.map((_, k) => (
              <button
                key={k}
                onClick={() => {
                  setDir(k > i ? 1 : -1);
                  setI(k);
                }}
                aria-label={`Quote ${k + 1}`}
                className="relative h-6 flex-1"
              >
                <span className="absolute inset-x-0 top-1/2 h-px bg-bone/20" />
                {k === i && (
                  <motion.span
                    key={`bar-${i}-${paused}`}
                    className="absolute left-0 top-1/2 h-px bg-saffron"
                    initial={{ width: paused || reduce ? "100%" : "0%" }}
                    animate={{ width: "100%" }}
                    transition={{ duration: paused || reduce ? 0 : HOLD / 1000, ease: "linear" }}
                  />
                )}
              </button>
            ))}
          </div>
          <div className="flex items-center gap-6 font-mono text-[11px] uppercase tracking-hud">
            <button onClick={() => go(-1)} className="text-bone/60 hover:text-saffron" aria-label="Previous quote">
              ← Prev
            </button>
            <button onClick={() => go(1)} className="text-bone/60 hover:text-saffron" aria-label="Next quote">
              Next →
            </button>
            <Link href="/testimonials" className="hidden text-bone/60 hover:text-saffron md:inline">
              All words
            </Link>
          </div>
        </div>
      </Container>
    </section>
  );
}
