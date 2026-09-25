import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";
import GLContours from "@/components/webgl/GLContours";

// Top banner for inner pages: a live topographic sheet behind a big title.
export default function PageHeader({ eyebrow, title, intro, meta, children }) {
  return (
    <section className="relative overflow-hidden border-b border-line bg-night pb-16 pt-40 md:pb-24 md:pt-52">
      <GLContours className="absolute inset-0" density={10} opacity={0.11} />
      <Container className="relative z-[2]">
        <Reveal>
          {eyebrow && (
            <p className="mb-6 flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/60">
              <span className="h-1.5 w-1.5 rounded-full bg-saffron" />
              {eyebrow}
            </p>
          )}
        </Reveal>
        <SplitText as="h1" delay={0.15} className="block max-w-5xl font-display text-fluid-xl text-bone">
          {title}
        </SplitText>
        {(intro || meta) && (
          <Reveal delay={0.2}>
            <div className="mt-10 flex flex-col justify-between gap-6 md:flex-row md:items-end">
              {intro && <p className="max-w-xl text-lg text-bone/65">{intro}</p>}
              {meta && <p className="font-mono text-[10px] uppercase tracking-hud text-bone/45">{meta}</p>}
            </div>
          </Reveal>
        )}
        {children}
      </Container>
    </section>
  );
}
