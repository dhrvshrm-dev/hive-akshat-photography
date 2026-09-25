// Bodies that have commissioned or recognised Akshat's work, shown as press
// passes on the home and about pages.
//
// FILL IN: only the Ministry of Tourism entry is confirmed. The entries marked
// `placeholder: true` are stand-ins that show the layout — replace each with the
// real organisation, event and year (or delete it). Never list a body he has
// not actually worked with.
//
//   org      the organisation, as it should be written
//   short    a 2–4 letter mark shown large on the pass when there is no logo
//   logo     optional: path to a logo in /public (SVG or PNG, white/transparent works best)
//   event    what he covered for them
//   role     his accreditation on the day
//   year     when
export const recognition = [
  {
    org: "Ministry of Tourism",
    sub: "Government of India",
    short: "MoT",
    logo: null,
    event: "Event coverage", // FILL IN: the event name
    role: "Official photographer",
    year: "2024", // FILL IN
  },
  {
    org: "State tourism board",
    sub: "Replace with the real name",
    short: "STB",
    event: "Destination campaign",
    role: "Campaign photographer",
    year: "2024",
    placeholder: true,
  },
  {
    org: "Cultural festival",
    sub: "Replace with the real name",
    short: "FEST",
    event: "Festival documentation",
    role: "Accredited media",
    year: "2023",
    placeholder: true,
  },
  {
    org: "Heritage trust",
    sub: "Replace with the real name",
    short: "HT",
    event: "Archival documentation",
    role: "Commissioned photographer",
    year: "2023",
    placeholder: true,
  },
];

// One line of recognition shown above the passes. FILL IN with the real honour.
export const recognitionHeadline = {
  kicker: "Commissioned & recognised by",
  title: [{ text: "Trusted by the people who" }, { text: "put India on the map.", emphasis: true }],
  note: "Official coverage for the Ministry of Tourism, Government of India — and the bodies that look after India's festivals, heritage and destinations.",
};
