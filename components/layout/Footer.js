import Link from "next/link";
import Container from "@/components/ui/Container";
import BackToTop from "@/components/layout/BackToTop";
import SocialIcon from "@/components/ui/SocialIcon";
import { site, socialLinks } from "@/data/site";
import { fmtCoords } from "@/lib/format";

export default function Footer() {
  return (
    <footer className="relative z-[2] overflow-hidden border-t border-line bg-night">
      <Container className="pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-hud text-saffron">
              ● {site.person}
            </p>
            <p className="mt-5 font-display text-fluid-md text-bone">
              Ajmer, Rajasthan.
              <br />
              <span className="italic text-bone/50">Anywhere, India.</span>
            </p>
            <p className="mt-5 font-mono text-[11px] uppercase tracking-hud text-bone/40">
              {fmtCoords(site.base.lat, site.base.lon)} · {site.base.alt} m
            </p>
          </div>

          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-hud text-bone/40">
              Index
            </p>
            <ul className="space-y-2">
              {site.footerNav.map((item) => (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    className="link-sweep text-sm text-bone/80 hover:text-bone"
                  >
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-hud text-bone/40">
              Signal
            </p>
            <a
              href={`mailto:${site.email}`}
              className="link-sweep block w-fit text-sm text-bone/80 hover:text-bone"
            >
              {site.email}
            </a>
            <a
              href={`tel:${site.phone.replace(/\s/g, "")}`}
              className="link-sweep mt-2 block w-fit text-sm text-bone/80 hover:text-bone"
            >
              {site.phone}
            </a>
            <ul className="mt-6 grid grid-cols-2 gap-x-5 gap-y-2 font-mono text-[11px] uppercase tracking-hud">
              {socialLinks.map((l) => (
                <li key={l.label}>
                  <a
                    href={l.href}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label={`${l.label} ${l.handle}`}
                    className="inline-flex items-center gap-2 text-bone/70 transition-colors hover:text-saffron"
                  >
                    <SocialIcon name={l.icon} className="h-4 w-4 shrink-0" />
                    {l.label}
                  </a>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* The wordmark, set as big as the page allows. */}
        <p
          aria-hidden="true"
          className="mt-20 select-none whitespace-nowrap text-center font-display leading-[0.8] text-bone/[0.06]"
          style={{ fontSize: "clamp(4rem, 17.5vw, 20rem)" }}
        >
          Hive Akshat
        </p>

        <div className="mt-8 flex flex-col gap-4 border-t border-line pt-6 font-mono text-[10px] uppercase tracking-hud text-bone/40 md:flex-row md:items-center md:justify-between">
          <span>
            © {new Date().getFullYear()} {site.name} · {site.person}
          </span>
          {/* Developer credit */}
          <a
            href={`mailto:${site.developer.email}?subject=${encodeURIComponent("Website enquiry (via Hive Akshat)")}`}
            className="group inline-flex w-fit items-center gap-2 text-bone/40 transition-colors hover:text-bone"
          >
            <span className="h-1 w-1 rounded-full bg-bone/40 transition-colors group-hover:bg-saffron" />
            Designed &amp; built by{" "}
            <span className="text-bone/70 group-hover:text-saffron">
              {site.developer.name}
            </span>
            <span className="hidden normal-case tracking-normal text-bone/30 group-hover:text-bone/60 sm:inline">
              · {site.developer.email}
            </span>
          </a>
          <span className="flex items-center gap-6">
            <Link href="/credits" className="link-sweep hover:text-bone">
              Photo credits
            </Link>
            <BackToTop />
          </span>
        </div>
      </Container>
    </footer>
  );
}
