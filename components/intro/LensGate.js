"use client";
// Sits *over* the site as an overlay — the real pages still render underneath and are
// fully server-rendered, so crawlers and no-JS visitors are never gated by this.
import { useCallback, useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { AnimatePresence, motion } from "framer-motion";
import useDeviceTier, { markSeen } from "@/components/intro/useDeviceTier";
import LensFallback from "@/components/intro/LensFallback";
import { ease } from "@/lib/motion";

// three.js only ever enters the bundle for devices that asked for it.
const LensScene = dynamic(() => import("@/components/intro/LensScene"), { ssr: false });

export default function LensGate() {
  const tier = useDeviceTier();
  const [dismissed, setDismissed] = useState(false);

  const finish = useCallback(() => {
    markSeen();
    setDismissed(true);
  }, []);

  // The server-rendered curtain is hidden as soon as we know the visitor is skipping.
  useEffect(() => {
    if (tier === "none" || dismissed) {
      document.documentElement.setAttribute("data-intro", "skip");
      document.body.style.overflow = "";
    } else if (tier) {
      document.body.style.overflow = "hidden";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [tier, dismissed]);

  // Escape always works, even mid-scene.
  useEffect(() => {
    const onKey = (e) => e.key === "Escape" && finish();
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [finish]);

  const open = Boolean(tier) && tier !== "none" && !dismissed;

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          key="lens-gate"
          exit={{ opacity: 0 }}
          transition={{ duration: 0.7, ease }}
          className="fixed inset-0 z-[200] bg-[#0B0806]"
        >
          {tier === "high" ? <LensScene onDone={finish} /> : <LensFallback onDone={finish} />}

          {/* Always-available escape hatch */}
          <motion.button
            onClick={finish}
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.4, duration: 0.6 }}
            className="absolute bottom-7 right-7 z-10 text-[10px] uppercase tracking-widest text-ivory/50 transition-colors hover:text-gold"
          >
            Skip intro →
          </motion.button>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 1.1, duration: 0.8 }}
            className="pointer-events-none absolute inset-x-0 bottom-7 text-center text-[10px] uppercase tracking-widest text-ivory/40"
          >
            Hive Akshat · Ajmer
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
