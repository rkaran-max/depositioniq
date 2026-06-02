import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md border text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50",
  {
    variants: {
      variant: {
        default:
          "border-cyan-300/35 bg-cyan-300 text-slate-950 shadow-[inset_0_1px_0_rgba(255,255,255,0.35),0_0_28px_rgba(34,211,238,0.18)] hover:border-cyan-100 hover:bg-cyan-200 hover:shadow-[inset_0_1px_0_rgba(255,255,255,0.45),0_0_36px_rgba(34,211,238,0.24)]",
        secondary:
          "border-white/12 bg-white/[0.035] text-slate-100 shadow-[inset_0_1px_0_rgba(255,255,255,0.06)] hover:border-cyan-300/35 hover:bg-cyan-300/[0.06] hover:text-white",
        ghost: "border-transparent text-slate-300 hover:border-white/10 hover:bg-white/5 hover:text-white",
      },
      size: {
        default: "h-10 px-4",
        sm: "h-8 px-3 text-xs",
        lg: "h-11 px-5 text-sm",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button";
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
