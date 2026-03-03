import PulsarScene from "@/components/pulsar/PulsarScene";
import PulsarHUD from "@/components/pulsar/PulsarHUD";

export default function PulsarPage() {
  return (
    <main className="w-full h-screen bg-black overflow-hidden relative font-mono text-white">
      {/* 3D Canvas Layer */}
      <div className="absolute inset-0 z-0">
        <PulsarScene />
      </div>

      {/* Telemetry UI Layer */}
      <div className="absolute inset-0 z-10 pointer-events-none">
        <PulsarHUD />
      </div>
    </main>
  );
}
