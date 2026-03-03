"use client";

import { Canvas } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import { celestialData } from "@/constants/data";
import CelestialBodyNode from "./CelestialBodyNode";
import AsteroidBelt from "./AsteroidBelt";
import GravityWellGrid from "./GravityWellGrid";
import { useStore } from "@/store/useStore";

function SceneContent() {
  const cameraResetTrigger = useStore((state) => state.cameraResetTrigger);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current && cameraResetTrigger > 0) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(0, 80, 200);
      controlsRef.current.target.set(0, 0, 0);
    }
  }, [cameraResetTrigger]);

  return (
    <>
      <color attach="background" args={["#010103"]} />
      <Stars
        radius={300}
        depth={60}
        count={10000}
        factor={7}
        saturation={0}
        fade
        speed={1}
      />

      <ambientLight intensity={0.03} />
      <pointLight
        position={[0, 0, 0]}
        intensity={10000}
        distance={1000}
        decay={2}
        castShadow
        shadow-mapSize={[2048, 2048]}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={15}
        maxDistance={600}
        makeDefault
      />

      {celestialData.map((body) => (
        <CelestialBodyNode key={body.id} body={body} />
      ))}

      <AsteroidBelt />
      <GravityWellGrid />
    </>
  );
}

export default function SolarSystemScene() {
  return (
    <div className="w-full h-full absolute inset-0 text-white pointer-events-auto">
      <Canvas shadows camera={{ position: [0, 80, 200], fov: 45 }}>
        <Suspense fallback={null}>
          <SceneContent />
        </Suspense>
      </Canvas>
    </div>
  );
}
