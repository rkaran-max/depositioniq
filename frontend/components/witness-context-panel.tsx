import { Network, ScanLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function WitnessContextPanel() {
  return (
    <Card id="witness-context" className="overflow-hidden">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Witness Context</CardTitle>
            <CardDescription>Record context and attorney follow-up analysis</CardDescription>
          </div>
          <Badge variant="violet">
            <ScanLine className="mr-1 size-3" />
            Preview
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="relative rounded-xl border border-white/10 bg-slate-950/80 p-5">
          <div className="relative flex items-start gap-4">
            <div className="rounded-xl border border-violet-300/20 bg-violet-300/10 p-3">
              <Network className="size-5 text-violet-200" />
            </div>
            <div>
              <div className="font-medium text-white">Retention or recall issue identified for attorney review.</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                The review panel summarizes potential preservation, retention, recall,
                and citation-support issues using the currently loaded testimony. It
                surfaces follow-up areas without drawing legal conclusions.
              </p>
              <div className="mt-4 grid gap-3 md:grid-cols-3">
                {["Retention practice", "Citation support", "Follow-up scope"].map((item) => (
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
