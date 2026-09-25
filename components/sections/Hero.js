"use client";
// The home page opens inside a viewfinder.
//
// The frame cycles through the strongest photographs, each change a rack focus
// (see GLHero). Over it sits the camera's HUD, driven by the same timeline: the
// AF box jumps to the new subject, hunts while the lens does, and locks saffron
// the moment the frame goes sharp. The info line along the bottom is the frame's
// real EXIF, plus where on earth it was made.
import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import SplitText from "@/components/ui/SplitText";
import Readout from "@/components/ui/Readout";
import GLHero from "@/components/webgl/GLHero";
import { photo } from "@/data/photos";
import { site } from "@/data/site";
import { T } from "@/lib/focusTimeline";
import { whenIntroDone } from "@/lib/intro";
import { fmtAlt, fmtLat, fmtLon, fmtTaken, fmtTakenTime } from "@/lib/format";
import { ease } from "@/lib/motion";

const FRAMES = ["zanskar-road", "golden-temple", "thar-dromedary", "gurudongmar", "bengal-tiger", "varanasi-sadhu"].map(photo);
const HOLD_MS = 6200; // how long a frame is held once locked

// Where on screen a point of the photo lands once it is cropped to cover the
// box — so the AF box sits on the subject, not on where the subject would be in
// an uncropped frame.
function focusOnScreen(p, boxW, boxH) {
  const imgA = p.w / p.h;
  const boxA = boxW / Math.max(1, boxH);
  const cx = imgA > boxA ? boxA / imgA : 1;
  const cy = imgA > boxA ? 1 : imgA / boxA;
  const clamp = (v) => Math.max(0.14, Math.min(0.86, v));
  return [clamp((p.focus[0] - 0.5) / cx + 0.5), clamp((p.focus[1] - 0.5) / cy + 0.5)];
}

// An exposure meter needle: wanders while the camera meters, settles on lock.
function Meter({ phase, bias }) {
  const ticks = [-3, -2, -1, 0, 1, 2, 3];
  const x = phase === "locked" ? bias : phase === "hunt" ? [bias - 1.4, bias + 1.1, bias - 0.6, bias] : bias - 2;
  return (
    <div className="relative w-36">
      <div className="flex justify-between text-[9px] text-bone/40">
        {ticks.map((t) => (
          <span key={t} className="w-3 text-center">{t === 0 ? "0" : t > 0 ? `+${t}` : t}</span>
        ))}
      </div>
      <div className="mt-1 flex h-2 items-end justify-between">
        {Array.from({ length: 19 }, (_, i) => (
          <span key={i} className={`w-px bg-bone/40 ${i % 3 === 0 ? "h-2" : "h-1"}`} />
        ))}
      </div>
      <motion.span
        className="absolute -bottom-2 h-1.5 w-1.5 -translate-x-1/2 rotate-45 bg-saffron"
        animate={{ left: Array.isArray(x) ? x.map((v) => `${((v + 3) / 6) * 100}%`) : `${((x + 3) / 6) * 100}%` }}
        transition={{ duration: phase === "hunt" ? 1.1 : 0.4, ease: "easeInOut" }}
      />
    </div>
  );
}

