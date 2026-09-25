import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import GoldenHour from "@/components/forms/GoldenHour";
import { site } from "@/data/site";

export const metadata = {
  title: "Contact — Hive Akshat Photography",
  description: "Plan a travel, heritage, hotel or festival shoot with Hive Akshat, based in Ajmer, Rajasthan.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact · Plan a shoot"
        title={[{ text: "Tell me the place." }, { text: "I'll find the light.", emphasis: true }]}
        intro="A few details and I'll come back within a day with dates, light windows and a plan."
      />
      <section className="bg-night py-20 md:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <div className="space-y-10">
              <Reveal>
                <div className="space-y-7">
                  {[
                    ["Email", site.email, `mailto:${site.email}`],
                    ["Phone", site.phone, `tel:${site.phone.replace(/\s/g, "")}`],
                    ["WhatsApp", "Message directly →", `https://wa.me/${site.whatsapp}`],
                  ].map(([k, v, href]) => (
                    <div key={k}>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-hud text-bone/45">{k}</p>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={href.startsWith("http") ? "noopener noreferrer" : undefined}
                        className="link-sweep font-display text-2xl text-bone hover:text-saffron"
                      >
                        {v}
                      </a>
                    </div>
                  ))}
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-hud text-bone/45">Base</p>
                    <p className="font-display text-2xl text-bone">{site.location}</p>
                  </div>
                </div>
              </Reveal>
              <Reveal delay={0.1}>
                <GoldenHour />
              </Reveal>
            </div>
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
