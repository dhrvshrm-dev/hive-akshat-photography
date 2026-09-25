"use client";
// One journey, told as a chapter.
//
// Desktop: the photograph is held in a sticky viewfinder on the left while the
// field notes and the chapter's frames scroll past on the right; as each frame
// crosses the middle of the screen the viewfinder racks focus onto it.
// Phone: no sticky trickery — the cover, the notes, then a swipeable strip of
// frames that snap into place and pull focus as they arrive.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import FocusImage from "@/components/ui/FocusImage";
import Readout from "@/components/ui/Readout";
import Reveal from "@/components/ui/Reveal";
import Lightbox from "@/components/gallery/Lightbox";
import { photo } from "@/data/photos";
import { fmtAlt, fmtCoords, fmtTakenTime } from "@/lib/format";

function FrameTrigger({ onActive, children }) {
  const ref = useRef(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // A thin band across the middle of the viewport: whichever frame is in it
    // is the one in the viewfinder.
    const io = new IntersectionObserver(([e]) => e.isIntersecting && onActive(), { rootMargin: "-45% 0px -45% 0px" });
    io.observe(el);
    return () => io.disconnect();
  }, [onActive]);
  return <div ref={ref}>{children}</div>;
}

export default function JourneyChapter({ j, index, total }) {
  const frames = [j.cover, ...j.frames].map(photo);
  const [current, setCurrent] = useState(0);
  const [open, setOpen] = useState(null);
  const p = frames[current];
  const e = p.exif;

  return (
    <section id={j.slug} className="relative scroll-mt-24 border-t border-line bg-night py-20 md:py-28">
      <div className="mx-auto max-w-[110rem] px-5 md:px-12">
        {/* Chapter header */}
        <div className="mb-10 flex items-end justify-between gap-6 md:mb-16">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-hud text-bone/50">
              <span className="text-saffron">Chapter {String(index + 1).padStart(2, "0")}</span> / {String(total).padStart(2, "0")} · {j.region}
            </p>
            <Reveal>
              <h2 className="mt-4 font-display text-fluid-lg text-bone">{j.name}</h2>
              <p className="mt-2 font-display text-xl italic text-ember md:text-2xl">{j.kicker}</p>
            </Reveal>
          </div>
          <p className="hidden text-right font-mono text-[10px] uppercase tracking-hud text-bone/40 md:block">
            {fmtCoords(j.lat, j.lon)}
            <br />
            {frames.length} frames
          </p>
        </div>

        <div className="grid gap-10 lg:grid-cols-[1.35fr_1fr] lg:gap-16">
          {/* Viewfinder (sticky on desktop) */}
          <div className="min-w-0 lg:sticky lg:top-24 lg:h-[calc(100svh-8rem)] lg:self-start">
            <button
              onClick={() => setOpen(current)}
              data-cursor="Review"
              className="group relative block aspect-[4/5] w-full overflow-hidden bg-soot sm:aspect-[3/2] lg:aspect-auto lg:h-full"
            >
              <div className="hidden h-full w-full lg:block">
                <FocusImage p={p} sizes="(min-width:1024px) 58vw, 100vw" className="absolute inset-0" />
              </div>
              <div className="h-full w-full lg:hidden">
                <FocusImage p={frames[0]} inView sizes="100vw" className="absolute inset-0" />
              </div>
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/70 via-transparent to-transparent" />
              <div className="brackets pointer-events-none absolute inset-3 md:inset-5" style={{ "--c": "rgba(237,230,218,0.55)" }} />
              {/* AF box on the subject */}
              <motion.span
                className="brackets pointer-events-none absolute -ml-7 -mt-7 hidden h-14 w-14 lg:block"
                style={{ "--c": "#F0782D", "--b": "10px", "--t": "1.5px" }}
                animate={{ left: `${p.focus[0] * 100}%`, top: `${p.focus[1] * 100}%`, scale: [1.3, 0.9, 1.05, 1] }}
                transition={{ duration: 0.9, times: [0, 0.5, 0.75, 1] }}
                key={`af-${p.id}`}
              />
              <div className="pointer-events-none absolute inset-x-4 bottom-4 flex flex-wrap items-end justify-between gap-2 font-mono text-[10px] uppercase tracking-hud text-bone/80 md:inset-x-6 md:bottom-6">
                <span className="flex gap-4">
                  <Readout value={e.shutter || "—"} className="text-bone" />
                  <Readout value={e.aperture || "—"} className="text-bone" />
                  <Readout value={e.iso ? `ISO ${e.iso}` : "ISO —"} />
                </span>
                <span className="hidden lg:inline">
                  <Readout value={`${p.title} · ${fmtTakenTime(e.taken) || "--:--"}`} />
                </span>
              </div>
            </button>
          </div>

          {/* Notes + frames */}
          {/* min-w-0: the phone strip below scrolls sideways, and without it the
              grid column would grow to the strip's full width. */}
          <div className="min-w-0">
            <Reveal>
              <p className="font-display text-2xl leading-snug text-bone/90 md:text-[1.7rem]">{j.note}</p>
            </Reveal>
            <Reveal delay={0.1}>
              <dl className="mt-10 grid grid-cols-2 gap-px bg-line font-mono text-[10px] uppercase tracking-hud">
                {[
                  ["Season", j.season],
                  ["Best light", j.bestLight],
                  ["Altitude", fmtAlt(frames[0].alt)],
                  ["Coordinates", fmtCoords(j.lat, j.lon)],
                ].map(([k, v]) => (
                  <div key={k} className="bg-night p-4">
                    <dt className="text-bone/40">{k}</dt>
                    <dd className="mt-1.5 text-bone">{v}</dd>
                  </div>
                ))}
              </dl>
            </Reveal>

            {/* Desktop: scroll-driven frame list */}
            <div className="mt-16 hidden space-y-[30vh] pb-[30vh] lg:block">
              {frames.map((f, i) => (
                <FrameTrigger key={f.id} onActive={() => setCurrent(i)}>
                  <button
                    onClick={() => setOpen(i)}
                    className={`group flex w-full items-center gap-5 text-left transition-opacity duration-500 ${current === i ? "opacity-100" : "opacity-40 hover:opacity-80"}`}
                  >
                    <span className="relative h-24 w-32 shrink-0 overflow-hidden bg-soot">
                      <Image src={f.src} alt="" fill sizes="128px" className="object-cover" />
                    </span>
                    <span>
                      <span className={`block font-mono text-[10px] tracking-hud ${current === i ? "text-saffron" : "text-bone/40"}`}>
                        {String(i + 1).padStart(2, "0")} {current === i ? "● In focus" : ""}
                      </span>
                      <span className="mt-1 block font-display text-2xl text-bone">{f.title}</span>
                      <span className="mt-1 block font-mono text-[10px] uppercase tracking-hud text-bone/45">
                        {f.place} · {f.discipline}
                      </span>
                    </span>
                  </button>
                </FrameTrigger>
              ))}
            </div>

            {/* Phone: swipeable strip */}
            {frames.length > 1 && (
              <div className="no-scrollbar -mx-5 mt-10 flex snap-x snap-mandatory gap-3 overflow-x-auto px-5 lg:hidden">
                {frames.slice(1).map((f, i) => (
                  <button key={f.id} onClick={() => setOpen(i + 1)} className="w-[72vw] shrink-0 snap-center text-left sm:w-[44vw]">
                    <FocusImage p={f} inView sizes="72vw" className="relative aspect-[4/5]" />
                    <span className="mt-3 block font-display text-lg text-bone">{f.title}</span>
                    <span className="block font-mono text-[9px] uppercase tracking-hud text-bone/45">
                      {f.exif.shutter || ""} {f.exif.aperture || ""} · {f.place}
                    </span>
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Lightbox
        items={frames}
        index={open}
        onClose={() => setOpen(null)}
        onStep={(d) => setOpen((v) => (v + d + frames.length) % frames.length)}
      />
    </section>
  );
}
