"use client";
// The hero photograph, dissolved rather than cut.
//
// Two textures are resident at once and a noise field decides, per pixel, which
// of the two it is showing yet — so the change sweeps across the frame in
// organic patches instead of a flat cross-fade. The same noise displaces the uv
// of both images while the sweep is in flight, which is what stops the dissolve
// reading as a slideshow.
//
// At rest the shader is a passthrough: no distortion, no tint, the photograph is
// exactly the photograph. Everything the visitor is here to look at stays sharp.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { registerItem } from "@/lib/gl/stage";
import { aspectOf, coverScale, loadTexture } from "@/lib/gl/textures";
import { COVER_UV, SIMPLEX_2D } from "@/lib/gl/glsl";

const HOLD = 5.2; // seconds a photograph is held before the next sweep starts
const SWEEP = 1.8; // seconds the dissolve itself takes
const OVERSCAN = 2; // the stage snaps boxes to whole pixels, so none is needed

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform sampler2D uFrom;
uniform sampler2D uTo;
uniform vec2 uCoverFrom;
uniform vec2 uCoverTo;
uniform float uProgress;
uniform float uTime;
uniform vec2 uPointer;
uniform float uHover;
uniform float uAspect;

varying vec2 vUv;

${SIMPLEX_2D}
${COVER_UV}

