"use client";
// The expedition map. India draws itself in as a single line, then the route
// is traced between the journeys in the order they were travelled, and the pins
// light up one by one. Every photograph in the archive is a faint dot where it
// was made. Hover (or tap) a pin or a list entry and the two light up together
// with a preview of that journey's cover; click to go to its chapter.
import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import { INDIA, project } from "@/data/indiaMap";
import { journeys } from "@/data/journeys";
import { photo, photos } from "@/data/photos";
import { site } from "@/data/site";
import { fmtCoords } from "@/lib/format";
import { scrollToTarget } from "@/lib/scroll";
import { ease } from "@/lib/motion";

// Catmull-Rom through the pins, as cubic Béziers — a road, not a zig-zag.
function smoothPath(pts) {
  if (pts.length < 2) return "";
  let d = `M${pts[0][0]} ${pts[0][1]}`;
  for (let i = 0; i < pts.length - 1; i++) {
    const p0 = pts[i - 1] || pts[i];
    const p1 = pts[i];
    const p2 = pts[i + 1];
    const p3 = pts[i + 2] || p2;
    const c1 = [p1[0] + (p2[0] - p0[0]) / 6, p1[1] + (p2[1] - p0[1]) / 6];
    const c2 = [p2[0] - (p3[0] - p1[0]) / 6, p2[1] - (p3[1] - p1[1]) / 6];
    d += ` C${c1[0].toFixed(1)} ${c1[1].toFixed(1)} ${c2[0].toFixed(1)} ${c2[1].toFixed(1)} ${p2[0].toFixed(1)} ${p2[1].toFixed(1)}`;
  }
  return d;
}

const PAD = 40;

