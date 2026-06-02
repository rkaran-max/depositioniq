import type { LucideIcon } from "lucide-react";
import { ArrowUpRight } from "lucide-react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";

type MetricCardProps = {
  label: string;
  value: string;
  detail: string;
  icon: LucideIcon;
  tone?: "sky" | "amber" | "emerald" | "rose";
};

const toneMap = {
  sky: "from-sky-400/20 text-sky-200 border-sky-300/20",
  amber: "from-amber-400/20 text-amber-200 border-amber-300/20",
  emerald: "from-emerald-400/20 text-emerald-200 border-emerald-300/20",
  rose: "from-rose-400/20 text-rose-200 border-rose-300/20",
};

export function MetricCard({
  label,
  value,
  detail,
  icon: Icon,
  tone = "sky",
}: MetricCardProps) {
  return (
    <Card className="group relative overflow-hidden p-5 transition duration-300 hover:-translate-y-0.5 hover:border-white/20">
      <div className={cn("absolute inset-x-0 top-0 h-px bg-gradient-to-r to-transparent", toneMap[tone])} />
      <div className="flex items-start justify-between gap-4">
        <div>
          <div className="text-sm text-slate-400">{label}</div>
          <div className="mt-3 text-3xl font-semibold tracking-tight text-white">{value}</div>
        </div>
        <div className={cn("rounded-xl border bg-gradient-to-b to-transparent p-2.5", toneMap[tone])}>
          <Icon className="size-5" />
        </div>
      </div>
      <div className="mt-4 flex items-center gap-1.5 text-xs text-slate-500">
        <ArrowUpRight className="size-3.5 text-slate-500" />
        {detail}
      </div>
    </Card>
  );
}
