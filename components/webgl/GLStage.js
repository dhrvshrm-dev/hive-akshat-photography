"use client";
// The site's single WebGL canvas. Fixed, full-screen, transparent and inert to
// the pointer; it paints only inside the boxes that registered themselves with
// the stage, so everywhere else the page is exactly the page.
//
// z-index 1 puts it above the flow content it replaces and below every fixed
// chrome layer — navbar (50), scroll bar (80), cursor (100), lightbox (60).
// Anything that must read *over* a WebGL surface needs a z-index of 2 or more.
import { useEffect, useRef, useState } from "react";
import { mountStage } from "@/lib/gl/stage";

export default function GLStage() {
  const canvasRef = useRef(null);
  const [enabled, setEnabled] = useState(false);

  useEffect(() => {
    // Reduced motion is honoured by not creating a context at all. Every GL
    // section falls back to the markup it already renders.
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setEnabled(true);
  }, []);

  useEffect(() => {
    if (!enabled || !canvasRef.current) return;
    return mountStage(canvasRef.current);
  }, [enabled]);

  if (!enabled) return null;

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        width: "100%",
        height: "100%",
        zIndex: 1,
        pointerEvents: "none",
      }}
    />
  );
}
