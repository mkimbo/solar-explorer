"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";
import { useStore } from "@/store/useStore";

const particleCount = 10000;
const positionsArray = (() => {
  const pos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    // Disk parameters: Inner radius 10, Outer radius 100
    const radius = 10 + Math.random() * 90;
    const theta = Math.random() * Math.PI * 2;

    // Elliptical swirling XZ
    pos[i * 3] = Math.cos(theta) * radius;
    // Slight vertical turbulence
    pos[i * 3 + 1] = (Math.random() - 0.5) * (radius * 0.1);
    pos[i * 3 + 2] = Math.sin(theta) * radius;
  }
  return pos;
})();

export default function AccretionDisk() {
  const showMagneticField = useStore((state) => state.showMagneticField);
  const diskRef = useRef<THREE.Group>(null);

  // Move the pre-computed static array to component scope
  const positions = positionsArray;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (diskRef.current) {
      // The accretion disk rotates independently of the core, but still extremely fast
      diskRef.current.rotation.y = t * 2;
    }
  });

  return (
    <group ref={diskRef}>
      {/* Outer Glow / Event Horizon Dust */}
      <mesh rotation={[-Math.PI / 2, 0, 0]}>
        <ringGeometry args={[8, 100, 64]} />
        <meshBasicMaterial
          color="#3b0764" // Deep purple
          transparent={true}
          opacity={0.1}
          side={THREE.DoubleSide}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </mesh>

      {/* Extreme particle swirling matter */}
      <points>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#a855f7" // Purple neon particle dust
          size={0.4}
          transparent={true}
          opacity={0.6}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>

      {/* Magnetic Field Visualization (conditional) */}
      {showMagneticField && (
        <mesh rotation={[-Math.PI / 2, 0, 0]}>
          <torusGeometry args={[45, 15, 16, 100]} />
          <meshBasicMaterial
            color="#06b6d4" // Cyan
            wireframe={true}
            transparent={true}
            opacity={0.15}
            blending={THREE.AdditiveBlending}
          />
        </mesh>
      )}
    </group>
  );
}
