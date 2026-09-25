"use client";
// Full-screen playback, styled as a camera's review screen: the frame, its EXIF,
// where it was made, and a live RGB histogram computed from the actual pixels
// of the photograph on screen. Keyboard arrows, swipe, and Escape all work.
import { useCallback, useEffect, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "@/lib/motion";
import { lockScroll, unlockScroll } from "@/lib/scroll";
import { fmtAlt, fmtCoords, fmtTaken, fmtTakenTime } from "@/lib/format";

/** Reads the image into a small canvas and bins its channels. Same-origin only. */
function useHistogram(src) {
  const [bins, setBins] = useState(null);
  useEffect(() => {
    if (!src) return;
    let cancelled = false;
    const img = new window.Image();
    img.decoding = "async";
    img.onload = () => {
      if (cancelled) return;
      try {
        const w = 160;
        const h = Math.round((img.height / img.width) * w) || 100;
        const c = document.createElement("canvas");
        c.width = w;
        c.height = h;
        const ctx = c.getContext("2d", { willReadFrequently: true });
        ctx.drawImage(img, 0, 0, w, h);
        const data = ctx.getImageData(0, 0, w, h).data;
        const N = 64;
        const r = new Array(N).fill(0);
        const g = new Array(N).fill(0);
        const b = new Array(N).fill(0);
        for (let i = 0; i < data.length; i += 4) {
          r[data[i] >> 2]++;
          g[data[i + 1] >> 2]++;
          b[data[i + 2] >> 2]++;
        }
        const max = Math.max(...r, ...g, ...b) || 1;
        setBins({ r: r.map((v) => v / max), g: g.map((v) => v / max), b: b.map((v) => v / max) });
      } catch {
        setBins(null);
      }
    };
    img.src = src;
    return () => {
      cancelled = true;
    };
  }, [src]);
  return bins;
}

function Histogram({ src }) {
  const bins = useHistogram(src);
  const path = (arr) =>
    arr ? "M0 40 " + arr.map((v, i) => `L${(i / (arr.length - 1)) * 160} ${40 - v * 38}`).join(" ") + " L160 40 Z" : "";
  return (
    <svg viewBox="0 0 160 40" className="h-12 w-full border-b border-bone/15" preserveAspectRatio="none" aria-hidden="true">
      {bins && (
        <g style={{ mixBlendMode: "screen" }}>
          <path d={path(bins.r)} fill="rgba(240,90,60,0.55)" />
          <path d={path(bins.g)} fill="rgba(90,200,110,0.45)" />
          <path d={path(bins.b)} fill="rgba(80,130,240,0.5)" />
        </g>
      )}
    </svg>
  );
}

export default function Lightbox({ items, index, onClose, onStep }) {
  const open = index != null && index >= 0 && items[index];
  const item = open ? items[index] : null;
  const [dir, setDir] = useState(1);
  const touch = useRef(null);

  const step = useCallback(
    (d) => {
      setDir(d);
      onStep(d);
    },
    [onStep]
  );

  useEffect(() => {
    if (!open) return;
    const onKey = (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") step(-1);
      if (e.key === "ArrowRight") step(1);
    };
    window.addEventListener("keydown", onKey);
    lockScroll("lightbox");
    return () => {
      window.removeEventListener("keydown", onKey);
      unlockScroll("lightbox");
    };
  }, [open, onClose, step]);

  const e = item?.exif || {};

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[130] flex flex-col bg-night/97 backdrop-blur-sm lg:flex-row"
          onClick={onClose}
          data-lenis-prevent
          role="dialog"
          aria-label={`${item.title} — ${item.place}`}
        >
          {/* The frame */}
          <div
            className="relative flex-1"
            onTouchStart={(ev) => (touch.current = ev.touches[0].clientX)}
            onTouchEnd={(ev) => {
              if (touch.current == null) return;
              const dx = ev.changedTouches[0].clientX - touch.current;
              if (Math.abs(dx) > 50) step(dx < 0 ? 1 : -1);
              touch.current = null;
            }}
          >
            <AnimatePresence initial={false} custom={dir}>
              <motion.div
                key={item.id}
                className="absolute inset-4 md:inset-10"
                initial={{ opacity: 0, x: dir * 40, filter: "blur(16px)" }}
                animate={{ opacity: 1, x: 0, filter: ["blur(16px)", "blur(1px)", "blur(4px)", "blur(0px)"] }}
                exit={{ opacity: 0, x: dir * -40, filter: "blur(10px)", transition: { duration: 0.3 } }}
                transition={{ duration: 0.8, ease, filter: { duration: 0.9, times: [0, 0.5, 0.75, 1] } }}
              >
                <Image src={item.src} alt={`${item.title} — ${item.place}`} fill sizes="(min-width:1024px) 75vw, 100vw" className="object-contain" onClick={(ev) => ev.stopPropagation()} />
              </motion.div>
            </AnimatePresence>
            <div className="brackets pointer-events-none absolute inset-4 md:inset-10" style={{ "--c": "rgba(237,230,218,0.3)" }} />
            <button
              onClick={(ev) => { ev.stopPropagation(); step(-1); }}
              className="absolute left-0 top-0 hidden h-full w-1/4 md:block"
              aria-label="Previous frame"
              data-cursor="Prev"
            />
            <button
              onClick={(ev) => { ev.stopPropagation(); step(1); }}
              className="absolute right-0 top-0 hidden h-full w-1/4 md:block"
              aria-label="Next frame"
              data-cursor="Next"
            />
          </div>

          {/* The review panel */}
          <aside
            className="shrink-0 border-t border-line bg-soot/80 p-5 font-mono text-[10px] uppercase tracking-hud text-bone/70 lg:w-80 lg:border-l lg:border-t-0 lg:p-8"
            onClick={(ev) => ev.stopPropagation()}
          >
            <div className="flex items-center justify-between text-bone/50">
              <span>▶ {String(index + 1).padStart(3, "0")} / {String(items.length).padStart(3, "0")}</span>
              <button onClick={onClose} className="text-bone hover:text-saffron" aria-label="Close">
                Close ✕
              </button>
            </div>
            <h2 className="mt-5 font-display text-2xl normal-case tracking-normal text-bone lg:mt-8 lg:text-3xl">{item.title}</h2>
            <p className="mt-2 text-bone/60">{item.place}, {item.region}</p>

            <div className="mt-5 hidden lg:block">
              <Histogram src={item.src} />
            </div>

            <dl className="mt-5 grid grid-cols-4 gap-x-4 gap-y-3 lg:mt-6 lg:grid-cols-2">
              {[
                ["Shutter", e.shutter],
                ["Aperture", e.aperture],
                ["ISO", e.iso],
                ["Focal", e.focal],
                ["GPS", fmtCoords(item.lat, item.lon), "col-span-2"],
                ["Alt", fmtAlt(item.alt)],
                ["Time", fmtTakenTime(e.taken)],
                ["Body", e.camera, "col-span-2 hidden lg:block"],
                ["Date", fmtTaken(e.taken), "hidden lg:block"],
              ].map(([k, v, cls]) => (
                <div key={k} className={cls || ""}>
                  <dt className="text-[9px] text-bone/35">{k}</dt>
                  <dd className="mt-0.5 text-bone">{v ?? "—"}</dd>
                </div>
              ))}
            </dl>

            <p className="mt-6 hidden normal-case tracking-normal text-bone/35 lg:block">
              Photo: {item.credit?.author} · {item.credit?.license}
            </p>
            <p className="mt-4 hidden text-bone/30 lg:block">← → to browse · Esc to close</p>
          </aside>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
