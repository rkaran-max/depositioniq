import { FounderContact } from "@/components/founder-contact";
import { Hero } from "@/components/hero";
import { Nav } from "@/components/nav";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070707] text-slate-100">
      <Nav />
      <Hero />
      <FounderContact />
    </main>
  );
}
