"use client";
// Services as an index that opens up: one row expanded at a time, its
// photograph wiping in beside the detail. Works as a plain accordion on phones.
import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import FocusImage from "@/components/ui/FocusImage";
import { services } from "@/data/services";
import { photo } from "@/data/photos";
import { ease } from "@/lib/motion";

export default function ServiceList() {
  const [open, setOpen] = useState(0);
  return (
    <ul className="border-t border-line">
      {services.map((s, i) => {
        const isOpen = open === i;
        const p = photo(s.image);
        return (
          <li key={s.key} className="border-b border-line">
            <button
              onClick={() => setOpen(isOpen ? null : i)}
              aria-expanded={isOpen}
              className="group flex w-full items-center justify-between gap-6 py-7 text-left md:py-9"
            >
              <span className="flex items-baseline gap-5 md:gap-10">
                <span className={`font-mono text-[10px] ${isOpen ? "text-saffron" : "text-bone/40"}`}>{String(i + 1).padStart(2, "0")}</span>
                <span className={`font-display text-[clamp(1.7rem,4.2vw,3.8rem)] leading-none transition-colors ${isOpen ? "text-bone" : "text-bone/70 group-hover:text-bone"}`}>
                  {s.title}
                </span>
              </span>
              <span className="relative h-5 w-5 shrink-0">
                <span className="absolute left-0 top-1/2 h-px w-full bg-bone" />
                <motion.span className="absolute left-1/2 top-0 h-full w-px bg-bone" animate={{ scaleY: isOpen ? 0 : 1 }} transition={{ duration: 0.3 }} />
              </span>
            </button>
            <AnimatePresence initial={false}>
              {isOpen && (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="overflow-hidden"
                >
                  <div className="grid gap-8 pb-10 md:grid-cols-[1fr_1.1fr] md:gap-14 md:pb-14">
                    <motion.div
                      initial={{ clipPath: "inset(0 100% 0 0)" }}
                      animate={{ clipPath: "inset(0 0% 0 0)" }}
                      transition={{ duration: 0.9, ease, delay: 0.1 }}
                    >
                      <FocusImage p={p} sizes="(min-width:768px) 45vw, 100vw" className="relative aspect-[3/2] bg-soot" />
                      <p className="mt-2 font-mono text-[9px] uppercase tracking-hud text-bone/40">
                        {p.title} · {p.place}
                      </p>
                    </motion.div>
                    <div>
                      <p className="font-display text-2xl italic text-ember">{s.short}</p>
                      <p className="mt-5 max-w-lg text-bone/70">{s.summary}</p>
                      <p className="mt-8 font-mono text-[10px] uppercase tracking-hud text-bone/40">For</p>
                      <div className="mt-3 flex flex-wrap gap-2">
                        {s.forWhom.map((f) => (
                          <span key={f} className="border border-line px-3 py-1.5 font-mono text-[10px] uppercase tracking-hud text-bone/80">
                            {f}
                          </span>
                        ))}
                      </div>
                      <p className="mt-8 font-mono text-[10px] uppercase tracking-hud text-bone/40">Includes</p>
                      <ul className="mt-3 space-y-2">
                        {s.points.map((pt) => (
                          <li key={pt} className="flex items-center gap-3 text-bone">
                            <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
                            {pt}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </li>
        );
      })}
    </ul>
  );
}
