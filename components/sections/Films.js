"use client";
// Drone and wildlife films.
//
// One big screen and a reel beside it. The screen wears the overlay of the
// camera that shot the film — a drone's OSD (altitude, speed, distance, a
// compass tape that drifts, a running timecode) or a camcorder's REC display —
// and racks focus whenever you pick another film from the reel.
//
// Nothing from YouTube is loaded until someone presses play: the cards use a
// poster, and the player is a youtube-nocookie iframe mounted inside a full-
// screen "cinema" with letterbox bars. The page stays as fast as it was.
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useInView, useReducedMotion } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import FocusImage from "@/components/ui/FocusImage";
import { films } from "@/data/films";
import { photo } from "@/data/photos";
import { ease } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll";

const posterOf = (f) =>
  f.youtube && !f.usePoster
    ? { id: `yt-${f.youtube}`, src: `https://i.ytimg.com/vi/${f.youtube}/maxresdefault.jpg`, title: f.title, place: f.place }
    : photo(f.poster);

/** A timecode that runs while the screen is on screen. */
function useTimecode(active) {
  const [t, setT] = useState(0);
  useEffect(() => {
    if (!active) return;
    const start = performance.now() - t * 1000;
    const id = setInterval(() => setT((performance.now() - start) / 1000), 1000 / 25);
    return () => clearInterval(id);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);
  const f = Math.floor((t % 1) * 25);
  const s = Math.floor(t) % 60;
  const m = Math.floor(t / 60) % 60;
  const p = (n) => String(n).padStart(2, "0");
  return `00:${p(m)}:${p(s)}:${p(f)}`;
}

function DroneOSD({ f, running }) {
  const tc = useTimecode(running);
  const reduce = useReducedMotion();
  const o = f.osd || {};
  const ticks = Array.from({ length: 49 }, (_, i) => i * 15);
  const dirs = { 0: "N", 90: "E", 180: "S", 270: "W", 360: "N", 450: "E", 540: "S", 630: "W", 720: "N" };
  return (
    <div className="pointer-events-none absolute inset-0 font-mono text-[10px] uppercase tracking-hud text-bone">
      <div className="absolute inset-x-4 top-4 flex items-center justify-between md:inset-x-6 md:top-6">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff3b30]" /> {tc}
        </span>
        <span className="hidden gap-4 sm:flex">
          <span>4K · 30</span>
          <span className="text-bone/60">GPS ▮▮▮▮</span>
          <span>▮▮▮▯ 78%</span>
        </span>
      </div>
      {/* Centre reticle + horizon */}
      <div className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2">
        <span className="absolute -left-16 top-0 h-px w-10 bg-bone/70" />
        <span className="absolute left-6 top-0 h-px w-10 bg-bone/70" />
        <span className="absolute -left-1.5 -top-1.5 h-3 w-3 rounded-full border border-bone/80" />
      </div>
      {/* Compass tape */}
      <div className="absolute left-1/2 top-12 hidden w-64 -translate-x-1/2 overflow-hidden md:top-16 md:block" style={{ maskImage: "linear-gradient(90deg, transparent, #000 20%, #000 80%, transparent)" }}>
        <motion.div
          className="flex w-max"
          animate={running && !reduce ? { x: [-240, -480] } : { x: -240 }}
          transition={{ duration: 40, repeat: Infinity, ease: "linear" }}
        >
          {ticks.map((d) => (
            <span key={d} className="flex w-5 flex-col items-center text-[8px] text-bone/70">
              <span className={`w-px bg-bone/60 ${d % 45 === 0 ? "h-2.5" : "h-1.5"}`} />
              <span className="mt-0.5 h-3">{dirs[d] || ""}</span>
            </span>
          ))}
        </motion.div>
        <span className="absolute left-1/2 top-0 h-3 w-px bg-saffron" />
      </div>
      <div className="absolute bottom-4 left-4 space-y-1 md:bottom-6 md:left-6">
        <p>ALT <span className="text-saffron">{o.alt ?? "—"} m</span></p>
        <p>H.S <span className="text-bone/80">{o.speed ?? "—"} m/s</span></p>
        <p>D <span className="text-bone/80">{o.dist ?? "—"} km</span></p>
      </div>
    </div>
  );
}

