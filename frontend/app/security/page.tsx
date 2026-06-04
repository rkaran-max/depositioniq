import { CheckCircle2, FileLock2, ShieldCheck } from "lucide-react";
import { FounderContact } from "@/components/founder-contact";
import { Nav } from "@/components/nav";

const safeguards = [
  {
    title: "Local-first prototype",
    body: "The CS153 demo can run locally with the Python backend and Next.js frontend on the same machine.",
  },
  {
    title: "No API key required",
    body: "The deterministic backend path works without model training or third-party API credentials.",
  },
  {
    title: "Attorney review required",
    body: "Outputs are framed as review aids and follow-up candidates, not legal conclusions.",
  },
  {
    title: "Future firm controls",
    body: "Future work includes access control, audit logs, firm deployment, encryption, and matter-level permissions.",
  },
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#070707] pt-14 text-slate-100">
      <Nav />
      <section className="px-4 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.92fr_1.08fr]">
          <div>
            <div className="flex size-14 items-center justify-center rounded-xl border border-white/10 bg-[#0B0F17]">
              <FileLock2 className="size-7 text-slate-300" />
            </div>
            <h1 className="mt-8 max-w-3xl font-serif text-5xl font-normal tracking-tight text-white md:text-6xl">
              Security posture for a legal AI prototype.
            </h1>
            <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
              DepositionIQ is designed for a responsible demo: deterministic
              local analysis, visible citation trails, and human attorney review
              before any strategic use.
            </p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B0F17] p-6">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck className="size-4 text-emerald-300" />
              Demo safeguards
            </div>
            <div className="space-y-3">
              {safeguards.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-[#070A0F] p-4">
                  <div className="flex items-center gap-2 text-sm font-medium text-white">
                    <CheckCircle2 className="size-4 text-emerald-300" />
                    {item.title}
                  </div>
                  <p className="mt-2 text-sm leading-6 text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
      <FounderContact />
    </main>
  );
}
