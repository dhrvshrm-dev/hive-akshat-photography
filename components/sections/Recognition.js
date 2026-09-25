"use client";
// Commissioned & recognised by — set as a row of event press passes hanging on
// lanyards. Each pass swings from its clip: the page's scroll speed sets them
// all swaying, and on desktop the one under the pointer turns to face it. On a
// phone they sit in a swipeable row and still swing with the scroll.
import { useRef } from "react";
import Image from "next/image";
import {
  motion,
  useMotionValue,
  useReducedMotion,
  useScroll,
  useSpring,
  useTransform,
  useVelocity,
} from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import { recognition, recognitionHeadline } from "@/data/recognition";

// A few bars of a fake barcode, derived from the org name so it is stable.
function Barcode({ seed }) {
  const bars = Array.from({ length: 28 }, (_, i) => ((seed.charCodeAt(i % seed.length) * (i + 3)) % 4) + 1);
  return (
    <span className="flex h-7 items-stretch gap-[2px]" aria-hidden="true">
      {bars.map((w, i) => (
        <span key={i} className="bg-ink" style={{ width: w }} />
      ))}
    </span>
  );
}

function Pass({ r, i, sway }) {
  const reduce = useReducedMotion();
  const tilt = useMotionValue(0);
  const turn = useMotionValue(0);
  const tiltS = useSpring(tilt, { stiffness: 120, damping: 9 });
  const turnS = useSpring(turn, { stiffness: 140, damping: 16 });
  // Neighbouring passes swing slightly out of phase, like real lanyards.
  const phased = useTransform(sway, (v) => v * (1 + (i % 3) * 0.25) * (i % 2 ? -1 : 1));
  const rotate = useTransform([tiltS, phased], ([a, b]) => a + b);

  const onMove = (e) => {
    const b = e.currentTarget.getBoundingClientRect();
    const x = (e.clientX - b.left) / b.width - 0.5;
    tilt.set(x * -10);
    turn.set(x * 18);
  };
  const onLeave = () => {
    tilt.set(0);
    turn.set(0);
  };

  return (
    <motion.div
      className="relative w-[74vw] shrink-0 snap-center sm:w-[46vw] lg:w-auto"
      initial={reduce ? false : { y: -60, opacity: 0, rotate: -8 }}
      whileInView={{ y: 0, opacity: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ type: "spring", stiffness: 90, damping: 11, delay: i * 0.12 }}
    >
      {/* The lanyard, running up out of the section */}
      <span className="absolute -top-28 left-1/2 h-28 w-[3px] -translate-x-1/2 bg-gradient-to-b from-transparent via-saffron/70 to-saffron" />
      <motion.div
        style={{ rotate: reduce ? 0 : rotate, rotateY: reduce ? 0 : turnS, transformOrigin: "50% -1.5rem", transformPerspective: 900 }}
        onMouseMove={onMove}
        onMouseLeave={onLeave}
        className="relative"
      >
        {/* Clip */}
        <span className="absolute -top-6 left-1/2 h-7 w-9 -translate-x-1/2 rounded-sm border border-bone/40 bg-smoke" />
        <div className="relative overflow-hidden rounded-[10px] bg-paper text-ink shadow-[0_30px_60px_-20px_rgba(0,0,0,0.8)]">
          {/* Punch hole */}
          <span className="absolute left-1/2 top-3 h-2 w-10 -translate-x-1/2 rounded-full bg-night/80" />
          <div className="bg-saffron px-5 pb-2 pt-8 font-mono text-[10px] uppercase tracking-hud text-night">
            {r.role}
          </div>
          <div className="px-5 pb-5 pt-5">
            <div className="flex h-20 items-center">
              {r.logo ? (
                <span className="relative block h-16 w-full">
                  <Image src={r.logo} alt={r.org} fill sizes="240px" className="object-contain object-left" />
                </span>
              ) : (
                <span className="font-display text-6xl leading-none tracking-tight">{r.short}</span>
              )}
            </div>
            <p className="mt-4 font-display text-2xl leading-tight">{r.org}</p>
            <p className="mt-1 text-sm text-ink/55">{r.sub}</p>
            <dl className="mt-5 grid grid-cols-2 gap-3 border-t border-ink/15 pt-4 font-mono text-[9px] uppercase tracking-hud">
              <div>
                <dt className="text-ink/45">Coverage</dt>
                <dd className="mt-1 text-ink">{r.event}</dd>
              </div>
              <div>
                <dt className="text-ink/45">Year</dt>
                <dd className="mt-1 text-ink">{r.year}</dd>
              </div>
            </dl>
            <div className="mt-5 flex items-end justify-between">
              <Barcode seed={r.org} />
              <span className="font-mono text-[9px] uppercase tracking-hud text-ink/45">
                Hive Akshat
                <br />
                No. {String(i + 1).padStart(3, "0")}
              </span>
            </div>
          </div>
          {r.placeholder && (
            <span className="absolute right-3 top-10 rotate-6 border border-night/40 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-hud text-night/60">
              Sample
            </span>
          )}
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Recognition() {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { stiffness: 80, damping: 12 });
  // Scroll speed -> swing, capped so a fling never flips a card over.
  const sway = useTransform(smooth, [-2500, 0, 2500], [7, 0, -7], { clamp: true });
  const rowRef = useRef(null);

  return (
    <section className="relative overflow-hidden bg-night py-28 md:py-40">
      <Container>
        <SectionHeading index="02" eyebrow={recognitionHeadline.kicker} title={recognitionHeadline.title} intro={recognitionHeadline.note} />
      </Container>

      <div
        ref={rowRef}
        className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-10 pt-36 md:px-8 lg:mx-auto lg:grid lg:max-w-content lg:grid-cols-4 lg:gap-8 lg:overflow-visible"
      >
        {recognition.map((r, i) => (
          <Pass key={r.org + i} r={r} i={i} sway={sway} />
        ))}
      </div>

      <Container>
        <Reveal>
          <p className="mt-6 font-mono text-[10px] uppercase tracking-hud text-bone/40 lg:hidden">Swipe →</p>
        </Reveal>
      </Container>
    </section>
  );
}
