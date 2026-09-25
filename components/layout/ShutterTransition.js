"use client";
// Route changes happen behind a closing aperture.
//
// Every same-origin link click is intercepted in the capture phase, before
// next/link sees it; next/link bails out of a click whose default is already
// prevented, so nothing navigates twice. The iris closes, the route is pushed
// while the screen is dark, and it opens again once the new pathname lands.
//
// The iris itself is one SVG path: a full-screen rectangle with a polygonal hole
// (even-odd fill), the polygon shrinking and turning as it closes. Each edge of
// the polygon is extended outward as a hairline, which is exactly the line a
// real aperture blade's edge makes — so eight straight lines read as blades.
import { useCallback, useEffect, useRef, useState } from "react";
import { usePathname, useRouter } from "next/navigation";

const BLADES = 8;
const CLOSE_MS = 520;
const OPEN_MS = 760;
const TURN = Math.PI / 3; // how far the opening rotates between open and closed

const easeIn = (t) => t * t * t;
const easeOut = (t) => 1 - Math.pow(1 - t, 4);

function irisGeometry(p, w, h) {
  const cx = w / 2;
  const cy = h / 2;
  // Large enough that the polygon's *inscribed* circle clears the corners.
  const rMax = Math.hypot(w, h) / 2 / Math.cos(Math.PI / BLADES) + 4;
  const r = Math.max(0, rMax * (1 - p));
  const rot = p * TURN;
  const pts = [];
  for (let i = 0; i < BLADES; i++) {
    const a = rot + (i / BLADES) * Math.PI * 2;
    pts.push([cx + Math.cos(a) * r, cy + Math.sin(a) * r]);
  }
  const hole = r < 0.5 ? "" : "M" + pts.map(([x, y]) => `${x.toFixed(1)} ${y.toFixed(1)}`).join("L") + "Z";
  const d = `M0 0H${w}V${h}H0Z${hole}`;
  const far = Math.hypot(w, h);
  const lines = pts.map(([x, y], i) => {
    const [nx, ny] = pts[(i + 1) % BLADES];
    const len = Math.hypot(nx - x, ny - y) || 1;
    const dx = (nx - x) / len;
    const dy = (ny - y) / len;
    return `M${nx.toFixed(1)} ${ny.toFixed(1)}L${(nx + dx * far).toFixed(1)} ${(ny + dy * far).toFixed(1)}`;
  });
  return { d, lines: lines.join("") };
}

function labelFor(href) {
  const path = href.split(/[?#]/)[0];
  if (path === "/" || path === "") return "Home";
  const seg = path.split("/").filter(Boolean).pop() || "";
  return seg.replace(/-/g, " ");
}

export default function ShutterTransition() {
  const router = useRouter();
  const pathname = usePathname();
  const [active, setActive] = useState(false);
  const [label, setLabel] = useState("");
  const [count, setCount] = useState(0);
  const pathRef = useRef(null);
  const linesRef = useRef(null);
  const textRef = useRef(null);
  const state = useRef({ phase: "idle", raf: 0, pending: null, fallback: 0 });
  const enabled = useRef(false);

  useEffect(() => {
    enabled.current = !window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  }, []);

  const draw = useCallback((p) => {
    const w = window.innerWidth;
    const h = window.innerHeight;
    const g = irisGeometry(p, w, h);
    if (pathRef.current) pathRef.current.setAttribute("d", g.d);
    if (linesRef.current) linesRef.current.setAttribute("d", g.lines);
    // The caption only exists once the blades have nearly met.
    if (textRef.current) textRef.current.style.opacity = String(Math.max(0, (p - 0.75) / 0.25));
  }, []);

  const run = useCallback(
    (from, to, ms, ease, done) => {
      cancelAnimationFrame(state.current.raf);
      const start = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - start) / ms);
        draw(from + (to - from) * ease(t));
        if (t < 1) state.current.raf = requestAnimationFrame(step);
        else done && done();
      };
      state.current.raf = requestAnimationFrame(step);
    },
    [draw]
  );

  const open = useCallback(() => {
    clearTimeout(state.current.fallback);
    state.current.phase = "opening";
    run(1, 0, OPEN_MS, easeOut, () => {
      state.current.phase = "idle";
      setActive(false);
    });
  }, [run]);

  // Intercept internal link clicks.
  useEffect(() => {
    const onClick = (e) => {
      if (!enabled.current) return;
      if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
      const a = e.target.closest?.("a[href]");
      if (!a || a.target === "_blank" || a.hasAttribute("download") || a.dataset.noTransition != null) return;
      const url = new URL(a.href, window.location.href);
      if (url.origin !== window.location.origin) return;
      // Same page (or just a new #hash on it): let the browser / Lenis handle it.
      if (url.pathname === window.location.pathname) return;
      if (state.current.phase !== "idle") {
        e.preventDefault();
        return;
      }
      e.preventDefault();
      const href = url.pathname + url.search + url.hash;
      state.current.pending = url.pathname;
      state.current.phase = "closing";
      setLabel(labelFor(href));
      setCount((c) => c + 1);
      setActive(true);
      // Drawn on the next frame, once the overlay exists.
      requestAnimationFrame(() => {
        draw(0);
        run(0, 1, CLOSE_MS, easeIn, () => {
          state.current.phase = "closed";
          router.push(href);
          // If the route is slow (or identical after a redirect), never leave
          // the visitor staring at a closed shutter.
          state.current.fallback = setTimeout(open, 2200);
        });
      });
    };
    document.addEventListener("click", onClick, true);
    return () => document.removeEventListener("click", onClick, true);
  }, [draw, run, router, open]);

  // The new page has landed: open up. A short beat first, so the page has painted
  // behind the shutter before it is revealed.
  useEffect(() => {
    if (state.current.phase === "closed" || state.current.phase === "closing") {
      const wait = () => {
        if (state.current.phase === "closing") {
          // Navigation beat the close animation — let it finish, then open.
          setTimeout(wait, 60);
          return;
        }
        setTimeout(open, 120);
      };
      wait();
    }
  }, [pathname, open]);

  useEffect(() => () => cancelAnimationFrame(state.current.raf), []);

  if (!active) return null;

  return (
    <div className="pointer-events-auto fixed inset-0 z-[150]" aria-hidden="true">
      <svg className="absolute inset-0 h-full w-full">
        <path ref={pathRef} fill="#050403" fillRule="evenodd" d="M0 0Z" />
        <path ref={linesRef} fill="none" stroke="rgba(237,230,218,0.14)" strokeWidth="1" d="M0 0Z" />
      </svg>
      <div
        ref={textRef}
        style={{ opacity: 0 }}
        className="absolute inset-0 flex flex-col items-center justify-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/60">
        <span className="flex items-center gap-2">
          <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
          {label}
        </span>
        <span className="text-bone/30">Frame {String(count).padStart(4, "0")}</span>
      </div>
    </div>
  );
}
