import * as React from "react";
import { Slot } from "@radix-ui/react-slot";

type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  asChild?: boolean;
  variant?: "default" | "secondary" | "outline" | "ghost";
};

function classesFor(variant: ButtonProps["variant"]) {
  const base =
    "inline-flex items-center justify-center gap-2 rounded-xl px-4 py-2 text-sm font-semibold " +
    "transition focus:outline-none focus:ring-2 focus:ring-black/20 disabled:opacity-50 disabled:pointer-events-none";

  const variants: Record<string, string> = {
    default: "bg-black text-white hover:opacity-90",
    secondary: "bg-black/5 text-black hover:bg-black/10 border border-black/10",
    outline: "bg-transparent text-black border border-black/20 hover:bg-black/5",
    ghost: "bg-transparent text-black hover:bg-black/5",
  };

  return `${base} ${variants[variant || "default"]}`;
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ asChild, variant = "default", className = "", ...props }, ref) => {
    const Comp: any = asChild ? Slot : "button";
    return <Comp ref={ref} className={`${classesFor(variant)} ${className}`} {...props} />;
  }
);

Button.displayName = "Button";
