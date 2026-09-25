import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import { photos } from "@/data/photos";

export const metadata = {
  title: "Photo credits — Hive Akshat Photography",
  robots: { index: false },
};

// Placeholder photographs are Creative Commons works from Wikimedia Commons and
// must stay credited until each one is replaced with Akshat's own.
export default function CreditsPage() {
  return (
    <>
      <PageHeader
        eyebrow="Credits"
        title="Photo credits"
        intro="Placeholder photographs used while the site is being built, from Wikimedia Commons under the licences listed."
      />
      <section className="bg-night py-16 md:py-24">
        <Container>
          <ul className="border-t border-line font-mono text-[11px] tracking-hud">
            {photos.map((p) => (
              <li key={p.id} className="grid gap-1 border-b border-line py-4 md:grid-cols-[1.2fr_1fr_0.6fr_auto] md:gap-6">
                <span className="text-bone">{p.title}</span>
                <span className="text-bone/60">{p.credit.author}</span>
                <span className="text-bone/45">{p.credit.license}</span>
                <a href={p.credit.source} target="_blank" rel="noopener noreferrer" className="link-sweep w-fit uppercase text-bone/60 hover:text-saffron">
                  Source ↗
                </a>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
