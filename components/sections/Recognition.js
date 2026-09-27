"use client";
// Collaborations & recognition, in four parts:
//
//   1. The tourism bodies, as event press passes hanging on lanyards. Each pass
//      swings from its clip: the page's scroll speed sets them all swaying, and
//      on desktop the one under the pointer turns to face it. On a phone they sit
//      in a swipeable row and still swing with the scroll.
//   2. The Rashtrapati Bhavan commission, given a feature of its own.
//   3. Honours, as a roll of certificates that rule themselves in.
//   4. Where the work has been published.
import Image from "next/image";
import { motion, useMotionValue, useScroll, useSpring, useTransform, useVelocity } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import FocusImage from "@/components/ui/FocusImage";
import { collaborations, collaborationsNote, commission, honours, press, recognitionHeadline } from "@/data/recognition";
import { photo } from "@/data/photos";
import { ease } from "@/lib/motion";

// A few bars of a barcode, derived from the org name so it is stable.
function Barcode({ seed }) {
  const bars = Array.from({ length: 24 }, (_, i) => ((seed.charCodeAt(i % seed.length) * (i + 3)) % 4) + 1);
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
      className="relative w-[72vw] shrink-0 snap-center sm:w-[44vw] lg:w-auto"
      initial={reduce ? false : { y: -60, opacity: 0, rotate: -8 }}
      whileInView={{ y: 0, opacity: 1, rotate: 0 }}
      viewport={{ once: true, margin: "-10%" }}
      transition={{ type: "spring", stiffness: 90, damping: 11, delay: i * 0.1 }}
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
          <div className="bg-saffron px-5 pb-2 pt-8 font-mono text-[10px] uppercase tracking-hud text-night">{r.role}</div>
          <div className="px-5 pb-5 pt-5">
            <div className={`flex h-20 items-center ${r.logo && r.logoOnDark ? "-mx-5 bg-night px-5" : ""}`}>
              {r.logo ? (
                <span className="relative block h-14 w-full">
                  <Image src={r.logo} alt={`${r.org} logo`} fill sizes="240px" className="object-contain object-left" />
                </span>
              ) : (
                <span className={`font-display leading-[0.95] tracking-tight ${r.short.length > 5 ? "text-4xl" : "text-6xl"}`}>
                  {r.short}
                </span>
              )}
            </div>
            <p className="mt-4 font-display text-2xl leading-tight">{r.org}</p>
            <p className="mt-1 min-h-[2.5rem] text-sm text-ink/55">{r.sub}</p>
            <dl className="mt-4 border-t border-ink/15 pt-4 font-mono text-[9px] uppercase tracking-hud">
              <dt className="text-ink/45">Work</dt>
              <dd className="mt-1 text-ink">{r.work}</dd>
            </dl>
            <div className="mt-5 flex items-end justify-between">
              <Barcode seed={r.org} />
              <span className="text-right font-mono text-[9px] uppercase tracking-hud text-ink/45">
                Hive Akshat
                <br />
                No. {String(i + 1).padStart(3, "0")}
              </span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

/** The headline commission. Shows his photograph once one is set in data. */
function Commission() {
  const p = commission.image ? photo(commission.image) : null;
  return (
    <Reveal>
      <div className="relative mt-24 grid overflow-hidden border border-line md:mt-32 md:grid-cols-[1.1fr_1fr]">
        <div className="relative min-h-[240px] bg-soot md:min-h-[420px]">
          {p ? (
            <FocusImage p={p} inView sizes="(min-width:768px) 50vw, 100vw" className="absolute inset-0" />
          ) : (
            // Until his own frame arrives: a line drawing of a domed facade,
            // so the block is never an empty box.
            <svg viewBox="0 0 400 260" className="absolute inset-0 h-full w-full" preserveAspectRatio="xMidYMid slice" aria-hidden="true">
              <rect width="400" height="260" fill="#1C1916" />
              <g fill="none" stroke="#E0A94A" strokeOpacity="0.55" strokeWidth="1">
                <path d="M150 120 Q200 58 250 120" />
                <path d="M168 120 Q200 82 232 120" />
                <line x1="200" y1="62" x2="200" y2="44" />
                <rect x="140" y="120" width="120" height="16" />
                <path d="M40 150 H360 V200 H40 Z" />
                {Array.from({ length: 13 }, (_, i) => (
                  <line key={i} x1={60 + i * 23.3} y1="150" x2={60 + i * 23.3} y2="200" />
                ))}
                <line x1="30" y1="206" x2="370" y2="206" />
                <line x1="20" y1="214" x2="380" y2="214" />
              </g>
            </svg>
          )}
          <div className="brackets pointer-events-none absolute inset-4" style={{ "--c": "rgba(237,230,218,0.5)" }} />
        </div>
        <div className="flex flex-col justify-center p-7 md:p-12">
          <p className="font-mono text-[10px] uppercase tracking-hud text-saffron">● {commission.kicker}</p>
          <h3 className="mt-5 font-display text-4xl leading-tight text-bone md:text-5xl">{commission.title}</h3>
          <p className="mt-5 max-w-md text-bone/65">{commission.note}</p>
        </div>
      </div>
    </Reveal>
  );
}

/** Honours, each ruled in like a line on a certificate as it arrives. */
function Honours() {
  const reduce = useReducedMotion();
  return (
    <div className="mt-24 md:mt-32">
      <div className="flex items-end justify-between gap-6">
        <h3 className="font-display text-3xl text-bone md:text-4xl">
          Honours & <span className="italic text-ember">recognition</span>
        </h3>
        <p className="hidden font-mono text-[10px] uppercase tracking-hud text-bone/40 md:block">{honours.length} entries</p>
      </div>
      <ol className="mt-10">
        {honours.map((h, i) => (
          <motion.li
            key={h.title}
            className="relative grid gap-2 py-6 md:grid-cols-[3rem_1.2fr_1.4fr_8.5rem] md:items-baseline md:gap-6"
            initial={reduce ? false : { opacity: 0, y: 14 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-10%" }}
            transition={{ duration: 0.7, ease, delay: i * 0.06 }}
          >
            <motion.span
              className="absolute inset-x-0 top-0 h-px origin-left bg-line"
              initial={reduce ? false : { scaleX: 0 }}
              whileInView={{ scaleX: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1.1, ease, delay: i * 0.06 }}
            />
            <span className="font-mono text-[10px] text-saffron">{String(i + 1).padStart(2, "0")}</span>
            <span className="flex items-center gap-4 font-display text-2xl leading-tight text-bone">
              {h.logo && (
                <span className="relative block h-10 w-10 shrink-0 overflow-hidden rounded-full bg-paper">
                  <Image src={h.logo} alt="" fill sizes="40px" className="object-contain p-0.5" />
                </span>
              )}
              {h.title}
            </span>
            <span className="text-bone/60">
              {h.by}
              {h.detail && <span className="mt-1 block text-sm text-bone/40">{h.detail}</span>}
            </span>
            <span className="font-mono text-[11px] uppercase tracking-hud text-bone/50 md:text-right">{h.year || ""}</span>
          </motion.li>
        ))}
      </ol>
      <div className="flex flex-wrap items-baseline gap-x-8 gap-y-3 border-t border-line pt-8">
        <span className="font-mono text-[10px] uppercase tracking-hud text-bone/40">Featured in</span>
        {press.map((p) =>
          p.href ? (
            <a
              key={p.name}
              href={p.href}
              target="_blank"
              rel="noopener noreferrer"
              className="link-sweep font-display text-2xl italic text-bone/80 transition-colors hover:text-saffron md:text-3xl"
            >
              {p.name} ↗
            </a>
          ) : (
            <span key={p.name} className="font-display text-2xl italic text-bone/80 md:text-3xl">
              {p.name}
            </span>
          )
        )}
      </div>
    </div>
  );
}

export default function Recognition({ index = "02" }) {
  const { scrollY } = useScroll();
  const vel = useVelocity(scrollY);
  const smooth = useSpring(vel, { stiffness: 80, damping: 12 });
  // Scroll speed -> swing, capped so a fling never flips a card over.
  const sway = useTransform(smooth, [-2500, 0, 2500], [7, 0, -7], { clamp: true });

  return (
    <section id="recognition" className="relative scroll-mt-20 overflow-hidden bg-night py-28 md:py-40">
      <Container>
        <SectionHeading index={index} eyebrow={recognitionHeadline.kicker} title={recognitionHeadline.title} intro={recognitionHeadline.note} />
      </Container>

      <div className="no-scrollbar mt-6 flex snap-x snap-mandatory gap-5 overflow-x-auto px-6 pb-10 pt-36 md:px-8 lg:mx-auto lg:grid lg:max-w-[96rem] lg:grid-cols-5 lg:gap-6 lg:overflow-visible">
        {collaborations.map((r, i) => (
          <Pass key={r.org} r={r} i={i} sway={sway} />
        ))}
      </div>

      <Container>
        <p className="mt-2 font-mono text-[10px] uppercase tracking-hud text-bone/40 lg:hidden">Swipe →</p>
        <Reveal>
          <p className="mt-8 flex items-center gap-3 text-bone/60">
            <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-saffron" />
            {collaborationsNote}
          </p>
        </Reveal>
        <Commission />
        <Honours />
      </Container>
    </section>
  );
}
