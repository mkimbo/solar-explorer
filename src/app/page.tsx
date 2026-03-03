import SolarSystemScene from "@/components/SolarSystemScene";
import HUD from "@/components/HUD";

export default function Home() {
  return (
    <main className="relative w-full h-full bg-black overflow-hidden font-sans text-white">
      <SolarSystemScene />
      <HUD />
    </main>
  );
}
