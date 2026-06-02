import { CheckCircle2, FileLock2, ShieldCheck } from "lucide-react";

const controls = [
  {
    number: "01",
    title: "Local and Private",
    body: "Prototype can run locally; uploaded transcripts do not need to be stored.",
  },
  {
    number: "02",
    title: "Full Audit Trails",
    body: "Each output is tied to claims, citations, and agent trace events.",
  },
  {
    number: "03",
    title: "Human-in-the-Loop Review",
    body: "DepositionIQ surfaces issues for attorney review; it does not replace legal judgment.",
  },
];

export function PrivacySection() {
  return (
    <section id="security" className="border-b border-white/10 bg-[#070707] px-4 py-28">
      <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[1fr_0.9fr]">
        <div className="rounded-2xl border border-white/10 bg-[#0B0F17] p-6">
          <div className="flex size-14 items-center justify-center rounded-xl border border-cyan-300/20 bg-cyan-300/10">
            <FileLock2 className="size-7 text-cyan-200" />
          </div>
          <div className="mt-8 space-y-3">
            {[
              "sealed_document: active",
              "audit_trail: retained",
              "local_demo_mode: enabled",
              "citation_trace: retained",
            ].map((line) => (
              <div key={line} className="flex items-center gap-3 rounded-lg border border-white/10 bg-[#070707] px-4 py-3 font-mono text-xs text-slate-400">
                <CheckCircle2 className="size-4 text-emerald-300" />
                {line}
              </div>
            ))}
          </div>
        </div>
        <div>
          <div className="flex items-center gap-2 font-mono text-[10px] uppercase tracking-[0.24em] text-cyan-300">
            <ShieldCheck className="size-4" />
            Privacy and compliance
          </div>
          <h2 className="mt-4 font-serif text-4xl font-normal tracking-tight text-white md:text-5xl">
            Privacy & Litigation Controls
          </h2>
          <div className="mt-8 space-y-5">
            {controls.map((control) => (
              <div key={control.number} className="rounded-xl border border-white/10 bg-[#0A0D12] p-5">
                <div className="font-mono text-[10px] text-cyan-300">{control.number}</div>
                <div className="mt-2 text-lg text-white">{control.title}</div>
                <p className="mt-2 text-sm leading-6 text-slate-500">{control.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
