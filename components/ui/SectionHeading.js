import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";

// Consistent heading block: small eyebrow label + large display title.
export default function SectionHeading({ eyebrow, title, align = "left", className = "" }) {
  return (
    <Reveal className={`${align === "center" ? "text-center" : ""} ${className}`}>
      {eyebrow && (
        <p className="mb-3 text-xs uppercase tracking-widest text-rose">{eyebrow}</p>
      )}
      <SplitText
        as="h2"
        whileInView
        delay={0.1}
        className="block font-display text-3xl leading-tight text-ink md:text-5xl"
      >
        {title}
      </SplitText>
    </Reveal>
  );
}
