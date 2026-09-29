import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SectionHeading from "@/components/ui/SectionHeading";
import FocusImage from "@/components/ui/FocusImage";
import CountUp from "@/components/ui/CountUp";
import CTA from "@/components/sections/CTA";
import Recognition from "@/components/sections/Recognition";
import CareerPath from "@/components/sections/CareerPath";
import SocialIcon from "@/components/ui/SocialIcon";
import { photo } from "@/data/photos";
import { site, socialLinks, philosophy } from "@/data/site";
import { collaborations } from "@/data/recognition";
import {
  community,
  expertise,
  intro,
  lens,
  philosophyLines,
  philosophyNote,
  shortBio,
  ventureRole,
  ventures,
} from "@/data/about";

export const metadata = pageMeta({
  title:
    "About Akshat Singh Chaudhary — Photographer, Filmmaker & Educationist",
  description:
    "The story of Akshat Singh Chaudhary (Hive Akshat) of Ajmer: two decades of wildlife, heritage and aerial photography, tourism collaborations, awards, and his schools and hospitality ventures.",
  path: "/about",
});

// FILL IN: a real portrait of Akshat (drop it in /public/images and add it to data/photos.js).
const portrait = photo("akshat-sunset");

const stats = [
  { to: 20, suffix: "+ yrs", label: "Behind the lens" },
  { to: collaborations.length, suffix: "", label: "Tourism bodies" },
  {
    to: ventures.education.items.length + ventures.hospitality.items.length,
    suffix: "",
    label: "Institutions & ventures",
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader
        eyebrow={`About · ${site.name}`}
        title={[
          { text: "Akshat Singh" },
          { text: "Chaudhary.", emphasis: true },
        ]}
        intro={site.roles.join(" · ")}
        meta={`Based in ${site.location}, India`}
      />

      {/* Introduction */}
      <section className="bg-night py-20 md:py-28">
        <Container>
          <div className="grid items-start gap-12 md:grid-cols-[1fr_1.15fr] md:gap-20">
            <Reveal>
              <div className="relative">
                <FocusImage
                  p={portrait}
                  inView
                  sizes="(min-width:768px) 45vw, 100vw"
                  className="relative aspect-[4/5] bg-soot"
                />
                <div className="brackets pointer-events-none absolute inset-3" />
                <p className="mt-3 font-mono text-[9px] uppercase tracking-hud text-bone/40">
                  {site.person} · {site.location}
                </p>
              </div>
            </Reveal>
            <div className="md:pt-6">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-hud text-bone/45">
                <span className="text-saffron">●</span> Biography
              </p>
              <Reveal>
                <p className="font-display text-2xl leading-snug text-bone md:text-[1.9rem]">
                  {intro}
                </p>
              </Reveal>
              <Reveal delay={0.1}>
                <p className="mt-8 text-bone/65">{shortBio}</p>
              </Reveal>
              <div className="mt-12 grid grid-cols-3 gap-4 border-t border-line pt-8">
                {stats.map((s) => (
                  <div key={s.label}>
                    <CountUp
                      to={s.to}
                      suffix={s.suffix}
                      className="font-display text-3xl text-bone md:text-4xl"
                    />
                    <p className="mt-2 font-mono text-[9px] uppercase tracking-hud text-bone/45">
                      {s.label}
                    </p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Behind the lens */}
      <section className="bg-night pb-20 md:pb-28">
        <Container>
          <p className="mb-6 font-mono text-[10px] uppercase tracking-hud text-bone/45">
            <span className="text-saffron">●</span> Behind the lens
          </p>
          <div className="no-scrollbar -mx-6 flex snap-x snap-mandatory gap-3 overflow-x-auto px-6 md:mx-0 md:grid md:grid-cols-4 md:overflow-visible md:px-0">
            {[
              "akshat-prone",
              "akshat-lake",
              "akshat-pushkar",
              "akshat-silhouette",
            ].map((id) => (
              <figure
                key={id}
                className="w-[70vw] shrink-0 snap-center sm:w-[40vw] md:w-auto"
              >
                <FocusImage
                  p={photo(id)}
                  inView
                  sizes="(min-width:768px) 25vw, 70vw"
                  className="relative aspect-[4/5] bg-soot"
                />
                <figcaption className="mt-2 font-mono text-[9px] uppercase tracking-hud text-bone/45">
                  {photo(id).title}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>

      {/* Philosophy */}
      <section className="bg-paper py-24 text-ink md:py-32">
        <Container>
          <p className="mb-8 font-mono text-[10px] uppercase tracking-hud text-ink/50">
            <span className="text-saffron">●</span> Photography philosophy
          </p>
          <Reveal>
            <blockquote className="max-w-5xl font-display text-[clamp(2rem,4.4vw,4.2rem)] leading-[1.1]">
              <span className="text-saffron">“</span>
              {philosophy}
              <span className="text-saffron">”</span>
            </blockquote>
          </Reveal>
          <div className="mt-14 grid gap-10 md:grid-cols-[1fr_1fr]">
            <div className="space-y-2 font-display text-2xl md:text-3xl">
              {philosophyLines.map((l, i) => (
                <Reveal key={l} delay={i * 0.08}>
                  <p
                    className={i === philosophyLines.length - 1 ? "italic" : ""}
                  >
                    {l}
                  </p>
                </Reveal>
              ))}
            </div>
            <Reveal delay={0.2}>
              <p className="max-w-md text-ink/70">{philosophyNote}</p>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* A journey through the lens */}
      <section className="bg-night py-24 md:py-32">
        <Container>
          <SectionHeading
            index="01"
            eyebrow="A journey through the lens"
            title={[
              { text: "Four ways" },
              { text: "into India.", emphasis: true },
            ]}
          />
          <div className="mt-16 grid gap-x-10 gap-y-16 md:grid-cols-2">
            {lens.map((l, i) => (
              <Reveal key={l.title} delay={(i % 2) * 0.08}>
                <article>
                  <FocusImage
                    p={photo(l.image)}
                    inView
                    sizes="(min-width:768px) 45vw, 100vw"
                    className="relative aspect-[3/2] bg-soot"
                  />
                  <p className="mt-6 font-mono text-[10px] text-saffron">
                    {String(i + 1).padStart(2, "0")}
                  </p>
                  <h3 className="mt-2 font-display text-3xl text-bone">
                    {l.title}
                  </h3>
                  <p className="mt-4 text-bone/65">{l.text}</p>
                </article>
              </Reveal>
            ))}
          </div>

          <div className="mt-24 border-t border-line pt-10">
            <p className="mb-8 font-mono text-[10px] uppercase tracking-hud text-bone/45">
              Areas of expertise
            </p>
            <div className="grid gap-px bg-line sm:grid-cols-2 lg:grid-cols-3">
              {expertise.map((e, i) => (
                <Reveal key={e} delay={i * 0.05} className="bg-night">
                  <div className="flex items-baseline gap-4 p-6">
                    <span className="font-mono text-[10px] text-bone/35">
                      {String(i + 1).padStart(2, "0")}
                    </span>
                    <span className="font-display text-xl text-bone">{e}</span>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <Recognition index="02" />

      {/* Career path */}
      <section className="border-t border-line bg-night py-24 md:py-32">
        <Container>
          <SectionHeading
            index="03"
            eyebrow="Education, leadership & ventures"
            title={[
              { text: "One journey," },
              { text: "six fields.", emphasis: true },
            ]}
            intro="While photography remains at the heart of his creative identity, Akshat's professional journey spans several interconnected fields."
          />
          <div className="mt-16">
            <CareerPath />
          </div>
        </Container>
      </section>

      {/* Ventures */}
      <section
        id="ventures"
        className="scroll-mt-20 bg-paper py-24 text-ink md:py-32"
      >
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.2fr]">
            <div>
              <p className="mb-6 font-mono text-[10px] uppercase tracking-hud text-ink/50">
                <span className="text-saffron">●</span>{" "}
                {ventures.education.title}
              </p>
              <p className="max-w-md text-ink/70">{ventures.education.note}</p>
              <p className="mt-4 font-mono text-[10px] uppercase tracking-hud text-ink/60">
                {site.person} ·{" "}
                <span className="text-saffron">{ventureRole}</span>
              </p>
              <div className="mt-10">
                {ventures.education.items.map((v, i) => (
                  <Reveal key={v.name} delay={i * 0.06}>
                    <div className="grid grid-cols-[2.5rem_1fr] gap-4 border-t border-ink/15 py-5">
                      <span className="font-mono text-[10px] text-ink/40">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <span>
                        <span className="block font-display text-2xl leading-tight">
                          {v.name}
                        </span>
                        <span className="mt-1 block font-mono text-[10px] uppercase tracking-hud text-ink/50">
                          {v.kind}
                          {v.place ? ` · ${v.place}` : ""}
                        </span>
                      </span>
                    </div>
                  </Reveal>
                ))}
              </div>
            </div>
            <div>
              <p className="mb-6 font-mono text-[10px] uppercase tracking-hud text-ink/50">
                <span className="text-saffron">●</span>{" "}
                {ventures.hospitality.title}
              </p>
              <div className="grid gap-8 sm:grid-cols-2">
                {ventures.hospitality.items.map((v, i) => (
                  <Reveal key={v.name} delay={i * 0.1}>
                    <article className="group">
                      {v.image ? (
                        <FocusImage
                          p={photo(v.image)}
                          inView
                          sizes="(min-width:640px) 30vw, 100vw"
                          className="relative aspect-[4/5] bg-ink/10"
                        />
                      ) : (
                        <span className="block h-px w-12 bg-saffron" />
                      )}
                      <p className="mt-5 font-mono text-[10px] uppercase tracking-hud text-ink/50">
                        {v.kind} · {v.place}
                      </p>
                      <h3 className="mt-2 font-display text-3xl leading-tight">
                        {v.name}
                      </h3>
                      <p className="mt-3 text-ink/70">{v.text}</p>
                    </article>
                  </Reveal>
                ))}
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Knowledge sharing + connect */}
      <section className="bg-night py-24 md:py-32">
        <Container>
          <div className="grid gap-16 md:grid-cols-2">
            <div>
              <SectionHeading
                index="04"
                eyebrow={community.title}
                title={[
                  { text: "Passing" },
                  { text: "it on.", emphasis: true },
                ]}
              />
              <Reveal delay={0.1}>
                <p className="mt-8 max-w-lg text-bone/65">{community.text}</p>
              </Reveal>
            </div>
            <div id="connect">
              <p className="mb-6 font-mono text-[10px] uppercase tracking-hud text-bone/45">
                Connect & digital presence · follow as{" "}
                <span className="text-bone">{site.name}</span>
              </p>
              <ul className="border-t border-line">
                {socialLinks.map((s) => (
                  <li key={s.label} className="border-b border-line">
                    <a
                      href={s.href}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="group flex items-baseline justify-between gap-6 py-5"
                    >
                      <span className="flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/45 transition-colors group-hover:text-saffron">
                        <SocialIcon name={s.icon} className="h-5 w-5" />
                        {s.label}
                      </span>
                      <span className="font-display text-2xl text-bone transition-colors group-hover:text-saffron">
                        {s.handle} ↗
                      </span>
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <CTA
        title={[
          { text: "Let’s tell" },
          { text: "India’s story.", emphasis: true },
        ]}
      />
    </>
  );
}
