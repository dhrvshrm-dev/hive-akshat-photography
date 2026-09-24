"use client";
import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import Button from "@/components/ui/Button";
import SplitText from "@/components/ui/SplitText";
import GLHero from "@/components/webgl/GLHero";
import { heroImages } from "@/data/portfolio";
import { site } from "@/data/site";

export default function Hero() {
  const reduce = useReducedMotion();
  return (
    // bg-ink so the pixel the GL layer may stop short of along each edge is a
    // dark one, matching the photograph's own gradient rather than flashing the
    // page's ivory through.
    <section className="relative flex h-[100svh] min-h-[560px] items-end overflow-hidden bg-ink">
      {/* The photographs, dissolving into one another in WebGL. The <Image>
          below is the real one — it carries the LCP, it is what a crawler and a
          no-WebGL visitor see, and it fades out only once the shader is live. */}
      <GLHero
        images={heroImages}
        className="absolute inset-0"
        fallback={
          <motion.div
            initial={reduce ? false : { scale: 1.1 }}
            animate={reduce ? {} : { scale: 1 }}
            transition={{ duration: 1.6, ease: [0.22, 1, 0.36, 1] }}
            className="absolute inset-0"
          >
            <Image
              src={heroImages[0]}
              alt="A wedding moment captured by Hive Akshat"
              fill
              priority
              className="object-cover"
            />
          </motion.div>
        }
      />

      {/* Above the canvas (z-1), so the headline keeps its footing whatever the
          photograph underneath is doing. */}
      {/* Deeper than a single still needs, because the photograph underneath is
          no longer a single still — the sequence runs from a dark road to a
          bright beach, and the headline has to hold on all of them. */}
      <div className="pointer-events-none absolute inset-0 z-[2] bg-gradient-to-t from-ink/90 via-ink/50 to-ink/25" />

      {/* Vertical location label */}
      <span className="absolute right-6 top-1/2 z-[2] hidden -translate-y-1/2 rotate-90 text-xs uppercase tracking-widest text-ivory/70 md:block">
        {site.location} · India
      </span>

      {/* Headline */}
      <div className="relative z-10 mx-auto w-full max-w-content px-6 pb-16 md:px-8 md:pb-24">
        <motion.p
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="mb-4 text-xs uppercase tracking-widest text-gold"
        >
          {site.tagline}
        </motion.p>
        <SplitText
          as="h1"
          delay={0.45}
          stagger={0.06}
          className="block max-w-3xl font-display text-5xl leading-[1.05] text-ivory md:text-7xl"
        >
          {[
            { text: "Stories worth" },
            { text: "reliving,", emphasis: true },
            { text: "told through light." },
          ]}
        </SplitText>
        <motion.div
          initial={reduce ? false : { opacity: 0, y: 20 }}
          animate={reduce ? {} : { opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.65 }}
          className="mt-8 flex flex-wrap gap-4"
        >
          <Button href="/work" data-cursor="View">
            View the work
          </Button>
          <Button
            href="/contact"
            variant="outline"
            data-cursor="Enquire"
            className="border-ivory/40 text-ivory hover:border-gold hover:text-gold"
          >
            Enquire now
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
