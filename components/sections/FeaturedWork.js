import Image from "next/image";
import Link from "next/link";
import Container from "@/components/ui/Container";
import SectionHeading from "@/components/ui/SectionHeading";
import Reveal from "@/components/ui/Reveal";
import ImageReveal from "@/components/ui/ImageReveal";
import TiltCard from "@/components/ui/TiltCard";
import { portfolio } from "@/data/portfolio";

export default function FeaturedWork() {
  const featured = portfolio.slice(0, 6);
  return (
    <section className="py-24">
      <Container>
        <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
          <SectionHeading eyebrow="Selected work" title="A glimpse of recent stories" />
          <Reveal>
            <Link href="/work" className="text-xs uppercase tracking-widest text-rose hover:text-ink">
              See full portfolio →
            </Link>
          </Reveal>
        </div>

        <div className="grid grid-cols-2 gap-3 md:grid-cols-3 md:gap-4">
          {featured.map((item, i) => (
            <Reveal key={item.id} delay={i * 0.05}>
              <TiltCard>
                <Link href="/work" className="group relative block overflow-hidden" data-cursor="View">
                  <ImageReveal delay={i * 0.05}>
                    <Image
                      src={item.src}
                      alt={item.title}
                      width={item.w}
                      height={item.h}
                      className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-105"
                    />
                  </ImageReveal>
                  <div className="absolute inset-0 z-20 flex items-end bg-gradient-to-t from-ink/60 to-transparent p-4 opacity-0 transition-opacity duration-500 group-hover:opacity-100">
                    <div>
                      <p className="text-xs uppercase tracking-widest text-gold">{item.category}</p>
                      <p className="font-display text-lg text-ivory">{item.title}</p>
                    </div>
                  </div>
                </Link>
              </TiltCard>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
