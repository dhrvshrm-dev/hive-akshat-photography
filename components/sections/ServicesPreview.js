import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";
import { services } from "@/data/services";

export default function ServicesPreview() {
  return (
    <section className="bg-blush py-24">
      <Container>
        <SectionHeading eyebrow="What we offer" title="Ways we can work together" align="center" />
        <div className="mx-auto mt-14 grid max-w-4xl gap-px overflow-hidden border border-line bg-line sm:grid-cols-2">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.06} className="group bg-ivory">
              <div className="relative h-full overflow-hidden p-8 transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:-translate-y-1">
                <span className="absolute inset-x-0 bottom-0 h-px origin-left scale-x-0 bg-rose transition-transform duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] group-hover:scale-x-100" />
                <h3 className="font-display text-2xl text-ink transition-colors duration-300 group-hover:text-rose">{s.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-taupe">{s.summary}</p>
              </div>
            </Reveal>
          ))}
        </div>
        <div className="mt-12 text-center">
          <Button href="/services">See all services</Button>
        </div>
      </Container>
    </section>
  );
}
