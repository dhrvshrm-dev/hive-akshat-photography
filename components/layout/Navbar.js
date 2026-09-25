"use client";
import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { photo } from "@/data/photos";
import { ease } from "@/lib/motion";
import { fmtCoords, fmtMinutes, istClock, sunTimes } from "@/lib/format";
import { lockScroll, unlockScroll } from "@/lib/scroll";

// One frame per menu link, revealed behind the full-screen menu on hover.
const MENU_FRAMES = {
  "/journeys": "zanskar-road",
  "/services": "jaisalmer-fort",
  "/about": "phuktal",
  "/contact": "golden-temple",
};

/** Live IST clock plus the next sunrise or sunset at base — a camera's info line. */
function BaseClock() {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);
  if (!now) return <span className="opacity-0">00:00:00</span>;
  const { rise, set } = sunTimes(site.base.lat, site.base.lon, now);
  const istMin = ((now.getUTCHours() * 60 + now.getUTCMinutes() + 330) % 1440);
  const next = istMin < rise ? `Sunrise ${fmtMinutes(rise)}` : istMin < set ? `Sunset ${fmtMinutes(set)}` : `Sunrise ${fmtMinutes(rise)}`;
  return (
    <span className="flex items-center gap-3">
      <span className="flex items-center gap-1.5">
        <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-saffron" />
        Ajmer {istClock(now)} IST
      </span>
      <span className="text-bone/40">{next}</span>
    </span>
  );
}

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const [solid, setSolid] = useState(false);
  const [hover, setHover] = useState(null);
  const pathname = usePathname();
  const lastY = useRef(0);

  // Out of the way while reading down, back the moment you scroll up.
  useEffect(() => {
    const onScroll = () => {
      const y = window.scrollY;
      setSolid(y > 40);
      setHidden(y > 240 && y > lastY.current + 2);
      if (y < lastY.current - 2) setHidden(false);
      lastY.current = y;
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => setOpen(false), [pathname]);

  useEffect(() => {
    if (!open) return;
    lockScroll("menu");
    const onKey = (e) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => {
      unlockScroll("menu");
      window.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const isActive = (href) => pathname === href || (href !== "/" && pathname.startsWith(href));

  return (
    <>
      <header
        className={`fixed inset-x-0 top-0 z-50 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${
          hidden && !open ? "-translate-y-full" : "translate-y-0"
        }`}
      >
        <div
          className={`pointer-events-none absolute inset-0 transition-opacity duration-500 ${solid ? "opacity-100" : "opacity-0"}`}
          style={{ background: "linear-gradient(to bottom, rgba(10,9,8,0.92), rgba(10,9,8,0.6) 60%, rgba(10,9,8,0))" }}
        />
        <nav className="relative mx-auto flex max-w-[110rem] items-start justify-between px-5 py-5 md:px-8">
          <Link href="/" className="group relative z-10 block leading-none">
            <span className="block font-display text-[1.6rem] tracking-tight text-bone">{site.name}</span>
            <span className="mt-1 block font-mono text-[9px] uppercase tracking-hud text-bone/45 transition-colors group-hover:text-saffron">
              {fmtCoords(site.base.lat, site.base.lon)}
            </span>
          </Link>

          <div className="hidden pt-1.5 font-mono text-[10px] uppercase tracking-hud text-bone/70 lg:block">
            <BaseClock />
          </div>

          <ul className="hidden items-center gap-7 pt-1 md:flex">
            {site.nav.map((item, i) => (
              <li key={item.href}>
                <Link
                  href={item.href}
                  className={`group flex items-baseline gap-1.5 font-mono text-[11px] uppercase tracking-hud transition-colors ${
                    isActive(item.href) ? "text-saffron" : "text-bone/80 hover:text-bone"
                  }`}
                >
                  <span className="text-[9px] text-bone/35">{String(i + 1).padStart(2, "0")}</span>
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>

          <button
            onClick={() => setOpen((v) => !v)}
            className="relative z-10 flex items-center gap-2 pt-1 font-mono text-[11px] uppercase tracking-hud text-bone md:hidden"
            aria-label={open ? "Close menu" : "Open menu"}
            aria-expanded={open}
          >
            <span className={`h-1.5 w-1.5 rounded-full transition-colors ${open ? "bg-saffron" : "bg-bone"}`} />
            {open ? "Close" : "Menu"}
          </button>
        </nav>
      </header>

      {/* Full-screen menu (mobile) */}
      <AnimatePresence>
        {open && (
          <motion.div
            key="menu"
            initial={{ clipPath: "inset(0 0 100% 0)" }}
            animate={{ clipPath: "inset(0 0 0% 0)" }}
            exit={{ clipPath: "inset(0 0 100% 0)" }}
            transition={{ duration: 0.7, ease }}
            className="fixed inset-0 z-40 flex flex-col justify-end overflow-hidden bg-night px-5 pb-10 pt-28"
          >
            <AnimatePresence>
              {hover && MENU_FRAMES[hover] && (
                <motion.div
                  key={hover}
                  initial={{ opacity: 0, scale: 1.08 }}
                  animate={{ opacity: 0.35, scale: 1 }}
                  exit={{ opacity: 0 }}
                  transition={{ duration: 0.6, ease }}
                  className="absolute inset-0"
                >
                  <Image src={photo(MENU_FRAMES[hover]).src} alt="" fill sizes="100vw" className="object-cover" />
                </motion.div>
              )}
            </AnimatePresence>
            <ul className="relative space-y-1">
              {[{ label: "Home", href: "/" }, ...site.nav].map((item, i) => (
                <motion.li
                  key={item.href}
                  initial={{ y: "100%", opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 + i * 0.06, duration: 0.7, ease }}
                >
                  <Link
                    href={item.href}
                    onPointerEnter={() => setHover(item.href)}
                    onFocus={() => setHover(item.href)}
                    className={`flex items-baseline gap-4 font-display text-5xl leading-tight ${
                      isActive(item.href) && item.href !== "/" ? "text-saffron" : "text-bone"
                    }`}
                  >
                    <span className="font-mono text-xs text-bone/40">{String(i).padStart(2, "0")}</span>
                    {item.label}
                  </Link>
                </motion.li>
              ))}
            </ul>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.6 }}
              className="relative mt-10 space-y-1 border-t border-line pt-6 font-mono text-[11px] uppercase tracking-hud text-bone/60"
            >
              <p>{site.email}</p>
              <p>{site.phone}</p>
              <div className="pt-3 text-bone/40">
                <BaseClock />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
