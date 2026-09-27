// Everything search engines read, in one place.
import { site, socialLinks } from "@/data/site";
import { collaborations, honours } from "@/data/recognition";

// The live address. Set NEXT_PUBLIC_SITE_URL in Vercel once the domain is
// bought (e.g. https://hiveakshat.com); until then the Vercel URL is used.
export const SITE_URL = (
  process.env.NEXT_PUBLIC_SITE_URL ||
  (process.env.VERCEL_PROJECT_PRODUCTION_URL
    ? `https://${process.env.VERCEL_PROJECT_PRODUCTION_URL}`
    : "https://hive-akshat-photography.vercel.app")
).replace(/\/$/, "");

export const OG_IMAGE = "/images/photos/ana-sagar-sunset-aerial.jpg";

// What people type into Google. Used in titles/descriptions naturally, never stuffed.
export const KEYWORDS = [
  "Akshat Singh Chaudhary",
  "Hive Akshat",
  "wildlife photographer Ajmer",
  "wildlife photographer Rajasthan",
  "travel photographer Rajasthan",
  "photographer in Ajmer",
  "Pushkar photographer",
  "drone photography Rajasthan",
  "bird photography Ana Sagar",
  "Pushkar Fair photography",
  "Rajasthan tourism photographer",
  "Ajmer photographer",
];

/** Per-page metadata with a canonical URL and share image. */
export function pageMeta({ title, description, path = "/", image = OG_IMAGE }) {
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      title,
      description,
      url: path,
      images: [{ url: image, width: 1200, height: 630, alt: title }],
    },
    twitter: { title, description, images: [image] },
  };
}

/** Schema.org structured data: tells Google who he is, what he does and what he has won. */
export function structuredData() {
  const person = {
    "@type": "Person",
    "@id": `${SITE_URL}/#person`,
    name: site.person,
    alternateName: ["Hive Akshat", "Akshat Singh", "Akshat Chaudhary"],
    url: SITE_URL,
    image: `${SITE_URL}/images/photos/akshat-sunset.jpg`,
    jobTitle: "Photographer & Filmmaker",
    description:
      "Wildlife, nature, landscape, aerial and heritage photographer and filmmaker from Ajmer, Rajasthan. Tourism promoter, educationist and entrepreneur.",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Ajmer",
      addressRegion: "Rajasthan",
      addressCountry: "IN",
    },
    email: `mailto:${site.email}`,
    telephone: site.phone.replace(/\s/g, ""),
    sameAs: socialLinks.map((s) => s.href),
    knowsAbout: [
      "Wildlife photography",
      "Bird photography",
      "Landscape photography",
      "Aerial and drone photography",
      "Astrophotography",
      "Heritage and architectural photography",
      "Documentary filmmaking",
      "Tourism promotion",
    ],
    award: honours.map(
      (h) => `${h.title} — ${h.by}${h.year ? ` (${h.year})` : ""}`,
    ),
    affiliation: collaborations.map((c) => ({
      "@type": "Organization",
      name: c.org,
    })),
  };
  const website = {
    "@type": "WebSite",
    "@id": `${SITE_URL}/#website`,
    url: SITE_URL,
    name: site.name,
    alternateName: `${site.person} Photography`,
    inLanguage: "en-IN",
    publisher: { "@id": `${SITE_URL}/#person` },
  };
  return { "@context": "https://schema.org", "@graph": [person, website] };
}
