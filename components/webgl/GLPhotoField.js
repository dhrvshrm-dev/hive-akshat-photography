"use client";
// A field of photographs that swells under the cursor, drains to grey as it
// falls away from it, and bows with the weight of the scroll.
//
// Ported into the shared stage from the standalone ImageGrid, and simpler for
// it: the stage's camera is already solved in pixels, so a card is square
// because it is square — no stretched world space, no aspect correction on the
// card's own height, and the cursor's reach is a radius in screen pixels
// because every number here is a screen pixel.
//
// Each card still reads exactly one value: its distance from the cursor. That
// number is the swell, the depth (so a raised card overlaps its neighbours with
// no sorting) and the drain to luminance. One value, three uses, no per-card
// state.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { registerItem } from "@/lib/gl/stage";
import { aspectOf, coverScale, loadTexture } from "@/lib/gl/textures";
import { LUMINANCE, COVER_UV, SCROLL_BEND } from "@/lib/gl/glsl";

// Each card is its own draw call — the textures differ, so they cannot be
// instanced without an atlas. This is the ceiling before the frame rate goes.
const MAX_CARDS = 360;

// Everything inside this fraction of the radius is at full size, so the cursor
// lifts a patch of the field rather than one card with half-grown neighbours.
// The rim is what stops a card popping as it crosses the edge.
const PLATEAU = 0.55;

const VERTEX = /* glsl */ `
uniform float uVelocity;
uniform vec2 uSize;

varying vec2 vUv;

${SCROLL_BEND}

void main() {
    vUv = uv;
    // 90px of lag at full scroll speed: enough to feel like weight, not enough
    // to tear the card away from the grid it belongs to.
    vec3 pos = bendByScroll(position, uv, uVelocity, uSize, 90.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uTexture;
uniform float uDistance;
uniform float uDrain;
uniform float uHasTexture;
uniform vec2 uCover;

varying vec2 vUv;

${LUMINANCE}
${COVER_UV}

void main() {
    if (uHasTexture < 0.5) discard;

    vec3 image = texture2D(uTexture, coverUv(vUv, uCover)).rgb;
    float drained = clamp(uDistance * uDrain, 0.0, 1.0);
    gl_FragColor = vec4(mix(image, toLuminance(image), drained), 1.0);
}
`;

/** 1 inside the plateau, easing to 0 at the radius, 0 beyond it. */
function falloffAt(reach) {
  if (reach <= PLATEAU) return 1;
  if (reach >= 1) return 0;
  const t = (reach - PLATEAU) / (1 - PLATEAU);
  return 1 - t * t * (3 - 2 * t);
}

/**
 * Which photograph a cell gets. Hashed from the cell's own coordinates rather
 * than drawn at random, so a resize does not reshuffle the whole field.
 */
function slotFor(col, row, count) {
  const n = Math.max(1, count);
  return Math.abs(((col * 73856093) ^ (row * 19349663)) >>> 0) % n;
}

