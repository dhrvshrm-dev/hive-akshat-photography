import Hero from "@/components/sections/Hero";
import PlacesMarquee from "@/components/sections/PlacesMarquee";
import Manifesto from "@/components/sections/Manifesto";
import JourneyReel from "@/components/sections/JourneyReel";
import Recognition from "@/components/sections/Recognition";
import Films from "@/components/sections/Films";
import Disciplines from "@/components/sections/Disciplines";
import FieldNumbers from "@/components/sections/FieldNumbers";
import TestimonialsPreview from "@/components/sections/TestimonialsPreview";
import CTA from "@/components/sections/CTA";
import { ContactSheet, FilmStrip } from "@/components/sections/ContactSheet";

export default function HomePage() {
  return (
    <>
      <Hero />
      <PlacesMarquee />
      <Manifesto />
      <Recognition />
      <JourneyReel />
      <Films />
      <Disciplines />
      {/* Full-bleed interlude: the whole archive as one field under the cursor.
          Drawn by the shared canvas, so it costs no second WebGL context. */}
      <ContactSheet />
      <FieldNumbers />
      <TestimonialsPreview />
      <FilmStrip
        label="Roll 07 · Rajasthan"
        ids={["pushkar-camels", "jaisalmer-window", "amber-fort", "bundi-lady", "thar-dunes", "jantar-mantar", "galta-ji", "rajasthan-shepherd", "ajmer-jhonpra-arch", "jaisalmer-fort", "macaque", "pushkar-ghats"]}
      />
      <CTA />
    </>
  );
}
