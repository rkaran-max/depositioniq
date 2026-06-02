import { Network, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function CourtShadowPanel() {
  return (
    <Card id="courtshadow" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>CourtShadow</CardTitle>
            <CardDescription>Adversarial posture and record-shadow analysis</CardDescription>
          </div>
          <Badge variant="violet">
            <ScanLine className="mr-1 size-3" />
            Preview
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-xl border border-white/10 bg-slate-950/80 p-5">
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(56,189,248,0.12),transparent_35%),radial-gradient(circle_at_80%_80%,rgba(168,85,247,0.12),transparent_35%)]" />
          <div className="relative flex items-start gap-4">
            <div className="rounded-xl border border-violet-300/20 bg-violet-300/10 p-3">
              <Network className="size-5 text-violet-200" />
            </div>
            <div>
              <div className="font-medium text-white">Record-shadow detected around DR DOS communications.</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The witness acknowledges broad email deletion behavior while disclaiming
                recall of specific DR DOS messages. CourtShadow marks the preservation
                trail as a high-value follow-up vector, not a legal conclusion.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["Retention policy", "Custodian timeline", "Missing-message scope"].map((item) => (
                  <div key={item} className="rounded-lg border border-white/10 bg-white/[0.04] p-3 text-sm text-slate-300">
                    {item}
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
