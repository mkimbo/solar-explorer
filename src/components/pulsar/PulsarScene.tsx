"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { OrbitControls, Stars } from "@react-three/drei";
import { EffectComposer, Bloom } from "@react-three/postprocessing";
import { useStore } from "@/store/useStore";
import { useRef } from "react";

import PulsarCore from "./PulsarCore";
import RelativisticJets from "./RelativisticJets";
import AccretionDisk from "./AccretionDisk";

function PulsarSceneContent() {
  const showPulsarPostProcessing = useStore(
    (state) => state.showPulsarPostProcessing,
  );
  const controlsRef = useRef<any>(null);

  // Auto-orbital drift when not interacting
  useFrame(() => {
    if (controlsRef.current) {
      // Very slow and subtle continuous orbiting
      controlsRef.current.autoRotate = true;
      controlsRef.current.autoRotateSpeed = 0.5;
    }
  });

  return (
    <>
      <color attach="background" args={["#000000"]} />

      {/* Dense Void */}
      <Stars
        radius={200}
        depth={100}
        count={20000}
        factor={5}
        saturation={0}
        fade
        speed={1}
      />

      <ambientLight intensity={0.05} />

      {/* Extreme PointLight coming from the core */}
      <pointLight
        position={[0, 0, 0]}
        intensity={20}
        color="#ffffff"
        distance={200}
        decay={2}
      />

      <OrbitControls
        ref={controlsRef}
        enableDamping={true}
        dampingFactor={0.05}
        minDistance={20} // Prevent clipping into the core
        maxDistance={400}
        makeDefault
      />

      <group>
        <PulsarCore />
        <RelativisticJets />
        <AccretionDisk />
      </group>

      {showPulsarPostProcessing && (
        <EffectComposer>
          <Bloom
            luminanceThreshold={0.5} // Lower threshold makes more things glow
            mipmapBlur
            intensity={3.5} // Extremely high intensity for blinding effect
          />
        </EffectComposer>
      )}
    </>
  );
}

export default function PulsarScene() {
  return (
    <Canvas camera={{ position: [50, 20, 100], fov: 45 }}>
      <PulsarSceneContent />
    </Canvas>
  );
}
