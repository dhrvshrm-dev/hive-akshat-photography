"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AnimatePresence, motion } from "framer-motion";
import { site } from "@/data/site";
import { ease, springSnappy } from "@/lib/motion";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  // Add a solid background once the user scrolls past the top.
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    onScroll();
    window.addEventListener("scroll", onScroll);
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // Close the mobile menu whenever the route changes.
  useEffect(() => setOpen(false), [pathname]);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-colors duration-300 ${
        scrolled || open ? "bg-ivory/95 backdrop-blur border-b border-line" : "bg-transparent"
      }`}
    >
      <nav className="mx-auto flex max-w-content items-center justify-between px-6 py-4 md:px-8">
        <Link href="/" className="font-display text-2xl tracking-tight text-ink" data-cursor="Home">
          {site.name}
        </Link>

        {/* Desktop links */}
        <ul className="hidden items-center gap-8 md:flex">
          {site.nav.map((item) => (
            <li key={item.href} className="relative">
              <Link
                href={item.href}
                className={`text-xs uppercase tracking-widest transition-colors hover:text-rose ${
                  pathname === item.href ? "text-rose" : "text-ink"
                }`}
              >
                {item.label}
              </Link>
              {pathname === item.href && (
                <motion.span
                  layoutId="navUnderline"
                  transition={springSnappy}
                  className="absolute -bottom-1.5 left-0 h-px w-full bg-rose"
                />
              )}
            </li>
          ))}
        </ul>

        {/* Mobile toggle */}
        <button
          onClick={() => setOpen((v) => !v)}
          className="flex flex-col gap-1.5 md:hidden"
          aria-label="Toggle menu"
          aria-expanded={open}
        >
          <span
            className={`h-px w-6 origin-center bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "translate-y-[6.5px] rotate-45" : ""
            }`}
          />
          <span
            className={`h-px w-6 bg-ink transition-all duration-300 ${open ? "scale-x-0 opacity-0" : ""}`}
          />
          <span
            className={`h-px w-6 origin-center bg-ink transition-transform duration-400 ease-[cubic-bezier(0.22,1,0.36,1)] ${
              open ? "-translate-y-[6.5px] -rotate-45" : ""
            }`}
          />
        </button>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {open && (
          <motion.ul
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: "auto", opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden border-t border-line bg-ivory md:hidden"
          >
            {site.nav.map((item, i) => (
              <motion.li
                key={item.href}
                initial={{ opacity: 0, x: -16 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.08 + i * 0.05, duration: 0.4, ease }}
                className="border-b border-line/60"
              >
                <Link
                  href={item.href}
                  className={`block px-6 py-4 text-sm uppercase tracking-widest ${
                    pathname === item.href ? "text-rose" : "text-ink"
                  }`}
                >
                  {item.label}
                </Link>
              </motion.li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>
    </header>
  );
}
