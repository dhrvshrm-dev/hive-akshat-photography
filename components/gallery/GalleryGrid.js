"use client";
// The archive: every frame, filterable by discipline. Each one focuses in as it
// scrolls into view, frames itself in viewfinder corners on hover with its EXIF,
// and opens into the review-screen lightbox.
import { useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { disciplines, photos } from "@/data/photos";
import Lightbox from "@/components/gallery/Lightbox";
import { ease, springSnappy } from "@/lib/motion";

const archive = photos.filter((p) => p.archive !== false);

export default function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [open, setOpen] = useState(null);
  const reduce = useReducedMotion();

  // ?d=Sacred (from the home page's discipline index) preselects a filter.
  useEffect(() => {
    const d = new URLSearchParams(window.location.search).get("d");
    if (d && disciplines.includes(d)) setFilter(d);
  }, []);

  const items = filter === "All" ? archive : archive.filter((p) => p.discipline === filter);
  const count = (d) => (d === "All" ? archive.length : archive.filter((p) => p.discipline === d).length);

  return (
    <LayoutGroup id="archive">
      <div className="no-scrollbar -mx-5 mb-12 flex gap-2 overflow-x-auto px-5 md:mx-0 md:flex-wrap md:justify-start md:px-0">
        {disciplines.map((d) => (
          <button
            key={d}
            onClick={() => setFilter(d)}
            className={`relative shrink-0 px-4 py-2.5 font-mono text-[11px] uppercase tracking-hud transition-colors ${
              filter === d ? "text-night" : "border border-line text-bone/60 hover:border-bone/40 hover:text-bone"
            }`}
          >
            {filter === d && <motion.span layoutId="filterPill" transition={springSnappy} className="absolute inset-0 bg-bone" />}
            <span className="relative z-10">
              {d} <span className={filter === d ? "text-night/50" : "text-bone/35"}>{count(d)}</span>
            </span>
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={filter}
          className="masonry"
          exit={{ opacity: 0, transition: { duration: 0.25 } }}
        >
          {items.map((item, i) => (
            <motion.button
              key={item.id}
              onClick={() => setOpen(i)}
              data-cursor="Review"
              className="group relative block w-full overflow-hidden bg-soot text-left"
              initial={reduce ? false : { opacity: 0, y: 30, filter: "blur(14px)" }}
              whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
              viewport={{ once: true, margin: "-8%" }}
              transition={{ duration: 0.9, delay: (i % 3) * 0.06, ease }}
            >
              <Image
                src={item.src}
                alt={`${item.title} — ${item.place}`}
                width={item.w}
                height={item.h}
                sizes="(min-width:1024px) 33vw, (min-width:640px) 50vw, 100vw"
                className="w-full object-cover transition-transform duration-[1.2s] ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-[1.03]"
              />
              <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-night/85 via-night/0 to-night/0 opacity-70 transition-opacity duration-500 group-hover:opacity-100" />
              <span
                className="brackets pointer-events-none absolute inset-3 scale-105 opacity-0 transition-all duration-500 group-hover:scale-100 group-hover:opacity-100"
                style={{ "--c": "#F0782D", "--b": "16px" }}
              />
              <span className="pointer-events-none absolute inset-x-0 bottom-0 flex items-end justify-between gap-3 p-4">
                <span>
                  <span className="block font-display text-lg leading-tight text-bone">{item.title}</span>
                  <span className="mt-1 block font-mono text-[9px] uppercase tracking-hud text-bone/60">
                    {item.place} · {item.discipline}
                  </span>
                </span>
                <span className="hidden shrink-0 text-right font-mono text-[9px] tracking-hud text-bone/70 transition-opacity duration-300 group-hover:opacity-100 md:block md:opacity-0">
                  {item.exif.shutter || ""} {item.exif.aperture || ""}
                  <br />
                  {item.exif.iso ? `ISO ${item.exif.iso}` : ""}
                </span>
              </span>
            </motion.button>
          ))}
        </motion.div>
      </AnimatePresence>

      <Lightbox
        items={items}
        index={open}
        onClose={() => setOpen(null)}
        onStep={(d) => setOpen((v) => (v + d + items.length) % items.length)}
      />
    </LayoutGroup>
  );
}
