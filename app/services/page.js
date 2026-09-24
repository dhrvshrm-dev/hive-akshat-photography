import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Process from "@/components/sections/Process";
import CTA from "@/components/sections/CTA";
import { services } from "@/data/services";

export const metadata = {
  title: "Services — Hive Akshat Photography",
  description: "Wedding photography, pre-wedding shoots, event coverage and films by Hive Akshat, Ajmer.",
};

export default function ServicesPage() {
  return (
    <>
      <PageHeader
        eyebrow="Services"
        title="What we offer"
        intro="Every wedding and event is different. Here's how we usually work — packages can be shaped around your day."
      />
      <section className="py-24">
        <Container className="space-y-px bg-line">
          {services.map((s, i) => (
            <Reveal key={s.title} delay={i * 0.05} className="bg-ivory">
              <div className="grid gap-6 p-8 md:grid-cols-[1fr_2fr] md:p-12">
                <h2 className="font-display text-2xl text-ink md:text-3xl">{s.title}</h2>
                <div>
                  <p className="text-taupe">{s.summary}</p>
                  <ul className="mt-5 flex flex-wrap gap-x-8 gap-y-2">
                    {s.points.map((p) => (
                      <li key={p} className="text-sm text-ink before:mr-2 before:text-rose before:content-['—']">
                        {p}
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Reveal>
          ))}
        </Container>
      </section>
      <Process />
      <CTA />
    </>
  );
}
