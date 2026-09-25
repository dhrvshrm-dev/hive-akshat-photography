"use client";
// A band of photographs that drifts sideways as the page scrolls past it, bows
// under the speed of that scroll, and splits its colour channels while it moves.
//
// The drift is driven by *position* — how far the band has travelled through the
// viewport — so it is perfectly reversible and never accumulates drift. The bend
// and the channel split are driven by *velocity*, so they exist only while the
// visitor is actually moving and vanish the instant they stop. That split is the
// whole trick: at rest this is a row of clean photographs, and the effect is
// something the page does rather than something the photographs are.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { registerItem } from "@/lib/gl/stage";
import { aspectOf, coverScale, loadTexture } from "@/lib/gl/textures";
import { COVER_UV, LUMINANCE, SCROLL_BEND } from "@/lib/gl/glsl";

const VERTEX = /* glsl */ `
uniform float uVelocity;
uniform vec2 uSize;

varying vec2 vUv;

${SCROLL_BEND}

void main() {
    vUv = uv;
    // Twice the field's lag: these cards are larger and travelling, so they can
    // carry more weight before the bend reads as a glitch.
    vec3 pos = bendByScroll(position, uv, uVelocity, uSize, 180.0);
    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uTexture;
uniform vec2 uCover;
uniform float uVelocity;
uniform float uHasTexture;
uniform float uFade;

varying vec2 vUv;

${COVER_UV}
${LUMINANCE}

void main() {
    if (uHasTexture < 0.5) discard;

    vec2 uv = coverUv(vUv, uCover);

    // Channel separation along the axis of travel. Sub-pixel at a gentle scroll,
    // clearly visible at a flick — and exactly zero when the page is still.
    float shift = uVelocity * 0.012;
    float r = texture2D(uTexture, uv + vec2(shift, 0.0)).r;
    vec4 g = texture2D(uTexture, uv);
    float b = texture2D(uTexture, uv - vec2(shift, 0.0)).b;

    vec3 color = vec3(r, g.g, b);
    // A touch of the colour drains out while it is moving, which keeps the
    // channel split from reading as a broken image.
    color = mix(color, toLuminance(color), min(abs(uVelocity) * 0.5, 0.35));

    gl_FragColor = vec4(color, uFade);
}
`;

function createStrip(sources, options, env) {
  const geometry = new THREE.PlaneGeometry(1, 1, 24, 12);
  const group = new THREE.Group();
  const textures = sources.map(() => null);
  const cards = [];

  let width = env.width;
  let height = env.height;
  let drift = 0; // smoothed, so a jump in scroll position does not snap the band

  function layout() {
    // Cards are as tall as the band allows, with a gutter, and the row is made
    // wider than the viewport so there is always something to drift into.
    const cardH = height * 0.72;
    const cardW = cardH * options.ratio;
    const gap = cardW * options.gap;
    const step = cardW + gap;
    const total = step * cards.length;

    for (let i = 0; i < cards.length; i++) {
      const card = cards[i];
      card.mesh.scale.set(cardW, cardH, 1);
      card.baseX = -total / 2 + step * (i + 0.5);
      card.step = step;
      card.total = total;
      card.material.uniforms.uSize.value.set(cardW, cardH);
      const tex = textures[card.slot];
      if (tex) {
        const c = coverScale(aspectOf(tex), options.ratio);
        card.material.uniforms.uCover.value.set(c.x, c.y);
      }
    }
  }

  function applyTexture(slot) {
    const tex = textures[slot];
    if (!tex) return;
    const c = coverScale(aspectOf(tex), options.ratio);
    for (const card of cards) {
      if (card.slot !== slot) continue;
      card.material.uniforms.uTexture.value = tex;
      card.material.uniforms.uHasTexture.value = 1;
      card.material.uniforms.uCover.value.set(c.x, c.y);
    }
  }

  for (let i = 0; i < sources.length; i++) {
    const material = new THREE.ShaderMaterial({
      vertexShader: VERTEX,
      fragmentShader: FRAGMENT,
      transparent: true,
      uniforms: {
        uTexture: { value: null },
        uHasTexture: { value: 0 },
        uCover: { value: new THREE.Vector2(1, 1) },
        uVelocity: { value: 0 },
        uSize: { value: new THREE.Vector2(1, 1) },
        uFade: { value: 1 },
      },
    });
    const mesh = new THREE.Mesh(geometry, material);
    cards.push({ mesh, material, slot: i, baseX: 0, step: 1, total: 1 });
    group.add(mesh);
  }

  layout();

  sources.forEach((src, i) => {
    loadTexture(src).then((tex) => {
      if (!tex) return;
      textures[i] = tex;
      applyTexture(i);
    });
  });

  return {
    group,
    resize(w, h) {
      width = w;
      height = h;
      layout();
    },
    update(e) {
      // -1 entering, +1 leaving. The band travels one full card-step-count of
      // distance across the whole passage, which is enough movement to notice
      // and little enough that no card is ever off in the wings.
      const travel = (e.progress - 0.5) * 2;
      const target = -travel * options.travel * width;
      drift += (target - drift) * (1 - Math.exp(-e.dt * 10));

      for (const card of cards) {
        let x = card.baseX + drift;
        // Wrapped into a ring, so the band is endless in both directions rather
        // than running out of photographs at one end.
        const half = card.total / 2;
        x = ((((x + half) % card.total) + card.total) % card.total) - half;
        card.mesh.position.x = x;

        // Faded at the two edges of the band so a card slides in and out of the
        // section instead of being chopped off by the scissor rect.
        const edge = width / 2;
        const t = Math.max(0, Math.min(1, (edge - Math.abs(x)) / (edge * 0.25)));
        card.material.uniforms.uFade.value = t * t * (3 - 2 * t);
        card.material.uniforms.uVelocity.value = e.velocity;
      }
    },
    dispose() {
      for (const card of cards) {
        group.remove(card.mesh);
        card.material.dispose();
      }
      geometry.dispose();
    },
  };
}

export default function GLScrollStrip({
  images,
  // Portrait cards: a row of upright frames reads as photographs, a row of
  // landscape ones reads as a filmstrip.
  ratio = 0.72,
  gap = 0.14,
  travel = 0.5,
  className = "",
  style,
}) {
  const boxRef = useRef(null);
  const [, setLive] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const srcs = (images || [])
      .map((i) => (typeof i === "string" ? i : i && i.src))
      .filter(Boolean);
    if (!srcs.length) return;
    const unregister = registerItem(
      el,
      (env) => createStrip(srcs, { ratio, gap, travel }, env),
      () => setLive(true)
    );
    return () => {
      setLive(false);
      unregister();
    };
  }, [images, ratio, gap, travel]);

  return (
    <div
      ref={boxRef}
      role="img"
      aria-label="A drifting roll of photographs from the road"
      className={className}
      style={{ position: "relative", ...style }}
    />
  );
}
