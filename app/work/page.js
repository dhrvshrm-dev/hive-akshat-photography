import Image from "next/image";
import { pageMeta } from "@/lib/seo";
import { photo } from "@/data/photos";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceList from "@/components/sections/ServiceList";
import Departures from "@/components/sections/Departures";
import CTA from "@/components/sections/CTA";

export const metadata = pageMeta({
  title: "Work — Wildlife, Nature, Aerial & Astrophotography in Rajasthan",
  description:
    "Wildlife and bird photography at Ana Sagar and Sambhar, landscapes, nature, drone and aerial work, astrophotography, heritage, films and tourism collaborations by Akshat Singh Chaudhary.",
  path: "/work",
});

// From the photography workshop, 8 September 2026.
const WORKSHOP = ["workshop-talk", "workshop-audience", "workshop-podium"].map(
  photo,
);

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Work"
        title={[{ text: "What I" }, { text: "photograph.", emphasis: true }]}
        intro="Wildlife, landscapes, nature, the night sky and the view from above — plus the films, tourism collaborations and talks that grow out of them."
        meta="No commercial shoots · Collaborations & talks welcome"
      />
      <section className="bg-night py-20 md:py-28">
        <Container>
          <ServiceList />
        </Container>
      </section>
      <section className="border-t border-line bg-night py-24 md:py-32">
        <Container>
          <SectionHeading
            index="→"
            eyebrow="Knowledge sharing & community"
            title={[
              { text: "Talks, workshops" },
              { text: "& judging.", emphasis: true },
            ]}
            intro="Sessions on visual storytelling, digital content creation and observational photography — and judging inter-college photography competitions. Invite me to your institution."
            className="mb-14"
          />
          <Departures />
          <div className="mt-14 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {WORKSHOP.map((p) => (
              <figure
                key={p.id}
                className="relative aspect-[4/3] overflow-hidden border border-line"
              >
                <Image
                  src={p.src}
                  alt={p.title}
                  fill
                  sizes="(min-width: 640px) 33vw, 100vw"
                  className="object-cover"
                  style={{
                    objectPosition: `${p.focus[0] * 100}% ${p.focus[1] * 100}%`,
                  }}
                />
                <figcaption className="absolute bottom-0 left-0 bg-night/70 px-2 py-1 font-mono text-[10px] uppercase tracking-[0.2em] text-bone/80">
                  {p.title}
                </figcaption>
              </figure>
            ))}
          </div>
        </Container>
      </section>
      <CTA />
    </>
  );
}
