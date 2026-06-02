"use client";

import {
  BarChart3,
  BookOpenText,
  Braces,
  FileSearch,
  Gavel,
  MessageSquareQuote,
  Network,
  ScrollText,
  ShieldAlert,
  UserRound,
} from "lucide-react";
import { cn } from "@/lib/utils";

const navItems = [
  { label: "Overview", icon: BarChart3, id: "overview" },
  { label: "Agent Pipeline", icon: Braces, id: "agent-pipeline" },
  { label: "Lawyer Workflow", icon: FileSearch, id: "lawyer-workflow" },
  { label: "Claim Map", icon: FileSearch, id: "claims-graph" },
  { label: "Evidence Viewer", icon: BookOpenText, id: "transcript-evidence-viewer" },
  { label: "Contradiction Review", icon: ShieldAlert, id: "contradiction-review" },
  { label: "Cross-Exam Strategy", icon: MessageSquareQuote, id: "cross-examination" },
  { label: "Witness Profile", icon: UserRound, id: "courtshadow" },
  { label: "CourtShadow", icon: Network, id: "courtshadow" },
  { label: "Report Export", icon: ScrollText, id: "report" },
];

export function Sidebar() {
  return (
    <aside className="sticky top-4 hidden h-[calc(100vh-2rem)] w-72 shrink-0 rounded-xl border border-white/10 bg-[#070A0F]/90 p-4 shadow-[0_24px_90px_rgba(0,0,0,0.45)] backdrop-blur-xl lg:block">
      <div className="mb-7 flex items-center gap-3 px-1">
        <div className="flex size-9 items-center justify-center rounded-lg border border-sky-300/20 bg-sky-300/10">
          <Gavel className="size-5 text-sky-200" />
        </div>
        <div>
          <div className="text-sm font-medium text-white">DepositionIQ</div>
          <div className="font-mono text-[10px] uppercase tracking-[0.18em] text-slate-600">
            agent console
          </div>
        </div>
      </div>

      <div className="mb-3 rounded-lg border border-emerald-300/15 bg-emerald-300/5 p-3">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-emerald-300">
          system.active
        </div>
        <div className="mt-2 grid grid-cols-2 gap-2 font-mono text-[10px] text-slate-500">
          <span>reasoner:on</span>
          <span>ocr:ready</span>
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
                "group flex items-center gap-3 rounded-lg px-3 py-2 font-mono text-[11px] text-slate-500 transition hover:bg-white/[0.05] hover:text-white",
                index === 0 && "border border-sky-300/15 bg-sky-300/10 text-sky-100",
              )}
            >
              <Icon className="size-4 text-slate-500 transition group-hover:text-sky-300" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-4 rounded-lg border border-white/10 bg-[#0B0F17] p-4">
        <div className="font-mono text-[10px] uppercase tracking-[0.2em] text-slate-600">
          case.kernel
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
