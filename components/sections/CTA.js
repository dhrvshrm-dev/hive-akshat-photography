import Container from "@/components/ui/Container";
import Reveal from "@/components/ui/Reveal";
import Button from "@/components/ui/Button";

export default function CTA() {
  return (
    <section className="py-24">
      <Container>
        <Reveal className="mx-auto max-w-2xl text-center">
          <p className="mb-3 text-xs uppercase tracking-widest text-rose">Let&apos;s talk</p>
          <h2 className="font-display text-3xl leading-tight text-ink md:text-5xl">
            Have a date in mind? Let&apos;s make it unforgettable.
          </h2>
          <p className="mt-4 text-taupe">
            Tell us about your wedding or event and we&apos;ll get back to you within a day.
          </p>
          <div className="mt-8">
            <Button href="/contact" data-cursor="Enquire">Start an enquiry</Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
