import GLPhotoField from "@/components/webgl/GLPhotoField";
import GLScrollStrip from "@/components/webgl/GLScrollStrip";
import { photos } from "@/data/photos";

const archive = photos.filter((p) => p.archive !== false);

/** The whole archive at once, as a field that swells under the cursor. */
export function ContactSheet() {
  return (
    <section className="relative bg-night">
      <div className="pointer-events-none absolute inset-x-0 top-0 z-[3] flex items-start justify-between px-5 pt-8 font-mono text-[10px] uppercase tracking-hud text-bone/60 md:px-12">
        <span>
          <span className="text-saffron">●</span> Contact sheet · {archive.length} frames
        </span>
        <span className="hidden md:inline">Move through it</span>
      </div>
      <GLPhotoField images={archive} className="h-[80svh] min-h-[420px]" cell={150} cardSize={68} magnify={2.3} drain={0.7} />
    </section>
  );
}

/** A roll of film that drifts past as the page scrolls. */
export function FilmStrip({ ids, label = "Roll 07" }) {
  const frames = ids ? ids.map((id) => archive.find((p) => p.id === id)).filter(Boolean) : archive.slice(0, 12);
  return (
    <section className="relative bg-night py-6">
      <div className="sprockets mx-auto" />
      <div className="flex items-center justify-between px-5 py-2 font-mono text-[9px] uppercase tracking-hud text-ember/70 md:px-12">
        <span>{label}</span>
        <span>▸ {String(frames.length).padStart(2, "0")}</span>
        <span className="hidden sm:inline">Hive Akshat · Ajmer</span>
      </div>
      <GLScrollStrip images={frames} className="h-[48svh] min-h-[300px]" />
      <div className="flex items-center justify-between px-5 py-2 font-mono text-[9px] uppercase tracking-hud text-ember/70 md:px-12">
        {frames.slice(0, 6).map((f, i) => (
          <span key={f.id} className={i > 2 ? "hidden md:inline" : ""}>
            {String(i * 2 + 1).padStart(2, "0")}A · {f.place}
          </span>
        ))}
      </div>
      <div className="sprockets mx-auto" />
    </section>
  );
}
