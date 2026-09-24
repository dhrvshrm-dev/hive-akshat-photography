"use client";
import { useState } from "react";
import Image from "next/image";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "framer-motion";
import { categories, portfolio } from "@/data/portfolio";
import Lightbox from "@/components/gallery/Lightbox";
import { ease, springSnappy } from "@/lib/motion";

export default function GalleryGrid() {
  const [filter, setFilter] = useState("All");
  const [openId, setOpenId] = useState(null); // id of the image open in the lightbox
  const reduce = useReducedMotion();

  const items = filter === "All" ? portfolio : portfolio.filter((p) => p.category === filter);
  const openIndex = items.findIndex((p) => p.id === openId);

  const close = () => setOpenId(null);
  const step = (dir) => {
    if (openIndex === -1) return;
    const nextIndex = (openIndex + dir + items.length) % items.length;
    setOpenId(items[nextIndex].id);
  };

  return (
    <LayoutGroup id="gallery">
      <div>
        {/* Filter buttons — the active pill slides between them */}
        <div className="mb-10 flex flex-wrap justify-center gap-3">
          {categories.map((c) => (
            <button
              key={c}
              onClick={() => setFilter(c)}
              className={`relative px-5 py-2 text-xs uppercase tracking-widest transition-colors ${
                filter === c ? "text-ivory" : "border border-line text-taupe hover:border-rose hover:text-rose"
              }`}
            >
              {filter === c && (
                <motion.span layoutId="filterPill" transition={springSnappy} className="absolute inset-0 bg-ink" />
              )}
              <span className="relative z-10">{c}</span>
            </button>
          ))}
        </div>

        {/* Masonry grid. Filtering swaps the whole set rather than reflowing items in
            place — CSS-columns rebalances every column on change, so per-item layout
            animation would look like items teleporting. */}
        <AnimatePresence mode="wait">
          <motion.div
            key={filter}
            className="masonry"
            initial="hidden"
            animate="show"
            exit="exit"
            variants={{
              hidden: {},
              show: { transition: { staggerChildren: reduce ? 0 : 0.05 } },
              exit: { opacity: 0, transition: { duration: 0.25 } },
            }}
          >
            {items.map((item) => (
              <motion.button
                key={item.id}
                onClick={() => setOpenId(item.id)}
                data-cursor="View"
                className="group block w-full overflow-hidden"
                variants={{
                  hidden: reduce ? {} : { opacity: 0, y: 24, scale: 0.97 },
                  show: {
                    opacity: 1,
                    y: 0,
                    scale: 1,
                    transition: { duration: 0.7, ease },
                  },
                }}
              >
                <motion.div layoutId={`shot-${item.id}`} className="relative overflow-hidden">
                  <Image
                    src={item.src}
                    alt={item.title}
                    width={item.w}
                    height={item.h}
                    className="w-full object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <span className="pointer-events-none absolute inset-0 bg-ink/0 transition-colors duration-500 group-hover:bg-ink/20" />
                </motion.div>
              </motion.button>
            ))}
          </motion.div>
        </AnimatePresence>

        <Lightbox
          item={openIndex === -1 ? null : items[openIndex]}
          onClose={close}
          onPrev={() => step(-1)}
          onNext={() => step(1)}
        />
      </div>
    </LayoutGroup>
  );
}
