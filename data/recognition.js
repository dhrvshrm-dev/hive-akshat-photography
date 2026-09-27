// Recognition, from Akshat's own brief. Shown in four ways:
//
//   collaborations  tourism bodies he has made campaigns and reels for — the press passes
//   commission      the headline commission, given its own feature
//   honours         awards and appreciation, listed like certificates
//   press           where the work has been published
//
// Logos live in /public/logos. `logoOnDark` puts the logo on a dark strip, for
// marks drawn in white.

export const collaborations = [
  {
    org: "Incredible India",
    sub: "Ministry of Tourism, Government of India",
    short: "MoT",
    logo: "/logos/incredible-india.svg",
    logoOnDark: true,
    work: "Digital campaigns & reels",
    role: "Tourism promoter",
  },
  {
    org: "Rajasthan Tourism",
    sub: "Government of Rajasthan",
    short: "RT",
    logo: "/logos/rajasthan-tourism.png",
    work: "Pushkar Fair · forts & heritage · state exhibition",
    role: "Tourism promoter",
  },
  {
    org: "Gujarat Tourism",
    sub: "Government of Gujarat",
    short: "GT",
    logo: "/logos/gujarat-tourism.png",
    work: "Rann Utsav · Rann of Kutch",
    role: "Collaboration",
  },
  {
    org: "Madhya Pradesh Tourism",
    sub: "Government of Madhya Pradesh",
    short: "MPT",
    logo: "/logos/mp-tourism.webp",
    work: "Digital campaigns & reels",
    role: "Tourism promoter",
  },
  {
    org: "Uttar Pradesh Tourism",
    sub: "Government of Uttar Pradesh",
    short: "UPT",
    logo: "/logos/up-tourism.png",
    work: "Digital campaigns & reels",
    role: "Tourism promoter",
  },
];

// Shown under the passes.
export const collaborationsNote =
  "Plus collaborations with tourism pages on Instagram, promoting destinations across India.";

export const commission = {
  kicker: "Invited photographer · 31 January 2025",
  title: "Rashtrapati Bhavan & the Presidential Estate",
  note: "Invited to document the President's House and its estate — a major milestone in his visual storytelling journey.",
  // FILL IN: id of a photo from data/photos.js once his Rashtrapati Bhavan frames arrive.
  image: null,
};

export const honours = [
  {
    title: "Responsible Tourism Influencer Samman",
    by: "PHDCCI Rajasthan Tourism Awards — awarded in two consecutive years",
    detail: "21 March 2025 · 21 March 2026",
    year: "2025 · 2026",
    logo: "/logos/phdcci.png",
  },
  {
    title: "Wildlife Photography Honour",
    by: "Presented by Cabinet Minister Shri Suresh Rawat, with the Divisional Commissioner and the Collector of Ajmer",
    detail: "Independence Day, 15 August 2025",
    year: "2025",
  },
  {
    title: "Excellence in Photography Award",
    by: "The Knights of Rajasthan, 94.3 MY FM",
    year: "2025",
  },
  {
    title: "State-level Photography Exhibition",
    by: "Rajasthan Tourism — Birla Auditorium, Jaipur",
    year: "2025",
  },
  {
    title: "Certificate of Appreciation",
    by: "Government of Rajasthan — presented by Deputy Chief Minister Smt. Diya Kumari",
    detail:
      "World Tourism Day, 27 September — for contributions to tourism promotion and heritage",
    // CHECK: the brief says 27 September 2014, but Smt. Diya Kumari became Deputy
    // Chief Minister in December 2023 — confirm the year before showing it.
    year: "",
  },
];

export const press = [
  {
    name: "Outlook Traveller",
    href: "https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MTMyMTM4Mzk0NDc5MDM0?story_media_id=3750368871896567756_3020213943&stkn=MXNuc2JsYWdyMm1wdQ==",
  },
  { name: "Dainik Bhaskar", href: "" },
  { name: "State tourism publications", href: "" },
];

export const recognitionHeadline = {
  kicker: "Collaborations & recognition",
  title: [
    { text: "Trusted by the people who" },
    { text: "put India on the map.", emphasis: true },
  ],
  note: "Digital campaigns and reels with Incredible India and four state tourism boards — bringing the Pushkar Fair, Rann Utsav and India's historic forts to audiences around the world.",
};
