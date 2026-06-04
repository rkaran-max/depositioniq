"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import * as THREE from "three";
import {
  ArrowRight,
  CheckCircle2,
  FileArchive,
  FileCheck2,
  FileText,
  Link2,
  MessageSquareQuote,
  SearchCheck,
  ShieldAlert,
  UploadCloud,
} from "lucide-react";
import { Button } from "@/components/ui/button";

const workflowSteps = [
  {
    label: "Transcript",
    title: "Source testimony",
    detail: "Gates Dep. 589:4-15",
  },
  {
    label: "Claims",
    title: "Citation-backed claims",
    detail: "4 extracted issues",
  },
  {
    label: "Review",
    title: "Contradiction review",
    detail: "2 attorney priorities",
  },
  {
    label: "Strategy",
    title: "Cross-exam plan",
    detail: "Questions and objectives",
  },
];

const evidenceRows = [
  {
    citation: "Gates Dep. 589:4-15",
    text: "I delete most incoming e-mails after reading them.",
    result: "Email retention claim",
  },
  {
    citation: "Gates Dep. 589:20-25",
    text: "I don't recall any specific message relating to DR DOS.",
    result: "Memory limitation",
  },
  {
    citation: "Gates Dep. 590:11-22",
    text: "I don't preserve messages that I send unless I copy myself.",
    result: "Preservation scope",
  },
];

type NetworkTone = "evidence" | "risk" | "verified" | "workflow";

type NetworkNode = {
  label: string;
  tone: NetworkTone;
  position: [number, number, number];
};

const networkColors: Record<NetworkTone, number> = {
  evidence: 0x5eead4,
  risk: 0xfbbf24,
  verified: 0x86efac,
  workflow: 0xa78bfa,
};

const networkNodes: NetworkNode[] = [
  { label: "Transcript", tone: "evidence", position: [-2.8, 1.25, 0.1] },
  { label: "Audio", tone: "workflow", position: [-3.5, 2.25, -0.2] },
  { label: "PDF", tone: "evidence", position: [-3.6, 0.25, -0.1] },
  { label: "Claims", tone: "verified", position: [-1.35, 1.05, 0.15] },
  { label: "Claim A", tone: "verified", position: [-0.95, 2.0, -0.1] },
  { label: "Claim B", tone: "verified", position: [-0.45, 0.15, 0.05] },
  { label: "Citations", tone: "evidence", position: [0.25, 1.25, 0.18] },
  { label: "Evidence Trace", tone: "evidence", position: [1.25, 0.55, -0.12] },
  { label: "Preservation Issues", tone: "risk", position: [0.85, -0.7, 0.08] },
  { label: "Contradictions", tone: "risk", position: [2.25, 1.3, 0.15] },
  { label: "Recall Gaps", tone: "risk", position: [2.95, 0.05, -0.1] },
  { label: "Verified Claims", tone: "verified", position: [2.0, 2.25, -0.18] },
  { label: "Cross-Exam Strategy", tone: "workflow", position: [3.65, 1.15, 0.05] },
  { label: "Follow-Up Questions", tone: "workflow", position: [4.15, -0.15, -0.12] },
  { label: "Attorney Review", tone: "verified", position: [3.25, -1.15, 0.12] },
  { label: "Report Export", tone: "verified", position: [1.55, -1.65, -0.08] },
  { label: "Risk Memo", tone: "risk", position: [0.0, -1.65, 0.04] },
  { label: "Citation Bundle", tone: "evidence", position: [-1.55, -1.05, -0.16] },
];

const networkEdges: Array<[number, number]> = [
  [1, 0],
  [2, 0],
  [0, 3],
  [3, 4],
  [3, 5],
  [3, 6],
  [6, 7],
  [7, 8],
  [5, 8],
  [6, 9],
  [8, 9],
  [9, 10],
  [4, 11],
  [9, 12],
  [10, 12],
  [12, 13],
  [13, 14],
  [14, 15],
  [8, 16],
  [16, 15],
  [7, 17],
  [17, 15],
];

