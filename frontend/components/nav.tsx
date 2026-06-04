"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const links = [
  { label: "Product", href: "/product" },
  { label: "Security", href: "/security" },
  { label: "Evidence Review", href: "/evidence-review" },
  { label: "Demo", href: "/demo" },
];

export function Nav() {
  const pathname = usePathname();

  return (
    <header className="fixed inset-x-0 top-0 z-50 border-b border-white/[0.08] bg-[#070A0F]/88 backdrop-blur-xl">
      <div className="mx-auto flex h-14 w-full max-w-7xl items-center justify-between px-4">
        <Link href="/" className="flex items-center gap-3">
          <img
            src="/brand/depositioniq-favicon.svg"
            alt=""
            className="size-8 rounded-lg"
          />
          <span className="text-sm font-medium text-white">DepositionIQ</span>
        </Link>
        <nav className="hidden items-center gap-7 md:flex">
          {links.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "group relative py-2 text-xs font-medium text-slate-500 transition hover:text-slate-200",
                pathname === link.href && "text-slate-100",
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute inset-x-0 -bottom-0.5 h-px origin-left scale-x-0 bg-slate-300/70 transition-transform duration-300 group-hover:scale-x-100",
                  pathname === link.href && "scale-x-100",
                )}
              />
            </Link>
          ))}
        </nav>
        <Button asChild size="sm" className="group text-xs">
          <Link href="/demo">
            <span>Analyze transcript</span>
          </Link>
        </Button>
      </div>
    </header>
  );
}