export default function JourneysMap() {
  const reduce = useReducedMotion();
  const [active, setActive] = useState(null);

  const pins = useMemo(() => journeys.map((j) => ({ ...j, xy: project(j.lat, j.lon) })), []);
  const base = project(site.base.lat, site.base.lon);
  const route = useMemo(() => smoothPath([base, ...pins.map((p) => p.xy)]), [pins, base]);
  const dots = useMemo(
    () => photos.filter((p) => p.archive !== false).map((p) => ({ id: p.id, xy: project(p.lat, p.lon) })),
    []
  );

  const go = (slug) => scrollToTarget(`#${slug}`);
  const draw = (delay, duration) =>
    reduce
      ? {}
      : {
          initial: { pathLength: 0 },
          whileInView: { pathLength: 1 },
          viewport: { once: true, margin: "-10%" },
          transition: { delay, duration, ease: "easeInOut" },
        };

  const activeJ = active != null ? pins[active] : null;

  return (
    <div className="grid items-center gap-10 lg:grid-cols-[0.8fr_1.2fr]">
      {/* The list */}
      <ol className="order-2 border-t border-line lg:order-1">
        {pins.map((j, i) => (
          <li key={j.slug} className="border-b border-line">
            <button
              onClick={() => go(j.slug)}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onFocus={() => setActive(i)}
              onBlur={() => setActive(null)}
              className="group flex w-full items-baseline justify-between gap-4 py-4 text-left"
            >
              <span className="flex items-baseline gap-4">
                <span className={`font-mono text-[10px] ${active === i ? "text-saffron" : "text-bone/40"}`}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span className={`font-display text-2xl transition-colors md:text-3xl ${active === i ? "text-saffron" : "text-bone"}`}>
                  {j.name}
                </span>
              </span>
              <span className="hidden font-mono text-[10px] uppercase tracking-hud text-bone/40 sm:inline">{j.season}</span>
            </button>
          </li>
        ))}
      </ol>

      {/* The map */}
      <div className="relative order-1 mx-auto w-full max-w-[640px] lg:order-2">
        <svg
          viewBox={`${-PAD} ${-PAD} ${INDIA.width + PAD * 2} ${INDIA.height + PAD * 2}`}
          className="h-auto w-full overflow-visible"
          role="img"
          aria-label="Map of India with the route between each journey"
        >
          <motion.path
            d={INDIA.d}
            fill="rgba(237,230,218,0.025)"
            stroke="rgba(237,230,218,0.45)"
            strokeWidth="1.2"
            vectorEffect="non-scaling-stroke"
            {...draw(0, 2.6)}
          />
          {/* Latitude lines, like a survey sheet */}
          {[10, 15, 20, 25, 30, 35].map((lat) => {
            const [, y] = project(lat, 70);
            return (
              <g key={lat}>
                <line x1={-PAD} x2={INDIA.width + PAD} y1={y} y2={y} stroke="rgba(237,230,218,0.06)" strokeDasharray="2 8" />
                <text x={INDIA.width + PAD - 4} y={y - 6} textAnchor="end" className="fill-bone/30 font-mono" style={{ fontSize: 16 }}>
                  {lat}°N
                </text>
              </g>
            );
          })}

          {dots.map((d) => (
            <circle key={d.id} cx={d.xy[0]} cy={d.xy[1]} r="3" className="fill-bone/30" />
          ))}

          <motion.path
            d={route}
            fill="none"
            stroke="#F0782D"
            strokeWidth="1.5"
            strokeDasharray="1 7"
            strokeLinecap="round"
            vectorEffect="non-scaling-stroke"
            {...draw(1.6, 3.2)}
          />

          {/* Base camp */}
          <g transform={`translate(${base[0]} ${base[1]})`}>
            <rect x="-9" y="-9" width="18" height="18" fill="none" stroke="#EDE6DA" strokeWidth="1.5" vectorEffect="non-scaling-stroke" transform="rotate(45)" />
            <text x="0" y="40" textAnchor="middle" className="fill-bone font-mono" style={{ fontSize: 16, letterSpacing: 2 }}>
              BASE · AJMER
            </text>
          </g>

          {pins.map((j, i) => (
            <motion.g
              key={j.slug}
              transform={`translate(${j.xy[0]} ${j.xy[1]})`}
              initial={reduce ? false : { opacity: 0 }}
              whileInView={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: reduce ? 0 : 1.8 + i * 0.25, duration: 0.4 }}
              onMouseEnter={() => setActive(i)}
              onMouseLeave={() => setActive(null)}
              onClick={() => (active === i ? go(j.slug) : setActive(i))}
              className="cursor-pointer"
              data-cursor-lock
            >
              <circle r="26" fill="transparent" />
              {!reduce && (
                <motion.circle
                  r="10"
                  fill="none"
                  stroke="#F0782D"
                  strokeWidth="1"
                  vectorEffect="non-scaling-stroke"
                  animate={{ r: [8, 24], opacity: [0.8, 0] }}
                  transition={{ duration: 2.4, repeat: Infinity, delay: i * 0.3, ease: "easeOut" }}
                />
              )}
              <circle r={active === i ? 9 : 6} fill={active === i ? "#F0782D" : "#0A0908"} stroke="#F0782D" strokeWidth="2" vectorEffect="non-scaling-stroke" style={{ transition: "r 200ms" }} />
              <text x="16" y="6" className={`font-mono ${active === i ? "fill-saffron" : "fill-bone/70"}`} style={{ fontSize: 17 }}>
                {String(i + 1).padStart(2, "0")}
              </text>
            </motion.g>
          ))}
        </svg>

        {/* Preview card */}
        <AnimatePresence>
          {activeJ && (
            <motion.button
              key={activeJ.slug}
              onClick={() => go(activeJ.slug)}
              initial={{ opacity: 0, y: 10, clipPath: "inset(0 0 100% 0)" }}
              animate={{ opacity: 1, y: 0, clipPath: "inset(0 0 0% 0)" }}
              exit={{ opacity: 0, transition: { duration: 0.15 } }}
              transition={{ duration: 0.45, ease }}
              className="absolute w-52 bg-soot text-left shadow-2xl md:w-60"
              style={{
                left: `${Math.min(62, Math.max(0, ((activeJ.xy[0] + PAD) / (INDIA.width + PAD * 2)) * 100 - 10))}%`,
                top: `${Math.min(70, Math.max(0, ((activeJ.xy[1] + PAD) / (INDIA.height + PAD * 2)) * 100 + 4))}%`,
              }}
            >
              <span className="relative block aspect-[4/3] overflow-hidden">
                <Image src={photo(activeJ.cover).src} alt="" fill sizes="240px" className="object-cover" />
              </span>
              <span className="block p-3">
                <span className="block font-display text-xl text-bone">{activeJ.name}</span>
                <span className="mt-1 block font-mono text-[9px] uppercase tracking-hud text-bone/50">
                  {fmtCoords(activeJ.lat, activeJ.lon)}
                </span>
                <span className="mt-2 block font-mono text-[9px] uppercase tracking-hud text-saffron">Open chapter →</span>
              </span>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