function CamcorderOSD({ f, running }) {
  const tc = useTimecode(running);
  return (
    <div className="pointer-events-none absolute inset-0 font-mono text-[10px] uppercase tracking-hud text-bone">
      <div className="brackets absolute inset-4 md:inset-6" style={{ "--c": "rgba(237,230,218,0.6)", "--b": "26px" }} />
      <div className="absolute inset-x-7 top-7 flex items-center justify-between md:inset-x-10 md:top-10">
        <span className="flex items-center gap-2">
          <span className="h-2 w-2 animate-pulse rounded-full bg-[#ff3b30]" /> REC
        </span>
        <span>{tc}</span>
      </div>
      <div className="absolute bottom-7 left-7 flex gap-5 md:bottom-10 md:left-10">
        <span>{f.lens || "—"}</span>
        <span className="text-bone/60">1/1000 · f/5.6</span>
        <span className="hidden text-bone/60 sm:inline">AF-C · Subject: Animal</span>
      </div>
    </div>
  );
}

function Player({ film, onClose }) {
  useEffect(() => {
    if (!film) return;
    lockScroll("film");
    const onKey = (e) => e.key === "Escape" && onClose();
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll("film");
      window.removeEventListener("keydown", onKey);
    };
  }, [film, onClose]);

  return (
    <AnimatePresence>
      {film && (
        <motion.div
          className="fixed inset-0 z-[140] flex items-center justify-center bg-black"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0, transition: { delay: 0.25, duration: 0.3 } }}
          onClick={onClose}
          role="dialog"
          aria-label={`${film.title} — film`}
          data-lenis-prevent
        >
          {/* Letterbox bars close in, cinema style */}
          <motion.span className="absolute inset-x-0 top-0 z-10 h-[8vh] bg-black" initial={{ y: "-100%" }} animate={{ y: 0 }} exit={{ y: "-100%" }} transition={{ duration: 0.5, ease }} />
          <motion.span className="absolute inset-x-0 bottom-0 z-10 h-[8vh] bg-black" initial={{ y: "100%" }} animate={{ y: 0 }} exit={{ y: "100%" }} transition={{ duration: 0.5, ease }} />
          <motion.div
            className="relative aspect-video w-full max-w-[min(100vw,calc(84vh*16/9))]"
            initial={{ scale: 0.94, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.96, opacity: 0 }}
            transition={{ duration: 0.6, ease, delay: 0.15 }}
            onClick={(e) => e.stopPropagation()}
          >
            {film.youtube ? (
              <iframe
                className="absolute inset-0 h-full w-full"
                src={`https://www.youtube-nocookie.com/embed/${film.youtube}?autoplay=1&rel=0&modestbranding=1&playsinline=1`}
                title={film.title}
                allow="autoplay; encrypted-media; picture-in-picture; fullscreen"
                allowFullScreen
              />
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 bg-soot text-center">
                <p className="font-mono text-[10px] uppercase tracking-hud text-saffron">● Film coming soon</p>
                <p className="font-display text-3xl text-bone">{film.title}</p>
                <p className="max-w-xs text-sm text-bone/50">Add the YouTube ID for this film in data/films.js.</p>
              </div>
            )}
          </motion.div>
          <div className="absolute inset-x-0 bottom-[calc(8vh+0.75rem)] z-20 flex items-center justify-between px-5 font-mono text-[10px] uppercase tracking-hud text-bone/60 md:px-10">
            <span>
              {film.kind} · {film.title} · {film.place}
            </span>
            <button onClick={onClose} className="text-bone hover:text-saffron">
              Close ✕
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

export default function Films() {
  const [active, setActive] = useState(0);
  const [playing, setPlaying] = useState(null);
  const close = useCallback(() => setPlaying(null), []);
  const screenRef = useRef(null);
  const inView = useInView(screenRef, { margin: "-20%" });
  const f = films[active];
  const poster = posterOf(f);

  return (
    <section id="films" className="relative scroll-mt-20 bg-night py-28 md:py-40">
      <Container>
        <SectionHeading
          index="04"
          eyebrow="Films · Drone & wildlife"
          title={[{ text: "From the air," }, { text: "and from the long grass.", emphasis: true }]}
        />
      </Container>

      <div className="mx-auto mt-14 grid max-w-[110rem] gap-8 px-5 md:mt-20 md:px-12 lg:grid-cols-[1.7fr_1fr] lg:gap-12">
        {/* The screen */}
        <button
          ref={screenRef}
          onClick={() => setPlaying(f)}
          data-cursor="Play"
          aria-label={`Play ${f.title}`}
          className="group relative block aspect-video w-full min-w-0 overflow-hidden bg-soot text-left"
        >
          <FocusImage p={poster} sizes="(min-width:1024px) 62vw, 100vw" className="absolute inset-0" />
          <div className="absolute inset-0 bg-gradient-to-t from-night/70 via-night/10 to-night/30" />
          <AnimatePresence mode="wait">
            <motion.div key={active} className="absolute inset-0" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} transition={{ duration: 0.3 }}>
              {f.kind === "Drone" ? <DroneOSD f={f} running={inView} /> : <CamcorderOSD f={f} running={inView} />}
            </motion.div>
          </AnimatePresence>
          {/* Play */}
          <span className="absolute left-1/2 top-1/2 flex h-20 w-20 -translate-x-1/2 -translate-y-1/2 items-center justify-center md:h-24 md:w-24">
            <span className="absolute inset-0 rounded-full border border-bone/50 transition-transform duration-500 group-hover:scale-110" />
            <span className="absolute inset-0 animate-ping rounded-full border border-saffron/40 [animation-duration:2.4s]" />
            <svg viewBox="0 0 24 24" className="ml-1 h-7 w-7 fill-bone transition-colors group-hover:fill-saffron" aria-hidden="true">
              <path d="M7 4.5v15l13-7.5z" />
            </svg>
          </span>
          {/* Desktop only: on a phone the reel right below already names the film,
              and here it would sit on top of the drone readouts. */}
          <span className="absolute inset-x-0 bottom-0 hidden items-end justify-between gap-4 p-4 md:flex md:p-6">
            <span className="hidden md:block" />
            <span className="text-right">
              <span className="block font-display text-2xl text-bone md:text-4xl">{f.title}</span>
              <span className="mt-1 block font-mono text-[10px] uppercase tracking-hud text-bone/60">
                {f.place} · {f.duration}
              </span>
            </span>
          </span>
        </button>

        {/* The reel */}
        <ol className="no-scrollbar -mx-5 flex min-w-0 snap-x gap-3 overflow-x-auto px-5 lg:mx-0 lg:block lg:space-y-0 lg:overflow-visible lg:border-t lg:border-line lg:px-0">
          {films.map((film, i) => {
            const p = posterOf(film);
            const on = i === active;
            return (
              <li key={film.title} className="w-[62vw] shrink-0 snap-start sm:w-[38vw] lg:w-auto lg:border-b lg:border-line">
                <button
                  onClick={() => (on ? setPlaying(film) : setActive(i))}
                  onMouseEnter={() => window.matchMedia("(pointer: fine)").matches && setActive(i)}
                  className="group flex w-full flex-col gap-3 text-left lg:flex-row lg:items-center lg:gap-5 lg:py-4"
                >
                  <span className={`relative block aspect-video w-full shrink-0 overflow-hidden bg-soot transition-opacity lg:w-36 ${on ? "opacity-100" : "opacity-60 group-hover:opacity-100"}`}>
                    <Image src={p.src} alt="" fill sizes="(min-width:1024px) 144px, 62vw" className="object-cover" />
                    {on && <span className="brackets absolute inset-1.5" style={{ "--c": "#F0782D", "--b": "10px" }} />}
                  </span>
                  <span className="min-w-0">
                    <span className={`block font-mono text-[9px] uppercase tracking-hud ${on ? "text-saffron" : "text-bone/40"}`}>
                      {String(i + 1).padStart(2, "0")} · {film.kind} · {film.duration}
                    </span>
                    <span className={`mt-1 block font-display text-xl leading-tight transition-colors ${on ? "text-bone" : "text-bone/60 group-hover:text-bone"}`}>
                      {film.title}
                    </span>
                    <span className="mt-0.5 block truncate text-sm text-bone/40">{film.place}</span>
                  </span>
                </button>
              </li>
            );
          })}
        </ol>
      </div>

      <Player film={playing} onClose={close} />
    </section>
  );
}
