import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-1 text-xs font-medium transition-colors",
  {
    variants: {
      variant: {
        default: "border-sky-300/25 bg-sky-300/10 text-sky-200",
        amber: "border-amber-300/25 bg-amber-300/10 text-amber-200",
        red: "border-rose-300/25 bg-rose-300/10 text-rose-200",
        green: "border-emerald-300/25 bg-emerald-300/10 text-emerald-200",
        violet: "border-violet-300/25 bg-violet-300/10 text-violet-200",
        slate: "border-slate-300/15 bg-slate-300/10 text-slate-200",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  },
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return <div className={cn(badgeVariants({ variant }), className)} {...props} />;
}

export { Badge, badgeVariants };
