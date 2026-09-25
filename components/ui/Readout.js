"use client";
// A value that changes the way a camera's display does: when it changes, each
// character rolls through a few random glyphs before settling left-to-right, so a
// new shutter speed or coordinate *arrives* instead of just being swapped in.
import { useEffect, useRef, useState } from "react";

const GLYPHS = "0123456789/°.·—NESW";

export default function Readout({ value, className = "", duration = 520, as: Tag = "span" }) {
  const text = String(value ?? "");
  const [shown, setShown] = useState(text);
  const first = useRef(true);

  useEffect(() => {
    if (first.current) {
      first.current = false;
      setShown(text);
      return;
    }
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setShown(text);
      return;
    }
    let raf = 0;
    const start = performance.now();
    const tick = (now) => {
      const t = Math.min(1, (now - start) / duration);
      const settled = Math.floor(t * text.length);
      let out = "";
      for (let i = 0; i < text.length; i++) {
        const c = text[i];
        if (i < settled || c === " ") out += c;
        else out += GLYPHS[Math.floor(Math.random() * GLYPHS.length)];
      }
      setShown(out);
      if (t < 1) raf = requestAnimationFrame(tick);
      else setShown(text);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [text, duration]);

  return (
    <Tag className={className} aria-label={text}>
      <span aria-hidden="true">{shown}</span>
    </Tag>
  );
}
