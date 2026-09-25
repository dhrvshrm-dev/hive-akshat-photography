import Reveal from "@/components/ui/Reveal";
import SplitText from "@/components/ui/SplitText";

// Consistent heading block: a mono index + label, then a large display title.
export default function SectionHeading({ index, eyebrow, title, align = "left", className = "", intro }) {
  return (
    <div className={`${align === "center" ? "text-center" : ""} ${className}`}>
      <Reveal>
        {eyebrow && (
          <p className={`mb-5 flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-bone/50 ${align === "center" ? "justify-center" : ""}`}>
            {index && <span className="text-saffron">{index}</span>}
            <span className="h-px w-8 bg-bone/25" />
            {eyebrow}
          </p>
        )}
      </Reveal>
      <SplitText as="h2" whileInView delay={0.05} className="block font-display text-fluid-lg text-bone">
        {title}
      </SplitText>
      {intro && (
        <Reveal delay={0.15}>
          <p className={`mt-6 max-w-xl text-bone/60 ${align === "center" ? "mx-auto" : ""}`}>{intro}</p>
        </Reveal>
      )}
    </div>
  );
}
