"use client";
// The lens itself — built entirely from primitives, no model files to license or load.
// Barrel + knurled grip + gold rings + a real glass front element that refracts the world
// sitting behind it, with aperture blades that snap open when you dive through.
import { useEffect, useMemo, useRef } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";

const GOLD = "#B98A3E";
const BODY = "#15100D";

// One aperture blade: a rounded wedge that rotates about the barrel's centre.
function bladeShape() {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.lineTo(1.25, 0.16);
  s.quadraticCurveTo(1.32, 0.66, 0.92, 1.0);
  s.lineTo(0, 0.34);
  s.closePath();
  return s;
}

function Aperture({ openRef, count = 8 }) {
  const blades = useRef([]);
  const geo = useMemo(() => new THREE.ShapeGeometry(bladeShape()), []);

  useFrame(() => {
    const open = openRef.current; // 0 = closed iris, 1 = wide open
    blades.current.forEach((b, i) => {
      if (!b) return;
      const base = (i / count) * Math.PI * 2;
      b.rotation.z = base + open * 0.85;
      const r = 0.32 + open * 1.25;
      b.position.set(Math.cos(base) * r, Math.sin(base) * r, 0);
      b.material.opacity = 1 - open * 0.9;
    });
  });

  return (
    <group position={[0, 0, 0.02]}>
      {Array.from({ length: count }, (_, i) => (
        <mesh key={i} ref={(el) => (blades.current[i] = el)} geometry={geo}>
          <meshStandardMaterial
            color={BODY}
            metalness={0.85}
            roughness={0.35}
            transparent
            side={THREE.DoubleSide}
          />
        </mesh>
      ))}
    </group>
  );
}

// A ring of small boxes reads as a knurled grip without a texture map.
function Knurl({ radius = 1.16, z = 0, teeth = 64 }) {
  const ref = useRef();

  // Static geometry — placed once on mount rather than every frame.
  useEffect(() => {
    const mesh = ref.current;
    if (!mesh) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < teeth; i++) {
      const a = (i / teeth) * Math.PI * 2;
      dummy.position.set(Math.cos(a) * radius, Math.sin(a) * radius, z);
      dummy.rotation.set(0, 0, a);
      dummy.scale.set(0.035, 0.09, 0.34);
      dummy.updateMatrix();
      mesh.setMatrixAt(i, dummy.matrix);
    }
    mesh.instanceMatrix.needsUpdate = true;
  }, [radius, z, teeth]);

  return (
    <instancedMesh ref={ref} args={[undefined, undefined, teeth]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color={BODY} metalness={0.9} roughness={0.45} />
    </instancedMesh>
  );
}

export default function Lens3D({ pointer, openRef, onSelect, hoverRef }) {
  const group = useRef();
  const glass = useRef();

  useFrame((state, delta) => {
    if (!group.current) return;
    // Tilt toward the cursor, always easing rather than snapping.
    const tx = pointer.current.y * 0.28;
    const ty = pointer.current.x * 0.42;
    group.current.rotation.x += (tx - group.current.rotation.x) * 0.06;
    group.current.rotation.y += (ty - group.current.rotation.y) * 0.06;
    // A slow idle breath so it never feels frozen.
    group.current.position.y = Math.sin(state.clock.elapsedTime * 0.6) * 0.06;
    // Focus ring creeps round while hovered.
    if (hoverRef.current) group.current.rotation.z += delta * 0.12;
  });

  return (
    <group
      ref={group}
      onClick={(e) => {
        e.stopPropagation();
        onSelect();
      }}
      onPointerOver={() => (hoverRef.current = true)}
      onPointerOut={() => (hoverRef.current = false)}
    >
      {/* Barrel */}
      <mesh position={[0, 0, -0.55]}>
        <cylinderGeometry args={[1.1, 1.24, 1.1, 64, 1, true]} />
        <meshStandardMaterial
          color={BODY}
          metalness={0.92}
          roughness={0.32}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Knurled focus grips */}
      <Knurl radius={1.18} z={-0.35} />
      <Knurl radius={1.18} z={-0.78} />

      {/* Gold accent rings */}
      <mesh position={[0, 0, -0.08]}>
        <torusGeometry args={[1.12, 0.035, 16, 96]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
      </mesh>
      <mesh position={[0, 0, -1.05]}>
        <torusGeometry args={[1.2, 0.03, 16, 96]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.25} />
      </mesh>

      {/* Front bezel */}
      <mesh position={[0, 0, 0]}>
        <torusGeometry args={[1.05, 0.09, 20, 96]} />
        <meshStandardMaterial color={BODY} metalness={0.95} roughness={0.28} />
      </mesh>

      <Aperture openRef={openRef} />

      {/* The glass element. transmission refracts whatever sits behind it — which is
          the world layer — so you genuinely look *through* the lens at Rajasthan. */}
      <mesh ref={glass} position={[0, 0, 0.06]}>
        <sphereGeometry args={[1.02, 64, 64, 0, Math.PI * 2, 0, Math.PI / 2.6]} />
        <meshPhysicalMaterial
          transmission={1}
          thickness={1.1}
          ior={1.55}
          roughness={0.03}
          metalness={0}
          clearcoat={1}
          clearcoatRoughness={0.04}
          color="#ffffff"
          attenuationColor={GOLD}
          attenuationDistance={6}
        />
      </mesh>

      {/* Warm coating flare across the glass */}
      <mesh position={[0, 0, 0.4]} rotation={[0, 0, -0.5]}>
        <circleGeometry args={[0.98, 48]} />
        <meshBasicMaterial color={GOLD} transparent opacity={0.07} />
      </mesh>
    </group>
  );
}
