import Image from "next/image";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ImageReveal from "@/components/ui/ImageReveal";
import CountUp from "@/components/ui/CountUp";
import CTA from "@/components/sections/CTA";
import { site } from "@/data/site";

export const metadata = {
  title: "About — Hive Akshat Photography",
  description: "Meet Akshat, a wedding and event photographer based in Ajmer, Rajasthan.",
};

const stats = [
  { to: 150, suffix: "+", label: "Weddings shot" },
  { to: 8, suffix: " yrs", label: "Behind the lens" },
  { to: 20, suffix: "+", label: "Cities covered" },
];

export default function AboutPage() {
  return (
    <>
      <PageHeader eyebrow="About" title="Hello, I'm Akshat" />
      <section className="py-24">
        <Container>
          <div className="grid items-start gap-12 md:grid-cols-2">
            <Reveal>
              <ImageReveal>
                <Image
                  src="https://picsum.photos/seed/ha-portrait/900/1100"
                  alt="Akshat, photographer"
                  width={900}
                  height={1100}
                  className="w-full object-cover"
                />
              </ImageReveal>
            </Reveal>
            <Reveal delay={0.1}>
              <div className="md:pt-6">
                <p className="font-display text-2xl leading-relaxed text-ink md:text-3xl">
                  I photograph weddings the way I&apos;d want mine remembered — honest, warm, and full of the small moments.
                </p>
                <p className="mt-6 text-taupe">
                  Based in {site.location}, I&apos;ve spent years learning to disappear into a day and let it happen.
                  My style leans candid and cinematic: real laughter, quiet glances, the chaos and the calm. I work
                  across Rajasthan and travel anywhere the story takes us.
                </p>
                <p className="mt-4 text-taupe">
                  When we work together, you get someone calm on the day, easy to talk to, and genuinely invested in
                  getting it right — from the first hello to the final gallery.
                </p>

                <div className="mt-10 grid grid-cols-3 gap-4 border-t border-line pt-8">
                  {stats.map((s) => (
                    <div key={s.label}>
                      <CountUp to={s.to} suffix={s.suffix} className="font-display text-3xl text-rose" />
                      <p className="mt-1 text-xs uppercase tracking-widest text-taupe">{s.label}</p>
                    </div>
                  ))}
                </div>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>
      <CTA />
    </>
  );
}
