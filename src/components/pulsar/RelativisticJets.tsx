"use client";

import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import * as THREE from "three";

const particleCount = 4000;
const positionsArray = (() => {
  const pos = new Float32Array(particleCount * 3);
  for (let i = 0; i < particleCount; i++) {
    // Random X and Z tightly packed near the core
    const radius = Math.random() * 2;
    const theta = Math.random() * Math.PI * 2;

    pos[i * 3] = Math.cos(theta) * radius;
    // Y spreads intensely up and down the poles
    pos[i * 3 + 1] = (Math.random() - 0.5) * 300;
    pos[i * 3 + 2] = Math.sin(theta) * radius;
  }
  return pos;
})();

export default function RelativisticJets() {
  const particlesRef = useRef<THREE.Points>(null);

  // Use the pre-computed static array
  const positions = positionsArray;

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (particlesRef.current) {
      const positionsAttr = particlesRef.current.geometry.attributes.position;

      for (let i = 0; i < particleCount; i++) {
        let y = positionsAttr.getY(i);
        // Move particles rapidly outwards from the core
        const speed = 100;

        if (y > 0) {
          y += speed * 0.016; // Upward jet
          if (y > 150) y = Math.random() * 5; // Reset near core
        } else {
          y -= speed * 0.016; // Downward jet
          if (y < -150) y = -Math.random() * 5; // Reset near core
        }

        positionsAttr.setY(i, y);
      }
      positionsAttr.needsUpdate = true;
    }
  });

  return (
    <group>
      {/* Top Conical Beam */}
      <mesh position={[0, 40, 0]}>
        <cylinderGeometry args={[5, 1, 80, 32, 1, true]} />
        <meshBasicMaterial
          color="#00ffff"
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* Bottom Conical Beam */}
      <mesh position={[0, -40, 0]} rotation={[Math.PI, 0, 0]}>
        <cylinderGeometry args={[5, 1, 80, 32, 1, true]} />
        <meshBasicMaterial
          color="#aa00ff"
          transparent={true}
          opacity={0.15}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
          side={THREE.DoubleSide}
        />
      </mesh>

      {/* High-speed emitting particles */}
      <points ref={particlesRef}>
        <bufferGeometry>
          <bufferAttribute attach="attributes-position" args={[positions, 3]} />
        </bufferGeometry>
        <pointsMaterial
          color="#ffffff"
          size={0.6}
          transparent={true}
          opacity={0.8}
          blending={THREE.AdditiveBlending}
          depthWrite={false}
        />
      </points>
    </group>
  );
}
