import {
  CheckCircle2,
  FileLock2,
  HardDrive,
  KeyRound,
  Mic2,
  Scale,
  ShieldCheck,
} from "lucide-react";
import { FounderContact } from "@/components/founder-contact";
import { Nav } from "@/components/nav";

const safeguards = [
  {
    title: "Local-first prototype",
    body: "The CS153 demo can run locally with the Python backend and Next.js frontend on the same machine.",
    icon: HardDrive,
  },
  {
    title: "No API key required",
    body: "The deterministic backend path works without model training or third-party API credentials.",
    icon: KeyRound,
  },
  {
    title: "Attorney review required",
    body: "Outputs are framed as review aids and follow-up candidates, not legal conclusions.",
    icon: Scale,
  },
  {
    title: "Future firm controls",
    body: "Future work includes access control, audit logs, firm deployment, encryption, and matter-level permissions.",
    icon: ShieldCheck,
  },
];

const reviewPrinciples = [
  "Citation-grounded outputs link claims and contradictions back to transcript evidence.",
  "Audio transcription runs locally/server-side with optional Whisper or faster-whisper support.",
  "No cloud transcription is required by default for the experimental audio path.",
  "Generated reports are attorney review aids, not legal conclusions or substitute legal advice.",
];

const firmControls = [
  "Authentication and role-based access control",
  "Matter-level permissions and secure document storage",
  "Encryption for documents, transcripts, and generated reports",
  "Audit logs for uploads, analysis runs, exports, and reviewer actions",
  "Firm deployment model with isolated workspaces",
  "Retention policies for transcripts, audio, and OCR artifacts",
];

export default function SecurityPage() {
  return (
    <main className="min-h-screen bg-[#070707] pt-14 text-slate-100">
      <Nav />
      <section className="border-b border-white/10 px-4 py-24">
        <div className="mx-auto grid max-w-7xl gap-12 lg:grid-cols-[0.9fr_1.1fr]">
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

          <div className="rounded-2xl border border-white/10 bg-[#0B0F17] p-6 shadow-[0_18px_70px_rgba(0,0,0,0.28)]">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck className="size-4 text-emerald-300" />
              Demo safeguards
            </div>
            <div className="grid gap-3 md:grid-cols-2">
              {safeguards.map((item) => (
                <div key={item.title} className="rounded-xl border border-white/10 bg-[#070A0F] p-4">
                  <div className="flex min-w-0 items-center gap-2 text-sm font-medium text-white">
                    <item.icon className="size-4 shrink-0 text-emerald-300" />
                    {item.title}
                  </div>
                  <p className="mt-2 break-words text-sm leading-6 text-slate-500">{item.body}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-white/10 bg-[#070707] px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 lg:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0B0F17] p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <Mic2 className="size-4 text-cyan-300" />
              Transcript and audio handling
            </div>
            <div className="mt-5 space-y-3">
              {reviewPrinciples.map((principle) => (
                <div key={principle} className="flex gap-3 rounded-xl border border-white/10 bg-[#070A0F] p-4">
                  <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-emerald-300" />
                  <p className="text-sm leading-6 text-slate-400">{principle}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B0F17] p-6">
            <div className="flex items-center gap-2 text-sm font-medium text-white">
              <ShieldCheck className="size-4 text-violet-300" />
              Future firm deployment controls
            </div>
            <p className="mt-3 text-sm leading-6 text-slate-500">
              The current CS153 prototype prioritizes transparent local analysis.
              A production legal workspace would add firm-grade controls around
              identity, storage, permissions, and review auditability.
            </p>
            <div className="mt-5 grid gap-3 md:grid-cols-2">
              {firmControls.map((control) => (
                <div key={control} className="rounded-lg border border-white/10 bg-[#070A0F] px-3 py-3 text-sm break-words text-slate-400">
                  {control}
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
