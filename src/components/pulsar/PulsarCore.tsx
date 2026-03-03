"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

export default function PulsarCore() {
  const coreRef = useRef<THREE.Mesh>(null);
  const materialRef = useRef<THREE.MeshStandardMaterial>(null);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    // Extremely fast rotation on the Y-axis
    if (coreRef.current) {
      coreRef.current.rotation.y = t * 30; // 30 rad/s (~290 RPM visually)
    }

    // High frequency pulse on emission intensity
    if (materialRef.current) {
      // Base emissive intensity + violent rapid flicker
      const pulse = 2.0 + Math.sin(t * 50) * 0.5 + Math.cos(t * 130) * 0.3;
      materialRef.current.emissiveIntensity = pulse;
    }
  });

  return (
    <mesh ref={coreRef}>
      <sphereGeometry args={[3, 128, 128]} />
      <meshStandardMaterial
        ref={materialRef}
        color="#ffffff"
        emissive="#00ffff"
        emissiveIntensity={2.5}
        roughness={0.2}
        metalness={0.8}
      />
    </mesh>
  );
}
