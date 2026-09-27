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
    work: "Rann Utsav · documentary shoot, Ahmedabad (Aug 2025)",
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

// Newest first. `image` is a photo of the moment, from his Drive.
export const honours = [
  {
    title: "Excellence in Digital Storytelling",
    by: "News18 Rajasthan — Young Entrepreneur Awards",
    detail: "Jaipur, 31 January 2026",
    year: "2026",
    image: "/images/awards/award-news18.jpg",
  },
  {
    title: "Responsible Tourism Influencer Samman",
    by: "PHDCCI Rajasthan Tourism Samman — awarded in two consecutive years",
    detail: "Tathastu Heritage Resort, Udaipur, 20 March 2025 · again on 21 March 2026",
    year: "2025 · 2026",
    logo: "/logos/phdcci.png",
    image: "/images/awards/award-phdcci.jpg",
  },
  {
    title: "Honour at the Sambhar Festival",
    by: "Department of Tourism, Government of Rajasthan",
    detail: "Sambhar Festival, 27–31 December 2025",
    year: "2025",
    image: "/images/awards/award-sambhar.jpg",
  },
  {
    title: "Wildlife Photography Honour",
    by: "Presented by Cabinet Minister Shri Suresh Rawat, with the Divisional Commissioner and the Collector of Ajmer",
    detail: "Independence Day, 15 August 2025",
    year: "2025",
    image: "/images/awards/award-independence-day.jpg",
  },
  {
    title: "Excellence in Photography Award",
    by: "The Knights of Rajasthan, 94.3 MY FM",
    year: "2025",
    image: "/images/awards/award-knights.jpg",
  },
  {
    title: "State-level Photography Exhibition",
    by: "Rajasthan Tourism — Birla Auditorium, Jaipur",
    detail: "His pond heron was among the photographs exhibited",
    year: "2025",
    image: "/images/awards/award-exhibition.jpg",
  },
  {
    title: "Certificate of Appreciation",
    by: "Department of Tourism, Government of Rajasthan — presented by Deputy Chief Minister Smt. Diya Kumari",
    detail: "World Tourism Day, 27 September 2024 — for capturing and sharing the essence of Rajasthan",
    year: "2024",
    image: "/images/awards/award-diya-kumari.jpg",
  },
];

export const press = [
  {
    name: "Outlook Traveller",
    href: "https://www.instagram.com/s/aGlnaGxpZ2h0OjE4MTMyMTM4Mzk0NDc5MDM0?story_media_id=3750368871896567756_3020213943&stkn=MXNuc2JsYWdyMm1wdQ==",
  },
  { name: "Dainik Bhaskar", href: "" },
  { name: "Rajasthan Lahar", href: "" },
  { name: "State tourism publications", href: "" },
];

// His photographs as they ran in print — the press wall. Newest first.
export const clippings = [
  { src: "/images/press/press-ana-sagar-evening.jpg", paper: "Rajasthan Lahar", caption: "An evening on Ana Sagar" },
  { src: "/images/press/press-puskar-song.jpg", paper: "Local press", caption: "The launch of the song “PUSHKAR”" },
  { src: "/images/press/press-pelicans.jpg", paper: "Dainik Bhaskar", caption: "Pelicans arrive at Ana Sagar" },
  { src: "/images/press/press-ajmer-sunrise.jpg", paper: "Ajmer Bhaskar", caption: "Sunrise over Ajmer" },
  { src: "/images/press/press-pushkar-night.jpg", paper: "Dainik Bhaskar", caption: "Pushkar, lit up" },
  { src: "/images/press/press-front-ana-sagar.jpg", paper: "Dainik Bhaskar", caption: "Front page — clouds over Ana Sagar" },
  { src: "/images/press/press-sunday-ajmer.jpg", paper: "Dainik Bhaskar", caption: "Sunday City Ajmer — Pushkar by night" },
  { src: "/images/press/press-sunset-aerial.jpg", paper: "Dainik Bhaskar", caption: "Sunset, from the air" },
  { src: "/images/press/press-pushkar-aerial.jpg", paper: "Rajasthan Lahar", caption: "Pushkar, from above" },
  { src: "/images/press/press-lahar-pushkar.jpg", paper: "Rajasthan Lahar", caption: "Pushkar's heritage in one frame" },
  { src: "/images/press/press-waterfall.jpg", paper: "Rajasthan Lahar", caption: "The monsoon waterfall" },
  { src: "/images/press/press-ibis.jpg", paper: "Dainik Bhaskar", caption: "Black-headed ibis at Varun Sagar" },
];

export const recognitionHeadline = {
  kicker: "Collaborations & recognition",
  title: [
    { text: "Trusted by the people who" },
    { text: "put India on the map.", emphasis: true },
  ],
  note: "Digital campaigns and reels with Incredible India and four state tourism boards — bringing the Pushkar Fair, Rann Utsav and India's historic forts to audiences around the world.",
};
