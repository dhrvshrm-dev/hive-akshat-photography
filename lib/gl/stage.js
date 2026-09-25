import * as THREE from "three";

/**
 * One WebGL context for the whole site.
 *
 * A browser will only hand out a handful of contexts before it starts silently
 * dropping the oldest, so every 3D surface on this site draws into a single
 * fixed, full-screen, pointer-transparent canvas that sits behind the content.
 *
 * The DOM stays authoritative. A section that wants to be drawn in WebGL renders
 * its ordinary markup — real elements, real text, real layout, real SEO — and
 * registers its box here. The stage reads that box every frame and parks a
 * THREE.Group at its centre, snapped to whole pixels. The element then makes
 * itself transparent and the group draws in the hole it left.

 *
 * The camera is orthographic and solved to the viewport in pixels, so one world
 * unit is one CSS pixel and x/y run right and up from the centre of the tracked
 * box. Nothing in an item needs to know about the page.
 */

// The registry is module-level rather than React context: items mount inside the
// React tree, the canvas mounts in the root layout, and neither needs to be an
// ancestor of the other.
const entries = new Set();
let stage = null;

// How far outside the viewport an item keeps drawing. Enough that a fast scroll
// never catches a plane mid-build at the edge of the screen.
const CULL_MARGIN = 200;

// Phones get a slightly softer buffer: at 3x DPR a full-screen blur shader costs
// more than the extra sharpness is worth, and the frame rate is what people feel.
function maxPixelRatio() {
  const coarse = window.matchMedia("(pointer: coarse)").matches;
  return Math.min(window.devicePixelRatio || 1, coarse ? 1.5 : 2);
}

class Stage {
  constructor(canvas) {
    this.canvas = canvas;
    this.renderer = new THREE.WebGLRenderer({
      canvas,
      alpha: true,
      antialias: true,
      powerPreference: "high-performance",
    });
    this.renderer.setPixelRatio(maxPixelRatio());
    this.renderer.setClearColor(0x000000, 0);
    // Each item is drawn in its own pass, clipped to its own box, so the canvas
    // is cleared once by hand rather than once per render() call.
    this.renderer.autoClear = false;

    // Frustum is set in resize(); the depth range is generous because items are
    // free to use z for their own layering.
    this.camera = new THREE.OrthographicCamera(-1, 1, 1, -1, -2000, 2000);
    this.camera.position.z = 100;

    this.vw = 1;
    this.vh = 1;

    this.scrollY = window.scrollY;
    this.velocity = 0; // smoothed, in px per frame
    this.pointer = { x: -99999, y: -99999, has: false };

    this.time = 0;
    this.last = performance.now();
    this.frameId = 0;
    this.drewLastFrame = true;
    this.disposed = false;

    this.resize();
    window.addEventListener("resize", this.onResize, { passive: true });
    window.addEventListener("pointermove", this.onPointerMove, { passive: true });
    window.addEventListener("pointerdown", this.onPointerMove, { passive: true });
    document.addEventListener("visibilitychange", this.onVisibility);
  }

  // Boxes are re-read every frame, so a resize only has to re-solve the canvas
  // and the camera.
  onResize = () => {
    this.resize();
  };

  onPointerMove = (e) => {
    this.pointer.x = e.clientX;
    this.pointer.y = e.clientY;
    this.pointer.has = true;
  };

  onVisibility = () => {
    // A tab coming back must not see one enormous dt, nor a scroll velocity
    // accumulated from a jump that the visitor never watched happen.
    if (!document.hidden) {
      this.last = performance.now();
      this.scrollY = window.scrollY;
      this.velocity = 0;
    }
  };

  resize() {
    // documentElement.clientWidth/Height, not window.innerWidth/Height: the
    // canvas is position:fixed, so it is laid out against the initial containing
    // block, which *excludes* the classic scrollbar. Sizing the drawing buffer
    // from innerWidth instead scales the whole GL layer by
    // clientWidth/innerWidth — about 1.2% on Windows — and every plane drifts
    // further from the DOM box it is supposed to be sitting in the further
    // right it is. Invisible wherever scrollbars are overlays, obvious wherever
    // they are not.
    this.vw = document.documentElement.clientWidth;
    this.vh = document.documentElement.clientHeight;
    this.renderer.setPixelRatio(maxPixelRatio());
    this.renderer.setSize(this.vw, this.vh, false);
    this.camera.left = -this.vw / 2;
    this.camera.right = this.vw / 2;
    this.camera.top = this.vh / 2;
    this.camera.bottom = -this.vh / 2;
    this.camera.updateProjectionMatrix();
  }

