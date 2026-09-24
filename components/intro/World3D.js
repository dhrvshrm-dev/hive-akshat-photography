"use client";
// The Rajasthan seen through the lens — layered silhouettes at different depths so the
// glass refracts them and the parallax reads as real distance. All procedural geometry.
import { useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const INK = "#241C17";
const GOLD = "#B98A3E";
const ROSE = "#8E2C3A";

// A jagged ridgeline built from a seeded zig-zag, closed into a fillable shape.
function ridgeShape(peaks, height, width, seed) {
  const shape = new THREE.Shape();
  shape.moveTo(-width, -6);
  let s = seed;
  const rand = () => {
    s = (s * 9301 + 49297) % 233280;
    return s / 233280;
  };
  for (let i = 0; i <= peaks; i++) {
    const x = -width + (i / peaks) * width * 2;
    const y = i % 2 === 0 ? -1 + rand() * 0.4 : height * (0.6 + rand() * 0.6);
    shape.lineTo(x, y);
  }
  shape.lineTo(width, -6);
  shape.closePath();
  return shape;
}

// A scalloped jharokha arch: two piers, a pointed arch, a domed finial.
function archShape() {
  const s = new THREE.Shape();
  s.moveTo(-1, -3);
  s.lineTo(-1, 0.2);
  s.quadraticCurveTo(-1, 1.5, 0, 2.2);
  s.quadraticCurveTo(1, 1.5, 1, 0.2);
  s.lineTo(1, -3);
  s.closePath();
  return s;
}

function Layer({ shape, z, color, opacity, x = 0, y = 0, scale = 1 }) {
  const geo = useMemo(() => new THREE.ShapeGeometry(shape), [shape]);
  return (
    <mesh geometry={geo} position={[x, y, z]} scale={scale}>
      <meshBasicMaterial color={color} transparent opacity={opacity} side={THREE.DoubleSide} />
    </mesh>
  );
}

// Marigold petals drifting upward through the frame.
function Petals({ count = 34 }) {
  const ref = useRef();
  const dummy = useMemo(() => new THREE.Object3D(), []);
  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 14,
        y: Math.random() * 12 - 6,
        z: -2 - Math.random() * 5,
        speed: 0.12 + Math.random() * 0.25,
        spin: (Math.random() - 0.5) * 1.4,
        size: 0.05 + Math.random() * 0.07,
      })),
    [count]
  );

  useFrame((state, delta) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((p, i) => {
      p.y += p.speed * delta;
      if (p.y > 7) p.y = -7;
      dummy.position.set(p.x + Math.sin(t * 0.4 + i) * 0.35, p.y, p.z);
      dummy.rotation.z = t * p.spin;
      dummy.scale.setScalar(p.size);
      dummy.updateMatrix();
      ref.current.setMatrixAt(i, dummy.matrix);
    });
    ref.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, count]}>
      <circleGeometry args={[1, 6]} />
      <meshBasicMaterial color={GOLD} transparent opacity={0.55} />
    </instancedMesh>
  );
}

export default function World3D({ pointer }) {
  const group = useRef();

  const far = useMemo(() => ridgeShape(9, 3.4, 11, 7), []);
  const mid = useMemo(() => ridgeShape(7, 2.6, 9, 31), []);
  const near = useMemo(() => ridgeShape(5, 1.9, 8, 89), []);
  const arch = useMemo(() => archShape(), []);

  // Layers drift against each other — the further back, the less they move.
  useFrame(() => {
    if (!group.current) return;
    group.current.position.x += (pointer.current.x * 0.6 - group.current.position.x) * 0.04;
    group.current.position.y += (pointer.current.y * 0.35 - group.current.position.y) * 0.04;
  });

  return (
    <group ref={group} position={[0, 0, -4]}>
      {/* Warm sky wash behind everything */}
      <mesh position={[0, 0, -9]}>
        <planeGeometry args={[40, 24]} />
        <meshBasicMaterial color={INK} />
      </mesh>

      {/* Sun disc low on the horizon */}
      <mesh position={[1.4, 0.6, -8.6]}>
        <circleGeometry args={[1.5, 48]} />
        <meshBasicMaterial color={ROSE} transparent opacity={0.5} />
      </mesh>

      <Layer shape={far} z={-8} color={GOLD} opacity={0.16} y={-1.5} />
      <Layer shape={mid} z={-6.4} color={GOLD} opacity={0.26} y={-2.2} />

      {/* Domes and arches of the old city */}
      <Layer shape={arch} z={-5.2} color={GOLD} opacity={0.4} x={-2.7} y={-2.4} scale={0.85} />
      <Layer shape={arch} z={-5.2} color={GOLD} opacity={0.5} x={0} y={-2.6} scale={1.15} />
      <Layer shape={arch} z={-5.2} color={GOLD} opacity={0.4} x={2.7} y={-2.4} scale={0.85} />

      <Layer shape={near} z={-4} color={INK} opacity={0.92} y={-3} />

      <Petals />
    </group>
  );
}
