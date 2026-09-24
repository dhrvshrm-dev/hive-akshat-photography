"use client";
// The WebGL intro. Loaded only on capable devices, and only via next/dynamic, so the
// three.js bundle never reaches a phone that was going to get the lite version anyway.
import { useCallback, useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Bloom, EffectComposer, Vignette } from "@react-three/postprocessing";
import Lens3D from "@/components/intro/Lens3D";
import World3D from "@/components/intro/World3D";

const START_Z = 6.2;

// Drives the whole dive: camera pushes through the glass, iris opens, bloom blows out.
function Rig({ pointer, diving, openRef, bloomRef, onArrive }) {
  const { camera } = useThree();
  const done = useRef(false);

  useEffect(() => {
    camera.position.set(0, 0, START_Z);
  }, [camera]);

  useFrame((state, delta) => {
    if (!diving) {
      // Idle: the camera drifts a little against the pointer for parallax.
      camera.position.x += (pointer.current.x * 0.5 - camera.position.x) * 0.04;
      camera.position.y += (pointer.current.y * 0.3 - camera.position.y) * 0.04;
      camera.lookAt(0, 0, 0);
      return;
    }

    // Accelerate toward and through the front element.
    const speed = 3.2 + (START_Z - camera.position.z) * 2.2;
    camera.position.z -= speed * delta;
    camera.position.x *= 0.9;
    camera.position.y *= 0.9;
    camera.lookAt(0, 0, 0);

    openRef.current = Math.min(1, openRef.current + delta * 2.4);
    if (bloomRef.current) {
      bloomRef.current.intensity = 0.6 + (START_Z - camera.position.z) * 1.5;
    }

    if (!done.current && camera.position.z < -0.6) {
      done.current = true;
      onArrive();
    }
  });

  return null;
}

export default function LensScene({ onDone }) {
  const pointer = useRef({ x: 0, y: 0 });
  const openRef = useRef(0);
  const hoverRef = useRef(false);
  const bloomRef = useRef();
  const [diving, setDiving] = useState(false);

  const onPointerMove = useCallback((e) => {
    pointer.current.x = (e.clientX / window.innerWidth) * 2 - 1;
    pointer.current.y = -((e.clientY / window.innerHeight) * 2 - 1);
  }, []);

  const dive = useCallback(() => setDiving(true), []);

  return (
    <div
      className="absolute inset-0"
      onPointerMove={onPointerMove}
      style={{ cursor: diving ? "none" : "pointer" }}
    >
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, powerPreference: "high-performance" }}
        camera={{ fov: 42, position: [0, 0, START_Z], near: 0.05, far: 60 }}
      >
        <color attach="background" args={["#0B0806"]} />
        <fog attach="fog" args={["#0B0806", 8, 22]} />

        <ambientLight intensity={0.35} />
        <directionalLight position={[4, 5, 6]} intensity={2.1} color="#F6F1E9" />
        <pointLight position={[-4, -1, 3]} intensity={22} color="#8E2C3A" distance={16} />
        <pointLight position={[3.5, 2.5, 2]} intensity={16} color="#B98A3E" distance={14} />
        {/* Built from light shapes rather than a preset HDRI — nothing is fetched from a
            third-party CDN at runtime, and the glass still gets something to reflect. */}
        <Environment resolution={256}>
          <Lightformer intensity={2.6} position={[0, 3, 4]} scale={[8, 3, 1]} color="#F6F1E9" />
          <Lightformer intensity={2} position={[-4, 0, 3]} scale={[3, 6, 1]} color="#8E2C3A" />
          <Lightformer intensity={2.2} position={[4, 1, 2]} scale={[3, 5, 1]} color="#B98A3E" />
          <Lightformer intensity={1.2} position={[0, -3, 2]} scale={[8, 2, 1]} color="#B98A3E" />
        </Environment>

        <World3D pointer={pointer} />
        <Lens3D pointer={pointer} openRef={openRef} hoverRef={hoverRef} onSelect={dive} />

        <Rig
          pointer={pointer}
          diving={diving}
          openRef={openRef}
          bloomRef={bloomRef}
          onArrive={onDone}
        />

        <EffectComposer disableNormalPass>
          <Bloom
            ref={bloomRef}
            intensity={0.6}
            luminanceThreshold={0.55}
            luminanceSmoothing={0.3}
            mipmapBlur
          />
          <Vignette eskil={false} offset={0.25} darkness={0.85} />
        </EffectComposer>
      </Canvas>
    </div>
  );
}
