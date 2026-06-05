import { CheckCircle2, Link2, ShieldAlert } from "lucide-react";
import { EvidenceViewer } from "@/components/evidence-viewer";
import { FounderContact } from "@/components/founder-contact";
import { Nav } from "@/components/nav";
import { Badge } from "@/components/ui/badge";
import { contradictions, transcriptEvidence } from "@/lib/mock-analysis";

export default function EvidenceReviewPage() {
  return (
    <main className="min-h-screen bg-[#070707] pt-14 text-slate-100">
      <Nav />
      <section className="border-b border-white/10 px-4 py-24">
        <div className="mx-auto max-w-7xl">
          <div className="text-sm text-slate-500">Evidence Review</div>
          <h1 className="mt-4 max-w-4xl font-serif text-5xl font-normal tracking-tight text-white md:text-6xl">
            Trace every issue back to the testimony that created it.
          </h1>
          <p className="mt-5 max-w-2xl text-base leading-8 text-slate-400">
            The evidence review layer connects excerpts, extracted claims,
            contradiction candidates, and cross-examination objectives in one
            citation-centered workflow.
          </p>
        </div>
      </section>

      <section className="px-4 py-20">
        <div className="mx-auto grid max-w-7xl gap-6 xl:grid-cols-[0.95fr_1.05fr]">
          <div className="rounded-2xl border border-white/10 bg-[#0B0F17] p-5">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
              <ShieldAlert className="size-4 text-amber-200" />
              Contradiction review
            </div>
            <div className="space-y-3">
              {contradictions.map((contradiction) => (
                <div key={contradiction.title} className="rounded-xl border border-white/10 bg-[#070A0F] p-4">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div className="min-w-0">
                      <div className="break-words text-sm font-medium text-white">{contradiction.title}</div>
                      <p className="mt-2 break-words text-sm leading-6 text-slate-500">{contradiction.summary}</p>
                    </div>
                    <Badge variant={contradiction.severity === "High" ? "red" : contradiction.severity === "Medium" ? "amber" : "slate"}>
                      {contradiction.severity}
                    </Badge>
                  </div>
                  <div className="mt-3 flex flex-wrap gap-2">
                    {contradiction.citations.map((citation) => (
                      <span key={citation} className="inline-flex max-w-full items-center gap-1 rounded-md border border-white/10 bg-[#0B0F17] px-2 py-1 font-mono text-[10px] break-all text-slate-400">
                        <Link2 className="size-3 shrink-0" />
                        {citation}
                      </span>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-2xl border border-white/10 bg-[#0B0F17] p-5">
            <div className="mb-5 flex items-center gap-2 text-sm font-medium text-white">
              <CheckCircle2 className="size-4 text-emerald-300" />
              Transcript evidence viewer
            </div>
            <EvidenceViewer excerpts={transcriptEvidence.slice(0, 4)} />
          </div>
        </div>
      </section>
      <FounderContact />
    </main>
  );
}
