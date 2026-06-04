"use client";

import {
  BarChart3,
  BookOpenText,
  FileSearch,
  MessageSquareQuote,
  ScrollText,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: BarChart3, id: "overview" },
  { label: "Contradiction Review", icon: ShieldAlert, id: "contradiction-review" },
  { label: "Evidence Viewer", icon: BookOpenText, id: "transcript-evidence-viewer" },
  { label: "Review Priorities", icon: FileSearch, id: "claims-graph" },
  { label: "Workflow", icon: FileSearch, id: "lawyer-workflow" },
  { label: "Cross-Exam Strategy", icon: MessageSquareQuote, id: "cross-examination" },
  { label: "Witness Profile", icon: UserRound, id: "courtshadow" },
  { label: "Report Export", icon: ScrollText, id: "report" },
];

export function Sidebar() {
  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-xl border border-white/10 bg-[#070A0F]/92 p-4 shadow-[0_16px_48px_rgba(0,0,0,0.28)] backdrop-blur-xl lg:block">
      <div className="mb-7 flex items-center gap-3 px-1">
        <img src="/brand/depositioniq-favicon.svg" alt="" className="size-9 rounded-lg" />
        <div>
          <div className="text-sm font-medium text-white">DepositionIQ</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
            legal review
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-white/10 bg-[#0B0F17] p-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-500">
          review status
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500">
          <span>evidence:linked</span>
          <span>pdf:ready</span>
          <span>claims:18</span>
          <span>risk:med</span>
        </div>
      </div>

      <nav className="space-y-1 border-t border-white/10 pt-3">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={`#${item.id}`}
              className={cn(
                "group flex items-center gap-3 rounded-lg px-3 py-2 text-xs text-slate-500 transition hover:bg-white/[0.05] hover:text-white",
                index === 0 && "border border-white/10 bg-white/[0.04] text-slate-100",
              )}
            >
              <Icon className="size-4 text-slate-500 transition group-hover:text-slate-200" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-4 rounded-lg border border-white/10 bg-[#0B0F17] p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          sample matter
        </div>
        <div className="mt-2 text-sm font-medium text-white">microsoft / drdos</div>
        <p className="mt-2 text-xs leading-5 text-slate-500">
          Retention vectors, custodian uncertainty, testimony conflicts, and
          cross-examination target synthesis.
        </p>
      </div>
    </aside>
  );
}
