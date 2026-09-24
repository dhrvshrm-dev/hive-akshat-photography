// Portfolio images. Replace the "src" values with your own photos in /public/images
// (e.g. src: "/images/wedding-01.jpg"). "category" must match one of the categories below.
export const categories = ["All", "Weddings", "Pre-Wedding", "Events"];

export const portfolio = [
  { id: 1,  title: "Aarav & Diya",      category: "Weddings",    src: "https://picsum.photos/seed/ha-wed1/900/1200", w: 900,  h: 1200 },
  { id: 2,  title: "Marigold Mandap",   category: "Weddings",    src: "https://picsum.photos/seed/ha-wed2/1200/800", w: 1200, h: 800  },
  { id: 3,  title: "First Light",       category: "Pre-Wedding", src: "https://picsum.photos/seed/ha-pre1/900/1200", w: 900,  h: 1200 },
  { id: 4,  title: "Lake Pichola Eve",  category: "Pre-Wedding", src: "https://picsum.photos/seed/ha-pre2/1200/800", w: 1200, h: 800  },
  { id: 5,  title: "The Sangeet",       category: "Events",      src: "https://picsum.photos/seed/ha-evt1/1200/800", w: 1200, h: 800  },
  { id: 6,  title: "Haldi Mornings",    category: "Events",      src: "https://picsum.photos/seed/ha-evt2/900/1200", w: 900,  h: 1200 },
  { id: 7,  title: "Vows",              category: "Weddings",    src: "https://picsum.photos/seed/ha-wed3/900/1200", w: 900,  h: 1200 },
  { id: 8,  title: "Baraat",            category: "Weddings",    src: "https://picsum.photos/seed/ha-wed4/1200/800", w: 1200, h: 800  },
  { id: 9,  title: "Desert Portrait",   category: "Pre-Wedding", src: "https://picsum.photos/seed/ha-pre3/900/1200", w: 900,  h: 1200 },
  { id: 10, title: "Reception Glow",    category: "Events",      src: "https://picsum.photos/seed/ha-evt3/1200/800", w: 1200, h: 800  },
  { id: 11, title: "Mehndi Details",    category: "Events",      src: "https://picsum.photos/seed/ha-evt4/900/1200", w: 900,  h: 1200 },
  { id: 12, title: "Together",          category: "Weddings",    src: "https://picsum.photos/seed/ha-wed5/1200/800", w: 1200, h: 800  },
];

// The hero's sequence, dissolved into one another by the WebGL hero. Order is
// the order they appear in; the first one is also the <img> that carries the
// LCP, so it should be the strongest frame you have.
export const heroImages = [
  "https://picsum.photos/seed/ha-hero/1920/1200",
  "https://picsum.photos/seed/ha-wed2/1920/1200",
  "https://picsum.photos/seed/ha-pre2/1920/1200",
  "https://picsum.photos/seed/ha-evt3/1920/1200",
];
