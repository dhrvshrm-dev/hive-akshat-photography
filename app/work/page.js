import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Showreel from "@/components/sections/Showreel";
import GalleryGrid from "@/components/gallery/GalleryGrid";
import CTA from "@/components/sections/CTA";

export const metadata = {
  title: "Work — Hive Akshat Photography",
  description: "Weddings, pre-weddings and events photographed by Hive Akshat across Rajasthan.",
};

export default function WorkPage() {
  return (
    <>
      <PageHeader
        eyebrow="Portfolio"
        title="The work"
        intro="A collection of weddings, pre-weddings and functions. Use the filters to explore, and tap any image to view it full-screen."
      />
      <Showreel />
      <section className="py-24">
        <Container>
          <GalleryGrid />
        </Container>
      </section>
      <CTA />
    </>
  );
}
