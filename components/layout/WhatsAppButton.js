"use client";
// The floating WhatsApp button — dressed to match the site rather than pasted on.
//
// A dark glass disc with the WhatsApp mark in its own green and a small "online"
// dot. On desktop it slides open into "Chat on WhatsApp" on hover. A new visitor
// gets one short "Namaste" bubble a few seconds in (once per session), which
// can be dismissed. It waits for the diya intro to finish before appearing.
import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { useReducedMotion } from "@/lib/useReducedMotion";
import { whenIntroDone } from "@/lib/intro";
import { site } from "@/data/site";

const GREEN = "#25D366";
const HINT_KEY = "ha-wa-hint";
const message = encodeURIComponent(
  "Namaste! I found your website and would like to get in touch.",
);

// The official WhatsApp mark, from Simple Icons (simpleicons.org).
function WhatsAppMark({ className }) {
  return (
    <svg viewBox="0 0 24 24" className={className} aria-hidden="true">
      <path
        fill="currentColor"
        d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"
      />
    </svg>
  );
}

export default function WhatsAppButton() {
  const reduce = useReducedMotion();
  const [ready, setReady] = useState(false);
  const [hint, setHint] = useState(false);

  // Appear once the intro is out of the way, then (first visit only) say hello.
  useEffect(() => {
    let hintTimer;
    let hideTimer;
    const cancel = whenIntroDone(() => {
      setReady(true);
      let seen = true;
      try {
        seen = sessionStorage.getItem(HINT_KEY) === "1";
      } catch {}
      if (seen) return;
      hintTimer = setTimeout(() => {
        setHint(true);
        try {
          sessionStorage.setItem(HINT_KEY, "1");
        } catch {}
        hideTimer = setTimeout(() => setHint(false), 7000);
      }, 6000);
    });
    return () => {
      cancel();
      clearTimeout(hintTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  const href = `https://wa.me/${site.whatsapp}?text=${message}`;

  return (
    <motion.div
      className="fixed bottom-5 right-5 z-50 flex items-end gap-3 md:bottom-7 md:right-7"
      initial={false}
      animate={ready ? { y: 0, opacity: 1 } : { y: 24, opacity: 0 }}
      transition={
        reduce
          ? { duration: 0 }
          : { type: "spring", stiffness: 260, damping: 22 }
      }
      style={{ pointerEvents: ready ? "auto" : "none" }}
    >
      {/* One-time hello */}
      <AnimatePresence>
        {hint && (
          <motion.div
            initial={{ opacity: 0, x: 12, scale: 0.96 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 8 }}
            transition={{ duration: 0.35 }}
            className="relative mb-1 max-w-[220px] rounded-2xl rounded-br-sm border border-line bg-soot/95 px-4 py-3 text-sm text-bone shadow-2xl shadow-black/50 backdrop-blur"
          >
            <button
              onClick={() => setHint(false)}
              aria-label="Dismiss"
              className="absolute -right-2 -top-2 flex h-5 w-5 items-center justify-center rounded-full border border-line bg-night text-[10px] text-bone/60 hover:text-bone"
            >
              ✕
            </button>
            <p className="font-display text-base leading-snug">Namaste 🙏</p>
            <p className="mt-1 text-bone/65">
              Questions about a collaboration or a talk? Message me on WhatsApp.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Chat on WhatsApp"
        onClick={() => setHint(false)}
        className="group relative flex h-14 items-center overflow-hidden rounded-full border border-white/10 bg-night/80 pl-[15px] pr-[15px] text-bone shadow-[0_12px_40px_-8px_rgba(0,0,0,0.7)] backdrop-blur-md transition-[padding,border-color] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] hover:border-[#25D366]/50 md:hover:pr-6"
      >
        {/* Soft green glow behind the mark */}
        <span
          className="pointer-events-none absolute left-1 top-1/2 h-12 w-12 -translate-y-1/2 rounded-full opacity-60 blur-md transition-opacity group-hover:opacity-100"
          style={{
            background: `radial-gradient(circle, ${GREEN}55, transparent 70%)`,
          }}
        />
        <span
          className="relative flex h-6 w-6 shrink-0 items-center justify-center"
          style={{ color: GREEN }}
        >
          <WhatsAppMark className="h-6 w-6" />
          {/* Online dot */}
          <span className="absolute -right-1 -top-1 flex h-2.5 w-2.5">
            {!reduce && (
              <span
                className="absolute inset-0 animate-ping rounded-full opacity-60"
                style={{ background: GREEN, animationDuration: "2.4s" }}
              />
            )}
            <span
              className="relative h-2.5 w-2.5 rounded-full border-2 border-night"
              style={{ background: GREEN }}
            />
          </span>
        </span>
        {/* Label, revealed on hover (desktop) */}
        <span className="relative hidden max-w-0 overflow-hidden whitespace-nowrap font-mono text-[11px] uppercase tracking-hud text-bone/90 transition-[max-width,margin] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:inline-block md:group-hover:ml-3 md:group-hover:max-w-[12rem]">
          Chat on WhatsApp
        </span>
      </a>
    </motion.div>
  );
}
