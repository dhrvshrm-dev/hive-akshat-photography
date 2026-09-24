import Container from "@/components/ui/Container";
import { clients } from "@/data/clients";

export default function ClientLogos() {
  return (
    <section className="overflow-hidden border-y border-line py-12">
      <Container>
        <p className="mb-8 text-center text-xs uppercase tracking-widest text-taupe">
          Trusted by couples &amp; venues across Rajasthan
        </p>
      </Container>

      {/* Track content is duplicated so the -50% slide loops seamlessly */}
      <div className="marquee-mask relative">
        <div className="pointer-events-none absolute inset-y-0 left-0 z-10 w-24 bg-gradient-to-r from-ivory to-transparent" />
        <div className="pointer-events-none absolute inset-y-0 right-0 z-10 w-24 bg-gradient-to-l from-ivory to-transparent" />
        <div className="marquee-track flex items-center gap-x-14">
          {[...clients, ...clients].map((c, i) => (
            <span
              key={`${c}-${i}`}
              aria-hidden={i >= clients.length}
              className="whitespace-nowrap font-display text-xl text-ink/50 transition-colors duration-300 hover:text-rose"
            >
              {c}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}