  /** Builds an item's meshes the first time its box has a usable size. */
  ensureBuilt(entry) {
    if (entry.obj || entry.failed) return;
    if (!entry.width || !entry.height) return;
    try {
      entry.obj = entry.factory({
        width: entry.width,
        height: entry.height,
        renderer: this.renderer,
      });
    } catch (err) {
      // One broken item must not take the whole canvas down with it — but it
      // must not fail silently either, or a section simply goes blank with
      // nothing anywhere to say why.
      entry.failed = true;
      console.error("[gl] item failed to build", entry.el, err);
      return;
    }
    if (entry.obj && entry.obj.group) {
      // One scene per item. It is what lets each be drawn in its own pass and
      // therefore clipped to its own box — a card that swells past the edge of
      // its section is cut off there rather than spilling into the next one.
      entry.scene = new THREE.Scene();
      entry.scene.add(entry.obj.group);
      if (entry.onReady) entry.onReady();
    }
  }

  teardown(entry) {
    if (!entry.obj) return;
    if (entry.scene && entry.obj.group) entry.scene.remove(entry.obj.group);
    entry.scene = null;
    if (entry.obj.dispose) entry.obj.dispose();
    entry.obj = null;
  }

  start() {
    const loop = () => {
      this.frameId = requestAnimationFrame(loop);
      this.step();
    };
    this.frameId = requestAnimationFrame(loop);
  }

  step() {
    if (this.disposed || document.hidden) return;

    const now = performance.now();
    let dt = (now - this.last) / 1000;
    this.last = now;
    if (!isFinite(dt) || dt < 0) dt = 0;
    if (dt > 0.05) dt = 0.05; // a backgrounded tab must not teleport anything
    this.time += dt;

    const y = window.scrollY;
    const delta = y - this.scrollY;
    this.scrollY = y;
    // Smoothed rather than raw: a wheel notch is one large frame followed by
    // nothing, and distortion driven by the raw number flickers.
    this.velocity += (delta - this.velocity) * (1 - Math.exp(-dt * 14));

    const env = {
      time: this.time,
      dt,
      // Normalised and clamped, so an item's shader constants stay meaningful
      // whatever the visitor's scroll device is.
      velocity: Math.max(-1, Math.min(1, this.velocity / 55)),
      velocityPx: this.velocity,
      viewportWidth: this.vw,
      viewportHeight: this.vh,
      pointerX: 0,
      pointerY: 0,
      pointerInside: false,
      width: 0,
      height: 0,
      // 0 as the box enters the bottom of the viewport, 1 as it leaves the top.
      // Anything that wants to be driven by scroll position rather than scroll
      // speed reads this.
      progress: 0,
    };

    let anyVisible = false;
    const visible = [];

    for (const entry of entries) {
      // Measured every frame rather than cached. A cached document position goes
      // stale the moment anything above the box reflows — a font swapping in, an
      // image arriving, a section expanding — and a box that is a pixel out
      // paints a line of itself over its neighbour. These are pure reads with no
      // writes between them, so the browser services them from a single layout
      // pass; for the handful of boxes a page registers it costs nothing.
      const rect = entry.el.getBoundingClientRect();
      const width = Math.round(rect.width);
      const height = Math.round(rect.height);
      if (width !== entry.width || height !== entry.height) {
        entry.width = width;
        entry.height = height;
        if (entry.obj && entry.obj.resize) entry.obj.resize(width, height);
      }

      this.ensureBuilt(entry);
      const obj = entry.obj;
      if (!obj || !obj.group) continue;

      // Whole pixels, because the scroll offset is fractional on a trackpad and
      // a box is very often laid out on a half pixel. Position and scissor are
      // both derived from these two integers and so can never disagree.
      const screenTop = Math.round(rect.top);
      const screenLeft = Math.round(rect.left);
      const onScreen =
        screenTop + entry.height > -CULL_MARGIN && screenTop < this.vh + CULL_MARGIN;
      obj.group.visible = onScreen;
      if (!onScreen) continue;
      anyVisible = true;
      entry.screenTop = screenTop;
      entry.screenLeft = screenLeft;
      visible.push(entry);

      // The group's origin is the centre of the tracked box, with y counting up.
      obj.group.position.set(
        screenLeft + entry.width / 2 - this.vw / 2,
        this.vh / 2 - (screenTop + entry.height / 2),
        0
      );

      env.width = entry.width;
      env.height = entry.height;
      env.progress = Math.max(
        0,
        Math.min(1, (this.vh - screenTop) / (this.vh + entry.height))
      );
      // Pointer handed over in the item's own space: pixels from its centre,
      // y up, so an item never has to think about the page either.
      env.pointerX = this.pointer.x - (screenLeft + entry.width / 2);
      env.pointerY = screenTop + entry.height / 2 - this.pointer.y;
      env.pointerInside =
        this.pointer.has &&
        this.pointer.x >= screenLeft &&
        this.pointer.x <= screenLeft + entry.width &&
        this.pointer.y >= screenTop &&
        this.pointer.y <= screenTop + entry.height;

      if (obj.update) obj.update(env);
    }

    // With nothing on screen there is nothing to draw; one last clear goes out
    // so the canvas is left empty rather than holding a stale frame.
    if (anyVisible || this.drewLastFrame) {
      this.renderer.setScissorTest(false);
      this.renderer.clear();
      this.renderer.setScissorTest(true);
      for (const entry of visible) {
        // Scissor coordinates are CSS pixels counted from the bottom-left;
        // three scales them by the pixel ratio itself.
        //
        // Every value here is already a whole number and is the same one the
        // group was positioned with, so the cut lands exactly on the plane's
        // edge — no seam, no overshoot into the next section.
        this.renderer.setScissor(
          entry.screenLeft,
          this.vh - (entry.screenTop + entry.height),
          entry.width,
          entry.height
        );
        this.renderer.render(entry.scene, this.camera);
      }
      this.renderer.setScissorTest(false);
    }
    this.drewLastFrame = anyVisible;
  }

