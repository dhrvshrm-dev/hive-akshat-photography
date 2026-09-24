import Hero from "@/components/sections/Hero";
import ClientLogos from "@/components/sections/ClientLogos";
import FeaturedWork from "@/components/sections/FeaturedWork";
import ServicesPreview from "@/components/sections/ServicesPreview";
import Process from "@/components/sections/Process";
import TestimonialsPreview from "@/components/sections/TestimonialsPreview";
import CTA from "@/components/sections/CTA";
import GLPhotoField from "@/components/webgl/GLPhotoField";
import GLScrollStrip from "@/components/webgl/GLScrollStrip";
import { portfolio } from "@/data/portfolio";

export default function HomePage() {
  return (
    <>
      <Hero />
      <ClientLogos />
      <FeaturedWork />
      {/* Full-bleed interlude: the portfolio as a field that swells under the
          cursor and bows with the scroll. Drawn by the shared canvas, so it
          costs no second WebGL context. */}
      <section className="bg-ink">
        <GLPhotoField images={portfolio} className="h-[80svh] min-h-[420px]" />
      </section>
      <ServicesPreview />
      <Process />
      {/* A band of frames that drifts sideways as the page passes it, bending
          with the speed of the scroll and settling clean the moment it stops. */}
      <section className="bg-ink">
        <GLScrollStrip images={portfolio} className="h-[56svh] min-h-[320px]" />
      </section>
      <TestimonialsPreview />
      <CTA />
    </>
  );
}
