import { FounderContact } from "@/components/founder-contact";
import { Nav } from "@/components/nav";
import { ProductConsole } from "@/components/product-console";
import { WorkflowSection } from "@/components/workflow-section";

export default function ProductPage() {
  return (
    <main className="min-h-screen bg-[#070707] pt-14 text-slate-100">
      <Nav />
      <section className="border-b border-white/10 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm text-slate-500">Product</div>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-normal tracking-tight text-white md:text-6xl">
            A citation-first workflow for deposition intelligence.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
            DepositionIQ organizes testimony into traceable claims, verifies
            contradiction candidates, and prepares cross-examination strategy
            without hiding the source record.
          </p>
        </div>
      </section>
      <ProductConsole />
      <WorkflowSection />
      <FounderContact />
    </main>
  );
}