export default function Hero() {
  const reduce = useReducedMotion();
  const [index, setIndex] = useState(0);
  const [phase, setPhase] = useState("idle"); // idle | defocus | hunt | locked
  const [box, setBox] = useState({ w: 1600, h: 900 });
  const controller = useRef({ from: 0, to: 0, changedAt: null });
  const timers = useRef([]);
  const sectionRef = useRef(null);
  const visible = useRef(true);
  const cycle = useRef({ next: null });

  const images = useMemo(() => FRAMES.map((f) => f.src), []);
  const current = FRAMES[index];
  const [fx, fy] = focusOnScreen(current, box.w, box.h);

  // Scroll: the viewfinder pulls back as the page moves on.
  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end start"] });
  const frameScale = useTransform(scrollYProgress, [0, 1], [1, 0.86]);
  const hudOpacity = useTransform(scrollYProgress, [0, 0.45], [1, 0]);
  const copyY = useTransform(scrollYProgress, [0, 1], [0, -120]);

  useEffect(() => {
    const measure = () => setBox({ w: window.innerWidth, h: window.innerHeight });
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  useEffect(() => {
    const clear = () => {
      timers.current.forEach(clearTimeout);
      timers.current = [];
    };
    const later = (fn, ms) => timers.current.push(setTimeout(fn, ms));

    const preload = (src) =>
      new Promise((res) => {
        const img = new window.Image();
        img.onload = img.onerror = () => res();
        img.src = src;
      });

    const goTo = async (to, instant = false) => {
      clear();
      const from = controller.current.to;
      await preload(FRAMES[to].src);
      if (instant) {
        // First frame: already on it, only the focus-pull remains.
        controller.current = { from: to, to, changedAt: performance.now() - T.swap * 1000 };
        setIndex(to);
        setPhase("hunt");
        later(() => setPhase("locked"), (T.lock - T.swap) * 1000);
      } else {
        controller.current = { from, to, changedAt: performance.now() };
        setPhase("defocus");
        later(() => {
          setIndex(to);
          setPhase("hunt");
        }, T.swap * 1000);
        later(() => setPhase("locked"), T.lock * 1000);
      }
      const holdFrom = instant ? (T.lock - T.swap) * 1000 : T.lock * 1000;
      later(function advance() {
        // Held, not advanced, while nobody is looking.
        if (!visible.current || document.hidden) {
          later(advance, 800);
          return;
        }
        goTo((to + 1) % FRAMES.length);
      }, holdFrom + HOLD_MS);
    };
    cycle.current.next = goTo;

    if (reduce) {
      controller.current = { from: 0, to: 0, changedAt: 0 };
      setPhase("locked");
      return clear;
    }

    const cancel = whenIntroDone(() => later(() => goTo(0, true), 350));
    return () => {
      cancel();
      clear();
    };
  }, [reduce]);

  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting), { threshold: 0.2 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  const locked = phase === "locked";
  const e = current.exif;

  return (
    <section ref={sectionRef} className="relative h-[100svh] min-h-[620px] overflow-hidden bg-night">
      <motion.div className="absolute inset-0" style={{ scale: reduce ? 1 : frameScale }}>
        <GLHero
          images={images}
          controller={controller}
          className="absolute inset-0"
          fallback={
            <div className="absolute inset-0">
              {FRAMES.map((f, i) => (
                <Image
                  key={f.id}
                  src={f.src}
                  alt={i === 0 ? `${f.title} — ${f.place}, ${f.region}` : ""}
                  fill
                  priority={i === 0}
                  sizes="100vw"
                  className="object-cover transition-[opacity,filter] duration-700"
                  style={{
                    opacity: i === index ? 1 : 0,
                    filter: i === index && locked ? "blur(0px)" : "blur(14px)",
                  }}
                />
              ))}
            </div>
          }
        />
      </motion.div>

      {/* Legibility: dark at the bottom where the copy is, and a soft vignette. */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-night via-night/30 to-night/40" />
      <div
        className="pointer-events-none absolute inset-0 z-[2]"
        style={{ background: "radial-gradient(ellipse at center, transparent 45%, rgba(10,9,8,0.55) 100%)" }}
      />

      {/* ---- The HUD ---- */}
      <motion.div className="pointer-events-none absolute inset-0 z-[3]" style={{ opacity: reduce ? 1 : hudOpacity }}>
        {/* Frame corners */}
        <div className="brackets absolute inset-x-4 bottom-4 top-20 md:inset-x-8 md:bottom-8 md:top-24" />

        {/* Top info row */}
        <div className="absolute inset-x-7 top-[6.5rem] hidden items-center justify-between font-mono text-[10px] uppercase tracking-hud text-bone/70 md:flex md:inset-x-12 md:top-[7.5rem]">
          <span className="flex items-center gap-4">
            <span className="border border-bone/40 px-1.5 py-0.5 text-bone">M</span>
            <span>AF-C</span>
            <span>RAW+L</span>
            <span className="text-bone/40">{e.camera || "—"}</span>
          </span>
          <span className="flex items-center gap-4">
            <span>{fmtTaken(e.taken) || "—"}</span>
            <span className="flex items-center gap-1.5">
              <span className="relative inline-block h-2.5 w-5 border border-bone/60">
                <span className="absolute inset-[1.5px] right-[30%] bg-bone/70" />
              </span>
            </span>
            <span className="text-bone">[ {String(1284 - index * 3).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} ]</span>
          </span>
        </div>

        {/* AF point grid */}
        <div className="absolute inset-x-[16%] inset-y-[24%] hidden grid-cols-9 grid-rows-5 md:grid">
          {Array.from({ length: 45 }, (_, i) => (
            <span key={i} className="flex items-center justify-center">
              <span className="relative block h-2 w-2 opacity-25">
                <span className="absolute left-0 top-1/2 h-px w-full bg-bone" />
                <span className="absolute left-1/2 top-0 h-full w-px bg-bone" />
              </span>
            </span>
          ))}
        </div>

        {/* The active AF box, on the subject */}
        <motion.div
          className="absolute -ml-8 -mt-8 h-16 w-16 md:-ml-10 md:-mt-10 md:h-20 md:w-20"
          initial={false}
          animate={{
            left: `${fx * 100}%`,
            top: `${fy * 100}%`,
            scale: phase === "hunt" ? [1.25, 0.9, 1.1, 0.96, 1] : phase === "defocus" ? 1.3 : 1,
            opacity: phase === "idle" ? 0 : phase === "hunt" ? [1, 0.4, 1, 0.5, 1] : 1,
          }}
          transition={{
            left: { duration: 0.35, ease },
            top: { duration: 0.35, ease },
            scale: { duration: phase === "hunt" ? 1.1 : 0.3 },
            opacity: { duration: phase === "hunt" ? 1.1 : 0.3 },
          }}
        >
          <div
            className="brackets absolute inset-0 transition-[--c] duration-150"
            style={{ "--b": "12px", "--t": "1.5px", "--c": locked ? "#F0782D" : "rgba(237,230,218,0.9)" }}
          />
          {locked && (
            <motion.span
              initial={{ scale: 1.6, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.25 }}
              className="absolute -right-5 -top-1 h-2 w-2 rounded-full bg-saffron"
            />
          )}
        </motion.div>

        {/* Bottom info line */}
        <div className="absolute bottom-8 left-7 right-20 font-mono text-[10px] uppercase tracking-hud text-bone/80 md:bottom-12 md:left-12 md:right-24">
          <div className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3 border-t border-bone/15 pt-3">
            <div className="flex items-end gap-5 md:gap-7">
              <Readout value={e.shutter || "—"} className="text-sm text-bone md:text-base" />
              <Readout value={e.aperture || "—"} className="text-sm text-bone md:text-base" />
              <span className="flex items-baseline gap-1.5">
                <span className="text-bone/40">ISO</span>
                <Readout value={e.iso ?? "—"} className="text-sm text-bone md:text-base" />
              </span>
              <Readout value={e.focal || "—"} className="hidden text-sm text-bone sm:inline md:text-base" />
              <div className="hidden lg:block">
                <Meter phase={phase} bias={index % 2 ? -0.3 : 0.3} />
              </div>
            </div>
            <div className="flex items-end gap-5 text-right md:gap-7">
              <span className="hidden sm:inline">
                <Readout value={`${current.place}, ${current.region}`} className="text-bone" />
              </span>
              <span className="hidden md:inline">
                <Readout value={`${fmtLat(current.lat)} ${fmtLon(current.lon)}`} />
              </span>
              <span className="hidden text-bone/50 md:inline">
                <Readout value={`${fmtAlt(current.alt)} · ${fmtTakenTime(e.taken) || "--:--"}`} />
              </span>
              <span className={`flex items-center gap-1.5 ${locked ? "text-saffron" : "text-bone/40"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${locked ? "bg-saffron" : "bg-bone/40"}`} />
                {locked ? "Focus" : "AF"}
              </span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* ---- The copy ---- */}
      <motion.div
        className="absolute inset-x-0 bottom-24 z-[4] mx-auto w-full max-w-[110rem] px-7 md:bottom-32 md:px-12"
        style={{ y: reduce ? 0 : copyY }}
      >
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/70"
        >
          <span className="h-px w-8 bg-saffron" />
          {site.tagline}
        </motion.p>
        <SplitText as="h1" delay={0.4} stagger={0.07} className="block max-w-5xl font-display text-fluid-xl text-bone">
          {[{ text: "Chasing light" }, { text: "across India.", emphasis: true }]}
        </SplitText>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.8 }}
          className="pointer-events-auto mt-8 flex flex-wrap items-center gap-4"
        >
          <Button href="/journeys">Enter the journeys</Button>
          <Button href="/contact" variant="outline">
            Plan a shoot
          </Button>
        </motion.div>
      </motion.div>

      {/* Frame selector */}
      <div className="absolute right-7 top-1/2 z-[4] hidden -translate-y-1/2 flex-col items-end gap-2 md:right-20 md:flex">
        {FRAMES.map((f, i) => (
          <button
            key={f.id}
            onClick={() => i !== index && cycle.current.next && cycle.current.next(i)}
            aria-label={`Show ${f.title}`}
            className="group flex items-center gap-3 py-1 font-mono text-[10px] tracking-hud"
          >
            <span className={`transition-opacity ${i === index ? "text-bone opacity-100" : "text-bone/40 opacity-0 group-hover:opacity-100"}`}>
              {f.place}
            </span>
            <span className={`${i === index ? "text-saffron" : "text-bone/40 group-hover:text-bone"}`}>
              {String(i + 1).padStart(2, "0")}
            </span>
            <span className="relative h-px w-8 overflow-hidden bg-bone/20">
              {i === index && locked && !reduce && (
                <motion.span
                  key={`p-${index}`}
                  className="absolute inset-y-0 left-0 bg-saffron"
                  initial={{ width: "0%" }}
                  animate={{ width: "100%" }}
                  transition={{ duration: HOLD_MS / 1000, ease: "linear" }}
                />
              )}
              {i === index && (locked === false || reduce) && <span className="absolute inset-0 bg-bone/60" />}
            </span>
          </button>
        ))}
      </div>
    </section>
  );
}
