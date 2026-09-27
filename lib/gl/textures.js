import * as THREE from "three";

// One texture per URL per document, shared by every surface on the page. Nothing
// here is ever disposed: a photo used by the hero is very often the same photo
// used by the field below it, and the cache outlives both.
const cache = new Map();
const pending = new Map();

// Widths Next's image optimizer serves (its default deviceSizes + imageSizes).
const WIDTHS = [128, 256, 384, 640, 750, 828, 1080, 1200, 1920, 2048];

/**
 * The URL a texture should actually be fetched from: the local original,
 * resized by Next to the smallest allowed width that covers `px`, and served as
 * WebP. A 100 px contact-sheet card then downloads a 256 px image instead of the
 * 2200 px original — the difference between ~20 MB and ~2 MB on a phone.
 */
export function glSrc(src, px) {
  if (!src || !src.startsWith("/")) return src; // remote URLs pass through untouched
  const w = WIDTHS.find((x) => x >= px) || WIDTHS[WIDTHS.length - 1];
  return `/_next/image?url=${encodeURIComponent(src)}&w=${w}&q=72`;
}

/** Hero-sized textures: enough for a full-screen cover crop, no more. */
export function heroWidth() {
  if (typeof window === "undefined") return 1920;
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return coarse || window.innerWidth < 900 ? 1200 : 1920;
}

export function loadTexture(url) {
  if (!url) return Promise.resolve(null);
  const cached = cache.get(url);
  if (cached) return Promise.resolve(cached);
  const inFlight = pending.get(url);
  if (inFlight) return inFlight;

  const p = new Promise((resolve) => {
    const loader = new THREE.TextureLoader();
    loader.setCrossOrigin("anonymous");
    loader.load(
      url,
      (texture) => {
        // Left in its raw colour space deliberately. Every shader on the site is
        // written by hand, so three injects neither a decode nor an encode and
        // the bytes reach the framebuffer untouched — which is what makes a
        // photograph at rest pixel-identical to the <img> it replaced.
        texture.minFilter = THREE.LinearMipmapLinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.generateMipmaps = true;
        cache.set(url, texture);
        resolve(texture);
      },
      undefined,
      () => {
        // Dropped from the pending map so a later mount can retry a URL that
        // failed once — a flaky CDN response should not poison the cache.
        pending.delete(url);
        resolve(null);
      },
    );
  });
  pending.set(url, p);
  return p;
}

/** Aspect of a loaded texture's source image, 1 if it cannot be read. */
export function aspectOf(texture) {
  const img = texture && texture.image;
  const w = (img && img.width) || 1;
  const h = (img && img.height) || 1;
  return w / h;
}

/**
 * The uv multiplier that crops a photo to a box the way `object-fit: cover`
 * does — squeezed about the centre, so the short axis fills and the long axis
 * is trimmed rather than squashed.
 */
export function coverScale(textureAspect, boxAspect, out) {
  const target = out || { x: 1, y: 1 };
  if (textureAspect > boxAspect) {
    target.x = boxAspect / textureAspect;
    target.y = 1;
  } else {
    target.x = 1;
    target.y = textureAspect / boxAspect;
  }
  return target;
}
