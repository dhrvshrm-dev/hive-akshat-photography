"use client";
import { useEffect, useState } from "react";
import { AnimatePresence, motion, useAnimationControls, useReducedMotion } from "framer-motion";
import { ease } from "@/lib/motion";

const EVENT_TYPES = ["Wedding", "Pre-Wedding", "Event / Function", "Other"];

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
    "w-full border border-line bg-ivory px-4 py-3 text-sm text-ink outline-none transition-colors focus:border-rose focus:ring-1 focus:ring-rose/30";

  if (status === "success") {
    return (
      <AnimatePresence mode="wait">
        <motion.div
          key="success"
          initial={{ opacity: 0, y: 16, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.5, ease }}
          className="border border-line bg-blush p-8 text-center"
        >
          <p className="font-display text-2xl text-ink">Thank you — your enquiry is on its way.</p>
          <p className="mt-2 text-sm text-taupe">We&apos;ll get back to you within a day. For anything urgent, message us on WhatsApp.</p>
        </motion.div>
      </AnimatePresence>
    );
  }

  return (
    <motion.form animate={controls} onSubmit={handleSubmit} className="space-y-5">
      {/* Honeypot: hidden from people, catches spam bots. Leave it empty. */}
      <input type="text" name="company" tabIndex={-1} autoComplete="off" className="hidden" aria-hidden="true" />

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-taupe">Name</label>
          <input name="name" required className={input} placeholder="Your name" />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-taupe">Phone</label>
          <input name="phone" required className={input} placeholder="Your phone number" />
        </div>
      </div>

      <div className="grid gap-5 sm:grid-cols-2">
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-taupe">Email</label>
          <input name="email" type="email" required className={input} placeholder="you@example.com" />
        </div>
        <div>
          <label className="mb-2 block text-xs uppercase tracking-widest text-taupe">Event date</label>
          <input name="date" type="date" className={input} />
        </div>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest text-taupe">Event type</label>
        <select name="eventType" className={input} defaultValue="Wedding">
          {EVENT_TYPES.map((t) => (
            <option key={t}>{t}</option>
          ))}
        </select>
      </div>

      <div>
        <label className="mb-2 block text-xs uppercase tracking-widest text-taupe">Tell us a little more</label>
        <textarea name="message" rows={5} className={input} placeholder="Venue, city, what you're looking for..." />
      </div>

      <AnimatePresence>
        {status === "error" && (
          <motion.p
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden text-sm text-rose"
          >
            {error}
          </motion.p>
        )}
      </AnimatePresence>

      <button
        type="submit"
        disabled={status === "sending"}
        className="inline-flex w-full items-center justify-center gap-3 bg-ink px-7 py-4 text-xs uppercase tracking-widest text-ivory transition-colors hover:bg-rose disabled:opacity-60 sm:w-auto"
      >
        {status === "sending" && !reduce && (
          <motion.span
            className="h-3 w-3 rounded-full border border-ivory/40 border-t-ivory"
            animate={{ rotate: 360 }}
            transition={{ duration: 0.8, repeat: Infinity, ease: "linear" }}
          />
        )}
        {status === "sending" ? "Sending..." : "Send enquiry"}
      </button>
    </motion.form>
  );
}
