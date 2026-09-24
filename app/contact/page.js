import PageHeader from "@/components/ui/PageHeader";
import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import ContactForm from "@/components/forms/ContactForm";
import { site } from "@/data/site";

export const metadata = {
  title: "Contact — Hive Akshat Photography",
  description: "Enquire about wedding and event photography with Hive Akshat, Ajmer.",
};

export default function ContactPage() {
  return (
    <>
      <PageHeader
        eyebrow="Contact"
        title="Let's tell your story"
        intro="Share a few details about your day and we'll be in touch within 24 hours."
      />
      <section className="py-24">
        <Container>
          <div className="grid gap-14 md:grid-cols-[1fr_1.4fr]">
            {/* Details */}
            <Reveal>
              <div className="space-y-8">
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-rose">Email</p>
                  <a href={`mailto:${site.email}`} className="font-display text-xl text-ink hover:text-rose">
                    {site.email}
                  </a>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-rose">Phone</p>
                  <a href={`tel:${site.phone}`} className="font-display text-xl text-ink hover:text-rose">
                    {site.phone}
                  </a>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-rose">Based in</p>
                  <p className="font-display text-xl text-ink">{site.location}</p>
                </div>
                <div>
                  <p className="mb-2 text-xs uppercase tracking-widest text-rose">Prefer WhatsApp?</p>
                  <a
                    href={`https://wa.me/${site.whatsapp}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="font-display text-xl text-ink hover:text-rose"
                  >
                    Message us →
                  </a>
                </div>
              </div>
            </Reveal>

            {/* Form */}
            <Reveal delay={0.1}>
              <ContactForm />
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