void main() {
    // Two octaves: the large one decides the shape of the sweep, the small one
    // breaks up its edge so the boundary never looks like a gradient.
    float n = snoise(vUv * 2.6) * 0.5 + snoise(vUv * 7.0) * 0.18;
    n = n * 0.5 + 0.5;

    // A ring travelling out from the cursor, dying off with distance. Aspect
    // correction keeps it a circle on a wide hero.
    vec2 aspect = vec2(uAspect, 1.0);
    float d = distance(vUv * aspect, uPointer * aspect);
    float ring = sin(d * 26.0 - uTime * 2.4) * exp(-d * 6.0) * 0.010 * uHover;
    vec2 dir = normalize(vUv - uPointer + vec2(1e-5));
    vec2 uv = vUv + dir * ring;

    // The sweep is a threshold on the noise rather than a mix factor, so each
    // pixel flips at its own moment; the soft edge is the only blending.
    float mask = smoothstep(n - 0.28, n + 0.28, uProgress);

    // Displacement peaks mid-sweep and is gone at both ends — this is the whole
    // reason the transition reads as liquid rather than as a fade.
    float push = sin(uProgress * 3.141592653589793) * 0.06;
    vec2 off = vec2(n - 0.5) * push;

    vec3 from = texture2D(uFrom, coverUv(uv + off * mask, uCoverFrom)).rgb;
    vec3 to = texture2D(uTo, coverUv(uv - off * (1.0 - mask), uCoverTo)).rgb;

    gl_FragColor = vec4(mix(from, to, mask), 1.0);
}
`;

function createHero(images, env) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uFrom: { value: null },
      uTo: { value: null },
      uCoverFrom: { value: new THREE.Vector2(1, 1) },
      uCoverTo: { value: new THREE.Vector2(1, 1) },
      uProgress: { value: 0 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uAspect: { value: 1 },
    },
  });

  const mesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(mesh);

  const state = {
    textures: images.map(() => null),
    from: 0,
    to: 0,
    elapsed: 0,
    sweeping: false,
    width: env.width,
    height: env.height,
    hover: 0,
    ready: false,
  };

  const applySize = (w, h) => {
    state.width = w;
    state.height = h;
    // Overscanned by a pixel on every side. The stage clips to the hero's exact
    // box with a scissor rectangle, so the plane's own antialiased edge — which
    // would otherwise blend with the transparent clear colour and draw a seam
    // along the join with the next section — is pushed outside the cut.
    mesh.scale.set(w + OVERSCAN, h + OVERSCAN, 1);
    material.uniforms.uAspect.value = w / Math.max(1, h);
    refreshCover();
  };

  function refreshCover() {
    const box = state.width / Math.max(1, state.height);
    const from = state.textures[state.from];
    const to = state.textures[state.to];
    if (from) {
      const c = coverScale(aspectOf(from), box);
      material.uniforms.uCoverFrom.value.set(c.x, c.y);
    }
    if (to) {
      const c = coverScale(aspectOf(to), box);
      material.uniforms.uCoverTo.value.set(c.x, c.y);
    }
  }

  images.forEach((src, i) => {
    loadTexture(src).then((tex) => {
      if (!tex) return;
      state.textures[i] = tex;
      // The first photograph to arrive occupies both slots, so the hero is never
      // showing a black plane while the rest of the set is still downloading.
      if (!state.ready) {
        state.ready = true;
        state.from = i;
        state.to = i;
        material.uniforms.uFrom.value = tex;
        material.uniforms.uTo.value = tex;
      }
      refreshCover();
    });
  });

  applySize(env.width, env.height);

  /** The next slot that actually has pixels, or null while only one does. */
  function nextLoaded(after) {
    const n = state.textures.length;
    for (let step = 1; step <= n; step++) {
      const i = (after + step) % n;
      if (state.textures[i] && i !== after) return i;
    }
    return null;
  }

  return {
    group,
    resize: applySize,
    update(e) {
      const u = material.uniforms;
      u.uTime.value = e.time;

      // Pointer in 0..1 across the hero, y flipped back into uv space.
      const px = e.pointerX / Math.max(1, state.width) + 0.5;
      const py = e.pointerY / Math.max(1, state.height) + 0.5;
      if (e.pointerInside) {
        u.uPointer.value.set(px, py);
      }
      const targetHover = e.pointerInside ? 1 : 0;
      state.hover += (targetHover - state.hover) * (1 - Math.exp(-e.dt * 4));
      u.uHover.value = state.hover;

      if (!state.ready) return;
      state.elapsed += e.dt;

      if (!state.sweeping) {
        if (state.elapsed >= HOLD) {
          const next = nextLoaded(state.to);
          if (next === null) {
            state.elapsed = 0; // nothing else has loaded yet; wait and retry
            return;
          }
          state.from = state.to;
          state.to = next;
          u.uFrom.value = state.textures[state.from];
          u.uTo.value = state.textures[state.to];
          refreshCover();
          state.sweeping = true;
          state.elapsed = 0;
          u.uProgress.value = 0;
        }
        return;
      }

      const t = Math.min(1, state.elapsed / SWEEP);
      // Smootherstep: the sweep leaves and arrives at a dead stop, so neither
      // end of the dissolve has a visible seam.
      u.uProgress.value = t * t * t * (t * (t * 6 - 15) + 10);
      if (t >= 1) {
        state.sweeping = false;
        state.elapsed = 0;
        // The arrival becomes the new resting frame, so uProgress is free to
        // start from 0 again on the next sweep.
        state.from = state.to;
        u.uFrom.value = state.textures[state.from];
        u.uCoverFrom.value.copy(u.uCoverTo.value);
        u.uProgress.value = 0;
      }
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

/**
 * Wraps the hero's own markup. `fallback` is the ordinary <Image> that carries
 * the LCP and serves anyone without WebGL; it is faded out — not unmounted —
 * the moment the shader has a frame to show, so the photograph never blinks and
 * the alt text stays in the document.
 */
export default function GLHero({ images, fallback, className = "", style }) {
  const boxRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const srcs = (images || []).filter(Boolean);
    if (!srcs.length) return;
    const unregister = registerItem(
      el,
      (env) => createHero(srcs, env),
      () => setLive(true),
    );
    return () => {
      setLive(false);
      unregister();
    };
  }, [images]);

  return (
    <div ref={boxRef} className={className} style={style}>
      <div
        aria-hidden={live ? "true" : undefined}
        style={{
          position: "absolute",
          inset: 0,
          opacity: live ? 0 : 1,
          transition: "opacity 600ms linear",
        }}
      >
        {fallback}
      </div>
    </div>
  );
}
