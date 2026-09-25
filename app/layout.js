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
  metadataBase: new URL("https://hiveakshat.com"),
  title: `${site.name} — ${site.tagline} · ${site.location}`,
  description:
    "Hive Akshat is a travel, heritage and spiritual photographer based in Ajmer, Rajasthan — temples, landscapes, architecture and wildlife across India, for tourism boards, hotels and publications.",
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: "Chasing light across India. Travel, heritage & spiritual photography from Ajmer.",
    type: "website",
    images: ["/images/photos/zanskar-road.jpg"],
  },
};

export const viewport = {
  themeColor: "#0A0908",
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable} ${mono.variable}`} suppressHydrationWarning>
      <head>
        {/* Decides before first paint whether the diya intro runs, so the
            curtain below is either kept or dropped with no flash. */}
        <script dangerouslySetInnerHTML={{ __html: introHeadScript }} />
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
