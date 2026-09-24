import { site } from "@/data/site";
import WhatsAppMotionWrap from "@/components/layout/WhatsAppMotionWrap";

// Floating one-tap WhatsApp button — great for quick enquiries in India.
export default function WhatsAppButton() {
  const message = encodeURIComponent("Hi! I found your website and would like to enquire about photography.");
  return (
    <WhatsAppMotionWrap>
    <a
      href={`https://wa.me/${site.whatsapp}?text=${message}`}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      data-cursor="Chat"
      className="relative flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg transition-transform hover:scale-105"
    >
      <svg viewBox="0 0 32 32" className="h-7 w-7 fill-current" aria-hidden="true">
        <path d="M16 3C9.4 3 4 8.4 4 15c0 2.1.6 4.2 1.6 6L4 29l8.2-1.6c1.7.9 3.7 1.4 5.8 1.4h.01C22.6 28.8 28 23.4 28 16.8 28 9.9 22.6 3 16 3zm0 23.3c-1.8 0-3.5-.5-5-1.4l-.4-.2-4.9 1 1-4.7-.3-.4C5.5 18.9 5 17 5 15 5 9.5 9.9 5 16 5s11 4.5 11 10.8-4.9 10.5-11 10.5zm6-7.9c-.3-.2-1.9-1-2.2-1.1-.3-.1-.5-.2-.7.2-.2.3-.8 1-1 1.2-.2.2-.4.2-.7.1-.3-.2-1.4-.5-2.6-1.6-1-.9-1.6-1.9-1.8-2.3-.2-.3 0-.5.1-.7.1-.1.3-.4.5-.6.1-.2.2-.3.3-.5.1-.2 0-.4 0-.6-.1-.2-.7-1.7-1-2.3-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.5.1-.8.4-.3.3-1 1-1 2.5s1.1 2.9 1.2 3.1c.2.2 2.1 3.2 5.1 4.5.7.3 1.3.5 1.7.6.7.2 1.4.2 1.9.1.6-.1 1.9-.8 2.1-1.5.3-.7.3-1.4.2-1.5-.1-.2-.3-.2-.6-.4z" />
      </svg>
    </a>
    </WhatsAppMotionWrap>
  );
}
