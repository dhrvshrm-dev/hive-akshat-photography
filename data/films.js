// Films — all Akshat's own work.
//
//   youtube   the video ID (the part after "v=", "youtu.be/" or "shorts/")
//   vertical  true for YouTube Shorts / reels — the player opens them 9:16
//   kind      "Drone", "Reel" or "Music video" — picks the on-screen overlay
//   credit    his role, shown on the card (e.g. Director of Photography)
//   poster    id from data/photos.js used as the cover. With `usePoster` off,
//             YouTube's own thumbnail is used instead (landscape videos only —
//             Shorts thumbnails are portrait and would be letterboxed)
//   duration  optional, e.g. "3:42"
export const films = [
  {
    youtube: "-UDth3n2VM0",
    title: "PUSHKAR",
    kind: "Music video",
    credit: "Director of Photography",
    place: "Pushkar, Rajasthan",
    note: "Singer: Jeet Sharmaa",
    poster: "pushkar-ghats-sunset",
    lens: "Cinema",
  },
  {
    youtube: "a3sklKEb0zc",
    title: "Train Pakad Le",
    kind: "Music video",
    credit: "Director of Photography",
    place: "Rajasthan",
    note: "Singer: Jeet Sharmaa",
    poster: "ajmer-station-night",
    lens: "Cinema",
  },
  {
    youtube: "RCQJpCatpTU",
    vertical: true,
    usePoster: true,
    title: "Jodhpur from the air",
    kind: "Drone",
    place: "Jodhpur, Rajasthan",
    poster: "jodhpur-clocktower",
    osd: { alt: 120, speed: 6.4, dist: 1.2 },
  },
  {
    youtube: "1SmrDa-6kO8",
    vertical: true,
    usePoster: true,
    title: "Varanasi from the air",
    kind: "Drone",
    place: "Varanasi, Uttar Pradesh",
    poster: "dev-deepawali-ghats",
    osd: { alt: 80, speed: 4.8, dist: 0.9 },
  },
  {
    youtube: "4UQ03WDfWTw",
    vertical: true,
    usePoster: true,
    title: "Amer Fort, aerial",
    kind: "Drone",
    place: "Jaipur, Rajasthan",
    poster: "amer-aerial",
    osd: { alt: 110, speed: 5.1, dist: 1.1 },
  },
  {
    youtube: "QccBM1BW8iE",
    vertical: true,
    usePoster: true,
    title: "Ajmer Dargah, aerial",
    kind: "Drone",
    place: "Ajmer, Rajasthan",
    poster: "ajmer-night-aerial",
    osd: { alt: 90, speed: 3.9, dist: 0.7 },
  },
  {
    youtube: "23awrCeWo1o",
    vertical: true,
    usePoster: true,
    title: "Maha Aarti at Pushkar Sarovar",
    kind: "Reel",
    place: "Pushkar, Rajasthan",
    poster: "brahma-temple-night",
    lens: "Night",
  },
];

// Where the rest live.
export const filmsChannel = "https://www.youtube.com/@hive_akshat";
