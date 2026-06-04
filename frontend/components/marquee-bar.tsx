import {
  FileArchive,
  FileSearch,
  FileText,
  Gavel,
  ScanText,
  ScrollText,
} from "lucide-react";

const items = [
  "Transcript",
  "Claims",
  "Evidence",
  "Contradictions",
  "Cross-Exam",
  "Report",
  "Audio",
  "PDF",
  "Citations",
  "Recall Gaps",
  "Preservation",
  "Attorney Review",
];

const icons = [FileText, ScanText, FileArchive, Gavel, FileSearch, ScrollText];
const iconTones = [
  "text-slate-300",
  "text-sky-300",
  "text-cyan-300",
  "text-amber-300",
  "text-violet-300",
  "text-emerald-300",
];

export function MarqueeBar() {
  const doubled = [...items, ...items];

  return (
    <section className="border-b border-white/10 bg-[#070707] px-4 py-8">
      <div className="mx-auto max-w-7xl overflow-hidden rounded-2xl border border-white/10 bg-[#0A0D12] p-3">
        <div className="marquee-track flex w-max gap-3">
          {doubled.map((item, index) => {
            const Icon = icons[index % icons.length];
            return (
              <div
                key={`${item}-${index}`}
                className="flex items-center gap-2 rounded-md border border-white/10 bg-[#0B0F17] px-4 py-2 text-xs text-slate-300"
              >
                <Icon className={`size-3.5 ${iconTones[index % iconTones.length]}`} />
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
