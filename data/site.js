// One place for all the site-wide details. Edit these and they update everywhere.
export const site = {
  name: "Hive Akshat",
  tagline: "Travel, Heritage & Spiritual Photography",
  location: "Ajmer, Rajasthan",
  // Home base — the navbar's GPS readout and the map's starting pin.
  base: { lat: 26.4499, lon: 74.6399, alt: 486 },
  email: "query@hiveakshat.com",
  phone: "+91 97853 26798",
  whatsapp: "919785326798", // digits only, used for the wa.me link
  social: {
    instagram: "https://instagram.com/",
    youtube: "https://youtube.com/",
  },
  // Navigation links, in order
  nav: [
    { label: "Journeys", href: "/journeys" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: [
    { label: "Home", href: "/" },
    { label: "Journeys", href: "/journeys" },
    { label: "Archive", href: "/journeys#archive" },
    { label: "Films", href: "/#films" },
    { label: "Services", href: "/services" },
    { label: "About", href: "/about" },
    { label: "Kind words", href: "/testimonials" },
    { label: "Contact", href: "/contact" },
  ],
};

// PLACEHOLDER COPY — written to show the tone. Confirm the facts with Akshat.
export const manifesto = [
  { text: "I don't photograph places." },
  { text: "I wait for them." },
  { image: "harmandir-sahib" },
  { text: "For fog to lift off the sarovar at five in the morning." },
  { text: "For the aarti fire" },
  { image: "varanasi-puja" },
  { text: "to catch the river." },
  { text: "For a tigress" },
  { image: "bengal-tiger" },
  { text: "to decide I'm worth one look." },
  { text: "The light decides.", emphasis: true },
  { text: "I just stay until it does." },
];

// The cities that scroll past in the marquee under the hero.
export const placesMarquee = [
  "Pushkar", "Varanasi", "Leh", "Jaisalmer", "Hampi", "Amritsar",
  "Spiti", "Zanskar", "Kannur", "Jaipur", "Gurudongmar", "Mamallapuram",
];
