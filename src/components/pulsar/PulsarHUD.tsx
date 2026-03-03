"use client";

import { useStore } from "@/store/useStore";
import { useEffect, useState } from "react";
import { RefreshCw, Zap, Layers } from "lucide-react";

export default function PulsarHUD() {
  const showMagneticField = useStore((state) => state.showMagneticField);
  const showPulsarPostProcessing = useStore(
    (state) => state.showPulsarPostProcessing,
  );
  const resetTelemetryTrigger = useStore(
    (state) => state.resetTelemetryTrigger,
  );

  const toggleMagneticField = useStore((state) => state.toggleMagneticField);
  const togglePulsarPostProcessing = useStore(
    (state) => state.togglePulsarPostProcessing,
  );
  const triggerResetTelemetry = useStore(
    (state) => state.triggerResetTelemetry,
  );

  const [frequency, setFrequency] = useState(716.3);
  const [magneticField, setMagneticField] = useState(1.0);
  const [surfaceTemp, setSurfaceTemp] = useState(1.2);

  // Live fluctuating data simulation
  useEffect(() => {
    let animationFrame: number;
    let lastTime = performance.now();

    const updateTelemetry = (time: number) => {
      if (time - lastTime > 100) {
        // Update frequency +- 0.5Hz
        setFrequency(716.3 + (Math.random() * 1 - 0.5));
        // Update magnetic field fraction (around 10^8 T)
        setMagneticField(1.0 + (Math.random() * 0.02 - 0.01));
        // Update surface temp (around 1.2M K)
        setSurfaceTemp(1.2 + (Math.random() * 0.01 - 0.005));

        lastTime = time;
      }
      animationFrame = requestAnimationFrame(updateTelemetry);
    };

    animationFrame = requestAnimationFrame(updateTelemetry);
    return () => cancelAnimationFrame(animationFrame);
  }, [resetTelemetryTrigger]);

  return (
    <div className="w-full h-full flex flex-col justify-between p-6 md:p-10 pointer-events-none text-cyan-400">
      {/* Top Left: Diagnostics */}
      <div className="glass-panel p-6 rounded-xl border border-cyan-500/30 bg-black/40 backdrop-blur-md shadow-[0_0_30px_rgba(0,255,255,0.05)] w-full max-w-sm pointer-events-auto">
        <h1 className="text-xl font-bold tracking-[0.2em] mb-4 text-white border-b border-cyan-500/30 pb-2">
          PULSAR TELEMETRY
        </h1>
        <div className="space-y-3 font-mono text-sm">
          <div className="flex justify-between items-center">
            <span className="text-cyan-600/80">PULSE FREQUENCY:</span>
            <span className="text-white tracking-wider">
              {frequency.toFixed(2)} Hz
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-600/80">MAGNETIC FIELD:</span>
            <span className="text-white tracking-wider">
              {magneticField.toFixed(3)} x 10^8 T
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-cyan-600/80">SURFACE TEMP:</span>
            <span className="text-white tracking-wider">
              {surfaceTemp.toFixed(3)}M K
            </span>
          </div>
        </div>
      </div>

      {/* Bottom Right: Global Controls */}
      <div className="absolute bottom-6 right-6 md:bottom-10 md:right-10 flex gap-4 pointer-events-auto">
        <button
          onClick={toggleMagneticField}
          className={`glass-button flex items-center gap-2 px-4 py-2 rounded-md border backdrop-blur-md transition-all ${
            showMagneticField
              ? "bg-cyan-900/40 border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              : "bg-black/40 border-white/10 hover:border-white/30 text-zinc-400"
          }`}
        >
          <Layers className="w-4 h-4" />
          <span className="text-xs tracking-wider uppercase">
            Magnetic Field
          </span>
        </button>

        <button
          onClick={togglePulsarPostProcessing}
          className={`glass-button flex items-center gap-2 px-4 py-2 rounded-md border backdrop-blur-md transition-all ${
            showPulsarPostProcessing
              ? "bg-cyan-900/40 border-cyan-400/50 text-cyan-200 shadow-[0_0_15px_rgba(34,211,238,0.2)]"
              : "bg-black/40 border-white/10 hover:border-white/30 text-zinc-400"
          }`}
        >
          <Zap className="w-4 h-4" />
          <span className="text-xs tracking-wider uppercase">Bloom fx</span>
        </button>

        <button
          onClick={triggerResetTelemetry}
          className="glass-button flex items-center justify-center p-2 rounded-md border border-white/10 bg-black/40 backdrop-blur-md hover:bg-white/10 transition-colors"
          title="Reset Telemetry Data"
        >
          <RefreshCw className="w-4 h-4 text-zinc-300" />
        </button>
      </div>
    </div>
  );
}
