import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import DrawLine from "@/components/ui/DrawLine";
import { process } from "@/data/services";

// Numbered because this is a genuine sequence: brief -> recce -> shoot -> deliver.
export default function Process() {
  return (
    <section className="bg-paper py-24 text-ink md:py-32">
      <Container>
        <p className="mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-ink/50">
          <span className="text-saffron">How it works</span>
          <span className="h-px w-8 bg-ink/25" />
          Four stops
        </p>
        <h2 className="font-display text-fluid-lg">
          From brief to <span className="italic">golden hour.</span>
        </h2>
        <div className="mt-16 hidden text-ink/30 md:block">
          <DrawLine />
        </div>
        <div className="mt-10 grid gap-10 md:mt-0 md:grid-cols-4">
          {process.map((p, i) => (
            <Reveal key={p.step} delay={i * 0.1}>
              <div className="relative border-t border-ink/20 pt-6 md:border-t-0">
                <span className="absolute -top-[5px] left-0 hidden h-2.5 w-2.5 rounded-full border border-ink bg-paper md:block" />
                <span className="font-mono text-[10px] uppercase tracking-hud text-ink/50">
                  {String(i + 1).padStart(2, "0")} · {p.time}
                </span>
                <h3 className="mt-3 font-display text-2xl">{p.step}</h3>
                <p className="mt-2 text-sm leading-relaxed text-ink/65">{p.desc}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
