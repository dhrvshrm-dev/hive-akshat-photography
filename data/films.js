// Drone and wildlife films, hosted on YouTube.
//
// DUMMY LINKS: the IDs below are public drone/wildlife videos from other
// channels, there only so the player can be demoed. Replace every one with
// Akshat's own before launch — the site must not present them as his work.
//
// FILL IN `youtube` with each video's ID — the part after "v=" in
// https://www.youtube.com/watch?v=XXXXXXXXXXX (or after youtu.be/). Until a
// video has an ID its card shows the poster frame and says the film is coming.
//
//   kind      "Drone" or "Wildlife" — picks the on-screen overlay
//   poster    id from data/photos.js used as the cover (YouTube's own thumbnail
//             is used instead once `youtube` is set, unless you keep a poster
//             by setting usePoster: true)
//   duration  shown on the card, e.g. "3:42"
export const films = [
  {
    youtube: "BnHUVARgcw8", // DUMMY — someone else's video, replace with Akshat's
    usePoster: true,
    title: "Above the Thar",
    kind: "Drone",
    place: "Jaisalmer, Rajasthan",
    duration: "3:40",
    poster: "thar-dunes",
    osd: { alt: 118, speed: 8.2, dist: 1.4 },
  },
  {
    youtube: "jaeq0Ep7q8s", // DUMMY — someone else's video, replace with Akshat's
    usePoster: true,
    title: "Tiger country",
    kind: "Wildlife",
    place: "Central India",
    duration: "5:12",
    poster: "bengal-tiger",
    lens: "400mm",
  },
  {
    youtube: "nSv4wCbAIHc", // DUMMY — someone else's video, replace with Akshat's
    usePoster: true,
    title: "The road to Padum",
    kind: "Drone",
    place: "Zanskar, Ladakh",
    duration: "4:05",
    poster: "zanskar-road",
    osd: { alt: 96, speed: 11.4, dist: 2.1 },
  },
  {
    youtube: "KOXCeSr6Npc", // DUMMY — someone else's video, replace with Akshat's
    usePoster: true,
    title: "Ghats at first light",
    kind: "Drone",
    place: "Varanasi, Uttar Pradesh",
    duration: "2:58",
    poster: "varanasi-ghats",
    osd: { alt: 60, speed: 4.6, dist: 0.8 },
  },
  {
    youtube: "4uPAnSuYyb0", // DUMMY — someone else's video, replace with Akshat's
    usePoster: true,
    title: "Desert dwellers",
    kind: "Wildlife",
    place: "Thar desert",
    duration: "3:21",
    poster: "thar-dromedary",
    lens: "300mm",
  },
];
