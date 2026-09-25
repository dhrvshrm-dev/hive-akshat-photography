"use client";
// The journeys, as a reel you travel along. The section pins, and scrolling
// down moves you sideways through the trips over a drifting topographic map,
// with a route tracker along the bottom showing where you are on the road.
// Works the same with a finger: vertical swipes drive the sideways travel.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, useReducedMotion, useScroll, useSpring, useTransform } from "framer-motion";
import GLContours from "@/components/webgl/GLContours";
import { journeys } from "@/data/journeys";
import { photo } from "@/data/photos";
import { fmtCoords } from "@/lib/format";

const featured = journeys.filter((j) => j.featured);

function Panel({ j, i, progress, count }) {
  const p = photo(j.cover);
  // Each photo slides a little against its card — depth, like looking out of a
  // moving window.
  const center = (i + 1) / (count + 1);
  const imgX = useTransform(progress, [center - 0.5, center + 0.5], ["-12%", "12%"]);
  return (
    <Link
      href={`/journeys#${j.slug}`}
      data-cursor="Open"
      className="group relative block h-[62svh] w-[82vw] shrink-0 overflow-hidden bg-soot sm:w-[60vw] lg:w-[46vw]"
    >
      <motion.div className="absolute inset-y-0 -left-[14%] -right-[14%]" style={{ x: imgX }}>
        <Image
          src={p.src}
          alt={`${p.title} — ${p.place}`}
          fill
          sizes="(min-width: 1024px) 60vw, 100vw"
          className="object-cover transition-transform duration-[1.4s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.04]"
        />
      </motion.div>
      <div className="absolute inset-0 bg-gradient-to-t from-night/90 via-night/20 to-transparent" />
      <div className="brackets absolute inset-3 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ "--c": "#F0782D" }} />
      <div className="absolute inset-x-0 top-0 flex justify-between p-5 font-mono text-[10px] uppercase tracking-hud text-bone/70">
        <span>{String(i + 1).padStart(2, "0")} / {String(count).padStart(2, "0")}</span>
        <span>{j.season}</span>
      </div>
      <div className="absolute inset-x-0 bottom-0 p-5 md:p-7">
        <p className="font-display text-lg italic text-ember">{j.kicker}</p>
        <h3 className="mt-1 font-display text-4xl leading-none text-bone md:text-6xl">{j.name}</h3>
        <div className="mt-4 flex flex-wrap items-center gap-x-5 gap-y-1 font-mono text-[10px] uppercase tracking-hud text-bone/60">
          <span>{fmtCoords(j.lat, j.lon)}</span>
          <span>Best light {j.bestLight.split(" · ")[0]}</span>
          <span className="text-saffron opacity-0 transition-opacity group-hover:opacity-100">Open journey →</span>
        </div>
      </div>
    </Link>
  );
}

export default function JourneyReel() {
  const sectionRef = useRef(null);
  const trackRef = useRef(null);
  const reduce = useReducedMotion();
  const [distance, setDistance] = useState(0);

  const { scrollYProgress } = useScroll({ target: sectionRef, offset: ["start start", "end end"] });
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, restDelta: 0.0005 });
  const x = useTransform(progress, [0, 1], [0, -distance]);
  const marker = useTransform(progress, (v) => `${v * 100}%`);

  useEffect(() => {
    const measure = () => {
      const track = trackRef.current;
      if (!track) return;
      setDistance(Math.max(0, track.scrollWidth - window.innerWidth));
    };
    measure();
    window.addEventListener("resize", measure);
    const t = setTimeout(measure, 500);
    return () => {
      window.removeEventListener("resize", measure);
      clearTimeout(t);
    };
  }, []);

  const count = featured.length;

  return (
    <section
      ref={sectionRef}
      className="relative bg-night"
      // Tall enough that the sideways distance travelled feels like a scroll,
      // not a flick.
      style={{ height: reduce ? "auto" : `${Math.max(250, count * 70)}svh` }}
    >
      <div className={`${reduce ? "relative py-24" : "sticky top-0 h-[100svh]"} overflow-hidden`}>
        <GLContours className="absolute inset-0" density={8} opacity={0.1} />

        <div className="relative z-[2] flex h-full flex-col justify-center">
          <motion.div
            ref={trackRef}
            className={`flex items-center gap-5 px-5 md:gap-8 md:px-12 ${reduce ? "no-scrollbar overflow-x-auto" : ""}`}
            style={{ x: reduce ? 0 : x }}
          >
            {/* Intro panel */}
            <div className="flex h-[62svh] w-[78vw] shrink-0 flex-col justify-between sm:w-[44vw] lg:w-[30vw]">
              <p className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/50">
                <span className="text-saffron">03</span>
                <span className="h-px w-8 bg-bone/25" />
                Journeys
              </p>
              <div>
                <h2 className="font-display text-fluid-lg text-bone">
                  {journeys.length} journeys.
                  <br />
                  <span className="italic text-ember">One road.</span>
                </h2>
                <p className="mt-6 max-w-sm text-bone/60">
                  From the ghats of Pushkar to 5,430 metres in North Sikkim. Keep scrolling — the road goes sideways.
                </p>
              </div>
              <p className="font-mono text-[10px] uppercase tracking-hud text-bone/40">Scroll →</p>
            </div>

            {featured.map((j, i) => (
              <Panel key={j.slug} j={j} i={i} count={count} progress={progress} />
            ))}

            {/* Outro panel */}
            <Link
              href="/journeys"
              className="group flex h-[62svh] w-[70vw] shrink-0 flex-col items-center justify-center border border-line text-center transition-colors hover:border-saffron sm:w-[36vw] lg:w-[26vw]"
            >
              <span className="font-mono text-[10px] uppercase tracking-hud text-bone/50">The full map</span>
              <span className="mt-4 font-display text-5xl text-bone transition-colors group-hover:text-saffron">All journeys →</span>
            </Link>
          </motion.div>

          {/* Route tracker */}
          {!reduce && (
            <div className="absolute inset-x-5 bottom-8 md:inset-x-12 md:bottom-10">
              <div className="relative h-px bg-bone/15">
                <motion.div className="absolute inset-y-0 left-0 bg-saffron" style={{ width: marker }} />
                {featured.map((j, i) => (
                  <span
                    key={j.slug}
                    className="absolute top-1/2 -translate-x-1/2 -translate-y-1/2"
                    style={{ left: `${((i + 1) / (count + 1)) * 100}%` }}
                  >
                    <span className="block h-1.5 w-1.5 rounded-full bg-bone/50" />
                    <span className="absolute left-1/2 top-3 hidden -translate-x-1/2 whitespace-nowrap font-mono text-[9px] uppercase tracking-hud text-bone/40 md:block">
                      {j.name.split(" ")[0]}
                    </span>
                  </span>
                ))}
                <motion.span
                  className="absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full border border-saffron bg-night"
                  style={{ left: marker }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
