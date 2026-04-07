import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cn } from "@/lib/utils";

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement> {
  asChild?: boolean;
  size?: "sm" | "md" | "lg";
  variant?: "primary" | "outline" | "ghost" | "danger" | "default";
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  (
    { className, asChild = false, size = "md", variant = "default", ...props },
    ref
  ) => {
    const Comp = asChild ? Slot : "button";

    return (
      <Comp
        ref={ref}
        className={cn(
          "inline-flex items-center justify-center rounded-md font-medium transition-all duration-200 active:scale-95 disabled:opacity-50 disabled:pointer-events-none",
          
          // Variant Styles
          variant === "primary" && "bg-zinc-900 text-white hover:bg-zinc-800 shadow-sm",
          variant === "outline" && "border border-zinc-200 bg-white text-zinc-900 hover:bg-zinc-50",
          variant === "ghost" && "bg-transparent hover:bg-zinc-100 text-zinc-600",
          variant === "danger" && "bg-rose-500 text-white hover:bg-rose-600 shadow-sm",
          variant === "default" && "bg-zinc-100 text-zinc-900 hover:bg-zinc-200",

          // Size Styles
          size === "sm" && "px-3 py-1.5 text-xs",
          size === "md" && "px-4 py-2.5 text-sm",
          size === "lg" && "px-6 py-3 text-base",
          
          className
        )}
        {...props}
      />
    );
  }
);

Button.displayName = "Button";
export { Button };
