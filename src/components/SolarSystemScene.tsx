"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { Suspense, useRef, useEffect } from "react";
import * as THREE from "three";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { celestialData } from "@/constants/data";
import CelestialBodyNode from "./CelestialBodyNode";
import AsteroidBelt from "./AsteroidBelt";
import GravityWellGrid from "./GravityWellGrid";
import { useStore } from "@/store/useStore";

function SceneContent() {
  const cameraResetTrigger = useStore((state) => state.cameraResetTrigger);
  const focusedPlanet = useStore((state) => state.focusedPlanet);
  const controlsRef = useRef<any>(null);

  useEffect(() => {
    if (controlsRef.current && cameraResetTrigger > 0) {
      controlsRef.current.reset();
      controlsRef.current.object.position.set(0, 80, 200);
      controlsRef.current.target.set(0, 0, 0);
    }
  }, [cameraResetTrigger]);

  useFrame((state) => {
    if (focusedPlanet && controlsRef.current) {
      const planetMesh = state.scene.getObjectByName(focusedPlanet);
      if (planetMesh) {
        const targetPos = new THREE.Vector3();
        planetMesh.getWorldPosition(targetPos);

        // Smoothly pan OrbitControls target to the planet
        controlsRef.current.target.lerp(targetPos, 0.05);

        // Smoothly move the camera to a good viewing distance
        const planetData = celestialData.find((b) => b.id === focusedPlanet);
        const focusDist = planetData ? planetData.radius * 6 : 20;

        const desiredCamPos = new THREE.Vector3();
        desiredCamPos
          .copy(targetPos)
          .add(new THREE.Vector3(focusDist, focusDist * 0.5, focusDist));
        state.camera.position.lerp(desiredCamPos, 0.05);
      }
    }
  });

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

      <ambientLight intensity={0.1} />
      <pointLight
        position={[0, 0, 0]}
        intensity={3}
        distance={0}
        decay={0}
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

      <EffectComposer>
        <Bloom luminanceThreshold={1} mipmapBlur intensity={2} />
      </EffectComposer>
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
