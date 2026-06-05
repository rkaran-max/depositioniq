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
  showLabel?: boolean;
  subtle?: boolean;
};

const networkColors: Record<NetworkTone, number> = {
  evidence: 0x67e8f9,
  risk: 0xf0a3b8,
  verified: 0xc4b5fd,
  workflow: 0x93c5fd,
};

const networkNodes: NetworkNode[] = [
  { label: "Transcript", tone: "evidence", position: [-3.7, 2.62, 0.08], showLabel: true },
  { label: "Audio", tone: "workflow", position: [-5.15, 2.82, -0.18] },
  { label: "PDF", tone: "evidence", position: [-4.95, -2.08, -0.1] },
  { label: "Claims", tone: "verified", position: [-2.15, 2.72, 0.14], showLabel: true },
  { label: "Claim A", tone: "verified", position: [-0.85, 2.5, -0.1] },
  { label: "Claim B", tone: "verified", position: [-2.65, -2.25, 0.04] },
  { label: "Evidence", tone: "evidence", position: [0.22, 0.32, 0.18], showLabel: true, subtle: true },
  { label: "Citation Bundle", tone: "evidence", position: [-0.95, -2.18, -0.16] },
  { label: "Preservation Issues", tone: "risk", position: [0.5, -2.32, 0.08] },
  { label: "Contradictions", tone: "risk", position: [0.2, 1.1, 0.15], showLabel: true, subtle: true },
  { label: "Recall Gaps", tone: "risk", position: [0.22, -0.65, -0.1], showLabel: true, subtle: true },
  { label: "Verified Claims", tone: "verified", position: [0.35, 2.78, -0.18] },
  { label: "Cross-Exam", tone: "workflow", position: [2.05, 2.66, 0.05], showLabel: true },
  { label: "Follow-Up Questions", tone: "workflow", position: [5.15, 1.55, -0.12] },
  { label: "Attorney Review", tone: "verified", position: [5.2, 0.12, 0.12], showLabel: true },
  { label: "Report", tone: "verified", position: [5.0, -1.72, -0.08], showLabel: true },
  { label: "Risk Memo", tone: "risk", position: [0.85, -2.36, 0.04] },
  { label: "Citation Index", tone: "evidence", position: [0.18, -1.35, -0.16], subtle: true },
];

const networkEdges: Array<[number, number]> = [
  [1, 0],
  [0, 3],
  [3, 4],
  [4, 11],
  [11, 12],
  [12, 13],
  [13, 14],
  [14, 15],
  [2, 5],
  [5, 7],
  [7, 8],
  [8, 16],
  [16, 15],
];