const ribbonItems = [
  { label: "Transcript", icon: FileText, color: "text-slate-300" },
  { label: "Audio", icon: UploadCloud, color: "text-blue-300" },
  { label: "PDF", icon: FileArchive, color: "text-cyan-300" },
  { label: "Claims", icon: SearchCheck, color: "text-sky-300" },
  { label: "Evidence", icon: Link2, color: "text-cyan-300" },
  { label: "Citations", icon: Link2, color: "text-cyan-300" },
  { label: "Contradictions", icon: ShieldAlert, color: "text-amber-300" },
  { label: "Recall Gaps", icon: MessageSquareQuote, color: "text-amber-300" },
  { label: "Cross-Exam", icon: MessageSquareQuote, color: "text-violet-300" },
  { label: "Report", icon: FileCheck2, color: "text-emerald-300" },
  { label: "Attorney Review", icon: CheckCircle2, color: "text-emerald-300" },
];

function WorkflowRibbon() {
  const doubled = [...ribbonItems, ...ribbonItems];

  return (
    <div className="relative z-10 mx-auto -mt-14 mb-16 hidden max-w-7xl overflow-hidden rounded-xl border border-white/10 bg-[#0B0F17]/82 p-2 shadow-[0_18px_70px_rgba(0,0,0,0.30)] backdrop-blur-md lg:block">
      <div className="marquee-track flex w-max gap-2">
        {doubled.map((item, index) => {
          const Icon = item.icon;
          return (
            <div
              key={`${item.label}-${index}`}
              className="flex items-center gap-2 rounded-md border border-white/10 bg-[#070A0F]/88 px-4 py-2 text-xs text-slate-300"
            >
              <Icon className={`size-3.5 ${item.color}`} />
              {item.label}
            </div>
          );
        })}
      </div>
    </div>
  );
}

