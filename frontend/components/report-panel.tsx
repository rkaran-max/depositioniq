import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

export function ReportPanel() {
  return (
    <Card id="report">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <div>
            <CardTitle>Final Report</CardTitle>
            <CardDescription>Attorney-ready Markdown export with citations</CardDescription>
          </div>
          <Button size="sm">
            <Download className="size-4" />
            Download
          </Button>
        </div>
      </CardHeader>
      <CardContent>
        <div className="rounded-xl border border-white/10 bg-white/[0.04] p-5">
          <div className="flex items-start gap-3">
            <FileText className="mt-0.5 size-5 text-sky-200" />
            <div>
              <div className="font-medium text-white">DepositionIQ Report</div>
              <p className="mt-2 text-sm leading-6 text-slate-400">
                Includes claims, contradiction candidates, witness profile,
                evidence review, cross-examination targets, and supporting citations.
              </p>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
