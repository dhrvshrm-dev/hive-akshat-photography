import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";

// Top banner used at the start of inner pages. Sits below the fixed navbar.
export default function PageHeader({ eyebrow, title, intro }) {
  return (
    <section className="border-b border-line pb-16 pt-36 md:pt-44">
      <Container>
        <Reveal>
          {eyebrow && <p className="mb-3 text-xs uppercase tracking-widest text-rose">{eyebrow}</p>}
          <SplitText
            as="h1"
            delay={0.15}
            className="block max-w-3xl font-display text-4xl leading-tight text-ink md:text-6xl"
          >
            {title}
          </SplitText>
          {intro && <p className="mt-5 max-w-2xl text-taupe">{intro}</p>}
        </Reveal>
      </Container>
    </section>
  );
}
