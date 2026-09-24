import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import DrawLine from "@/components/ui/DrawLine";
import { process } from "@/data/services";

// Numbered because this is a genuine sequence: enquire -> meet -> shoot -> deliver.
export default function Process() {
  return (
    <section className="py-24">
      <Container>
        <SectionHeading eyebrow="How it works" title="Simple, from hello to gallery" />
        {/* On wide screens one continuous line draws across all four steps */}
        <div className="mt-14 hidden text-line md:block">
          <DrawLine />
        </div>
        <div className="mt-10 grid gap-10 md:mt-0 md:grid-cols-4">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.08}>
              <div className="border-t border-line pt-5 md:border-t-0">
                <span className="font-display text-4xl text-gold">{String(i + 1).padStart(2, "0")}</span>
                <h3 className="mt-3 font-display text-xl text-ink">{p.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-taupe">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
