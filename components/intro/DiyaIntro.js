"use client";
// The first thing a new visitor sees: darkness, and a diya.
//
// The pointer carries a lamp flame. Wherever it goes, the night aarti at
// Dashashwamedh Ghat is revealed in a warm, flickering pool of light — the rest
// of the frame stays black. Press and hold, and the lamp is lit: the light
// swells until it fills the screen, and the site is revealed behind it as dawn.
//
// It is an overlay over the real, server-rendered page, so crawlers and no-JS
// visitors never see it. Escape and the skip button always work.
import { useCallback, useEffect, useRef, useState } from "react";
import { markIntroDone } from "@/lib/intro";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { photo } from "@/data/photos";
import { fmtCoords, fmtTakenTime } from "@/lib/format";

const HOLD_MS = 1300;
const DAWN_MS = 1700;
const shot = photo("varanasi-puja");

// Cheap 1D value noise — enough to make a flame breathe without looking periodic.
function noise1(t) {
  const i = Math.floor(t);
  const f = t - i;
  const h = (n) => {
    const s = Math.sin(n * 127.1) * 43758.5453;
    return s - Math.floor(s);
  };
  const u = f * f * (3 - 2 * f);
  return h(i) * (1 - u) + h(i + 1) * u;
}

export default function DiyaIntro() {
  const [show, setShow] = useState(false);
  const [phase, setPhase] = useState("dark"); // dark | dawn | out
  const [touched, setTouched] = useState(false);

  const rootRef = useRef(null);
  const photoRef = useRef(null);
  const glowRef = useRef(null);
  const flameRef = useRef(null);
  const ringRef = useRef(null);
  const canvasRef = useRef(null);

  const s = useRef({
    x: 0, y: 0, tx: 0, ty: 0,
    lastMove: 0, hasPointer: false,
    holding: false, hold: 0, dawn: 0, dawnStart: 0,
    phase: "dark", raf: 0, particles: [],
  });

  useEffect(() => {
    const v = document.documentElement.getAttribute("data-intro");
    if (v === "skip" || v === "done") return;
    setShow(true);
    lockScroll("intro");
    const st = s.current;
    st.x = st.tx = window.innerWidth * 0.5;
    st.y = st.ty = window.innerHeight * 0.58;
    return () => unlockScroll("intro");
  }, []);

  const finish = useCallback(() => {
    if (s.current.phase === "out") return;
    s.current.phase = "out";
    setPhase("out");
    unlockScroll("intro");
    markIntroDone();
    setTimeout(() => setShow(false), 900);
  }, []);

  const light = useCallback(() => {
    const st = s.current;
    if (st.phase !== "dark") return;
    st.phase = "dawn";
    st.dawnStart = performance.now();
    setPhase("dawn");
  }, []);

  // Input
  useEffect(() => {
    if (!show) return;
    const st = s.current;
    const move = (e) => {
      const p = e.touches ? e.touches[0] : e;
      if (!p) return;
      st.tx = p.clientX;
      st.ty = p.clientY;
      st.hasPointer = true;
      st.lastMove = performance.now();
    };
    const down = (e) => {
      if (e.target.closest?.("[data-intro-skip]")) return;
      move(e);
      st.holding = true;
      setTouched(true);
    };
    const up = () => {
      st.holding = false;
      if (st.phase === "dark") setTouched(false);
    };
    const key = (e) => {
      if (e.key === "Escape") finish();
      if ((e.key === " " || e.key === "Enter") && !e.repeat) {
        e.preventDefault();
        st.holding = true;
        setTouched(true);
      }
    };
    const keyUp = (e) => {
      if (e.key === " " || e.key === "Enter") {
        st.holding = false;
        if (st.phase === "dark") setTouched(false);
      }
    };
    window.addEventListener("pointermove", move, { passive: true });
    window.addEventListener("touchmove", move, { passive: true });
    window.addEventListener("pointerdown", down);
    window.addEventListener("pointerup", up);
    window.addEventListener("pointercancel", up);
    window.addEventListener("keydown", key);
    window.addEventListener("keyup", keyUp);
    return () => {
      window.removeEventListener("pointermove", move);
      window.removeEventListener("touchmove", move);
      window.removeEventListener("pointerdown", down);
      window.removeEventListener("pointerup", up);
      window.removeEventListener("pointercancel", up);
      window.removeEventListener("keydown", key);
      window.removeEventListener("keyup", keyUp);
    };
  }, [show, finish]);

  // Frame loop: light pool, flame, embers.
  useEffect(() => {
    if (!show) return;
    const st = s.current;
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let last = performance.now();
    let dpr = Math.min(window.devicePixelRatio || 1, 2);

    const size = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
    };
    size();
    window.addEventListener("resize", size);

    const frame = (now) => {
      st.raf = requestAnimationFrame(frame);
      // Clamped both ways: a stalled first frame (hydration on a slow phone) can
      // report a *negative* delta, which must never count as time held.
      const dt = Math.max(0, Math.min(0.05, (now - last) / 1000));
      last = now;
      const t = now / 1000;
      const w = window.innerWidth;
      const h = window.innerHeight;

      // No pointer (a phone before its first touch, or a mouse gone idle): the
      // flame drifts on its own across the ghat, so the scene is never dead.
      if (!st.hasPointer || now - st.lastMove > 4000) {
        st.tx = w * (0.5 + Math.sin(t * 0.37) * 0.26);
        st.ty = h * (0.52 + Math.sin(t * 0.53 + 1.3) * 0.16);
      }
      const k = 1 - Math.exp(-dt * 7);
      st.x += (st.tx - st.x) * k;
      st.y += (st.ty - st.y) * k;

      // Hold to light. Letting go early lets it sink back, like a wick that
      // didn't quite catch.
      if (st.phase === "dark") {
        st.hold += (st.holding ? dt : -dt * 1.6) * (1000 / HOLD_MS);
        st.hold = Math.max(0, Math.min(1, st.hold));
        if (st.hold >= 1 && st.holding) light();
      }

      let dawn = 0;
      if (st.phase === "dawn" || st.phase === "out") {
        const d = Math.min(1, (now - st.dawnStart) / DAWN_MS);
        dawn = d < 0.5 ? 4 * d * d * d : 1 - Math.pow(-2 * d + 2, 3) / 2;
        if (d >= 1 && st.phase === "dawn") finish();
      }
      st.dawn = dawn;

      const flicker = 0.9 + noise1(t * 7.3) * 0.14 + Math.sin(t * 23.0) * 0.02;
      const base = Math.min(w, h) * (0.2 + st.hold * 0.12);
      const full = Math.hypot(w, h) * 1.25;
      const r = base * flicker * (1 - dawn) + full * dawn;

      const ph = photoRef.current;
      if (ph) {
        ph.style.setProperty("--x", `${st.x}px`);
        ph.style.setProperty("--y", `${st.y}px`);
        ph.style.setProperty("--r", `${r}px`);
        // The ghat leans a little against the lamp, for depth.
        const px = (st.x / w - 0.5) * -18;
        const py = (st.y / h - 0.5) * -12;
        ph.style.transform = `translate3d(${px}px, ${py}px, 0) scale(${1.06 - dawn * 0.04})`;
        ph.style.filter = `brightness(${0.85 + dawn * 0.25}) saturate(${1.05 + dawn * 0.1})`;
      }
      const gl = glowRef.current;
      if (gl) {
        gl.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) translate(-50%, -50%) scale(${flicker * (1 + st.hold * 0.5)})`;
        gl.style.opacity = String((0.55 + st.hold * 0.3) * (1 - dawn));
      }
      const fl = flameRef.current;
      if (fl) {
        const sway = (noise1(t * 3.1 + 7) - 0.5) * 10;
        fl.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) translate(-50%, -88%) skewX(${sway}deg) scale(${(0.9 + noise1(t * 9) * 0.2) * (1 + st.hold * 0.35)})`;
        fl.style.opacity = String(1 - dawn);
      }
      const ring = ringRef.current;
      if (ring) {
        ring.style.transform = `translate3d(${st.x}px, ${st.y}px, 0) translate(-50%, -50%)`;
        ring.style.opacity = String(st.hold > 0.01 && st.phase === "dark" ? 1 : 0);
        const c = ring.querySelector("circle[data-progress]");
        if (c) c.style.strokeDashoffset = String(176 * (1 - st.hold));
      }

      // Embers: rise off the flame, drift, cool and die. More of them while the
      // lamp is catching.
      const spawn = (st.phase === "dark" ? 16 + st.hold * 70 : 0) * dt;
      const count = Math.floor(spawn) + (Math.random() < spawn % 1 ? 1 : 0);
      for (let i = 0; i < count; i++) {
        st.particles.push({
          x: st.x + (Math.random() - 0.5) * 10,
          y: st.y - 14,
          vx: (Math.random() - 0.5) * 18,
          vy: -30 - Math.random() * 50,
          life: 0,
          max: 1.2 + Math.random() * 1.6,
          size: 0.6 + Math.random() * 1.6,
        });
      }
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
      ctx.clearRect(0, 0, w, h);
      ctx.globalCompositeOperation = "lighter";
      st.particles = st.particles.filter((p) => {
        p.life += dt;
        if (p.life > p.max) return false;
        p.vx += (noise1(p.y * 0.02 + t) - 0.5) * 40 * dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const a = (1 - p.life / p.max) * (1 - dawn);
        ctx.fillStyle = `rgba(255, ${150 + Math.round(80 * (1 - p.life / p.max))}, 70, ${a})`;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fill();
        return true;
      });
    };
    st.raf = requestAnimationFrame(frame);
    return () => {
      cancelAnimationFrame(st.raf);
      window.removeEventListener("resize", size);
    };
  }, [show, light, finish]);

  if (!show) return null;

  const mask =
    "radial-gradient(circle var(--r) at var(--x) var(--y), #000 0%, rgba(0,0,0,0.92) 30%, rgba(0,0,0,0.35) 62%, transparent 100%)";

  return (
    <div
      ref={rootRef}
      role="dialog"
      aria-label="Intro — press and hold to light the lamp, or press Escape to skip"
      className="fixed inset-0 z-[200] select-none overflow-hidden bg-[#050403] touch-none"
      style={{ opacity: phase === "out" ? 0 : 1, transition: "opacity 850ms cubic-bezier(0.22,1,0.36,1)" }}
    >
      {/* The ghat, seen only where the lamp light falls. */}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={photoRef}
        src={shot.src}
        alt=""
        className="absolute inset-0 h-full w-full object-cover will-change-transform"
        style={{
          objectPosition: "70% 45%",
          WebkitMaskImage: mask,
          maskImage: mask,
          "--x": "50vw",
          "--y": "58vh",
          "--r": "0px",
        }}
      />

      {/* Warm spill of light around the flame. */}
      <div
        ref={glowRef}
        className="pointer-events-none absolute left-0 top-0 h-[70vmin] w-[70vmin] rounded-full mix-blend-screen"
        style={{
          background:
            "radial-gradient(circle, rgba(255,190,110,0.38) 0%, rgba(240,120,45,0.16) 30%, rgba(240,120,45,0) 65%)",
        }}
      />

      <canvas ref={canvasRef} className="pointer-events-none absolute inset-0 h-full w-full" />

      {/* Hold progress: a thin ring that closes round the lamp. */}
      <svg
        ref={ringRef}
        width="64"
        height="64"
        viewBox="0 0 64 64"
        className="pointer-events-none absolute left-0 top-0"
        style={{ opacity: 0, transition: "opacity 200ms" }}
      >
        <circle cx="32" cy="32" r="28" fill="none" stroke="rgba(237,230,218,0.15)" strokeWidth="1" />
        <circle
          data-progress
          cx="32"
          cy="32"
          r="28"
          fill="none"
          stroke="#F0782D"
          strokeWidth="1.5"
          strokeDasharray="176"
          strokeDashoffset="176"
          transform="rotate(-90 32 32)"
        />
      </svg>

      {/* The flame itself. */}
      <div ref={flameRef} className="pointer-events-none absolute left-0 top-0">
        <svg width="34" height="58" viewBox="0 0 34 58" style={{ filter: "drop-shadow(0 0 14px rgba(255,170,80,0.9))" }}>
          <defs>
            <radialGradient id="diya-flame" cx="50%" cy="72%" r="60%">
              <stop offset="0%" stopColor="#FFFBEA" />
              <stop offset="28%" stopColor="#FFE08A" />
              <stop offset="62%" stopColor="#F0782D" />
              <stop offset="100%" stopColor="#F0782D" stopOpacity="0" />
            </radialGradient>
          </defs>
          <path d="M17 2 C 22 16, 31 26, 31 38 C 31 49, 24 56, 17 56 C 10 56, 3 49, 3 38 C 3 26, 12 16, 17 2 Z" fill="url(#diya-flame)" />
          <ellipse cx="17" cy="44" rx="5" ry="8" fill="#FFFDF4" opacity="0.85" />
        </svg>
      </div>

      {/* Copy */}
      <div className="pointer-events-none absolute inset-x-0 top-0 flex items-start justify-between p-6 font-mono text-[10px] uppercase tracking-hud text-bone/50 md:p-8">
        <span>Hive Akshat</span>
        <span className="hidden sm:inline">Ajmer · Rajasthan</span>
      </div>

      <div
        className="pointer-events-none absolute inset-x-0 bottom-0 flex flex-col items-center px-6 pb-24 text-center md:pb-20"
        style={{ opacity: phase === "dark" ? 1 : 0, transition: "opacity 600ms" }}
      >
        <p className="font-display text-3xl italic text-bone/90 md:text-5xl">Every journey begins in the dark.</p>
        <p className="mt-5 font-mono text-[10px] uppercase tracking-hud text-bone/50">
          {touched ? "Keep holding…" : (
            <>
              <span className="hidden md:inline">Move to look around · </span>Press &amp; hold to light the diya
            </>
          )}
        </p>
      </div>

      <div className="pointer-events-none absolute bottom-6 left-6 hidden font-mono text-[10px] uppercase tracking-hud text-bone/35 md:block md:bottom-8 md:left-8">
        {shot.place} · {fmtCoords(shot.lat, shot.lon)} · {fmtTakenTime(shot.exif.taken)} IST
      </div>

      <button
        data-intro-skip
        onClick={finish}
        className="absolute bottom-6 right-6 font-mono text-[10px] uppercase tracking-hud text-bone/50 transition-colors hover:text-saffron md:bottom-8 md:right-8"
      >
        Skip intro →
      </button>
    </div>
  );
}
