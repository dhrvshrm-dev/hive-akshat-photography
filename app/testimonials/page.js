import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import CTA from "@/components/sections/CTA";
import { testimonials } from "@/data/testimonials";

export const metadata = {
  title: "Testimonials — Hive Akshat Photography",
  description: "Words from couples and families photographed by Hive Akshat.",
};

export default function TestimonialsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Kind words"
        title="What couples say"
        intro="Nothing means more than a family trusting us with their day. Here's what a few of them had to say."
      />
      <section className="py-24">
        <Container>
          <div className="grid gap-6 md:grid-cols-2">
            {testimonials.map((t, i) => (
              <Reveal key={t.name} delay={(i % 2) * 0.08} className="group h-full">
                <figure className="flex h-full flex-col border border-line p-8 transition-all duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1 group-hover:border-rose/40 group-hover:bg-blush/40">
                  <blockquote className="flex-1 font-display text-xl leading-relaxed text-ink">
                    “{t.quote}”
                  </blockquote>
                  <figcaption className="mt-6 border-t border-line pt-4">
                    <p className="text-sm text-ink">{t.name}</p>
                    <p className="text-xs uppercase tracking-widest text-rose">{t.event}</p>
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
