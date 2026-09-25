// The journeys — each one a chapter on /journeys and a pin on its map, in route
// order (the map draws the line between them in this sequence).
//
// PLACEHOLDER COPY: the field notes are written to show the voice of the site.
// Replace them with Akshat's own words about each trip.
//
//   cover     id from data/photos.js — the chapter's lead frame
//   frames    more ids from data/photos.js, shown as the chapter's contact sheet
//   lat/lon   where the pin sits on the map
//   featured  shown in the horizontal journey reel on the home page
export const journeys = [
  {
    slug: "pushkar-ajmer",
    name: "Pushkar & Ajmer",
    kicker: "Home ground",
    region: "Rajasthan",
    lat: 26.47,
    lon: 74.6,
    season: "Oct – Mar",
    bestLight: "05:50 – 07:00",
    cover: "pushkar-ghats",
    frames: ["ajmer-jhonpra-arch", "pushkar-camels", "rajasthan-shepherd"],
    note:
      "Twenty minutes over Nag Pahar and the desert opens around a lake that has been holy for longer than anyone can say. This is where I learned to photograph — the ghats before the bells, camel fair dust in November, and the long red arches of the Jhonpra at noon.",
    featured: true,
  },
  {
    slug: "jaipur",
    name: "Jaipur",
    kicker: "Geometry in pink sandstone",
    region: "Rajasthan",
    lat: 26.92,
    lon: 75.82,
    season: "Nov – Feb",
    bestLight: "06:30 – 08:00",
    cover: "amber-fort",
    frames: ["jantar-mantar", "galta-ji", "macaque"],
    note:
      "A city built by an astronomer-king, and it shows — the Jantar Mantar is a photograph waiting for a hard shadow. Amber is best from across Maota at first light, before the elephants and the buses.",
    featured: true,
  },
  {
    slug: "thar",
    name: "The Thar",
    kicker: "Golden fort, moving dunes",
    region: "Jaisalmer, Rajasthan",
    lat: 26.91,
    lon: 70.91,
    season: "Nov – Feb",
    bestLight: "05:45 – 07:15",
    cover: "thar-dunes",
    frames: ["jaisalmer-fort", "thar-dromedary", "jaisalmer-window", "bundi-lady"],
    note:
      "The dunes redraw themselves every night. Walk out before sunrise and you get lines nobody has stepped on yet. Sonar Qila turns from grey to gold in about four minutes — you have to already be standing there.",
    featured: true,
  },
  {
    slug: "amritsar",
    name: "Amritsar",
    kicker: "The golden sanctum",
    region: "Punjab",
    lat: 31.62,
    lon: 74.88,
    season: "Year round",
    bestLight: "04:30 – 06:00",
    cover: "golden-temple",
    frames: ["harmandir-sahib"],
    note:
      "The Harmandir Sahib never closes and never goes quiet, but there is an hour before dawn when the sarovar holds the reflection still. In winter the fog comes in and the whole temple floats.",
    featured: false,
  },
  {
    slug: "high-himalaya",
    name: "Ladakh, Zanskar & Spiti",
    kicker: "Above the tree line",
    region: "Ladakh · Himachal Pradesh",
    lat: 33.5,
    lon: 77.2,
    season: "Jun – Sep",
    bestLight: "05:15 – 06:30",
    cover: "zanskar-road",
    frames: ["phuktal", "thiksey", "ladakh-mustard", "kee-monastery", "spiti-river", "sangla-snow"],
    note:
      "At 3,600 metres the air is so clear that the light has edges. Monasteries cling to cliffs that look impossible until you have climbed to one. Every road is a two-day negotiation with the weather.",
    featured: true,
  },
  {
    slug: "sikkim",
    name: "North Sikkim",
    kicker: "Gurudongmar, 5,430 m",
    region: "Sikkim",
    lat: 28.02,
    lon: 88.71,
    season: "Mar – May",
    bestLight: "06:00 – 08:00",
    cover: "gurudongmar",
    frames: ["ranikhet-himalaya"],
    note:
      "A lake sacred to Buddhists and Sikhs, and one of the highest in the world. Breath is short, hands go numb, and the mountains line up in the water as if someone arranged them.",
    featured: false,
  },
  {
    slug: "varanasi",
    name: "Varanasi",
    kicker: "The river of fire",
    region: "Uttar Pradesh",
    lat: 25.31,
    lon: 83.01,
    season: "Oct – Mar",
    bestLight: "05:30 – 07:00 · aarti 18:45",
    cover: "varanasi-puja",
    frames: ["varanasi-ghats", "varanasi-boatman", "varanasi-sadhu"],
    note:
      "Eighty-four ghats and every one of them awake before you are. The evening aarti is fire, smoke and conch shells; the morning is mist, boatmen and absolute calm. You need both to understand the city.",
    featured: true,
  },
  {
    slug: "tiger-country",
    name: "Tiger country",
    kicker: "Central Indian forests",
    region: "Madhya Pradesh",
    lat: 23.7,
    lon: 81.0,
    season: "Oct – Jun",
    bestLight: "06:00 – 09:00",
    cover: "bengal-tiger",
    frames: [],
    note:
      "Six drives, nothing. The seventh, a pug-mark still filling with water, then an alarm call from a langur, then her. She stopped, looked at the jeep for maybe two seconds, and walked on.",
    featured: false,
  },
  {
    slug: "deccan-coast",
    name: "Hampi & the Coromandel",
    kicker: "Stone & sea",
    region: "Karnataka · Tamil Nadu",
    lat: 15.33,
    lon: 76.46,
    season: "Nov – Feb",
    bestLight: "06:15 – 07:30",
    cover: "hampi-virupaksha",
    frames: ["hampi-pushkarani", "shore-temple"],
    note:
      "Hampi is a kingdom's worth of temples scattered across a landscape of balanced boulders. Climb Hemakuta for sunrise over Virupaksha, then drive east to where the Pallavas carved temples at the edge of the sea.",
    featured: true,
  },
  {
    slug: "kerala",
    name: "Kerala",
    kicker: "Backwaters & Theyyam",
    region: "Kerala",
    lat: 9.95,
    lon: 76.3,
    season: "Nov – Mar",
    bestLight: "06:00 – 07:30 · Theyyam after dark",
    cover: "kerala-theyyam",
    frames: ["kerala-mangrove"],
    note:
      "In the north, Theyyam: a ritual where the dancer becomes the god for one night, in paint and fire. In the south, the mangroves of Ashtamudi, where a boatman steers you under roots in total silence.",
    featured: false,
  },
];