function createField(sources, options, env) {
  const cell = options.cell;
  const fill = options.fill;
  const magnify = options.magnify;
  const radius = options.radius;
  const drain = options.drain;

  const geometry = new THREE.PlaneGeometry(1, 1, 12, 12);
  const group = new THREE.Group();
  const textures = sources.map(() => null);
  let cards = [];
  let width = env.width;
  let height = env.height;

  const scratch = new THREE.Vector3();
  const baseScale = new THREE.Vector3(1, 1, 1);
  const maxScale = new THREE.Vector3(1, 1, 1);
  const mouse = new THREE.Vector2(0, 0);
  const targetMouse = new THREE.Vector2(0, 0);
  let hover = 0;
  let targetHover = 0;

  function applyTexture(slot) {
    const tex = textures[slot];
    if (!tex) return;
    const c = coverScale(aspectOf(tex), 1); // cards are square
    for (const card of cards) {
      if (card.slot !== slot) continue;
      card.material.uniforms.uTexture.value = tex;
      card.material.uniforms.uHasTexture.value = 1;
      card.material.uniforms.uCover.value.set(c.x, c.y);
    }
  }

  function clearCards() {
    for (const card of cards) {
      group.remove(card.mesh);
      card.material.dispose();
    }
    cards = [];
  }

  function build() {
    clearCards();

    let columns = Math.max(1, Math.floor(width / cell));
    let rows = Math.max(1, Math.floor(height / cell));
    // Trimmed from the longer axis first, so a capped field keeps its shape.
    while (columns * rows > MAX_CARDS) {
      if (columns >= rows) columns--;
      else rows--;
    }

    const cellW = width / columns;
    const cellH = height / rows;
    // Square, and sized by the tighter of the two axes so a card never spills
    // out of its cell on a short, wide box.
    const size = Math.min(cellW, cellH) * fill;
    baseScale.set(size, size, 1);
    // A card this big on a narrow screen covers most of the column and the
    // field stops reading as a grid, so portrait gets half the swell.
    const portrait = width < height;
    maxScale.copy(baseScale).multiplyScalar(portrait ? magnify * 0.5 : magnify);

    for (let i = 0; i < columns; i++) {
      for (let j = 0; j < rows; j++) {
        const slot = slotFor(i, j, textures.length);
        const material = new THREE.ShaderMaterial({
          vertexShader: VERTEX,
          fragmentShader: FRAGMENT,
          uniforms: {
            uTexture: { value: textures[slot] || null },
            uHasTexture: { value: textures[slot] ? 1 : 0 },
            uDistance: { value: 0 },
            uDrain: { value: drain },
            uCover: { value: new THREE.Vector2(1, 1) },
            uVelocity: { value: 0 },
            uSize: { value: new THREE.Vector2(size, size) },
          },
        });
        const mesh = new THREE.Mesh(geometry, material);
        mesh.scale.copy(baseScale);
        // Home is the cell's centre, in pixels from the middle of the box.
        const home = new THREE.Vector3(
          -width / 2 + (i + 0.5) * cellW,
          height / 2 - (j + 0.5) * cellH,
          0
        );
        // Everything starts stacked on the centre line and unfolds sideways
        // before it drops into rows — see the y target in update().
        mesh.position.set(0, 0, 0);
        // slot is what applyTexture() matches on when a photograph lands.
        cards.push({ mesh, material, slot, home, target: new THREE.Vector3(), size });
        group.add(mesh);
      }
    }

    for (let i = 0; i < textures.length; i++) applyTexture(i);
  }

  sources.forEach((src, i) => {
    loadTexture(src).then((tex) => {
      if (!tex) return;
      textures[i] = tex;
      applyTexture(i);
    });
  });

  build();

  return {
    group,
    resize(w, h) {
      if (Math.abs(w - width) < 1 && Math.abs(h - height) < 1) return;
      width = w;
      height = h;
      build();
    },
    update(e) {
      if (e.pointerInside) {
        targetMouse.set(e.pointerX, e.pointerY);
        targetHover = 1;
      } else {
        // The swell is eased away rather than the cursor being sent somewhere
        // far off — a cursor lerping to infinity drags a bulge across every
        // card on its way out.
        targetHover = 0;
      }

      mouse.lerp(targetMouse, 1 - Math.pow(0.0125, e.dt));
      hover += (targetHover - hover) * (1 - Math.exp(-e.dt * 5));

      const positionRate = 1 - Math.pow(0.004, e.dt);
      const scaleRate = 1 - Math.pow(0.0002, e.dt);

      for (const card of cards) {
        const mesh = card.mesh;
        const dx = mouse.x - mesh.position.x;
        const dy = mouse.y - mesh.position.y;
        const reach = Math.sqrt(dx * dx + dy * dy) / radius;

        scratch.lerpVectors(baseScale, maxScale, falloffAt(reach) * hover);
        mesh.scale.lerp(scratch, scaleRate);

        // Squared, so the drain and the depth keep a soft curve while the swell
        // itself gets the flat-topped one.
        const distance = reach * reach;
        mesh.position.z = -distance;
        card.material.uniforms.uDistance.value = distance;
        card.material.uniforms.uVelocity.value = e.velocity;
        card.material.uniforms.uSize.value.set(mesh.scale.x, mesh.scale.y);

        // y is held on the centre line until x has nearly arrived — this is
        // what makes the field unfold sideways and then drop into rows.
        const settledX = Math.abs(card.home.x - mesh.position.x) < Math.max(8, width * 0.04);
        card.target.set(card.home.x, settledX ? card.home.y : 0, mesh.position.z);
        mesh.position.lerp(card.target, positionRate);
      }
    },
    dispose() {
      clearCards();
      geometry.dispose();
    },
  };
}

export default function GLPhotoField({
  images,
  cell = 150,
  // An airy field with a large swell reads better than a dense one with a small
  // swell: the cards need somewhere to grow into, or the lift under the cursor
  // just fuses into a block.
  cardSize = 46,
  magnify = 3.0,
  radius = 240,
  drain = 1.0,
  className = "",
  style,
  children,
}) {
  const boxRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const srcs = (images || []).map((i) => (typeof i === "string" ? i : i && i.src)).filter(Boolean);
    if (!srcs.length) return;
    const options = {
      cell: Math.max(40, cell),
      fill: Math.min(1, Math.max(0.05, cardSize / 100)),
      magnify: Math.max(1, magnify),
      radius: Math.max(40, radius),
      drain: Math.max(0, drain),
    };
    const unregister = registerItem(
      el,
      (env) => createField(srcs, options, env),
      () => setLive(true)
    );
    return () => {
      setLive(false);
      unregister();
    };
  }, [images, cell, cardSize, magnify, radius, drain]);

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label="A field of photographs that swells under the pointer"
      className={className}
      style={{ position: "relative", ...style }}
    >
      {/* Whatever the section renders for non-WebGL visitors, gone once the
          field is drawing. */}
      <div style={{ opacity: live ? 0 : 1, transition: "opacity 500ms linear" }}>
        {children}
      </div>
    </div>
  );
}
