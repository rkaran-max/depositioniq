import {
  FileArchive,
  FileSearch,
  FileText,
  Gavel,
  ScanText,
  ScrollText,
} from "lucide-react";

const items = [
  "PDF",
  "OCR",
  "TXT",
  "Depositions",
  "Exhibits",
  "Discovery",
  "Transcripts",
  "Court Records",
  "Witness Testimony",
  "Cross-Examination",
  "Litigation Reports",
  "CourtShadow",
];

const icons = [FileText, ScanText, FileArchive, Gavel, FileSearch, ScrollText];

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
                className="flex items-center gap-2 rounded-full border border-white/10 bg-[#0B0F17] px-4 py-2 font-mono text-[11px] uppercase tracking-[0.16em] text-slate-300"
              >
                <Icon className="size-3.5 text-cyan-300" />
                {item}
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
