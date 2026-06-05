import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type Claim = {
  id: string;
  claim: string;
  topic: string;
  certainty: string;
  confidence: string;
  citation: string;
};

export function ClaimTable({ claims }: { claims: Claim[] }) {
  return (
    <Card id="claims">
      <CardHeader>
        <CardTitle>Claims</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto rounded-xl border border-white/10">
          <table className="w-full min-w-[760px] text-left text-sm">
            <thead className="bg-white/[0.04] text-xs uppercase tracking-[0.18em] text-slate-500">
              <tr>
                <th className="px-4 py-3">Claim</th>
                <th className="px-4 py-3">Topic</th>
                <th className="px-4 py-3">Certainty</th>
                <th className="px-4 py-3">Confidence</th>
                <th className="px-4 py-3">Citation</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/10">
              {claims.map((claim) => (
                <tr key={claim.id} className="transition hover:bg-white/[0.035]">
                  <td className="max-w-xl px-4 py-4 break-words text-slate-200">{claim.claim}</td>
                  <td className="px-4 py-4">
                    <Badge variant="violet" className="text-left">{claim.topic}</Badge>
                  </td>
                  <td className="px-4 py-4">
                    <Badge variant={claim.certainty === "High" ? "green" : "amber"}>
                      {claim.certainty}
                    </Badge>
                  </td>
                  <td className="px-4 py-4 text-slate-300">{claim.confidence}</td>
                  <td className="px-4 py-4 break-all text-slate-500">{claim.citation}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </CardContent>
    </Card>
  );
}
