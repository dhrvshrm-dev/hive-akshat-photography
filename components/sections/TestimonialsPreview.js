import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Link from "next/link";
import { testimonials } from "@/data/testimonials";

export default function TestimonialsPreview() {
  const few = testimonials.slice(0, 3);
  return (
    <section className="bg-ink py-24 text-ivory">
      <Container>
        <p className="mb-3 text-center text-xs uppercase tracking-widest text-gold">Kind words</p>
        <h2 className="text-center font-display text-3xl md:text-5xl">Loved by the families we serve</h2>
        <div className="mt-14 grid gap-8 md:grid-cols-3">
          {few.map((t, i) => (
            <Reveal key={t.name} delay={i * 0.08}>
              <figure className="flex h-full flex-col border border-ivory/15 p-8">
                <blockquote className="flex-1 font-display text-xl leading-relaxed text-ivory/90">
                  “{t.quote}”
                </blockquote>
                <figcaption className="mt-6">
                  <p className="text-sm text-ivory">{t.name}</p>
                  <p className="text-xs uppercase tracking-widest text-gold">{t.event}</p>
                </figcaption>
              </figure>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Link href="/testimonials" className="text-xs uppercase tracking-widest text-gold hover:text-ivory">
            Read more stories →
          </Link>
        </div>
      </Container>
    </section>
  );
}
