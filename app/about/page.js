import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import FocusImage from "@/components/ui/FocusImage";
import CountUp from "@/components/ui/CountUp";
import CTA from "@/components/sections/CTA";
import { FilmStrip } from "@/components/sections/ContactSheet";
import { photo } from "@/data/photos";
import { site } from "@/data/site";

export const metadata = {
  title: "About — Hive Akshat Photography",
  description: "Meet Akshat, a travel, heritage and spiritual photographer based in Ajmer, Rajasthan.",
};

// PLACEHOLDER: swap for a real portrait of Akshat (e.g. /images/akshat.jpg).
const portrait = photo("zanskar-road");

// PLACEHOLDER numbers and kit — confirm with Akshat.
const stats = [
  { to: 12, suffix: " yrs", label: "Behind the lens" },
  { to: 22, suffix: "", label: "States travelled" },
  { to: 400, suffix: "+", label: "Sunrises shot" },
];

const kit = [
  ["Body", "Full-frame mirrorless ×2"],
  ["Wide", "16–35mm f/4"],
  ["Standard", "24–70mm f/2.8"],
  ["Long", "100–400mm"],
  ["Air", "Drone (where permitted)"],
  ["Always", "Tripod, ND filters, headtorch, chai"],
];

const log = [
  ["Ajmer", "Grew up at the foot of Taragarh. First camera, first Pushkar sunrise."],
  ["Rajasthan", "Years spent learning one state properly — its forts, fairs and light."],
  ["The North", "Ladakh, Zanskar, Spiti. Learned patience at 4,000 metres."],
  ["India", "Commissions for hotels, tourism campaigns and publications nationwide."],
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title={[{ text: "Hello, I'm" }, { text: "Akshat.", emphasis: true }]} meta={`${site.location} · ${site.base.alt} m`} />
      <section className="bg-night py-20 md:py-28">
        <Container>
          <div className="grid items-start gap-12 md:grid-cols-[1fr_1.1fr] md:gap-20">
            <Reveal>
              <div className="relative">
                <FocusImage p={portrait} inView sizes="(min-width:768px) 45vw, 100vw" className="relative aspect-[4/5] bg-soot" />
                <div className="brackets pointer-events-none absolute inset-3" />
                <p className="mt-3 font-mono text-[9px] uppercase tracking-hud text-bone/40">Somewhere past Padum — where you&apos;ll usually find me</p>
              </div>
            </Reveal>
            <div className="md:pt-8">
              <Reveal>
                <p className="font-display text-3xl leading-snug text-bone md:text-4xl">
                  I grew up an hour from Pushkar, where a whole town wakes before the sun. I&apos;ve been chasing that light ever since.
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 text-bone/65">
                  My work is travel, heritage and the spiritual life of India — temples at dawn, festivals at full volume, mountains at the
                  edge of breath. I photograph for tourism boards, hotels, temple trusts and publications, and I lead small photo walks for
                  people who want to learn to see a place, not just visit it.
                </p>
                <p className="mt-4 text-bone/65">
                  The method is simple and slow: arrive early, ask permission, and wait for the light to decide.
                </p>
              </Reveal>
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <CountUp to={s.to} suffix={s.suffix} className="font-display text-3xl text-bone md:text-4xl" />
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-hud text-bone/45">{s.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-paper py-24 text-ink md:py-32">
        <Container>
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <p className="mb-8 font-mono text-[10px] uppercase tracking-hud text-ink/50">
                <span className="text-saffron">●</span> Field log
              </p>
              <ol className="space-y-8">
                {log.map(([where, what], i) => (
                  <Reveal key={where} delay={i * 0.08}>
                    <li className="grid grid-cols-[3rem_1fr] gap-4 border-t border-ink/15 pt-5">
                      <span className="font-mono text-[10px] text-ink/40">{String(i + 1).padStart(2, "0")}</span>
                      <span>
                        <span className="block font-display text-2xl">{where}</span>
                        <span className="mt-1 block text-ink/65">{what}</span>
                      </span>
                    </li>
                  </Reveal>
                ))}
              </ol>
            </div>
            <div>
              <p className="mb-8 font-mono text-[10px] uppercase tracking-hud text-ink/50">
                <span className="text-saffron">●</span> In the bag
              </p>
              <dl className="font-mono text-[12px] uppercase tracking-hud">
                {kit.map(([k, v], i) => (
                  <Reveal key={k} delay={i * 0.05}>
                    <div className="flex items-baseline justify-between gap-6 border-t border-ink/15 py-4">
                      <dt className="text-ink/45">{k}</dt>
                      <dd className="text-right">{v}</dd>
                    </div>
                  </Reveal>
                ))}
              </dl>
            </div>
          </div>
        </Container>
      </section>

      <FilmStrip label="Roll 12 · The North" ids={["phuktal", "thiksey", "kee-monastery", "spiti-river", "ladakh-mustard", "sangla-snow", "gurudongmar", "zanskar-road"]} />
      <CTA title={[{ text: "Let’s go" }, { text: "somewhere.", emphasis: true }]} />
    </>
  );
}
