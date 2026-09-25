"use client";
// The cursor is an autofocus point.
//
// At rest it is a small AF box trailing the pointer. Over a link or a button it
// *locks on*: the box springs out to the element's own bounds and turns saffron,
// the way a camera's focus box snaps round a subject. Over photographs (anything
// tagged data-cursor="…") it opens into a wider box with a mono label instead,
// because locking round a full-bleed image would just outline the screen.
import { useEffect, useRef, useState } from "react";
import { motion, useMotionValue, useSpring, useReducedMotion } from "framer-motion";

const REST = 30; // px, the idle AF box
const MEDIA = 86; // px, the box over a photograph
const PAD = 8; // px of air between a locked box and its element

const spring = { stiffness: 420, damping: 36, mass: 0.6 };

export default function Cursor() {
  const reduce = useReducedMotion();
  const [enabled, setEnabled] = useState(false);
  const [mode, setMode] = useState("rest"); // rest | lock | media
  const [label, setLabel] = useState(null);
  const [down, setDown] = useState(false);
  const [visible, setVisible] = useState(false);

  const px = useMotionValue(-200);
  const py = useMotionValue(-200);
  const bx = useSpring(-200, spring);
  const by = useSpring(-200, spring);
  const bw = useSpring(REST, spring);
  const bh = useSpring(REST, spring);
  const dotX = useSpring(px, { stiffness: 1400, damping: 60, mass: 0.2 });
  const dotY = useSpring(py, { stiffness: 1400, damping: 60, mass: 0.2 });

  const target = useRef(null);
  const pointer = useRef({ x: -200, y: -200 });
  const modeRef = useRef("rest");

  useEffect(() => {
    if (reduce) return;
    if (!window.matchMedia("(pointer: fine)").matches) return;
    setEnabled(true);
    document.documentElement.classList.add("has-custom-cursor");
    return () => document.documentElement.classList.remove("has-custom-cursor");
  }, [reduce]);

  useEffect(() => {
    if (!enabled) return;
    let raf = 0;

    const pick = (el) => {
      const media = el?.closest?.("[data-cursor]");
      if (media) return { el: media, mode: "media", label: media.dataset.cursor };
      const lock = el?.closest?.("a, button, [role='button'], input, select, textarea, label, [data-cursor-lock]");
      if (lock) return { el: lock, mode: "lock", label: null };
      return { el: null, mode: "rest", label: null };
    };

    const move = (e) => {
      pointer.current.x = e.clientX;
      pointer.current.y = e.clientY;
      px.set(e.clientX);
      py.set(e.clientY);
      setVisible(true);
    };
    const over = (e) => {
      const next = pick(e.target);
      target.current = next.el;
      if (next.mode !== modeRef.current) {
        modeRef.current = next.mode;
        setMode(next.mode);
      }
      setLabel(next.label);
    };
    const press = () => setDown(true);
    const release = () => setDown(false);
    const leave = () => setVisible(false);
    const enter = () => setVisible(true);

    // Every frame, because a locked element moves under the box when the page
    // scrolls, and the lock has to ride along with it.
    const tick = () => {
      raf = requestAnimationFrame(tick);
      const m = modeRef.current;
      const el = target.current;
      if (m === "lock" && el && el.isConnected) {
        const r = el.getBoundingClientRect();
        // A giant link (a whole card) would outline half the screen; past a size
        // it behaves like media instead.
        if (r.width < 520 && r.height < 220) {
          bw.set(r.width + PAD * 2);
          bh.set(r.height + PAD * 2);
          bx.set(r.left - PAD);
          by.set(r.top - PAD);
          return;
        }
      }
      const size = m === "media" || m === "lock" ? MEDIA : REST;
      bw.set(size);
      bh.set(size);
      bx.set(pointer.current.x - size / 2);
      by.set(pointer.current.y - size / 2);
    };
    raf = requestAnimationFrame(tick);

    window.addEventListener("mousemove", move, { passive: true });
    document.addEventListener("mouseover", over, { passive: true });
    window.addEventListener("mousedown", press);
    window.addEventListener("mouseup", release);
    document.documentElement.addEventListener("mouseleave", leave);
    document.documentElement.addEventListener("mouseenter", enter);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("mousemove", move);
      document.removeEventListener("mouseover", over);
      window.removeEventListener("mousedown", press);
      window.removeEventListener("mouseup", release);
      document.documentElement.removeEventListener("mouseleave", leave);
      document.documentElement.removeEventListener("mouseenter", enter);
    };
  }, [enabled, px, py, bx, by, bw, bh]);

  if (!enabled) return null;

  const hot = mode !== "rest";
  const color = hot ? "#F0782D" : "rgba(237,230,218,0.85)";

  return (
    <div
      aria-hidden="true"
      className="pointer-events-none fixed inset-0 z-[120]"
      style={{ opacity: visible ? 1 : 0, transition: "opacity 200ms linear" }}
    >
      {/* The AF box: four corners of a rectangle that springs to its target. */}
      <motion.div
        className="absolute left-0 top-0"
        style={{ x: bx, y: by, width: bw, height: bh }}
        animate={{ scale: down ? 0.9 : 1 }}
        transition={{ duration: 0.12 }}
      >
        {["left-0 top-0 border-l border-t", "right-0 top-0 border-r border-t", "left-0 bottom-0 border-l border-b", "right-0 bottom-0 border-r border-b"].map(
          (pos) => (
            <span
              key={pos}
              className={`absolute h-2.5 w-2.5 ${pos}`}
              style={{ borderColor: color, transition: "border-color 180ms linear" }}
            />
          )
        )}
        {mode === "media" && label && (
          <span className="absolute left-1/2 top-full mt-2 -translate-x-1/2 whitespace-nowrap font-mono text-[10px] uppercase tracking-hud text-saffron">
            {label}
          </span>
        )}
      </motion.div>

      {/* The centre point — a tiny cross that stays glued to the pointer. */}
      <motion.div className="absolute left-0 top-0" style={{ x: dotX, y: dotY }}>
        <span
          className="absolute -left-[5px] top-0 h-px w-[11px]"
          style={{ background: color, opacity: hot ? 0 : 1, transition: "opacity 150ms" }}
        />
        <span
          className="absolute -top-[5px] left-0 h-[11px] w-px"
          style={{ background: color, opacity: hot ? 0 : 1, transition: "opacity 150ms" }}
        />
        <span
          className="absolute -left-[2px] -top-[2px] h-[5px] w-[5px] rounded-full bg-saffron"
          style={{ opacity: hot ? 1 : 0, transition: "opacity 150ms" }}
        />
      </motion.div>
    </div>
  );
}
