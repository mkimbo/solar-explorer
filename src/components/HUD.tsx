"use client";

import { useStore } from "@/store/useStore";
import { Orbit, Activity, RefreshCw } from "lucide-react";

export default function HUD() {
  const {
    showOrbits,
    showGravityWells,
    toggleOrbits,
    toggleGravityWells,
    triggerCameraReset,
  } = useStore();

  return (
    <div className="absolute inset-0 pointer-events-none z-10 font-sans p-6 text-white flex flex-col justify-between">
      {/* Top Left - Title */}
      <div className="flex flex-col gap-1 pointer-events-auto w-max backdrop-blur-md bg-black/40 p-4 rounded-xl border border-white/10">
        <h1 className="text-xl tracking-widest text-zinc-100 uppercase font-semibold">
          Solar Explorer
        </h1>
        <p className="font-mono text-xs text-zinc-400">
          STATUS: ONLINE / SYS. NOMINAL
        </p>
      </div>

      {/* Bottom Right - Controls */}
      <div className="self-end pointer-events-auto flex gap-3">
        <button
          onClick={toggleOrbits}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border transition-all ${
            showOrbits
              ? "bg-white/20 border-white/30 text-white"
              : "bg-black/40 border-white/10 text-zinc-400"
          } hover:bg-white/10`}
        >
          <Orbit size={16} />
          <span className="font-mono text-sm uppercase">Orbits</span>
        </button>
        <button
          onClick={toggleGravityWells}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg backdrop-blur-md border transition-all ${
            showGravityWells
              ? "bg-indigo-500/20 border-indigo-500/50 text-indigo-300"
              : "bg-black/40 border-white/10 text-zinc-400"
          } hover:bg-white/10 hover:border-white/20`}
        >
          <Activity size={16} />
          <span className="font-mono text-sm uppercase">Gravity Wells</span>
        </button>
        <button
          onClick={triggerCameraReset}
          className="flex items-center justify-center p-2 rounded-lg backdrop-blur-md bg-black/40 border border-white/10 text-zinc-400 hover:text-white hover:bg-white/10 hover:border-white/20 transition-all"
          title="Reset Camera"
        >
          <RefreshCw size={18} />
        </button>
      </div>
    </div>
  );
}
