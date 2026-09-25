"use client";
// The archive by discipline, as an index of big type.
//
// Desktop: hovering a row floats a photograph from that discipline beside the
// cursor, leaning into the direction of travel, and it cycles through the row's
// frames while you stay on it.
// Phone: there is no hover, so each row carries its own strip of frames that
// wipes open as the row scrolls into view.
import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { AnimatePresence, motion, useMotionValue, useSpring, useTransform, useVelocity } from "framer-motion";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import { photos } from "@/data/photos";
import { ease } from "@/lib/motion";

const BLURB = {
  Sacred: "Aarti, gompa, gurdwara, mandir. Ritual, light and permission.",
  Landscape: "Dunes, passes, lakes at five thousand metres.",
  Architecture: "Forts, stepwells, jharokhas — stone that holds light.",
  People: "Boatmen, sadhus, shepherds. The faces of a place.",
  Wild: "A tigress, a camel, a macaque on the ramparts.",
};

const rows = Object.keys(BLURB).map((d) => ({
  name: d,
  blurb: BLURB[d],
  frames: photos.filter((p) => p.discipline === d && p.archive !== false),
}));

export default function Disciplines() {
  const [active, setActive] = useState(null);
  const [frame, setFrame] = useState(0);
  const [fine, setFine] = useState(false);
  const mx = useMotionValue(0);
  const my = useMotionValue(0);
  const x = useSpring(mx, { stiffness: 180, damping: 22, mass: 0.6 });
  const y = useSpring(my, { stiffness: 180, damping: 22, mass: 0.6 });
  const vx = useVelocity(x);
  const rotate = useTransform(vx, [-1500, 0, 1500], [-10, 0, 10], { clamp: true });
  const areaRef = useRef(null);

  useEffect(() => setFine(window.matchMedia("(pointer: fine)").matches), []);

  // Cycle frames while hovering a row.
  useEffect(() => {
    if (active == null) return;
    setFrame(0);
    const id = setInterval(() => setFrame((f) => f + 1), 900);
    return () => clearInterval(id);
  }, [active]);

  const onMove = (e) => {
    const r = areaRef.current.getBoundingClientRect();
    mx.set(e.clientX - r.left);
    my.set(e.clientY - r.top);
  };

  const current = active != null ? rows[active].frames[frame % rows[active].frames.length] : null;

  return (
    <section className="relative bg-night py-28 md:py-40">
      <Container>
        <SectionHeading index="03" eyebrow="The archive" title={[{ text: "Five ways" }, { text: "of looking.", emphasis: true }]} />
      </Container>

      <div ref={areaRef} className="relative mt-16 md:mt-20" onMouseMove={fine ? onMove : undefined} onMouseLeave={() => setActive(null)}>
        <ul className="border-t border-line">
          {rows.map((row, i) => (
            <li key={row.name} className="border-b border-line">
              <Link
                href={`/journeys?d=${row.name}#archive`}
                onMouseEnter={() => fine && setActive(i)}
                className="group relative block"
                data-cursor={fine ? "Browse" : undefined}
              >
                <Container className="flex items-center justify-between gap-6 py-7 md:py-10">
                  <span className="flex items-baseline gap-5 md:gap-10">
                    <span className="font-mono text-[10px] text-bone/40">{String(i + 1).padStart(2, "0")}</span>
                    <span
                      className={`font-display text-[clamp(2.6rem,8vw,7.5rem)] leading-none transition-[color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
                        active === i ? "translate-x-4 italic text-saffron" : active != null ? "text-bone/25" : "text-bone"
                      }`}
                    >
                      {row.name}
                    </span>
                  </span>
                  <span className="hidden max-w-xs text-right md:block">
                    <span className="block text-sm text-bone/60">{row.blurb}</span>
                    <span className="mt-2 block font-mono text-[10px] uppercase tracking-hud text-bone/40">
                      {String(row.frames.length).padStart(2, "0")} frames
                    </span>
                  </span>
                  <span className="font-mono text-[10px] text-bone/40 md:hidden">{row.frames.length}</span>
                </Container>

                {/* Phone: a strip of frames that wipes open in view */}
                {!fine && (
                  // The wrapper is what gets watched: an element that starts fully
                  // clipped never counts as "in view", so it could never open.
                  <motion.div initial="hidden" whileInView="show" viewport={{ once: true, margin: "-10%" }}>
                  <motion.div
                    className="no-scrollbar -mt-2 flex gap-2 overflow-x-auto px-5 pb-6"
                    variants={{ hidden: { clipPath: "inset(0 100% 0 0)" }, show: { clipPath: "inset(0 0% 0 0)" } }}
                    transition={{ duration: 1.1, ease }}
                  >
                    {row.frames.slice(0, 6).map((p) => (
                      <span key={p.id} className="relative h-28 w-24 shrink-0 overflow-hidden bg-soot">
                        <Image src={p.src} alt={p.title} fill sizes="120px" className="object-cover" />
                      </span>
                    ))}
                  </motion.div>
                  </motion.div>
                )}
              </Link>
            </li>
          ))}
        </ul>

        {/* Desktop: the floating frame */}
        {fine && (
          <motion.div
            className="pointer-events-none absolute -ml-[120px] -mt-[150px] left-0 top-0 z-10 h-[300px] w-[240px]"
            style={{ x, y, rotate }}
          >
            <AnimatePresence>
              {current && (
                <motion.div
                  key={current.id}
                  initial={{ clipPath: "inset(50% 50% 50% 50%)", scale: 1.15 }}
                  animate={{ clipPath: "inset(0% 0% 0% 0%)", scale: 1 }}
                  exit={{ opacity: 0, transition: { duration: 0.25 } }}
                  transition={{ duration: 0.55, ease }}
                  className="absolute inset-0 overflow-hidden"
                >
                  <Image src={current.src} alt="" fill sizes="240px" className="object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-night/80 to-transparent p-3 font-mono text-[9px] uppercase tracking-hud text-bone/80">
                    {current.place} · {current.exif.aperture || ""} {current.exif.shutter || ""}
                  </span>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        )}
      </div>
    </section>
  );
}
