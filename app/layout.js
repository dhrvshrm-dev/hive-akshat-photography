import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import SmoothScroll from "@/components/layout/SmoothScroll";
import ShutterTransition from "@/components/layout/ShutterTransition";
import DiyaIntro from "@/components/intro/DiyaIntro";
import Cursor from "@/components/ui/Cursor";
import TouchFocus from "@/components/ui/TouchFocus";
import ScrollProgress from "@/components/ui/ScrollProgress";
import GLStage from "@/components/webgl/GLStage";
import { introHeadScript } from "@/lib/intro";
import { site } from "@/data/site";
import { KEYWORDS, OG_IMAGE, SITE_URL, structuredData } from "@/lib/seo";

// Fonts are self-hosted in /app/fonts, so the site builds anywhere with no external dependency.
const display = localFont({
  src: "./fonts/Fraunces.ttf",
  variable: "--font-display",
  display: "swap",
  weight: "300 900",
});
const sans = localFont({
  src: "./fonts/Jost.ttf",
  variable: "--font-sans",
  display: "swap",
  weight: "300 700",
});
// The viewfinder's voice: every readout, coordinate and label.
const mono = localFont({
  src: "./fonts/JetBrainsMono.ttf",
  variable: "--font-mono",
  display: "swap",
  weight: "300 700",
});

export const metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: `${site.person} — Wildlife & Travel Photographer, Ajmer, Rajasthan | ${site.name}`,
    template: `%s | ${site.name}`,
  },
  description:
    "Akshat Singh Chaudhary (Hive Akshat) is a wildlife, nature, aerial and heritage photographer and filmmaker from Ajmer, Rajasthan — two decades of work, collaborations with Incredible India and state tourism boards, and awards from PHDCCI, News18 Rajasthan and the Government of Rajasthan.",
  keywords: KEYWORDS,
  applicationName: site.name,
  creator: site.developer.name,
  authors: [
    { name: site.person, url: "/about" },
    { name: site.developer.name, url: `mailto:${site.developer.email}` },
  ],
  alternates: { canonical: "/" },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large" },
  },
  openGraph: {
    type: "website",
    locale: "en_IN",
    siteName: `${site.name} — ${site.person}`,
    title: `${site.person} — Wildlife & Travel Photographer, Ajmer`,
    description:
      "Photographer · Filmmaker · Visual Storyteller. Rajasthan is his inspiration; India is his canvas.",
    url: "/",
    images: [
      {
        url: OG_IMAGE,
        width: 1200,
        height: 630,
        alt: "Ana Sagar at sunset — photographed from the air by Akshat Singh Chaudhary",
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    site: "@Hive_akshat",
    creator: "@Hive_akshat",
  },
  // Paste the code from Google Search Console → Settings → Ownership (HTML tag).
  verification: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION
    ? { google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION }
    : undefined,
  category: "photography",
};

export const viewport = {
  themeColor: "#0A0908",
};

export default function RootLayout({ children }) {
  return (
    <html
      lang="en"
      className={`${display.variable} ${sans.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <head>
        {/* Decides before first paint whether the diya intro runs, so the
            curtain below is either kept or dropped with no flash. */}
        <script dangerouslySetInnerHTML={{ __html: introHeadScript }} />
        {/* Who he is, for Google: name, work, awards, profiles (schema.org). */}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData()) }}
        />
      </head>
      <body className="font-sans">
        <div className="intro-curtain" aria-hidden="true" />
        {/* The site's only WebGL context. Draws behind the chrome and only
            inside the boxes that registered with it. */}
        <GLStage />
        <SmoothScroll />
        <Navbar />
        <main className="relative">{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollProgress />
        <div className="grain" aria-hidden="true" />
        <ShutterTransition />
        <Cursor />
        <TouchFocus />
        <DiyaIntro />
      </body>
    </html>
  );
}
