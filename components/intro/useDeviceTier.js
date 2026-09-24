"use client";
// Decides how much intro a visitor's device can comfortably carry.
//   "high" — real WebGL scene
//   "lite" — 2.5D parallax fallback (phones, weak CPUs, saver mode, no WebGL)
//   "none" — skip entirely (reduced motion, or they've already seen it)
import { useEffect, useState } from "react";

export const SEEN_KEY = "ha-lens-seen";

function hasWebGL() {
  try {
    const canvas = document.createElement("canvas");
    return Boolean(
      window.WebGLRenderingContext &&
        (canvas.getContext("webgl2") || canvas.getContext("webgl"))
    );
  } catch {
    return false;
  }
}

export default function useDeviceTier() {
  const [tier, setTier] = useState(null); // null until measured on the client

  useEffect(() => {
    // Already seen, or they've asked for less motion — don't gate them at all.
    let seen = false;
    try {
      seen = localStorage.getItem(SEEN_KEY) === "1";
    } catch {
      seen = true; // storage blocked: fail toward not trapping anyone
    }
    if (seen || window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      setTier("none");
      return;
    }

    if (!hasWebGL()) {
      setTier("lite");
      return;
    }

    const cores = navigator.hardwareConcurrency ?? 4;
    const memory = navigator.deviceMemory ?? 4;
    const conn = navigator.connection || {};
    const slowNet = conn.saveData === true || /^(slow-2g|2g|3g)$/.test(conn.effectiveType || "");
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    const small = window.innerWidth < 1024;

    const weak = cores < 4 || memory < 4 || slowNet || coarse || small;
    setTier(weak ? "lite" : "high");
  }, []);

  return tier;
}

export function markSeen() {
  try {
    localStorage.setItem(SEEN_KEY, "1");
  } catch {
    /* storage blocked — intro simply shows again next time */
  }
}
