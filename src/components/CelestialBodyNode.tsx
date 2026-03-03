"use client";

import { useRef, useState, useMemo, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import { Html } from "@react-three/drei";
import * as THREE from "three";
import { CelestialBody } from "@/constants/data";
import { useStore } from "@/store/useStore";

function SafeTexture({
  url,
  normalMapUrl,
  roughnessMapUrl,
  color,
  isStar,
}: {
  url: string | null;
  normalMapUrl?: string | null;
  roughnessMapUrl?: string | null;
  color: string;
  isStar: boolean;
}) {
  const [maps, setMaps] = useState<{
    map: THREE.Texture | null;
    normalMap: THREE.Texture | null;
    roughnessMap: THREE.Texture | null;
  }>({ map: null, normalMap: null, roughnessMap: null });

  useEffect(() => {
    const loader = new THREE.TextureLoader();
    const newMaps: any = { map: null, normalMap: null, roughnessMap: null };

    const urlsToLoad = [
      { key: "map", url },
      { key: "normalMap", url: normalMapUrl },
      { key: "roughnessMap", url: roughnessMapUrl },
    ].filter((i) => i.url);

    if (urlsToLoad.length === 0) return;

    let loadedCount = 0;
    urlsToLoad.forEach((item) => {
      loader.load(
        item.url!,
        (tex) => {
          if (item.key === "map") tex.colorSpace = THREE.SRGBColorSpace;
          newMaps[item.key] = tex;
          loadedCount++;
          if (loadedCount === urlsToLoad.length) {
            setMaps({ ...newMaps });
          }
        },
        undefined,
        () => {
          console.warn("Failed texture:", item.url);
          loadedCount++;
          if (loadedCount === urlsToLoad.length) {
            setMaps({ ...newMaps });
          }
        },
      );
    });
  }, [url, normalMapUrl, roughnessMapUrl]);

  if (isStar) {
    return (
      <meshBasicMaterial
        map={maps.map || null}
        color={maps.map ? "#ffffff" : color}
        toneMapped={false}
      />
    );
  }

  return (
    <meshStandardMaterial
      map={maps.map || null}
      normalMap={maps.normalMap || null}
      roughnessMap={maps.roughnessMap || null}
      color={maps.map ? "#ffffff" : color}
      roughness={maps.roughnessMap ? 1 : 0.7}
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
          // @ts-expect-error R3F intrinsic elements conflict with React SVG types
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
          name={body.id}
          position={[body.distanceFromSun, 0, 0]}
          castShadow
          receiveShadow
        >
          <sphereGeometry args={[body.radius, 64, 64]} />
          <SafeTexture
            url={body.textureUrl}
            normalMapUrl={body.normalMapUrl}
            roughnessMapUrl={body.roughnessMapUrl}
            color={body.color}
            isStar={body.type === "star"}
          />

          {body.type !== "moon" && body.id !== "sun" && (
            <Html
              distanceFactor={150}
              zIndexRange={[100, 0]}
              className="pointer-events-none"
            >
              <div
                onClick={() => useStore.getState().setFocusedPlanet(body.id)}
                className="flex flex-col items-center bg-black/60 backdrop-blur-md px-3 py-1.5 rounded-md border border-white/10 shadow-lg transform translate-x-4 -translate-y-4 pointer-events-auto cursor-pointer hover:border-white/30 transition-all hover:bg-white/10"
              >
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
