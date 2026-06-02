import { Shield, Target, UserRound } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

type WitnessProfileProps = {
  name: string;
  overview: string;
  topics: string[];
  vulnerabilities: string[];
  strengths: string[];
  risk: "Low" | "Medium" | "High";
};

export function WitnessProfile({
  name,
  overview,
  topics,
  vulnerabilities,
  strengths,
  risk,
}: WitnessProfileProps) {
  return (
    <Card id="witness-profile">
      <CardHeader>
        <div className="flex items-center justify-between gap-4">
          <CardTitle>Witness Profile</CardTitle>
          <Badge variant={risk === "High" ? "red" : risk === "Medium" ? "amber" : "green"}>
            {risk} risk
          </Badge>
        </div>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 lg:grid-cols-[1fr_1.5fr]">
          <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
            <div className="flex items-center gap-3">
              <UserRound className="size-5 text-sky-200" />
              <div>
                <div className="text-sm text-slate-500">Witness</div>
                <div className="font-medium text-white">{name}</div>
              </div>
            </div>
            <p className="mt-4 text-sm leading-6 text-slate-400">{overview}</p>
          </div>
          <div className="grid gap-4 md:grid-cols-2">
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                <Shield className="size-4 text-amber-200" />
                Vulnerabilities
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                {vulnerabilities.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
            <div className="rounded-xl border border-white/10 bg-white/[0.04] p-4">
              <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
                <Target className="size-4 text-emerald-200" />
                Strengths
              </div>
              <ul className="space-y-2 text-sm text-slate-400">
                {strengths.map((item) => (
                  <li key={item}>- {item}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
        <div className="mt-4 flex flex-wrap gap-2">
          {topics.map((topic) => (
            <Badge key={topic} variant="slate">
              {topic}
            </Badge>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
