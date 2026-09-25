"use client";
// A topographic map that is never quite still.
//
// Isolines of a slowly drifting noise field, anti-aliased with fwidth so they
// stay one hairline wide at any zoom; every fifth line is an index contour,
// drawn heavier, the way survey maps do it. Near the pointer the lines warm to
// saffron, as if a head-torch were passing over the sheet.
//
// Transparent everywhere but the lines, so the section's own background (and
// anything laid under it, like the map of India) shows straight through.
import { useEffect, useRef } from "react";
import * as THREE from "three";
import { registerItem } from "@/lib/gl/stage";
import { SIMPLEX_2D } from "@/lib/gl/glsl";

const VERTEX = /* glsl */ `
varying vec2 vUv;
void main() {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
}
`;

const FRAGMENT = /* glsl */ `
uniform float uTime;
uniform float uAspect;
uniform vec2 uPointer;
uniform float uHover;
uniform float uDensity;
uniform float uOpacity;
uniform float uScroll;

varying vec2 vUv;

${SIMPLEX_2D}

float field(vec2 p) {
    float t = uTime * 0.015;
    float n = snoise(p * 0.9 + vec2(t, -t * 0.6)) * 0.62;
    n += snoise(p * 2.1 + vec2(-t * 1.3, t)) * 0.26;
    n += snoise(p * 4.7 + vec2(t * 2.0, t * 1.1)) * 0.09;
    return n;
}

void main() {
    vec2 p = vec2(vUv.x * uAspect, vUv.y) * 1.6 + vec2(0.0, uScroll * 0.35);
    float h = field(p) * uDensity;

    float aa = fwidth(h);
    float f = fract(h);
    float d = min(f, 1.0 - f);
    float line = 1.0 - smoothstep(0.0, aa * 1.2, d);

    // Index contours: every fifth level, a little heavier.
    float level = floor(h + 0.5);
    float index = 1.0 - step(0.5, abs(mod(level, 5.0)));
    float heavy = 1.0 - smoothstep(0.0, aa * 2.2, d);
    line = max(line * 0.55, heavy * index);

    vec2 q = vec2(vUv.x * uAspect, vUv.y);
    vec2 m = vec2(uPointer.x * uAspect, uPointer.y);
    float torch = exp(-pow(distance(q, m) * 3.2, 2.0)) * uHover;

    vec3 bone = vec3(0.93, 0.90, 0.85);
    vec3 saffron = vec3(0.94, 0.47, 0.18);
    vec3 col = mix(bone, saffron, torch);
    float alpha = line * (uOpacity + torch * 0.5);

    gl_FragColor = vec4(col * alpha, alpha);
}
`;

function createContours(options, env) {
  const geometry = new THREE.PlaneGeometry(1, 1);
  const material = new THREE.ShaderMaterial({
    vertexShader: VERTEX,
    fragmentShader: FRAGMENT,
    transparent: true,
    depthWrite: false,
    // Premultiplied: the fragment already multiplies colour by alpha.
    blending: THREE.CustomBlending,
    blendSrc: THREE.OneFactor,
    blendDst: THREE.OneMinusSrcAlphaFactor,
    uniforms: {
      uTime: { value: Math.random() * 100 },
      uAspect: { value: 1 },
      uPointer: { value: new THREE.Vector2(0.5, 0.5) },
      uHover: { value: 0 },
      uDensity: { value: options.density },
      uOpacity: { value: options.opacity },
      uScroll: { value: 0 },
    },
  });
  const mesh = new THREE.Mesh(geometry, material);
  const group = new THREE.Group();
  group.add(mesh);
  let width = env.width;
  let height = env.height;
  let hover = 0;
  const pointer = new THREE.Vector2(0.5, 0.5);

  const applySize = (w, h) => {
    width = w;
    height = h;
    mesh.scale.set(w + 2, h + 2, 1);
    material.uniforms.uAspect.value = w / Math.max(1, h);
  };
  applySize(width, height);

  return {
    group,
    resize: applySize,
    update(e) {
      const u = material.uniforms;
      u.uTime.value += e.dt;
      u.uScroll.value = e.progress;
      if (e.pointerInside) {
        pointer.set(e.pointerX / Math.max(1, width) + 0.5, e.pointerY / Math.max(1, height) + 0.5);
      }
      u.uPointer.value.lerp(pointer, 1 - Math.exp(-e.dt * 6));
      hover += ((e.pointerInside ? 1 : 0) - hover) * (1 - Math.exp(-e.dt * 3));
      u.uHover.value = hover;
    },
    dispose() {
      geometry.dispose();
      material.dispose();
    },
  };
}

export default function GLContours({ density = 9, opacity = 0.12, className = "", style }) {
  const boxRef = useRef(null);

  useEffect(() => {
    const el = boxRef.current;
    if (!el) return;
    return registerItem(el, (env) => createContours({ density, opacity }, env));
  }, [density, opacity]);

  return <div ref={boxRef} aria-hidden="true" className={className} style={style} />;
}
