// What Hive Akshat offers. `image` is an id from data/photos.js.
export const services = [
  {
    key: "tourism",
    title: "Tourism & Destination Campaigns",
    short: "Stills and motion that make people book the ticket.",
    summary:
      "For tourism boards, travel brands and agencies. Campaign imagery shot on location across India, delivered with the usage rights your media plan needs.",
    forWhom: ["Tourism boards", "Travel brands", "Agencies"],
    points: ["Location scouting & permits", "Campaign stills + short-form video", "Licensed image libraries"],
    image: "gurudongmar",
  },
  {
    key: "hospitality",
    title: "Hotels & Heritage Properties",
    short: "Havelis, forts and resorts, photographed like places — not listings.",
    summary:
      "Architecture, interiors and guest-experience stories for hotels and heritage stays. Blue-hour exteriors, honest interiors, and the view from the room that sells the room.",
    forWhom: ["Heritage hotels", "Resorts", "Homestays"],
    points: ["Architecture & interiors", "Blue/golden hour exteriors", "Lifestyle with guests"],
    image: "jaisalmer-fort",
  },
  {
    key: "sacred",
    title: "Temples, Festivals & Pilgrimage",
    short: "Aarti, mela and the quiet between them — always with permission.",
    summary:
      "Documentation for temple trusts, festival organisers and publications. Pushkar fair, Dev Deepawali, Theyyam season. Respectful, unobtrusive, permission-first.",
    forWhom: ["Temple trusts", "Festival bodies", "Publications"],
    points: ["Ritual & festival coverage", "Archival documentation", "Editorial photo essays"],
    image: "varanasi-puja",
  },
  {
    key: "prints",
    title: "Landscape & Fine-Art Prints",
    short: "Limited editions for walls that deserve a mountain.",
    summary:
      "Archival pigment prints from the archive, in limited editions. For homes, offices, hotels and anyone who wants a piece of Zanskar in the living room.",
    forWhom: ["Collectors", "Interior designers", "Corporate spaces"],
    points: ["Numbered limited editions", "Museum-grade paper", "Framing & installation"],
    image: "zanskar-road",
  },
  {
    key: "walks",
    title: "Photo Walks & Expeditions",
    short: "Small groups. Early starts. Better pictures.",
    summary:
      "Guided photo walks in Pushkar and Ajmer, and longer expeditions to Varanasi, the Thar and the high Himalaya. Composition, light and patience — taught where it matters.",
    forWhom: ["Enthusiasts", "Travellers", "Schools & clubs"],
    points: ["Dawn walks in Pushkar", "Multi-day expeditions", "One-to-one mentoring"],
    image: "varanasi-boatman",
  },
  {
    key: "wild",
    title: "Wildlife & Nature",
    short: "Long lenses, longer waits.",
    summary:
      "Editorial wildlife and nature work for lodges, conservation groups and publications — from the forests of central India to the desert's edge.",
    forWhom: ["Safari lodges", "Conservation groups", "Magazines"],
    points: ["Safari & lodge shoots", "Conservation stories", "Editorial assignments"],
    image: "bengal-tiger",
  },
];

// A real, ordered process — the numbering reflects the actual sequence.
export const process = [
  { step: "Brief", time: "Day 0", desc: "Tell me the place, the audience, and what the pictures have to do. I reply within a day." },
  { step: "Recce", time: "Day 1–3", desc: "Scouting, permissions, sun paths and weather windows — planned before a camera comes out." },
  { step: "Wait for the light", time: "The shoot", desc: "Blue hour, golden hour, and the patience in between. This is where the picture is made." },
  { step: "Grade & deliver", time: "+7 days", desc: "A hand-edited selection, graded for the destination, with the licences you need." },
];

// PLACEHOLDER dates — update each season.
export const departures = [
  { what: "Pushkar dawn walk", where: "Pushkar", when: "Every Sun", length: "3 hrs", seats: 6 },
  { what: "Pushkar camel fair", where: "Pushkar", when: "Nov", length: "3 days", seats: 8 },
  { what: "Dev Deepawali", where: "Varanasi", when: "Nov", length: "4 days", seats: 6 },
  { what: "Thar under stars", where: "Jaisalmer", when: "Jan", length: "4 days", seats: 8 },
  { what: "Monasteries of Zanskar", where: "Ladakh", when: "Jul", length: "10 days", seats: 5 },
];
