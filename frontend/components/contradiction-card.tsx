import { AlertTriangle, CheckCircle2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";

type ContradictionCardProps = {
  severity: "High" | "Medium" | "Low";
  title: string;
  summary: string;
  citations: string[];
  verified: boolean;
};

export function ContradictionCard({
  severity,
  title,
  summary,
  citations,
  verified,
}: ContradictionCardProps) {
  const badgeVariant = severity === "High" ? "red" : severity === "Medium" ? "amber" : "slate";
  return (
    <Card className="p-5 transition hover:border-rose-300/25 hover:bg-rose-950/10">
      <div className="flex items-start justify-between gap-4">
        <div className="flex items-start gap-3">
          <div className="rounded-xl border border-rose-300/20 bg-rose-300/10 p-2">
            <AlertTriangle className="size-4 text-rose-200" />
          </div>
          <div>
            <div className="font-medium text-white">{title}</div>
            <p className="mt-2 text-sm leading-6 text-slate-400">{summary}</p>
          </div>
        </div>
        <div className="flex shrink-0 gap-2">
          <Badge variant={badgeVariant}>{severity}</Badge>
          {verified ? (
            <Badge variant="green">
              <CheckCircle2 className="mr-1 size-3" />
              Verified
            </Badge>
          ) : null}
        </div>
      </div>
      <div className="mt-4 flex flex-wrap gap-2">
        {citations.map((citation) => (
          <span
            key={citation}
            className="rounded-full border border-white/10 bg-white/[0.04] px-2.5 py-1 text-xs text-slate-400"
          >
            {citation}
          </span>
        ))}
      </div>
    </Card>
  );
}
