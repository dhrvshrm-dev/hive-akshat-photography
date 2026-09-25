// Coordination between the diya intro and whatever wants to wait for it (the
// hero holds its first focus-pull until the lamp has been lit).
export const INTRO_KEY = "ha-diya-seen";

/**
 * Runs in <head> before first paint. Decides whether this visit gets the intro
 * and marks <html> accordingly, so the server-rendered curtain is either kept
 * (intro coming) or hidden at once (everyone else) with no flash either way.
 * ?intro=1 always shows it — handy for showing the client.
 */
export const introHeadScript = `(function(){var d=document.documentElement;try{var q=/[?&]intro=1/.test(location.search);var skip=!q&&(location.pathname!=="/"||sessionStorage.getItem("${INTRO_KEY}")==="1"||matchMedia("(prefers-reduced-motion: reduce)").matches);if(skip)d.setAttribute("data-intro","skip");}catch(e){d.setAttribute("data-intro","skip");}})();`;

export function introPending() {
  if (typeof document === "undefined") return false;
  const v = document.documentElement.getAttribute("data-intro");
  return v !== "skip" && v !== "done";
}

export function markIntroDone() {
  try {
    sessionStorage.setItem(INTRO_KEY, "1");
  } catch {
    /* storage blocked — the intro just shows again next visit */
  }
  document.documentElement.setAttribute("data-intro", "done");
  window.dispatchEvent(new Event("intro:done"));
}

/** Calls `cb` once the intro is out of the way (immediately if there is none). */
export function whenIntroDone(cb) {
  if (!introPending()) {
    cb();
    return () => {};
  }
  const handler = () => cb();
  window.addEventListener("intro:done", handler, { once: true });
  return () => window.removeEventListener("intro:done", handler);
}
