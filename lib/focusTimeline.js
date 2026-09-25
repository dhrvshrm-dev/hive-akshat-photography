// The rack-focus timeline, shared by the WebGL shader and the DOM viewfinder so
// the picture and the HUD can never disagree about what the lens is doing.
//
// Every value is a function of `d`: seconds since the change began.
//
//   0.00 – 0.45  the outgoing frame drifts out of focus
//   0.30 – 0.60  cross-fade under full blur (the "swap" is at 0.45)
//   0.45 – 0.95  focus pulls in fast and overshoots…
//   0.95 – 1.20  …hunts back out a little…
//   1.20 – 1.60  …and settles. Lock at 1.60.
export const T = {
  swap: 0.45,
  lock: 1.6,
};

const clamp01 = (x) => Math.max(0, Math.min(1, x));
const smooth = (a, b, x) => {
  const t = clamp01((x - a) / (b - a));
  return t * t * (3 - 2 * t);
};
const lerp = (a, b, t) => a + (b - a) * t;

/** 0 = pin sharp, 1 = fully defocused. */
export function blurAt(d) {
  if (d == null) return 1; // not started yet: hold out of focus
  if (d <= 0) return 0;
  if (d < 0.45) return smooth(0, 0.45, d);
  if (d < 0.95) return lerp(1, 0.12, smooth(0.45, 0.95, d));
  if (d < 1.2) return lerp(0.12, 0.38, smooth(0.95, 1.2, d));
  if (d < 1.6) return lerp(0.38, 0, smooth(1.2, 1.6, d));
  return 0;
}

/** 0 = still showing the outgoing frame, 1 = fully on the incoming one. */
export function mixAt(d) {
  if (d == null) return 1;
  return smooth(0.3, 0.6, d);
}

/** Where the HUD is: "idle" | "defocus" | "hunt" | "locked". */
export function phaseAt(d) {
  if (d == null) return "idle";
  if (d < T.swap) return "defocus";
  if (d < T.lock) return "hunt";
  return "locked";
}
