"use client";
// The last frame of every page: a Himalayan panorama panning slowly behind the
// question the whole site is building to.
import { useRef } from "react";
import Image from "next/image";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import Button from "@/components/ui/Button";
import SplitText from "@/components/ui/SplitText";
import { photo } from "@/data/photos";
import { site } from "@/data/site";

const pano = photo("ranikhet-himalaya");

export default function CTA({ title, subtitle }) {
  const ref = useRef(null);
  const reduce = useReducedMotion();
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start end", "end start"] });
  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-22%"]);
  const scale = useTransform(scrollYProgress, [0, 1], [1.15, 1]);

  return (
    <section ref={ref} className="relative flex min-h-[90svh] items-center overflow-hidden bg-night">
      <motion.div className="absolute inset-y-0 left-0 w-[160%] md:w-[135%]" style={reduce ? {} : { x, scale }}>
        <Image src={pano.src} alt={`${pano.title}`} fill sizes="160vw" className="object-cover" />
      </motion.div>
      <div className="absolute inset-0 bg-night/55" />
      <div className="absolute inset-0 bg-gradient-to-b from-night via-transparent to-night" />
      <div className="brackets absolute inset-5 md:inset-10" style={{ "--c": "rgba(237,230,218,0.35)" }} />

      <div className="relative z-[2] mx-auto w-full max-w-content px-6 text-center md:px-8">
        <p className="mb-6 font-mono text-[10px] uppercase tracking-hud text-bone/60">
          <span className="text-saffron">●</span> Next frame
        </p>
        <SplitText as="h2" whileInView className="mx-auto block max-w-4xl font-display text-fluid-xl text-bone">
          {title || [{ text: "Where should we" }, { text: "go next?", emphasis: true }]}
        </SplitText>
        <p className="mx-auto mt-6 max-w-lg text-bone/70">
          {subtitle || "Campaigns, hotels, festivals, prints or a dawn walk in Pushkar — tell me the place and I'll tell you when the light is best."}
        </p>
        <div className="mt-10 flex flex-wrap justify-center gap-4">
          <Button href="/contact">Plan a shoot</Button>
          <Button href={`https://wa.me/${site.whatsapp}`} variant="outline" target="_blank" rel="noopener noreferrer">
            WhatsApp
          </Button>
        </div>
        <p className="mt-10 font-mono text-[10px] uppercase tracking-hud text-bone/40">
          {pano.title} · {pano.exif.focal || ""}
        </p>
      </div>
    </section>
  );
}
