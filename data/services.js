// What Akshat shoots, on /work. He does not take commercial shoots — this is his
// own practice, plus the collaborations and talks that grow out of it.
// `image` is an id from data/photos.js (placeholders until his frames arrive).
//
//   where       places or subjects, shown as tags
//   highlights  short bullets
export const services = [
  {
    key: "wildlife",
    title: "Wildlife & Birds",
    short:
      "Flamingos, painted storks and the wildlife of India's wetlands and forests.",
    summary:
      "Birds, animals, forests and the changing seasons — highlighting the delicate relationship between wildlife and its environment. Flamingos at Sambhar Lake; painted storks at Ana Sagar and Varun Sagar in Ajmer.",
    where: ["Sambhar Lake", "Ana Sagar", "Varun Sagar", "Kaziranga"],
    highlights: [
      "Flamingo series, Sambhar",
      "Painted storks, Ajmer",
      "Wildlife honour, 15 Aug 2025",
    ],
    image: "flamingos",
  },
  {
    key: "landscape",
    title: "Landscapes",
    short: "Salt deserts, snowfields and cities by the sea.",
    summary:
      "From the White Rann of Kutch to the snows of Manali — landscapes across India and beyond.",
    where: ["Rann of Kutch", "Manali", "Mumbai", "Abroad"],
    highlights: ["The White Rann", "Himalayan snow", "Coast & skyline"],
    image: "rann-white",
  },
  {
    key: "nature",
    title: "Nature",
    short: "Landscapes shaped by Rajasthan's monsoon skies.",
    summary:
      "Forests, waterfalls and changing seasons — from Rajasthan's monsoon skies to the living root bridges of Meghalaya.",
    where: ["Rajasthan", "Meghalaya", "Kerala"],
    highlights: ["Monsoon skies", "Waterfalls & forests", "Backwaters"],
    image: "meghalaya-falls",
  },
  {
    key: "astro",
    title: "Astrophotography",
    short: "The night sky over Rajasthan.",
    summary:
      "Star fields and the Milky Way — the desert and the hills after dark.",
    where: ["Rajasthan"],
    highlights: ["Milky Way", "Star fields", "Nightscapes"],
    image: "milky-way",
  },
  {
    key: "aerial",
    title: "Aerial & Drone",
    short: "Forts, ghats and cities, seen from above.",
    summary:
      "Aerial stills and drone films of heritage sites and cities — Jodhpur, Varanasi, Amer Fort and the Dargah at Ajmer.",
    where: ["Jodhpur", "Varanasi", "Jaipur", "Ajmer"],
    highlights: ["Drone films", "Aerial stills", "On YouTube · @hive_akshat"],
    image: "jodhpur-blue",
  },
  {
    key: "heritage",
    title: "Heritage & Architecture",
    short:
      "Forts, palaces, temples and stepwells — Rajasthan as a living cultural landscape.",
    summary:
      "Ground-based and aerial documentation of forts, palaces, temples, stepwells, festivals and people — Rajasthan presented not simply as a tourist destination, but as a living cultural landscape.",
    where: ["Jodhpur", "Bikaner", "Jaipur", "Ahmedabad"],
    highlights: [
      "Rashtrapati Bhavan, 31 Jan 2025",
      "Forts & palaces",
      "Stepwells & temples",
    ],
    image: "mehrangarh",
  },
  {
    key: "film",
    title: "Film & Music Videos",
    short: "Director of Photography for two songs.",
    summary:
      "Cinematic filmmaking that combines drone footage, cultural storytelling and music — Director of Photography for the songs “PUSHKAR” and “Train Pakad Le”, sung by Jeet Sharmaa.",
    where: ["Pushkar", "Rajasthan"],
    highlights: ["PUSHKAR", "Train Pakad Le", "Drone films & reels"],
    image: "pushkar-ghats",
  },
  {
    key: "tourism",
    title: "Tourism Collaborations",
    short: "Campaigns and reels that bring destinations to global audiences.",
    summary:
      "Digital campaigns and reels with Incredible India, Rajasthan Tourism, Gujarat Tourism, Madhya Pradesh Tourism and Uttar Pradesh Tourism — and with tourism pages on Instagram.",
    where: ["Incredible India", "Rajasthan", "Gujarat", "MP", "UP"],
    highlights: ["Pushkar Fair", "Rann Utsav", "Historic forts"],
    image: "rann-camels",
  },
  {
    key: "talks",
    title: "Talks, Workshops & Judging",
    short: "Visual storytelling, taught where the next generation is.",
    summary:
      "Sessions on visual storytelling, digital content creation and observational photography at institutions such as MNIT Jaipur and RK Patni Girls College, Ajmer — and judging inter-college photography competitions.",
    where: ["MNIT Jaipur", "RK Patni Girls College"],
    highlights: [
      "Visual storytelling",
      "Digital content creation",
      "Observational photography",
    ],
    image: "varanasi-boatman",
  },
];

// Knowledge sharing — shown as the board on /work.
export const sessions = [
  { what: "Visual storytelling", where: "MNIT Jaipur", kind: "Session" },
  { what: "Digital content creation", where: "MNIT Jaipur", kind: "Session" },
  {
    what: "Observational photography",
    where: "RK Patni Girls College, Ajmer",
    kind: "Workshop",
  },
  {
    what: "Inter-college photography",
    where: "Colleges across Rajasthan",
    kind: "Judge",
  },
];
