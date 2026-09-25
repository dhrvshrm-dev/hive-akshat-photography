import Link from "next/link";
import Container from "@/components/ui/Container";
import BackToTop from "@/components/layout/BackToTop";
import { site } from "@/data/site";
import { photos } from "@/data/photos";
import { fmtCoords } from "@/lib/format";

export default function Footer() {
  const states = new Set(photos.filter((p) => p.archive !== false).map((p) => p.region)).size;
  return (
    <footer className="relative z-[2] overflow-hidden border-t border-line bg-night">
      <Container className="pb-10 pt-20 md:pt-28">
        <div className="grid gap-14 md:grid-cols-[1.4fr_1fr_1fr]">
          <div>
            <p className="font-mono text-[10px] uppercase tracking-hud text-saffron">● Base camp</p>
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
            <p className="mb-5 font-mono text-[10px] uppercase tracking-hud text-bone/40">Index</p>
            <ul className="space-y-2">
              {site.footerNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-sweep text-sm text-bone/80 hover:text-bone">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <p className="mb-5 font-mono text-[10px] uppercase tracking-hud text-bone/40">Signal</p>
            <a href={`mailto:${site.email}`} className="link-sweep block w-fit text-sm text-bone/80 hover:text-bone">
              {site.email}
            </a>
            <a href={`tel:${site.phone.replace(/\s/g, "")}`} className="link-sweep mt-2 block w-fit text-sm text-bone/80 hover:text-bone">
              {site.phone}
            </a>
            <div className="mt-6 flex gap-5 font-mono text-[11px] uppercase tracking-hud">
              <a href={site.social.instagram} target="_blank" rel="noopener noreferrer" className="link-sweep text-bone/70 hover:text-saffron">
                Instagram
              </a>
              <a href={site.social.youtube} target="_blank" rel="noopener noreferrer" className="link-sweep text-bone/70 hover:text-saffron">
                YouTube
              </a>
            </div>
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
          <span>© {new Date().getFullYear()} {site.name} · {photos.length} frames · {states} regions</span>
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
