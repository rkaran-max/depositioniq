"use client";

import {
  BarChart3,
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
  { label: "Overview", icon: BarChart3 },
  { label: "Claims", icon: FileSearch },
  { label: "Contradictions", icon: ShieldAlert },
  { label: "Cross-Examination", icon: MessageSquareQuote },
  { label: "Witness Profile", icon: UserRound },
  { label: "CourtShadow", icon: Network },
  { label: "Report", icon: ScrollText },
];

export function Sidebar() {
  return (
    <aside className="hidden min-h-[calc(100vh-2rem)] w-72 shrink-0 rounded-2xl border border-white/10 bg-slate-950/60 p-4 shadow-glass backdrop-blur-xl lg:block">
      <div className="mb-8 flex items-center gap-3 px-2">
        <div className="flex size-10 items-center justify-center rounded-xl border border-sky-300/20 bg-sky-300/10">
          <Gavel className="size-5 text-sky-200" />
        </div>
        <div>
          <div className="text-sm font-semibold text-white">DepositionIQ</div>
          <div className="text-xs text-slate-500">Litigation intelligence OS</div>
        </div>
      </div>

      <nav className="space-y-1">
        {navItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <a
              key={item.label}
              href={`#${item.label.toLowerCase().replace(/[^a-z]+/g, "-")}`}
              className={cn(
                "group flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm text-slate-400 transition hover:bg-white/[0.06] hover:text-white",
                index === 0 && "bg-white/[0.07] text-white",
              )}
            >
              <Icon className="size-4 text-slate-500 transition group-hover:text-sky-300" />
              {item.label}
            </a>
          );
        })}
      </nav>

      <div className="mt-8 rounded-xl border border-white/10 bg-white/[0.04] p-4">
        <div className="text-xs uppercase tracking-[0.2em] text-slate-500">Case Mode</div>
        <div className="mt-2 text-sm font-medium text-white">High-signal review</div>
        <p className="mt-2 text-xs leading-5 text-slate-400">
          Tuned for deposition contradiction triage, preservation issues, and
          cross-examination prep.
        </p>
      </div>
    </aside>
  );
}
