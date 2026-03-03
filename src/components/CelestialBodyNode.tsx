"use client";

import { useRef, useState, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import { Html, useTexture } from "@react-three/drei";
import * as THREE from "three";
import { CelestialBody } from "@/constants/data";
import { useStore } from "@/store/useStore";

function SafeTexture({
  url,
  color,
  isStar,
}: {
  url: string | null;
  color: string;
  isStar: boolean;
}) {
  let texture = null;
  try {
    // eslint-disable-next-line react-hooks/rules-of-hooks
    texture = url ? useTexture(url) : null;
  } catch (_e) {
    console.warn("Failed to load texture", url);
  }

  if (isStar) {
    return (
      <meshBasicMaterial map={texture} color={texture ? "#ffffff" : color} />
    );
  }

  return (
    <meshStandardMaterial
      map={texture}
      color={texture ? "#ffffff" : color}
      roughness={0.7}
      metalness={0.1}
    />
  );
}

export default function CelestialBodyNode({ body }: { body: CelestialBody }) {
  const meshRef = useRef<THREE.Mesh>(null);
  const orbitGroupRef = useRef<THREE.Group>(null);
  const [distanceText, setDistanceText] = useState("");
  const earthPosition = useStore((state) => state.earthPosition);
  const setEarthPosition = useStore((state) => state.setEarthPosition);
  const showOrbits = useStore((state) => state.showOrbits);

  const orbitPath = useMemo(() => {
    if (body.distanceFromSun === 0) return null;
    const points = [];
    const segments = 128;
    for (let i = 0; i <= segments; i++) {
      const theta = (i / segments) * Math.PI * 2;
      points.push(
        new THREE.Vector3(
          Math.cos(theta) * body.distanceFromSun,
          0,
          Math.sin(theta) * body.distanceFromSun,
        ),
      );
    }
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    return geometry;
  }, [body.distanceFromSun]);

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();

    if (meshRef.current) {
      meshRef.current.rotation.y = t * body.rotationSpeed;
    }

    if (orbitGroupRef.current && body.distanceFromSun > 0) {
      orbitGroupRef.current.rotation.y = t * body.orbitSpeed;
    }

    if (meshRef.current) {
      const myPos = new THREE.Vector3();
      meshRef.current.getWorldPosition(myPos);

      if (body.id === "earth") {
        setEarthPosition(myPos);
        setDistanceText("0.00 M km");
      } else {
        const dist = earthPosition.distanceTo(myPos);
        setDistanceText(`${(dist * 1.5).toFixed(2)} M km`);
      }
    }
  });

  return (
    <group>
      {showOrbits &&
        orbitPath &&
        body.distanceFromSun > 0 &&
        body.type !== "moon" && (
          <line geometry={orbitPath}>
            <lineBasicMaterial
              color={body.color}
              opacity={0.3}
              transparent
              linewidth={1}
            />
          </line>
        )}

      <group ref={orbitGroupRef}>
        <mesh
          ref={meshRef}
          position={[body.distanceFromSun, 0, 0]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[body.radius, 64, 64]} />
          <SafeTexture
            url={body.textureUrl}
            color={body.color}
            isStar={body.type === "star"}
          />

          {body.type !== "moon" && body.id !== "sun" && (
            <Html
              distanceFactor={150}
              zIndexRange={[100, 0]}
              className="pointer-events-none"
            >
              <div className="flex flex-col items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 shadow-lg transform translate-x-4 -translate-y-4">
                <span className="text-white font-sans font-medium text-sm tracking-wide">
                  {body.name}
                </span>
                <span className="text-zinc-400 font-mono text-[10px] mt-0.5 whitespace-nowrap">
                  {distanceText}
                </span>
              </div>
            </Html>
          )}
        </mesh>

        {body.moons?.map((moon) => (
          <group key={moon.id} position={[body.distanceFromSun, 0, 0]}>
            <CelestialBodyNode body={moon} />
          </group>
        ))}
      </group>
    </group>
  );
}
