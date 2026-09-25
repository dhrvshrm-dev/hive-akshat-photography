"use client";
// The hero photograph, changed the way a lens changes subject: a rack focus.
//
// The outgoing frame drifts out of focus into bokeh, the incoming one is swapped
// in under full blur, and the focus then pulls in, overshoots, hunts back and
// locks — the same beat as the HUD's AF box, because both read one timeline
// (lib/focusTimeline). The blur is a golden-angle disc of taps on a mip-biased
// texture read, with highlights weighted up so bright points bloom into discs
// the way real out-of-focus highlights do.
//
// Nothing here owns the clock. The hero writes { from, to, changedAt } into a
// shared ref and the shader just reads it each frame, so the DOM readouts and
// the picture stay in lockstep whatever the frame rate.
//
// At rest (blur 0) the shader is a single texture read: the photograph is the
// photograph.
import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { registerItem } from "@/lib/gl/stage";
import { aspectOf, coverScale, loadTexture } from "@/lib/gl/textures";
import { COVER_UV } from "@/lib/gl/glsl";
import { blurAt, mixAt } from "@/lib/focusTimeline";

const OVERSCAN = 2;
const TAPS = 20;

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
uniform float uMix;
uniform float uBlur;
uniform float uAspect;
uniform float uZoom;
uniform vec2 uShift;

varying vec2 vUv;

${COVER_UV}

vec3 bokeh(sampler2D tex, vec2 uv, vec2 cover, float amount) {
    // Written with a single exit: ANGLE (Chrome on Windows) warns about an early
    // return from a function that also contains a loop.
    vec3 result = texture2D(tex, coverUv(uv, cover)).rgb;
    if (amount >= 0.002) {
        float radius = amount * 0.032;
        float bias = amount * 2.5;
        vec3 acc = vec3(0.0);
        float wsum = 0.0;
        for (int i = 0; i < ${TAPS}; i++) {
            float fi = float(i);
            float r = sqrt((fi + 0.5) / ${TAPS}.0) * radius;
            float a = fi * 2.399963;
            vec2 o = vec2(cos(a) / uAspect, sin(a)) * r;
            vec3 c = texture2D(tex, coverUv(uv + o, cover), bias).rgb;
            // Bright taps count for more: highlights swell into discs.
            float w = 1.0 + pow(dot(c, vec3(0.333)), 3.0) * 6.0 * amount;
            acc += c * w;
            wsum += w;
        }
        result = acc / wsum;
    }
    return result;
}

void main() {
    // Focus breathing: a real lens's framing shifts slightly as it focuses.
    vec2 uv = (vUv - 0.5) / (uZoom * (1.0 + uBlur * 0.025)) + 0.5 + uShift;

    vec3 col;
    if (uMix <= 0.001) {
        col = bokeh(uFrom, uv, uCoverFrom, uBlur);
    } else if (uMix >= 0.999) {
        col = bokeh(uTo, uv, uCoverTo, uBlur);
    } else {
        col = mix(bokeh(uFrom, uv, uCoverFrom, uBlur), bokeh(uTo, uv, uCoverTo, uBlur), uMix);
    }
    // A defocused frame loses a touch of contrast, which sells the blur.
    col = mix(col, vec3(dot(col, vec3(0.333))), uBlur * 0.12);
    gl_FragColor = vec4(col, 1.0);
}
`;

function createHero(images, controller, env, onFirstFrame) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    uniforms: {
      uFrom: { value: null },
      uTo: { value: null },
      uCoverFrom: { value: new THREE.Vector2(1, 1) },
      uCoverTo: { value: new THREE.Vector2(1, 1) },
      uMix: { value: 1 },
      uBlur: { value: 1 },
      uAspect: { value: 1 },
      uZoom: { value: 1 },
      uShift: { value: new THREE.Vector2(0, 0) },
    },
  });
  const mesh = new THREE.Mesh(geometry, material);
  mesh.visible = false; // until there are pixels to show
  const group = new THREE.Group();
  group.add(mesh);

  const textures = images.map(() => null);
  let width = env.width;
  let height = env.height;
  const shift = new THREE.Vector2(0, 0);
  let announced = false;

  const cover = (tex, out) => {
    if (!tex) return;
    const c = coverScale(aspectOf(tex), width / Math.max(1, height));
    out.set(c.x, c.y);
  };

  const applySize = (w, h) => {
    width = w;
    height = h;
    mesh.scale.set(w + OVERSCAN, h + OVERSCAN, 1);
    material.uniforms.uAspect.value = w / Math.max(1, h);
  };
  applySize(env.width, env.height);

  images.forEach((src, i) => {
    loadTexture(src).then((tex) => {
      if (tex) textures[i] = tex;
    });
  });

  return {
    group,
    resize: applySize,
    update(e) {
      const u = material.uniforms;
      const c = controller.current;
      const fromTex = textures[c.from] || textures[c.to];
      const toTex = textures[c.to] || fromTex;
      if (!toTex) return;
      mesh.visible = true;
      if (!announced) {
        // The markup underneath only fades once there is a real frame to
        // replace it with, never onto an empty plane.
        announced = true;
        onFirstFrame();
      }
      u.uFrom.value = fromTex;
      u.uTo.value = toTex;
      cover(fromTex, u.uCoverFrom.value);
      cover(toTex, u.uCoverTo.value);

      const d = c.changedAt == null ? null : (performance.now() - c.changedAt) / 1000;
      // An incoming frame that has not decoded yet is held behind full blur
      // rather than cut to — the hunt simply waits for it.
      const ready = Boolean(textures[c.to]);
      u.uBlur.value = ready ? blurAt(d) : 1;
      u.uMix.value = ready ? mixAt(d) : 0;

      // A slow push-in across the hold, and a few pixels of drift toward the
      // pointer, so a still frame is never quite static.
      const hold = d == null ? 0 : Math.max(0, d - 1.6);
      u.uZoom.value = 1.02 + Math.min(hold, 8) * 0.004;
      const tx = e.pointerInside ? (e.pointerX / Math.max(1, width)) * -0.01 : 0;
      const ty = e.pointerInside ? (e.pointerY / Math.max(1, height)) * -0.01 : 0;
      shift.x += (tx - shift.x) * (1 - Math.exp(-e.dt * 3));
      shift.y += (ty - shift.y) * (1 - Math.exp(-e.dt * 3));
      u.uShift.value.copy(shift);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

/**
 * `controller` is a ref holding { from, to, changedAt } (changedAt from
 * performance.now(), or null to hold the first frame out of focus).
 * `fallback` is ordinary markup for no-WebGL visitors; it fades out once the
 * shader has a frame.
 */
export default function GLHero({ images, controller, fallback, className = "", style }) {
  const boxRef = useRef(null);
  const [live, setLive] = useState(false);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    const srcs = (images || []).filter(Boolean);
    if (!srcs.length) return;
    const unregister = registerItem(
      el,
      (env) => createHero(srcs, controller, env, () => setLive(true))
    );
    return () => {
      setLive(false);
      unregister();
    };
  }, [images, controller]);

  return (
    <div ref={boxRef} className={className} style={style}>
      <div
        aria-hidden={live ? "true" : undefined}
        style={{ position: "absolute", inset: 0, opacity: live ? 0 : 1, transition: "opacity 600ms linear" }}
      >
        {fallback}
      </div>
    </div>
  );
}
