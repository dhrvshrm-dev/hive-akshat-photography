"use client";
// Weighted, inertial scrolling. Lenis moves the real document scroll, so
// position: sticky, IntersectionObserver and the GL stage's scrollY reads all keep
// working untouched — it only changes how the number gets there.
import { useEffect } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import { getLenis, setLenis } from "@/lib/scroll";

export default function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const lenis = new Lenis({
      duration: 1.15,
      easing: (t) => 1 - Math.pow(1 - t, 4),
      smoothWheel: true,
      // Touch keeps the platform's own momentum — it is already good, and a
      // second layer of smoothing on a phone reads as lag.
      syncTouch: false,
    });
    setLenis(lenis);
    let id = 0;
    const raf = (time) => {
      lenis.raf(time);
      id = requestAnimationFrame(raf);
    };
    id = requestAnimationFrame(raf);
    return () => {
      cancelAnimationFrame(id);
      lenis.destroy();
      setLenis(null);
    };
  }, []);

  // A new page starts at the top, unless it was asked for an anchor.
  useEffect(() => {
    const lenis = getLenis();
    const hash = window.location.hash;
    if (hash) {
      const t = setTimeout(() => {
        const el = document.querySelector(hash);
        if (el && lenis) lenis.scrollTo(el, { offset: -80, immediate: true });
        else if (el) el.scrollIntoView();
      }, 60);
      return () => clearTimeout(t);
    }
    if (lenis) lenis.scrollTo(0, { immediate: true });
    else window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}