  debug() {
    return {
      vw: this.vw,
      vh: this.vh,
      pixelRatio: this.renderer.getPixelRatio(),
      canvas: [this.canvas.width, this.canvas.height],
      clientHeight: document.documentElement.clientHeight,
      items: this.debugItems(),
    };
  }

  debugItems() {
    return [...entries].map((entry) => ({
      tag: entry.el.tagName + "." + (entry.el.className || "").toString().slice(0, 40),
      built: Boolean(entry.obj),
      failed: entry.failed,
      width: entry.width,
      height: entry.height,
      screenTop: entry.screenTop,
      visible: Boolean(entry.obj && entry.obj.group && entry.obj.group.visible),
      children: entry.obj && entry.obj.group ? entry.obj.group.children.length : 0,
    }));
  }

  dispose() {
    this.disposed = true;
    cancelAnimationFrame(this.frameId);
    window.removeEventListener("resize", this.onResize);
    window.removeEventListener("pointermove", this.onPointerMove);
    window.removeEventListener("pointerdown", this.onPointerMove);
    document.removeEventListener("visibilitychange", this.onVisibility);
    for (const entry of entries) this.teardown(entry);
    this.renderer.dispose();
  }
}

/** Called once, by the canvas in the root layout. */
export function mountStage(canvas) {
  if (stage) return () => {};
  try {
    stage = new Stage(canvas);
  } catch (err) {
    // No WebGL. Every registered item stays as the plain DOM it already is.
    stage = null;
    return () => {};
  }
  stage.start();
  // A handle for poking at the stage from the console when a section is not
  // drawing: __glStage.debug() reports what is registered, built and on screen.
  window.__glStage = stage;
  return () => {
    if (!stage) return;
    stage.dispose();
    stage = null;
  };
}

/**
 * Track a DOM box and draw `factory()`'s meshes over it.
 *
 * `factory({ width, height, renderer })` returns `{ group, update(env), resize(w, h), dispose() }`.
 * `onReady` fires once the meshes exist, which is the moment the caller should
 * fade its own markup out.
 *
 * Returns an unregister function. Safe to call before the canvas has mounted.
 */
export function registerItem(el, factory, onReady) {
  const entry = {
    el,
    factory,
    onReady,
    obj: null,
    scene: null,
    failed: false,
    width: 0,
    height: 0,
    screenLeft: 0,
    screenTop: 0,
  };
  entries.add(entry);

  // No observer and no initial measurement: the render loop reads the box every
  // frame, so an item registered before the canvas mounts is picked up on the
  // first frame after it does.
  return () => {
    if (stage) stage.teardown(entry);
    entries.delete(entry);
  };
}

/** True once a context exists — callers use it to decide whether to hide markup. */
export function stageIsLive() {
  return Boolean(stage);
}
