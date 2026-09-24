"use client";
import { useEffect, useCallback } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { ease } from "@/lib/motion";

// Full-screen viewer. The frame shares a layoutId with its grid thumbnail, so opening a
// photo flies it out of the grid. The frame keeps the image's own aspect ratio in both
// places, which makes the morph a pure uniform scale — no cropping shift mid-flight.
export default function Lightbox({ item, onClose, onPrev, onNext }) {
  const open = Boolean(item);

  const handleKey = useCallback(
    (e) => {
      if (!open) return;
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowLeft") onPrev();
      if (e.key === "ArrowRight") onNext();
    },
    [open, onClose, onPrev, onNext]
  );

  useEffect(() => {
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [handleKey]);

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = prev;
    };
  }, [open]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 z-[60] flex flex-col items-center justify-center bg-ink/95 p-4 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.button
            onClick={onClose}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute right-5 top-5 z-10 text-2xl text-ivory/70 hover:text-ivory"
            aria-label="Close"
          >
            ✕
          </motion.button>
          <motion.button
            onClick={(e) => { e.stopPropagation(); onPrev(); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute left-4 z-10 text-3xl text-ivory/60 hover:text-ivory md:left-8"
            aria-label="Previous"
          >
            ‹
          </motion.button>

          <motion.div
            layoutId={`shot-${item.id}`}
            transition={{ duration: 0.6, ease }}
            style={{
              width: `min(92vw, calc(80vh * ${item.w / item.h}))`,
              aspectRatio: `${item.w} / ${item.h}`,
            }}
            className="relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            <Image src={item.src} alt={item.title} fill sizes="92vw" className="object-cover" />
          </motion.div>

          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0, transition: { delay: 0.35, duration: 0.4, ease } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="mt-4 text-center text-xs uppercase tracking-widest text-gold"
          >
            {item.title} · {item.category}
          </motion.p>

          <motion.button
            onClick={(e) => { e.stopPropagation(); onNext(); }}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1, transition: { delay: 0.3 } }}
            exit={{ opacity: 0, transition: { duration: 0.15 } }}
            className="absolute right-4 z-10 text-3xl text-ivory/60 hover:text-ivory md:right-8"
            aria-label="Next"
          >
            ›
          </motion.button>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
