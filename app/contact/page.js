import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import GoldenHour from "@/components/forms/GoldenHour";
import SocialIcon from "@/components/ui/SocialIcon";
import { site, socialLinks } from "@/data/site";

export const metadata = {
  title: "Contact — Hive Akshat Photography",
  description:
    "Contact Akshat Singh Chaudhary (Hive Akshat) for tourism collaborations, talks, workshops, judging and press — based in Ajmer, Rajasthan.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title={[
          { text: "Let's talk" },
          { text: "about the light.", emphasis: true },
        ]}
        intro="For tourism collaborations, talks, workshops and judging, press, or just a conversation about a photograph. I don't take commercial shoots."
      />
      <section className="bg-night py-20 md:py-28">
        <Container>
          <div className="grid gap-16 lg:grid-cols-[1fr_1.5fr] lg:gap-20">
            <div className="space-y-10">
              <Reveal>
                <div className="space-y-7">
                  {[
                    ["Email", site.email, `mailto:${site.email}`],
                    [
                      "Phone",
                      site.phone,
                      `tel:${site.phone.replace(/\s/g, "")}`,
                    ],
                    [
                      "WhatsApp",
                      "Message directly →",
                      `https://wa.me/${site.whatsapp}`,
                    ],
                  ].map(([k, v, href]) => (
                    <div key={k}>
                      <p className="mb-2 font-mono text-[10px] uppercase tracking-hud text-bone/45">
                        {k}
                      </p>
                      <a
                        href={href}
                        target={href.startsWith("http") ? "_blank" : undefined}
                        rel={
                          href.startsWith("http")
                            ? "noopener noreferrer"
                            : undefined
                        }
                        className="link-sweep font-display text-2xl text-bone hover:text-saffron"
                      >
                        {v}
                      </a>
                    </div>
                  ))}
                  <div>
                    <p className="mb-3 font-mono text-[10px] uppercase tracking-hud text-bone/45">
                      Follow · {site.name}
                    </p>
                    <ul className="flex flex-wrap gap-2">
                      {socialLinks.map((s) => (
                        <li key={s.label}>
                          <a
                            href={s.href}
                            target="_blank"
                            rel="noopener noreferrer"
                            aria-label={`${s.label} ${s.handle}`}
                            title={`${s.label} · ${s.handle}`}
                            className="flex h-11 w-11 items-center justify-center border border-line text-bone/80 transition-colors hover:border-saffron hover:text-saffron"
                          >
                            <SocialIcon name={s.icon} className="h-5 w-5" />
                          </a>
                        </li>
                      ))}
                    </ul>
                  </div>
                  <div>
                    <p className="mb-2 font-mono text-[10px] uppercase tracking-hud text-bone/45">
                      Base
                    </p>
                    <p className="font-display text-2xl text-bone">
                      {site.location}
                    </p>
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
