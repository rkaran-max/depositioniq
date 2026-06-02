"use client";

import { motion } from "framer-motion";
import {
  AlertTriangle,
  ArrowRight,
  CheckCircle2,
  Command,
  FileUp,
  Gavel,
  Search,
  ShieldAlert,
  Sparkles,
  UploadCloud,
} from "lucide-react";
import { ClaimTable } from "@/components/claim-table";
import { ContradictionCard } from "@/components/contradiction-card";
import { CourtShadowPanel } from "@/components/courtshadow-panel";
import { MetricCard } from "@/components/metric-card";
import { ReportPanel } from "@/components/report-panel";
import { Sidebar } from "@/components/sidebar";
import { WitnessProfile } from "@/components/witness-profile";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  claims,
  contradictions,
  depositionMetrics,
  intelligenceSummary,
  sampleTranscript,
  strategyCards,
  witnessProfile,
} from "@/lib/mock-analysis";

const metricIcons = [Gavel, AlertTriangle, CheckCircle2, ShieldAlert];

export default function Home() {
  return (
    <main className="relative min-h-screen overflow-hidden bg-background">
      <div className="absolute inset-0 bg-radial-spotlight" />
      <div className="noise-overlay absolute inset-0 opacity-80" />
      <div className="absolute inset-x-0 top-0 h-80 bg-gradient-to-b from-sky-400/10 to-transparent" />

      <div className="relative mx-auto flex w-full max-w-[1500px] gap-4 p-4">
        <Sidebar />

        <section className="min-w-0 flex-1">
          <header className="sticky top-4 z-20 mb-4 flex items-center gap-3 rounded-2xl border border-white/10 bg-slate-950/70 p-3 shadow-glass backdrop-blur-xl">
            <div className="flex flex-1 items-center gap-3 rounded-xl border border-white/10 bg-white/[0.04] px-3 py-2">
              <Search className="size-4 text-slate-500" />
              <Input
                className="h-7 border-0 bg-transparent p-0 focus-visible:ring-0"
                placeholder="Search claims, contradictions, witnesses, citations..."
              />
            </div>
            <Badge variant="slate" className="hidden md:inline-flex">
              <Command className="mr-1 size-3" />
              Command bar
            </Badge>
            <Button variant="secondary" size="sm">
              <Sparkles className="size-4" />
              Demo Case
            </Button>
          </header>

          <motion.section
            initial={{ opacity: 0, y: 18 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            className="relative overflow-hidden rounded-3xl border border-white/10 bg-slate-950/65 p-8 shadow-glass backdrop-blur-xl md:p-12"
          >
            <div className="absolute inset-0 bg-[radial-gradient(circle_at_20%_10%,rgba(56,189,248,0.18),transparent_30%),radial-gradient(circle_at_80%_20%,rgba(168,85,247,0.12),transparent_28%)]" />
            <div className="relative max-w-4xl">
              <Badge variant="default" className="mb-5">
                Litigation intelligence for deposition teams
              </Badge>
              <h1 className="text-balance text-5xl font-semibold tracking-tight text-white md:text-7xl">
                DepositionIQ
              </h1>
              <p className="mt-5 max-w-2xl text-xl leading-8 text-slate-300">
                Agentic litigation analysis for deposition review
              </p>
              <p className="mt-4 max-w-2xl text-sm leading-6 text-slate-500">
                Turn transcripts into claim maps, contradiction risk, witness profiles,
                CourtShadow vectors, and cross-examination targets in one review surface.
              </p>
              <div className="mt-8 flex flex-wrap gap-3">
                <Button size="lg">
                  Analyze Transcript
                  <ArrowRight className="size-4" />
                </Button>
                <Button variant="secondary" size="lg">
                  View Sample Case
                </Button>
              </div>
            </div>
          </motion.section>

          <section id="overview" className="mt-4 grid gap-4 xl:grid-cols-[1.2fr_0.8fr]">
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <CardTitle>Analysis Workspace</CardTitle>
                    <CardDescription>Upload PDFs or paste transcript text for review</CardDescription>
                  </div>
                  <Badge variant="green">
                    <CheckCircle2 className="mr-1 size-3" />
                    Ready
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:grid-cols-2">
                  <div className="rounded-xl border border-dashed border-sky-300/25 bg-sky-300/[0.04] p-5">
                    <UploadCloud className="size-8 text-sky-200" />
                    <div className="mt-4 font-medium text-white">Upload deposition PDF</div>
                    <p className="mt-2 text-sm leading-6 text-slate-400">
                      OCR-ready transcript extraction with citation-aware review output.
                    </p>
                    <Button variant="secondary" className="mt-4">
                      <FileUp className="size-4" />
                      Select PDF
                    </Button>
                  </div>
                  <div>
                    <Textarea
                      placeholder="Paste deposition transcript text here..."
                      className="h-full min-h-48 resize-none"
                      defaultValue={sampleTranscript}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Deposition Intelligence Summary</CardTitle>
                <CardDescription>30-second executive readout</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-start gap-3 rounded-xl border border-amber-300/20 bg-amber-300/10 p-4">
                  <ShieldAlert className="mt-0.5 size-5 text-amber-200" />
                  <div>
                    <div className="font-medium text-white">
                      {intelligenceSummary.contradictionRisk}
                    </div>
                    <p className="mt-1 text-sm leading-6 text-slate-400">
                      {intelligenceSummary.body}
                    </p>
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-3 text-sm">
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-slate-500">Dominant topics</div>
                    <div className="mt-1 text-white">{intelligenceSummary.dominantTopics}</div>
                  </div>
                  <div className="rounded-lg border border-white/10 bg-white/[0.04] p-3">
                    <div className="text-slate-500">Attorney attention</div>
                    <div className="mt-1 text-white">{intelligenceSummary.attorneyAttention}</div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </section>

          <section className="mt-4 grid gap-4 md:grid-cols-2 xl:grid-cols-4">
            {depositionMetrics.map((metric, index) => (
              <MetricCard
                key={metric.label}
                {...metric}
                icon={metricIcons[index]}
              />
            ))}
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1.25fr_0.75fr]">
            <ClaimTable claims={claims} />
            <WitnessProfile {...witnessProfile} />
          </section>

          <section id="contradictions" className="mt-4 grid gap-4 xl:grid-cols-2">
            {contradictions.map((contradiction) => (
              <ContradictionCard key={contradiction.title} {...contradiction} />
            ))}
          </section>

          <section id="cross-examination" className="mt-4 grid gap-4 xl:grid-cols-3">
            {strategyCards.map((card) => (
              <Card key={card.title} className="p-5 transition hover:-translate-y-0.5 hover:border-sky-300/20">
                <div className="text-sm font-medium text-white">{card.title}</div>
                <p className="mt-3 text-sm leading-6 text-slate-400">{card.body}</p>
              </Card>
            ))}
          </section>

          <section className="mt-4 grid gap-4 xl:grid-cols-[1fr_0.8fr]">
            <CourtShadowPanel />
            <ReportPanel />
          </section>
        </section>
      </div>
    </main>
  );
}
