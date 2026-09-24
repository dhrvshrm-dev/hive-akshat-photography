import Link from "next/link";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import { site } from "@/data/site";

export default function Footer() {
  return (
    <footer className="mt-24 bg-ink text-ivory">
      <Container className="py-16">
        <div className="grid gap-10 md:grid-cols-3">
          <Reveal>
            <p className="font-display text-3xl">{site.name}</p>
            <p className="mt-2 text-sm text-ivory/60">{site.tagline}</p>
            <p className="mt-1 text-sm text-ivory/60">{site.location}</p>
          </Reveal>

          <Reveal delay={0.1}>
            <p className="mb-4 text-xs uppercase tracking-widest text-gold">Explore</p>
            <ul className="space-y-2">
              {site.nav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="link-sweep text-sm text-ivory/80 hover:text-ivory">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.2}>
            <p className="mb-4 text-xs uppercase tracking-widest text-gold">Get in touch</p>
            <a href={`mailto:${site.email}`} className="link-sweep inline-block text-sm text-ivory/80 hover:text-ivory">
              {site.email}
            </a>
            <a href={`tel:${site.phone}`} className="link-sweep mt-1 block w-fit text-sm text-ivory/80 hover:text-ivory">
              {site.phone}
            </a>
            <div className="mt-4 flex gap-4 text-xs uppercase tracking-widest">
              <a href={site.social.instagram} className="link-sweep text-ivory/80 hover:text-ivory">Instagram</a>
              <a href={site.social.youtube} className="link-sweep text-ivory/80 hover:text-ivory">YouTube</a>
            </div>
          </Reveal>
        </div>

        <Reveal delay={0.25}>
          <div className="mt-12 border-t border-ivory/15 pt-6 text-xs text-ivory/40">
            © {new Date().getFullYear()} {site.name}. All rights reserved.
          </div>
        </Reveal>
      </Container>
    </footer>
  );
}
