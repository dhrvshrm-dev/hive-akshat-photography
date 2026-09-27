import { pageMeta } from "@/lib/seo";
import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import JourneysMap from "@/components/journeys/JourneysMap";
import JourneyChapter from "@/components/journeys/JourneyChapter";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import CTA from "@/components/sections/CTA";
import { abroadJourneys, indiaJourneys, journeys } from "@/data/journeys";
import { photos } from "@/data/photos";

export const metadata = pageMeta({
  title: "Journeys — Photography from Ajmer, Pushkar, Rajasthan & across India",
  description:
    "Photographs by Akshat Singh Chaudhary from Ajmer, Pushkar, Sambhar, Jaipur, Jodhpur, the Rann of Kutch, Varanasi, the north-east and beyond — wildlife, heritage, landscapes and aerials.",
  path: "/journeys",
});

export default function JourneysPage() {
  const frames = photos.filter((p) => p.archive !== false).length;
  return (
    <>
      <PageHeader
        eyebrow="Journeys · The expedition map"
        title={[
          { text: `${journeys.length} journeys.` },
          { text: "One road.", emphasis: true },
        ]}
        intro="Every trip starts from Ajmer. Follow the line, open a chapter, or skip straight to the archive."
        meta={`${indiaJourneys.length} in India · ${abroadJourneys.length} beyond · ${frames} frames`}
      />

      <section className="relative bg-night py-20 md:py-28">
        <Container>
          <JourneysMap />
        </Container>
      </section>

      {journeys.map((j, i) => (
        <JourneyChapter key={j.slug} j={j} index={i} total={journeys.length} />
      ))}

      <section
        id="archive"
        className="scroll-mt-24 border-t border-line bg-night py-24 md:py-32"
      >
        <Container>
          <SectionHeading
            index="A"
            eyebrow="The archive"
            title={[
              { text: "Every frame," },
              { text: "sorted by what it holds.", emphasis: true },
            ]}
            className="mb-14"
          />
          <GalleryGrid />
        </Container>
      </section>

      <CTA />
    </>
  );
}
