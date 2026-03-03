"use client";

import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { asteroidBeltRange } from "@/constants/data";

const { inner, outer, count } = asteroidBeltRange;

const positions = new Float32Array(count * 3);
const scales = new Float32Array(count);
const rotations = new Float32Array(count * 3);
for (let i = 0; i < count; i++) {
  const radius = inner + Math.random() * (outer - inner);
  const theta = Math.random() * Math.PI * 2;
  const y = (Math.random() - 0.5) * 4;

  positions[i * 3] = Math.cos(theta) * radius;
  positions[i * 3 + 1] = y;
  positions[i * 3 + 2] = Math.sin(theta) * radius;

  scales[i] = Math.random() * 0.4 + 0.1;

  rotations[i * 3] = Math.random() * Math.PI;
  rotations[i * 3 + 1] = Math.random() * Math.PI;
  rotations[i * 3 + 2] = Math.random() * Math.PI;
}

export default function AsteroidBelt() {
  const meshRef = useRef<THREE.InstancedMesh>(null);

  useEffect(() => {
    if (!meshRef.current) return;
    const dummy = new THREE.Object3D();
    for (let i = 0; i < count; i++) {
      dummy.position.set(
        positions[i * 3],
        positions[i * 3 + 1],
        positions[i * 3 + 2],
      );
      const s = scales[i];
      dummy.scale.set(s, s, s);
      dummy.rotation.set(
        rotations[i * 3],
        rotations[i * 3 + 1],
        rotations[i * 3 + 2],
      );
      dummy.updateMatrix();
      meshRef.current.setMatrixAt(i, dummy.matrix);
    }
    meshRef.current.instanceMatrix.needsUpdate = true;
  }, []);

  useFrame(({ clock }) => {
    if (meshRef.current) {
      meshRef.current.rotation.y = clock.getElapsedTime() * -0.005;
    }
  });

  return (
    <instancedMesh ref={meshRef} args={[undefined, undefined, count]}>
      <dodecahedronGeometry args={[1, 0]} />
      <meshStandardMaterial color="#666666" roughness={0.9} />
    </instancedMesh>
  );
}
