"use client";
// The enquiry form, laid out like a camera's settings menu: every field a
// labelled row, the active one marked in saffron. On success the shutter fires.
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const SHOOT_TYPES = [
  "Tourism campaign",
  "Hotel / heritage property",
  "Temple / festival",
  "Fine-art prints",
  "Photo walk / expedition",
  "Wildlife / nature",
  "Something else",
];

function Field({ label, index, children }) {
  return (
    <label className="group block border-b border-line py-4 transition-colors focus-within:border-saffron">
      <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/45 transition-colors group-focus-within:text-saffron">
        <span>{String(index).padStart(2, "0")}</span>
        {label}
      </span>
      {children}
    </label>
  );
}

export default function ContactForm() {
  const [status, setStatus] = useState("idle"); // idle | sending | success | error
  const [error, setError] = useState("");
  const reduce = useReducedMotion();
  const controls = useAnimationControls();

  useEffect(() => {
    if (status !== "error" || reduce) return;
    controls.start({ x: [0, -8, 8, -6, 6, 0], transition: { duration: 0.45 } });
  }, [status, reduce, controls]);

  async function handleSubmit(e) {
    e.preventDefault();
    setStatus("sending");
    setError("");
    const form = e.currentTarget;
    const data = Object.fromEntries(new FormData(form).entries());
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) {
        const body = await res.json().catch(() => ({}));
        throw new Error(body.message || "Something went wrong.");
      }
      setStatus("success");
      form.reset();
    } catch (err) {
      setError(err.message);
      setStatus("error");
    }
  }

  const input =
    "mt-2 w-full bg-transparent font-display text-xl text-bone outline-none placeholder:text-bone/25 md:text-2xl";

  if (status === "success") {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative overflow-hidden border border-line bg-soot p-10 text-center"
      >
        {/* The shutter fires: a black frame snaps shut and open. */}
        {!reduce && (
          <motion.span
            className="absolute inset-0 bg-night"
            initial={{ clipPath: "circle(0% at 50% 50%)" }}
            animate={{ clipPath: ["circle(0% at 50% 50%)", "circle(80% at 50% 50%)", "circle(0% at 50% 50%)"] }}
            transition={{ duration: 0.5, times: [0, 0.4, 1] }}
          />
        )}
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.5, ease }}
          className="relative font-mono text-[10px] uppercase tracking-hud text-saffron"
        >
          ● Captured
        </motion.p>
        <motion.p
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.55, duration: 0.5, ease }}
          className="relative mt-4 font-display text-3xl text-bone"
        >
          Your enquiry is on its way.
        </motion.p>
        <p className="relative mt-3 text-sm text-bone/60">I reply within a day. For anything urgent, WhatsApp is fastest.</p>
      </motion.div>
    );
  }

  return (
    <motion.form animate={controls} onSubmit={handleSubmit} className="border-t border-line">
      {/* Honeypot: hidden from people, catches spam bots. Leave it empty. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid sm:grid-cols-2 sm:gap-x-8">
        <Field label="Name" index={1}>
          <input name="name" required className={input} placeholder="Your name" autoComplete="name" />
        </Field>
        <Field label="Phone" index={2}>
          <input name="phone" required className={input} placeholder="+91" inputMode="tel" autoComplete="tel" />
        </Field>
      </div>
      <div className="grid sm:grid-cols-2 sm:gap-x-8">
        <Field label="Email" index={3}>
          <input name="email" type="email" required className={input} placeholder="you@example.com" autoComplete="email" />
        </Field>
        <Field label="Dates (if you know)" index={4}>
          <input name="date" type="date" className={`${input} [color-scheme:dark]`} />
        </Field>
      </div>
      <Field label="What are we shooting?" index={5}>
        <select name="eventType" className={`${input} cursor-pointer appearance-none [color-scheme:dark]`} defaultValue={SHOOT_TYPES[0]}>
          {SHOOT_TYPES.map((t) => (
            <option key={t} className="bg-night text-base">
              {t}
            </option>
          ))}
        </select>
      </Field>
      <Field label="Where?" index={6}>
        <input name="location" className={input} placeholder="Pushkar, a hotel in Udaipur, somewhere with mountains…" />
      </Field>
      <Field label="Tell me more" index={7}>
        <textarea name="message" rows={3} className={`${input} resize-none`} placeholder="Audience, usage, what the pictures have to do" />
      </Field>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden pt-4 font-mono text-[11px] uppercase tracking-hud text-saffron"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "sending"}
        className="group relative mt-8 inline-flex w-full items-center justify-center gap-3 overflow-hidden bg-bone px-7 py-5 font-mono text-[11px] uppercase tracking-hud text-night disabled:opacity-60 sm:w-auto"
      >
        <span className="absolute inset-0 origin-left scale-x-0 bg-saffron transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
        {status === "sending" && !reduce ? (
          <motion.span
            className="relative h-3 w-3 rounded-full border border-night/40 border-t-night"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        ) : (
          <span className="relative h-2.5 w-2.5 rounded-full border-2 border-night" />
        )}
        <span className="relative">{status === "sending" ? "Sending…" : "Release shutter · Send enquiry"}</span>
      </button>
    </motion.form>
  );
}
