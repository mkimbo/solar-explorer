"use client";

import { useRef, useMemo } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { celestialData } from "@/constants/data";
import { useStore } from "@/store/useStore";

const vertexShader = `
uniform vec3 uPlanets[9];
uniform float uMasses[9];

varying float vDeformation;

void main() {
    // Basic local to world matrix transform
    vec4 worldPosition = modelMatrix * vec4(position, 1.0);
    
    float deformation = 0.0;
    
    // Evaluate gravity influence for each of the 9 main bodies
    for(int i = 0; i < 9; i++) {
        float dist = distance(worldPosition.xz, uPlanets[i].xz);
        if(uMasses[i] > 0.0) {
            // Apply a modified Newtonian gravity well curve
            float influence = uMasses[i] / (dist * dist * 0.15 + 4.0);
            deformation -= min(influence, 80.0); // Cap max depth
        }
    }
    
    worldPosition.y += deformation;
    vDeformation = deformation;

    gl_Position = projectionMatrix * viewMatrix * worldPosition;
}
`;

const fragmentShader = `
varying float vDeformation;

void main() {
    float intensity = clamp(-vDeformation / 20.0, 0.0, 1.0);
    // Darker colors to prevent blowing out the Bloom threshold
    vec3 baseColor = vec3(0.02, 0.04, 0.1); 
    vec3 deepColor = vec3(0.1, 0.3, 0.6);
    
    vec3 color = mix(baseColor, deepColor, intensity);
    
    // Lower opacity to reduce AdditiveBlending accumulation
    gl_FragColor = vec4(color, 0.05 + intensity * 0.3);
}
`;

export default function GravityWellGrid() {
  const showGravityWells = useStore((state) => state.showGravityWells);
  const materialRef = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(() => {
    return {
      uPlanets: { value: Array(9).fill(new THREE.Vector3()) },
      uMasses: { value: celestialData.map((b) => b.mass) },
    };
  }, []);

  useFrame(({ clock }) => {
    if (!showGravityWells || !materialRef.current) return;

    const t = clock.getElapsedTime();
    const planets: THREE.Vector3[] = [];

    for (let i = 0; i < celestialData.length; i++) {
      const body = celestialData[i];
      if (body.distanceFromSun === 0) {
        planets.push(new THREE.Vector3(0, 0, 0));
      } else {
        // Calculate orbit positions dynamically to match the OrbitGroup transforms
        const angle = t * body.orbitSpeed;
        const d = body.distanceFromSun;
        planets.push(
          new THREE.Vector3(d * Math.cos(angle), 0, -d * Math.sin(angle)),
        );
      }
    }

    materialRef.current.uniforms.uPlanets.value = planets;
  });

  if (!showGravityWells) return null;

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[800, 800, 250, 250]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        wireframe={true}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </mesh>
  );
}
