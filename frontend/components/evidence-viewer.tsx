import { BookOpenText } from "lucide-react";
import type { TranscriptEvidence } from "@/lib/mock-analysis";
import { cn } from "@/lib/utils";

const riskBadgeTone = {
  Low: "border-slate-300/15 bg-slate-300/10 text-slate-300",
  Medium: "border-amber-300/25 bg-amber-300/10 text-amber-200",
  High: "border-rose-300/25 bg-rose-300/10 text-rose-200",
};

function HighlightedTranscript({
  text,
  highlights,
}: {
  text: string;
  highlights: string[];
}) {
  const escaped = highlights.map((phrase) =>
    phrase.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"),
  );
  const parts = text.split(new RegExp(`(${escaped.join("|")})`, "gi"));

  return (
    <p className="font-mono text-xs leading-6 text-slate-300">
      {parts.map((part, index) => {
        const isHighlighted = highlights.some(
          (phrase) => phrase.toLowerCase() === part.toLowerCase(),
        );
        return isHighlighted ? (
          <mark
            key={`${part}-${index}`}
            className="rounded border border-sky-300/20 bg-sky-300/10 px-1 py-0.5 text-sky-100"
          >
            {part}
          </mark>
        ) : (
          <span key={`${part}-${index}`}>{part}</span>
        );
      })}
    </p>
  );
}

export function EvidenceViewer({ excerpts }: { excerpts: TranscriptEvidence[] }) {
  return (
    <div className="grid gap-3 lg:grid-cols-2">
      {excerpts.map((excerpt) => (
        <div
          key={excerpt.id}
          className="group rounded-lg border border-white/10 bg-[#070A0F] p-4 transition hover:border-sky-200/25 hover:bg-[#0D131D]"
        >
          <div className="flex flex-wrap items-center justify-between gap-3">
            <div className="flex items-center gap-2">
              <BookOpenText className="size-4 text-sky-300/80 transition group-hover:text-sky-200" />
              <div className="font-mono text-[11px] text-sky-300 transition group-hover:text-sky-200">{excerpt.citation}</div>
            </div>
            <span className={cn("rounded-full border px-2 py-1 font-mono text-[10px]", riskBadgeTone[excerpt.crossExamRelevance])}>
              {excerpt.crossExamRelevance} exam relevance
            </span>
          </div>
          <div className="mt-4 rounded-lg border border-white/10 bg-[#111827] p-3 transition group-hover:border-sky-200/20">
            <HighlightedTranscript text={excerpt.text} highlights={excerpt.highlights} />
          </div>
          <div className="mt-3 grid gap-2 md:grid-cols-2">
            <div className="rounded border border-white/10 bg-[#0B0F17] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                extracted claim
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">{excerpt.extractedClaim}</p>
            </div>
            <div className="rounded border border-white/10 bg-[#0B0F17] p-3">
              <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
                linked issue
              </div>
              <p className="mt-2 text-xs leading-5 text-slate-400">
                {excerpt.relatedContradiction ?? "No contradiction currently linked"}
              </p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
