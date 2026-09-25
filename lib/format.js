// Small formatters shared by every readout on the site, so a coordinate or an
// altitude looks the same in the hero, the map and the lightbox.

export function fmtLat(lat) {
  return `${Math.abs(lat).toFixed(4)}°${lat >= 0 ? "N" : "S"}`;
}

export function fmtLon(lon) {
  return `${Math.abs(lon).toFixed(4)}°${lon >= 0 ? "E" : "W"}`;
}

export function fmtCoords(lat, lon) {
  return `${fmtLat(lat)} ${fmtLon(lon)}`;
}

export function fmtAlt(alt) {
  if (alt == null) return "— m";
  if (alt > 100000) return `${Math.round(alt / 1000).toLocaleString("en-IN")} km`;
  return `${alt.toLocaleString("en-IN")} m`;
}

export const pad = (n, len = 2) => String(n).padStart(len, "0");

/** "HH:MM:SS" in India Standard Time, whatever the visitor's own zone. */
export function istClock(date = new Date()) {
  const ist = new Date(date.getTime() + (date.getTimezoneOffset() + 330) * 60000);
  return `${pad(ist.getHours())}:${pad(ist.getMinutes())}:${pad(ist.getSeconds())}`;
}

/** "Dec 2019" from an EXIF-ish ISO string. */
export function fmtTaken(iso) {
  if (!iso) return null;
  const d = new Date(iso);
  if (isNaN(d)) return null;
  return d.toLocaleString("en-GB", { month: "short", year: "numeric" });
}

/** "05:28" — the local wall-clock time the frame was made, straight from EXIF. */
export function fmtTakenTime(iso) {
  if (!iso) return null;
  const m = /T(\d\d):(\d\d)/.exec(iso);
  return m ? `${m[1]}:${m[2]}` : null;
}

/**
 * Sunrise and sunset for a place and day, in IST minutes after midnight.
 * NOAA's simplified solar-position algorithm — accurate to a minute or two,
 * which is plenty for telling someone when golden hour starts in Ajmer.
 */
export function sunTimes(lat, lon, date = new Date()) {
  const rad = Math.PI / 180;
  const start = Date.UTC(date.getUTCFullYear(), 0, 0);
  const day = Math.floor((date.getTime() - start) / 86400000);
  const g = ((2 * Math.PI) / 365) * (day - 1);
  const eqTime =
    229.18 *
    (0.000075 + 0.001868 * Math.cos(g) - 0.032077 * Math.sin(g) - 0.014615 * Math.cos(2 * g) - 0.040849 * Math.sin(2 * g));
  const decl =
    0.006918 - 0.399912 * Math.cos(g) + 0.070257 * Math.sin(g) - 0.006758 * Math.cos(2 * g) +
    0.000907 * Math.sin(2 * g) - 0.002697 * Math.cos(3 * g) + 0.00148 * Math.sin(3 * g);
  const cosH =
    Math.cos(90.833 * rad) / (Math.cos(lat * rad) * Math.cos(decl)) - Math.tan(lat * rad) * Math.tan(decl);
  const ha = Math.acos(Math.max(-1, Math.min(1, cosH))) / rad;
  const toIst = (utcMin) => (((utcMin + 330) % 1440) + 1440) % 1440;
  const rise = toIst(720 - 4 * (lon + ha) - eqTime);
  const set = toIst(720 - 4 * (lon - ha) - eqTime);
  return { rise, set };
}

export function fmtMinutes(min) {
  const m = Math.round(min);
  return `${pad(Math.floor(m / 60) % 24)}:${pad(m % 60)}`;
}
