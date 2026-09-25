import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import ServiceList from "@/components/sections/ServiceList";
import Departures from "@/components/sections/Departures";
import Process from "@/components/sections/Process";
import CTA from "@/components/sections/CTA";

export const metadata = {
  title: "Services — Hive Akshat Photography",
  description:
    "Tourism campaigns, hotel and heritage photography, temple and festival documentation, fine-art prints, photo walks and wildlife — by Hive Akshat, Ajmer.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title={[{ text: "Pictures that" }, { text: "move people.", emphasis: true }]}
        intro="For tourism boards, hotels, temple trusts, publications — and anyone who wants to see a place properly. Every brief is shaped around the destination and its light."
        meta="Based in Ajmer · Travels across India"
      />
      <section className="bg-night py-20 md:py-28">
        <Container>
          <ServiceList />
        </Container>
      </section>
      <Process />
      <section className="bg-night py-24 md:py-32">
        <Container>
          <SectionHeading
            index="→"
            eyebrow="Photo walks & expeditions"
            title={[{ text: "Next" }, { text: "departures.", emphasis: true }]}
            intro="Small groups, early starts. Dates are indicative — message to hold a seat."
            className="mb-14"
          />
          <Departures />
        </Container>
      </section>
      <CTA />
    </>
  );
}