const pulseRoutes: Array<{
  tone: NetworkTone;
  points: Array<[number, number, number]>;
}> = [
  {
    tone: "evidence",
    points: [
      [-5.15, 2.82, -0.18],
      [-3.7, 2.62, 0.08],
      [-2.15, 2.72, 0.14],
      [-0.85, 2.5, -0.1],
      [0.35, 2.78, -0.18],
      [2.05, 2.66, 0.05],
      [4.85, 2.44, 0.08],
      [5.2, 0.12, 0.12],
    ],
  },
  {
    tone: "risk",
    points: [
      [-4.95, -2.08, -0.1],
      [-2.65, -2.25, 0.04],
      [-0.95, -2.18, -0.16],
      [0.5, -2.32, 0.08],
      [0.85, -2.36, 0.04],
      [5.0, -1.72, -0.08],
    ],
  },
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
  canvas.width = 512;
  canvas.height = 128;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  context.clearRect(0, 0, canvas.width, canvas.height);
  const radius = 26;
  const x = 28;
  const y = 26;
  const width = canvas.width - 56;
  const height = canvas.height - 52;

  context.beginPath();
  context.moveTo(x + radius, y);
  context.lineTo(x + width - radius, y);
  context.quadraticCurveTo(x + width, y, x + width, y + radius);
  context.lineTo(x + width, y + height - radius);
  context.quadraticCurveTo(x + width, y + height, x + width - radius, y + height);
  context.lineTo(x + radius, y + height);
  context.quadraticCurveTo(x, y + height, x, y + height - radius);
  context.lineTo(x, y + radius);
  context.quadraticCurveTo(x, y, x + radius, y);
  context.closePath();

  context.fillStyle = "rgba(7,10,15,0.66)";
  context.fill();
  context.strokeStyle = "rgba(226,232,240,0.10)";
  context.lineWidth = 2;
  context.stroke();

  context.fillStyle = color;
  context.globalAlpha = 0.82;
  context.fillRect(x + 18, y + 22, 4, height - 44);
  context.globalAlpha = 1;

  context.font = "600 23px Inter, ui-sans-serif, system-ui, sans-serif";
  context.textAlign = "center";
  context.textBaseline = "middle";
  context.fillStyle = "rgba(241,245,249,0.78)";
  context.fillText(label, canvas.width / 2 + 8, canvas.height / 2);

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function createNodeTexture(color: string) {
  const canvas = document.createElement("canvas");
  canvas.width = 160;
  canvas.height = 160;
  const context = canvas.getContext("2d");

  if (!context) {
    return new THREE.CanvasTexture(canvas);
  }

  const center = canvas.width / 2;
  const gradient = context.createRadialGradient(center, center, 4, center, center, 58);
  gradient.addColorStop(0, "rgba(255,255,255,0.78)");
  gradient.addColorStop(0.2, color.replace("1)", "0.78)"));
  gradient.addColorStop(0.42, color.replace("1)", "0.36)"));
  gradient.addColorStop(0.72, color.replace("1)", "0.10)"));
  gradient.addColorStop(1, "rgba(0,0,0,0)");

  context.fillStyle = gradient;
  context.fillRect(0, 0, canvas.width, canvas.height);
  context.strokeStyle = "rgba(255,255,255,0.24)";
  context.lineWidth = 1.5;
  context.beginPath();
  context.arc(center, center, 17, 0, Math.PI * 2);
  context.stroke();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  return texture;
}

function colorToRgba(color: number, alpha = 1) {
  const threeColor = new THREE.Color(color);
  return `rgba(${Math.round(threeColor.r * 255)},${Math.round(threeColor.g * 255)},${Math.round(threeColor.b * 255)},${alpha})`;
}

function sampleRoute(points: THREE.Vector3[], t: number) {
  if (points.length === 0) {
    return new THREE.Vector3();
  }

  if (points.length === 1) {
    return points[0].clone();
  }

  const segmentLengths = points.slice(0, -1).map((point, index) => point.distanceTo(points[index + 1]));
  const routeLength = segmentLengths.reduce((total, length) => total + length, 0);
  let distance = ((t % 1) + 1) % 1 * routeLength;

  for (let index = 0; index < segmentLengths.length; index += 1) {
    const segmentLength = segmentLengths[index];

    if (distance <= segmentLength) {
      return new THREE.Vector3().lerpVectors(points[index], points[index + 1], distance / Math.max(segmentLength, 0.001));
    }

    distance -= segmentLength;
  }

  return points[points.length - 1].clone();
}

function ThreeEvidenceNetwork() {
  const mountRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    const mount = mountRef.current;

    if (!mount) {
      return;
    }

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(39, 1, 0.1, 100);
    camera.position.set(0.0, 0.08, 8.85);
    camera.lookAt(0.0, 0.15, 0);

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    } catch {
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);

    const networkGroup = new THREE.Group();
    networkGroup.position.set(0.0, -0.02, 0);
    scene.add(networkGroup);

    scene.add(new THREE.AmbientLight(0xffffff, 0.55));

    const pointLight = new THREE.PointLight(0x60a5fa, 2.2, 14);
    pointLight.position.set(1.6, 1.8, 3.4);
    scene.add(pointLight);

    const nodes: THREE.Sprite[] = [];
    const halos: THREE.Sprite[] = [];
    const labelSprites: THREE.Sprite[] = [];
    const nodeTextures: THREE.Texture[] = [];

    networkNodes.forEach((node) => {
      const color = networkColors[node.tone];
      const rgba = colorToRgba(color);
      const nodeTexture = createNodeTexture(rgba);
      const nodeScale = node.subtle ? 0.13 : 0.22;
      const haloScale = node.subtle ? 0.24 : 0.42;
      const nodeOpacity = node.subtle ? 0.22 : 0.58;
      const haloOpacity = node.subtle ? 0.035 : 0.08;
      nodeTextures.push(nodeTexture);
      const material = new THREE.SpriteMaterial({
        map: nodeTexture,
        transparent: true,
        opacity: nodeOpacity,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      const haloMaterial = material.clone();
      haloMaterial.opacity = haloOpacity;

      const nodeSprite = new THREE.Sprite(material);
      const halo = new THREE.Sprite(haloMaterial);
      nodeSprite.position.set(...node.position);
      halo.position.copy(nodeSprite.position);
      nodeSprite.scale.set(nodeScale, nodeScale, 1);
      halo.scale.set(haloScale, haloScale, 1);
      nodeSprite.userData.baseScale = nodeScale;
      halo.userData.baseScale = haloScale;
      halo.userData.baseOpacity = haloOpacity;
      networkGroup.add(halo, nodeSprite);
      nodes.push(nodeSprite);
      halos.push(halo);

      if (node.showLabel) {
        const labelMaterial = new THREE.SpriteMaterial({
          map: createLabelTexture(node.label, rgba),
          transparent: true,
          opacity: node.subtle ? 0.22 : 0.34,
          depthWrite: false,
        });
        const label = new THREE.Sprite(labelMaterial);
        label.position.set(node.position[0], node.position[1] - 0.25, node.position[2]);
        label.scale.set(node.subtle ? 0.66 : 0.82, node.subtle ? 0.16 : 0.2, 1);
        networkGroup.add(label);
        labelSprites.push(label);
      }
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
        opacity: 0.068,
        blending: THREE.AdditiveBlending,
      });
      networkGroup.add(new THREE.Line(geometry, material));
      lineMaterials.push(material);
    });

    const pulseGeometry = new THREE.SphereGeometry(0.017, 18, 18);
    const pulses = pulseRoutes.flatMap((route, routeIndex) => {
      const routePoints = route.points.map((point) => new THREE.Vector3(...point));
      const material = new THREE.MeshBasicMaterial({
        color: networkColors[route.tone],
        transparent: true,
        opacity: 0.38,
        blending: THREE.AdditiveBlending,
        depthWrite: false,
      });
      return [0, 0.42].map((offset, pulseIndex) => {
        const pulse = new THREE.Mesh(pulseGeometry, material.clone());
        networkGroup.add(pulse);
        return {
          pulse,
          routePoints,
          offset: offset + routeIndex * 0.18 + pulseIndex * 0.07,
        };
      });
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
      networkGroup.rotation.y = Math.sin(elapsed * 0.13) * 0.06 - 0.08;
      networkGroup.rotation.x = Math.sin(elapsed * 0.1) * 0.035;

      nodes.forEach((node, index) => {
        const baseScale = typeof node.userData.baseScale === "number" ? node.userData.baseScale : 0.22;
        node.scale.setScalar(baseScale * (1 + Math.sin(elapsed * 1.2 + index * 0.65) * 0.12));
      });

      halos.forEach((halo, index) => {
        const baseScale = typeof halo.userData.baseScale === "number" ? halo.userData.baseScale : 0.42;
        const baseOpacity = typeof halo.userData.baseOpacity === "number" ? halo.userData.baseOpacity : 0.18;
        halo.scale.setScalar(baseScale * (1 + Math.sin(elapsed * 0.9 + index * 0.4) * 0.16));
        (halo.material as THREE.SpriteMaterial).opacity = baseOpacity * 0.5 + Math.sin(elapsed * 0.75 + index) * (baseOpacity * 0.13);
      });

      lineMaterials.forEach((material, index) => {
        material.opacity = 0.055 + Math.sin(elapsed * 0.9 + index * 0.28) * 0.014;
      });

      labelSprites.forEach((label, index) => {
        label.material.opacity = 0.25 + Math.sin(elapsed * 0.5 + index * 0.24) * 0.035;
      });

      pulses.forEach(({ pulse, routePoints, offset }, index) => {
        const t = (elapsed * 0.075 + offset) % 1;
        pulse.position.copy(sampleRoute(routePoints, t));
        (pulse.material as THREE.MeshBasicMaterial).opacity = Math.sin(t * Math.PI) * (index % 2 === 0 ? 0.36 : 0.24);
      });

      renderer.render(scene, camera);
      frameId = window.requestAnimationFrame(animate);
    };

    animate();

    return () => {
      window.cancelAnimationFrame(frameId);
      resizeObserver.disconnect();
      mount.removeChild(renderer.domElement);
      pulseGeometry.dispose();
      nodeTextures.forEach((texture) => texture.dispose());
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
      <div className="pointer-events-none absolute inset-y-0 left-[-20%] right-[-10%] opacity-100">
        <ThreeEvidenceNetwork />
      </div>
      <div className="pointer-events-none absolute inset-y-0 left-0 w-[54%] bg-[linear-gradient(90deg,#070A0F_0%,rgba(7,10,15,0.98)_42%,rgba(7,10,15,0.72)_66%,rgba(7,10,15,0.12)_100%)]" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_28%_36%,rgba(0,0,0,0.48),transparent_29rem)]" />
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
          className="max-w-3xl rounded-2xl border border-white/[0.10] bg-[#070A0F]/78 p-5 shadow-[0_24px_90px_rgba(0,0,0,0.36)] backdrop-blur-md md:p-7"
        >
          <div className="inline-flex rounded-md border border-white/10 bg-white/[0.035] px-3 py-1.5 text-xs text-slate-400">
            Deposition review workspace
          </div>
          <h1 className="mt-7 text-balance text-left font-serif text-5xl font-normal leading-[1.02] tracking-tight text-white drop-shadow-[0_2px_28px_rgba(0,0,0,0.85)] md:text-7xl">
            Find contradictions before opposing counsel does.
          </h1>
          <p className="mt-6 max-w-2xl text-base leading-8 text-slate-300 md:text-lg">
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
          className="rounded-xl border border-white/10 bg-[#0B0F17]/72 p-5 shadow-[0_28px_90px_rgba(0,0,0,0.38)] backdrop-blur-md"
        >
          <div className="mb-5 flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <div className="text-xs text-slate-400">Review packet</div>
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
              <div key={step.label} className="group rounded-md border border-white/10 bg-[#070A0F]/72 p-3 backdrop-blur-sm transition hover:border-slate-200/20 hover:bg-[#0D131D]/82">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-[10px] text-slate-500">{String(index + 1).padStart(2, "0")}</span>
                  <CheckCircle2 className="size-3.5 text-emerald-300/80 transition group-hover:text-emerald-200" />
                </div>
                <div className="mt-4 text-xs text-slate-400">{step.label}</div>
                <div className="mt-1 text-sm text-white">{step.title}</div>
                <div className="mt-2 text-xs leading-5 text-slate-400">{step.detail}</div>
              </div>
            ))}
          </div>

          <div className="mt-5 rounded-lg border border-white/10 bg-[#070A0F]/72 p-4 backdrop-blur-sm">
            <div className="mb-3 flex items-center gap-2 text-sm font-medium text-white">
              <FileText className="size-4 text-slate-400" />
              Transcript Evidence
            </div>
            <div className="space-y-3">
              {evidenceRows.map((row) => (
                <div key={row.citation} className="group grid gap-3 rounded-md border border-white/10 bg-[#0B0F17]/72 p-3 backdrop-blur-sm transition hover:border-slate-200/20 hover:bg-[#101722]/84 md:grid-cols-[132px_1fr_150px]">
                  <div className="font-mono text-[10px] text-sky-300">{row.citation}</div>
                  <div className="text-xs leading-5 text-slate-300">{row.text}</div>
                  <div className="rounded-md border border-white/10 bg-white/[0.04] px-2 py-1 text-[11px] text-slate-300 transition group-hover:border-sky-200/20 group-hover:text-slate-100">
                    {row.result}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="mt-5 rounded-lg border border-amber-300/15 bg-[#0B0F17]/72 p-4 backdrop-blur-sm">
            <div className="flex items-start gap-3">
              <ShieldAlert className="mt-0.5 size-4 text-amber-200" />
              <div>
                <div className="text-sm font-medium text-white">
                  Contradiction Review Prioritized
                </div>
                <p className="mt-2 text-xs leading-6 text-slate-300">
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
