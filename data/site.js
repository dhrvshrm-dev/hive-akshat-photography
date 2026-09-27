// One place for all the site-wide details. Edit these and they update everywhere.
//
// Voice: the site speaks as Akshat, in the first person ("I", "me"). The one
// exception is the About biography, which is his official third-person bio.
export const site = {
  name: "Hive Akshat", // the brand
  person: "Akshat Singh Chaudhary", // the man behind it
  tagline: "Photographer · Filmmaker · Visual Storyteller",
  roles: [
    "Photographer",
    "Filmmaker",
    "Visual Storyteller",
    "Tourism Promoter",
    "Educationist",
    "Entrepreneur",
  ],
  location: "Ajmer, Rajasthan",
  // Home base — the navbar's GPS readout and the map's starting pin.
  base: { lat: 26.4499, lon: 74.6399, alt: 486 },
  email: "chowdhary.akshat2011@gmail.com",
  phone: "+91 99507 75013",
  whatsapp: "919950775013", // digits only, used for the wa.me link
  // Empty links are simply not shown.
  social: [
    {
      label: "Instagram",
      icon: "instagram",
      handle: "@hive_akshat",
      href: "https://instagram.com/hive_akshat",
    },
    {
      label: "Wildlife",
      icon: "instagram",
      handle: "@akshat_wild_eye",
      href: "https://instagram.com/akshat_wild_eye",
    },
    {
      label: "YouTube",
      icon: "youtube",
      handle: "Hive Akshat",
      href: "https://www.youtube.com/@hive_akshat",
    },
    { label: "Facebook", icon: "facebook", handle: "Hive Akshat", href: "" }, // FILL IN: page URL
    {
      label: "Threads",
      icon: "threads",
      handle: "@hive_akshat",
      href: "https://www.threads.net/@hive_akshat",
    },
    {
      label: "X",
      icon: "x",
      handle: "@Hive_akshat",
      href: "https://x.com/Hive_akshat",
    },
  ],
  // Navigation links, in order
  nav: [
    { label: "Journeys", href: "/journeys" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Contact", href: "/contact" },
  ],
  footerNav: [
    { label: "Home", href: "/" },
    { label: "Journeys", href: "/journeys" },
    { label: "Archive", href: "/journeys#archive" },
    { label: "Films", href: "/#films" },
    { label: "Work", href: "/work" },
    { label: "About", href: "/about" },
    { label: "Ventures", href: "/about#ventures" },
    { label: "Contact", href: "/contact" },
  ],
};

export const socialLinks = site.social.filter((s) => s.href);

// His philosophy, read word by word on the home page, with photographs set
// into the sentence.
export const manifesto = [
  { text: "Photography is my language." },
  { image: "pond-heron" },
  { text: "Storytelling is my craft." },
  { text: "Rajasthan" },
  { image: "pushkar-fair-portrait" },
  { text: "is my inspiration." },
  { text: "India" },
  { image: "ana-sagar-sunset-aerial" },
  { text: "is my canvas.", emphasis: true },
];

export const philosophy =
  "A photograph is not just a picture; it is a story, a memory and a piece of time preserved forever.";

// The cities that scroll past in the marquee under the hero.
export const placesMarquee = [
  "Pushkar",
  "Ajmer",
  "Sambhar",
  "Jodhpur",
  "Bikaner",
  "Jaipur",
  "Rann of Kutch",
  "Ahmedabad",
  "Statue of Unity",
  "Mumbai",
  "Kerala",
  "Varanasi",
  "Assam",
  "Meghalaya",
  "Manali",
  "Dubai",
  "Singapore",
  "Australia",
];