function createLabelTexture(label: string, color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 384;
  canvas.height = 96;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  context.font = "500 28px Inter, ui-sans-serif, system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgba(7,10,15,0.58)";
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = color;
  context.globalAlpha = 0.34;
  context.strokeRect(12, 18, canvas.width - 24, canvas.height - 36);
  context.globalAlpha = 1;
  context.fillStyle = "rgba(226,232,240,0.82)";
  context.fillText(label, canvas.width / 2, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function ThreeEvidenceNetwork() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(42, 1, 0.1, 100);
    camera.position.set(0.9, 0.2, 8.4);
    camera.lookAt(0.7, 0.2, 0);

    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const networkGroup = new THREE.Group();
    networkGroup.position.set(0.9, -0.05, 0);
    scene.add(networkGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const pointLight = new THREE.PointLight(0x60a5fa, 2.2, 14);
    pointLight.position.set(1.6, 1.8, 3.4);
    scene.add(pointLight);

    const nodeGeometry = new THREE.SphereGeometry(0.075, 32, 32);
    const haloGeometry = new THREE.SphereGeometry(0.18, 32, 32);
    const nodes: THREE.Mesh[] = [];
    const halos: THREE.Mesh[] = [];
    const labelSprites: THREE.Sprite[] = [];

    networkNodes.forEach((node) => {
      const color = networkColors[node.tone];
      const material = new THREE.MeshBasicMaterial({ color, transparent: true, opacity: 0.95 });
      const haloMaterial = new THREE.MeshBasicMaterial({
        color,
        transparent: true,
        opacity: 0.13,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });

      const mesh = new THREE.Mesh(nodeGeometry, material);
      const halo = new THREE.Mesh(haloGeometry, haloMaterial);
      mesh.position.set(...node.position);
      halo.position.copy(mesh.position);
      networkGroup.add(mesh, halo);
      nodes.push(mesh);
      halos.push(halo);

      const labelMaterial = new THREE.SpriteMaterial({
        map: createLabelTexture(node.label, `#${color.toString(16).padStart(6, "0")}`),
        transparent: true,
        opacity: 0.62,
        depthWrite: false,
      });
      const label = new THREE.Sprite(labelMaterial);
      label.position.set(node.position[0], node.position[1] - 0.27, node.position[2]);
      label.scale.set(0.86, 0.22, 1);
      networkGroup.add(label);
      labelSprites.push(label);
    });

    const lineMaterials: THREE.LineBasicMaterial[] = [];
    networkEdges.forEach(([from, to]) => {
      const start = new THREE.Vector3(...networkNodes[from].position);
      const end = new THREE.Vector3(...networkNodes[to].position);
      const color =
        networkNodes[from].tone === "risk" || networkNodes[to].tone === "risk"
          ? networkColors.risk
          : networkNodes[from].tone === "verified" || networkNodes[to].tone === "verified"
            ? networkColors.verified
            : networkColors.evidence;

      const geometry = new THREE.BufferGeometry().setFromPoints([start, end]);
      const material = new THREE.LineBasicMaterial({
        color,
        transparent: true,
        opacity: 0.18,
        blending: THREE.AdditiveBlending,
      });
      networkGroup.add(new THREE.Line(geometry, material));
      lineMaterials.push(material);
    });

    const pulseGeometry = new THREE.SphereGeometry(0.045, 18, 18);
    const pulses = networkEdges.slice(0, 10).map(([from, to], index) => {
      const tone =
        networkNodes[from].tone === "risk" || networkNodes[to].tone === "risk"
          ? "risk"
          : networkNodes[from].tone === "verified" || networkNodes[to].tone === "verified"
            ? "verified"
            : "evidence";
      const material = new THREE.MeshBasicMaterial({
        color: networkColors[tone],
        transparent: true,
        opacity: 0.85,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const pulse = new THREE.Mesh(pulseGeometry, material);
      networkGroup.add(pulse);
      return {
        pulse,
        from: new THREE.Vector3(...networkNodes[from].position),
        to: new THREE.Vector3(...networkNodes[to].position),
        offset: index / 10,
      };
    });

    const resize = () => {
      const width = mount.clientWidth;
      const height = mount.clientHeight;
      renderer.setSize(width, height, false);
      camera.aspect = width / Math.max(height, 1);
      camera.updateProjectionMatrix();
    };

    resize();
    const resizeObserver = new ResizeObserver(resize);
    resizeObserver.observe(mount);

    let frameId = 0;
    const clock = new THREE.Clock();

    const animate = () => {
      const elapsed = clock.getElapsedTime();
      networkGroup.rotation.y = Math.sin(elapsed * 0.13) * 0.08 - 0.14;
      networkGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.035;

      nodes.forEach((node, index) => {
        node.scale.setScalar(1 + Math.sin(elapsed * 1.2 + index * 0.65) * 0.18);
      });

      halos.forEach((halo, index) => {
        halo.scale.setScalar(1 + Math.sin(elapsed * 0.9 + index * 0.4) * 0.24);
        (halo.material as THREE.MeshBasicMaterial).opacity = 0.1 + Math.sin(elapsed * 0.75 + index) * 0.035;
      });

      lineMaterials.forEach((material, index) => {
        material.opacity = 0.14 + Math.sin(elapsed * 0.9 + index * 0.28) * 0.055;
      });

      labelSprites.forEach((label, index) => {
        label.material.opacity = 0.52 + Math.sin(elapsed * 0.5 + index * 0.24) * 0.08;
      });

      pulses.forEach(({ pulse, from, to, offset }, index) => {
        const t = (elapsed * 0.105 + offset) % 1;
        pulse.position.lerpVectors(from, to, t);
        (pulse.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * (index % 3 === 0 ? 0.95 : 0.68);
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      nodeGeometry.dispose();
      haloGeometry.dispose();
      pulseGeometry.dispose();
      scene.traverse((object) => {
        if (object instanceof THREE.Line) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          if (Array.isArray(object.material)) {
            object.material.forEach((material) => material.dispose());
          } else {
            object.material.dispose();
          }
        }
        if (object instanceof THREE.Sprite) {
          object.material.map?.dispose();
          object.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, []);

  return <div ref={mountRef} className="absolute inset-0" />;
}

function EvidenceSurface() {
  return (
    <div aria-hidden="true" className="pointer-events-none absolute inset-0 overflow-hidden">
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_73%_16%,rgba(56,189,248,0.18),transparent_29rem),radial-gradient(circle_at_82%_61%,rgba(251,191,36,0.10),transparent_24rem),linear-gradient(180deg,#070A0F_0%,#05070B_78%,#070A0F_100%)]" />
      <div className="pointer-events-none absolute inset-y-0 right-[-8%] w-[78%] opacity-95">
        <ThreeEvidenceNetwork />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[68%] bg-[linear-gradient(90deg,#070A0F_0%,rgba(7,10,15,0.99)_45%,rgba(7,10,15,0.88)_70%,rgba(7,10,15,0.35)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_36%,rgba(0,0,0,0.58),transparent_31rem)]" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#070A0F] to-transparent" />
    </div>
  );
}

export function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-white/10 bg-[#070A0F] px-4 pt-24">
      <EvidenceSurface />

      <div className="relative z-10 mx-auto grid min-h-[calc(100vh-4rem)] w-full max-w-7xl items-center gap-12 pb-24 pt-20 lg:grid-cols-[minmax(0,0.88fr)_minmax(500px,1fr)]">
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: "easeOut" }}
          className="max-w-3xl rounded-2xl border border-white/[0.07] bg-[#070A0F]/72 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.32)] backdrop-blur-sm md:p-7"
        >
          <div className="inline-flex rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400">
            Deposition review workspace
          </div>
          <h1 className="mt-7 text-balance text-left font-serif text-5xl font-normal leading-[1.02] tracking-tight text-white md:text-7xl">
            Find contradictions before opposing counsel does.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-400 md:text-lg">
            DepositionIQ turns transcript testimony into citation-backed claims,
            contradiction review, and cross-examination strategy.
          </p>
          <div className="mt-9 flex flex-wrap gap-3">
            <Button asChild size="lg" className="group min-w-0">
              <Link href="/demo">
                <span>Analyze Transcript</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg" className="group min-w-0">
              <Link href="/evidence-review">
                <span>Review Evidence</span>
                <ArrowRight className="size-3.5 transition-transform group-hover:translate-x-0.5" />
              </Link>
            </Button>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.65, delay: 0.08, ease: "easeOut" }}
          className="rounded-xl border border-white/10 bg-[#0B0F17]/90 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.42)] backdrop-blur-md"
        >
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-xs text-slate-500">Review packet</div>
              <div className="mt-1 text-sm font-medium text-white">
                Deposition analysis workflow
              </div>
            </div>
            <div className="rounded-md border border-emerald-300/15 bg-emerald-300/10 px-2.5 py-1 text-xs text-emerald-200">
              Ready
            </div>
          </div>

          <div className="grid gap-3 sm:grid-cols-4">
            {workflowSteps.map((step, index) => (
              <div key={step.label} className="group rounded-md border border-white/10 bg-[#070A0F]/90 p-3 transition hover:border-slate-200/20 hover:bg-[#0D131D]">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                  <CheckCircle2 className="size-3.5 text-emerald-300/80 transition group-hover:text-emerald-200" />
                </div>
                <div className="mt-4 text-xs text-slate-500">{step.label}</div>
                <div className="mt-1 text-sm text-white">{step.title}</div>
                <div className="mt-2 text-xs leading-5 text-slate-500">{step.detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-[#070A0F]/92 p-4">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
              <FileText className="size-4 text-slate-400" />
              Transcript Evidence
            </div>
            <div className="space-y-3">
              {evidenceRows.map((row) => (
                <div key={row.citation} className="group grid gap-3 rounded-md border border-white/10 bg-[#0B0F17] p-3 transition hover:border-slate-200/20 hover:bg-[#101722] md:grid-cols-[132px_1fr_150px]">
                  <div className="font-mono text-[10px] text-sky-300">{row.citation}</div>
                  <div className="text-xs leading-5 text-slate-300">{row.text}</div>
                  <div className="rounded-md border border-white/10 bg-white/[0.025] px-2 py-1 text-[11px] text-slate-400 transition group-hover:border-sky-200/20 group-hover:text-slate-200">
                    {row.result}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-amber-300/15 bg-amber-300/[0.04] p-4">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-4 text-amber-200" />
              <div>
                <div className="text-sm font-medium text-white">
                  Contradiction Review Prioritized
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-400">
                  Evidence excerpts, citation chips, and follow-up questions stay
                  adjacent so reviewers can test each issue quickly.
                </p>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      <WorkflowRibbon />
    </section>
  );
}
