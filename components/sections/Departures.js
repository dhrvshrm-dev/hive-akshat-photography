"use client";
// Upcoming walks and expeditions, as a split-flap departures board: each cell
// flips through characters before landing, row by row, as the board comes into view.
import { useEffect, useRef, useState } from "react";
import { useInView } from "framer-motion";
import { departures } from "@/data/services";

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789 ";

function Flap({ text, start, delay }) {
  const [shown, setShown] = useState(() => text.replace(/./g, " "));
  useEffect(() => {
    if (!start) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }
    let raf = 0;
    let t0 = 0;
    const dur = 700 + text.length * 25;
    const tick = (now) => {
      if (!t0) t0 = now + delay;
      const t = Math.max(0, (now - t0) / dur);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        out += t * text.length * 1.4 > i + 3 || text[i] === " " ? text[i] : CHARS[Math.floor(Math.random() * CHARS.length)];
      }
      setShown(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setShown(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [start, text, delay]);
  return <span aria-label={text}><span aria-hidden="true">{shown}</span></span>;
}

export default function Departures() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-15%" });
  const cols = ["Departure", "From", "When", "Length", "Seats"];
  return (
    <div ref={ref} className="overflow-x-auto no-scrollbar">
      <table className="w-full min-w-[640px] border-collapse font-mono text-[12px] uppercase tracking-hud">
        <thead>
          <tr className="text-left text-[9px] text-bone/40">
            {cols.map((c) => (
              <th key={c} className="border-b border-line pb-3 font-normal">{c}</th>
            ))}
          </tr>
        </thead>
        <tbody>
          {departures.map((d, i) => (
            <tr key={d.what} className="border-b border-line text-bone">
              <td className="py-4 pr-4 text-ember"><Flap text={d.what.toUpperCase()} start={inView} delay={i * 120} /></td>
              <td className="py-4 pr-4"><Flap text={d.where.toUpperCase()} start={inView} delay={i * 120 + 60} /></td>
              <td className="py-4 pr-4"><Flap text={d.when.toUpperCase()} start={inView} delay={i * 120 + 100} /></td>
              <td className="py-4 pr-4 text-bone/70"><Flap text={d.length.toUpperCase()} start={inView} delay={i * 120 + 140} /></td>
              <td className="py-4">
                <span className="inline-flex items-center gap-2">
                  <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
                  <Flap text={String(d.seats).padStart(2, "0")} start={inView} delay={i * 120 + 180} />
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
