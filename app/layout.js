import "./globals.css";
import localFont from "next/font/local";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import Cursor from "@/components/ui/Cursor";
import ScrollProgress from "@/components/ui/ScrollProgress";
import GLStage from "@/components/webgl/GLStage";
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

export const metadata = {
  title: `${site.name} — ${site.tagline} in ${site.location}`,
  description:
    "Hive Akshat is a wedding and event photographer based in Ajmer, Rajasthan, capturing weddings, pre-weddings and functions across India.",
  openGraph: {
    title: `${site.name} — ${site.tagline}`,
    description: "Wedding & event photography in Ajmer, Rajasthan.",
    type: "website",
  },
};

export default function RootLayout({ children }) {
  return (
    <html lang="en" className={`${display.variable} ${sans.variable}`}>
      <body className="font-sans">
        {/* The site's only WebGL context. Draws behind the chrome and only
            inside the boxes that registered with it. */}
        <GLStage />
        <Navbar />
        <main>{children}</main>
        <Footer />
        <WhatsAppButton />
        <ScrollProgress />
        <Cursor />
      </body>
    </html>
  );
}
