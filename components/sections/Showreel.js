import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";

// Video showreel. Replace VIDEO_ID with a real YouTube ID (the part after "v=").
// Video showreel. Replace VIDEO_ID with a real YouTube ID (the part after "v=").
// Video showreel. Replace VIDEO_ID with a real YouTube ID (the part after "v=").
const VIDEO_ID = "dQw4w9WgXcQ"; // Example YouTube video ID
export default function Showreel() {
  return (
    <section className="bg-blush py-24">
      <Container>
        <SectionHeading
          eyebrow="In motion"
          title="The showreel"
          align="center"
        />

        <Reveal className="mx-auto mt-12 max-w-4xl">
          <div className="relative aspect-video overflow-hidden border border-line bg-ink">
            <iframe
              className="absolute inset-0 h-full w-full pointer-events-none"
              src={`https://www.youtube.com/embed/${VIDEO_ID}?autoplay=1&mute=1&controls=0&loop=1&playlist=${VIDEO_ID}&rel=0&playsinline=1&disablekb=1`}
              title="Showreel"
              tabIndex={-1}
              allow="autoplay; encrypted-media"
            />
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
