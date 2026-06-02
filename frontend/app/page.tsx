import { Dashboard } from "@/components/dashboard";
import { FounderContact } from "@/components/founder-contact";
import { Hero } from "@/components/hero";
import { MarqueeBar } from "@/components/marquee-bar";
import { Nav } from "@/components/nav";
import { PrivacySection } from "@/components/privacy-section";
import { ProductConsole } from "@/components/product-console";
import { WorkflowSection } from "@/components/workflow-section";

export default function Home() {
  return (
    <main className="min-h-screen bg-[#070707] text-slate-100">
      <Nav />
      <Hero />
      <MarqueeBar />
      <ProductConsole />
      <WorkflowSection />
      <PrivacySection />
      <section id="dashboard" className="bg-[#070A0F]">
        <Dashboard />
      </section>
      <FounderContact />
    </main>
  );
}
