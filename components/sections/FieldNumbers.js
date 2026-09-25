import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import CountUp from "@/components/ui/CountUp";
import { photos } from "@/data/photos";
import { journeys } from "@/data/journeys";

// Every number here is computed from the archive itself, so it stays true as
// photographs are added or replaced.
export default function FieldNumbers() {
  const archive = photos.filter((p) => p.archive !== false);
  const highest = archive.reduce((a, p) => ((p.alt || 0) > (a.alt || 0) ? p : a), archive[0]);
  const south = archive.reduce((a, p) => (p.lat < a.lat ? p : a), archive[0]);
  const north = archive.reduce((a, p) => (p.lat > a.lat ? p : a), archive[0]);
  const regions = new Set(archive.map((p) => p.region)).size;
  // Great-circle-ish north–south spread, in km.
  const spread = Math.round((north.lat - south.lat) * 111);

  const stats = [
    { to: highest.alt, suffix: " m", label: "Highest frame", note: highest.place },
    { to: spread, suffix: " km", label: "North to south", note: `${north.place} → ${south.place}` },
    { to: regions, suffix: "", label: "States & regions", note: `${journeys.length} journeys` },
    { to: archive.length, suffix: "", label: "Frames on this site", note: "and counting" },
  ];

  return (
    <section className="relative bg-paper py-24 text-ink md:py-32">
      <Container>
        <p className="mb-14 flex items-center gap-3 font-mono text-[10px] uppercase tracking-hud text-ink/50">
          <span className="text-saffron">06</span>
          <span className="h-px w-8 bg-ink/25" />
          Field log
        </p>
        <div className="grid grid-cols-2 gap-x-6 gap-y-14 md:grid-cols-4">
          {stats.map((s, i) => (
            <Reveal key={s.label} delay={i * 0.08}>
              <div className="border-t border-ink/20 pt-5">
                <CountUp
                  to={s.to}
                  suffix={s.suffix}
                  className="block font-display text-[clamp(2.2rem,5vw,4.5rem)] leading-none tabular-nums"
                />
                <p className="mt-4 font-mono text-[10px] uppercase tracking-hud text-ink/70">{s.label}</p>
                <p className="mt-1 text-sm text-ink/50">{s.note}</p>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
