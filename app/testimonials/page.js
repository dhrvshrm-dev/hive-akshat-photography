import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/sections/CTA";
import { testimonials } from "@/data/testimonials";

export const metadata = {
  title: "Kind words — Hive Akshat Photography",
  description: "What hotels, tourism teams, editors and expedition guests say about working with Hive Akshat.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kind words"
        title={[{ text: "Word from" }, { text: "the road.", emphasis: true }]}
        intro="From hotels and tourism teams to the people who got up at four in the morning to come along."
      />
      <section className="bg-night py-20 md:py-28">
        <Container>
          <div className="grid gap-px bg-line md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={i} delay={(i % 2) * 0.08} className="group h-full bg-night">
                <figure className="relative flex h-full flex-col p-8 transition-colors duration-500 group-hover:bg-soot md:p-12">
                  <span className="brackets pointer-events-none absolute inset-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100" style={{ "--c": "#F0782D" }} />
                  <span className="font-mono text-[10px] tracking-hud text-bone/35">{String(i + 1).padStart(2, "0")}</span>
                  <blockquote className="mt-6 flex-1 font-display text-2xl leading-snug text-bone md:text-3xl">“{t.quote}”</blockquote>
                  <figcaption className="mt-8 font-mono text-[10px] uppercase tracking-hud">
                    <span className="text-bone">{t.name}</span>
                    <span className="text-bone/45"> · {t.org}</span>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>
      <CTA />
    </>
  );
}
