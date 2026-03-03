import { create } from "zustand";
import * as THREE from "three";

interface SolarSystemState {
  showOrbits: boolean;
  showGravityWells: boolean;
  cameraResetTrigger: number;
  focusedPlanet: string | null;
  earthPosition: THREE.Vector3;
  toggleOrbits: () => void;
  toggleGravityWells: () => void;
  triggerCameraReset: () => void;
  setFocusedPlanet: (id: string | null) => void;
  setEarthPosition: (pos: THREE.Vector3) => void;

  // Pulsar State
  showMagneticField: boolean;
  showPulsarPostProcessing: boolean;
  resetTelemetryTrigger: number;
  toggleMagneticField: () => void;
  togglePulsarPostProcessing: () => void;
  triggerResetTelemetry: () => void;
}

export const useStore = create<SolarSystemState>((set) => ({
  showOrbits: true,
  showGravityWells: false,
  cameraResetTrigger: 0,
  focusedPlanet: null,
  earthPosition: new THREE.Vector3(50, 0, 0),
  toggleOrbits: () => set((state) => ({ showOrbits: !state.showOrbits })),
  toggleGravityWells: () =>
    set((state) => ({ showGravityWells: !state.showGravityWells })),
  triggerCameraReset: () =>
    set((state) => ({
      cameraResetTrigger: state.cameraResetTrigger + 1,
      focusedPlanet: null,
    })),
  setFocusedPlanet: (id) => set({ focusedPlanet: id }),
  setEarthPosition: (pos) => set({ earthPosition: pos }),

  // Pulsar State
  showMagneticField: true,
  showPulsarPostProcessing: true,
  resetTelemetryTrigger: 0,
  toggleMagneticField: () =>
    set((state) => ({ showMagneticField: !state.showMagneticField })),
  togglePulsarPostProcessing: () =>
    set((state) => ({
      showPulsarPostProcessing: !state.showPulsarPostProcessing,
    })),
  triggerResetTelemetry: () =>
    set((state) => ({
      resetTelemetryTrigger: state.resetTelemetryTrigger + 1,
    })),
}));
