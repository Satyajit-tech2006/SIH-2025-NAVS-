import * as React from "react";
import { Slot } from "@radix-ui/react-slot";
import { cva, type VariantProps } from "class-variance-authority";

import { cn } from "@/lib/utils";

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-lg text-sm font-medium transition-all duration-300 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 active:scale-[0.98] hover:translate-y-[-1px]",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary-hover shadow-elegant hover:shadow-floating",
        destructive: "bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-elegant hover:shadow-floating",
        outline: "border border-border-light bg-background hover:bg-accent hover:text-accent-foreground shadow-elegant hover:shadow-card",
        secondary: "bg-secondary text-secondary-foreground hover:bg-secondary/80 shadow-elegant hover:shadow-card",
        ghost: "hover:bg-accent hover:text-accent-foreground transition-colors duration-200",
        link: "text-primary underline-offset-4 hover:underline transition-colors duration-200",
        hero: "bg-gradient-hero text-white hover:shadow-verification transform hover:scale-[1.02] transition-all duration-300 font-semibold",
        success: "bg-success text-success-foreground hover:bg-success/90 shadow-elegant hover:shadow-floating",
        warning: "bg-warning text-warning-foreground hover:bg-warning/90 shadow-elegant hover:shadow-floating",
        verify: "bg-trust-green text-white hover:bg-trust-green-700 shadow-verification hover:shadow-floating font-semibold",
        gov: "bg-gov-blue text-white hover:bg-gov-blue-600 shadow-elegant hover:shadow-floating border border-gov-blue/20",
        premium: "bg-gradient-primary text-white hover:shadow-floating transform hover:scale-[1.02] transition-all duration-300 font-semibold",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3 text-xs",
        lg: "h-12 rounded-lg px-8 text-base",
        xl: "h-14 rounded-xl px-10 text-lg",
        icon: "h-10 w-10",
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
    return <Comp className={cn(buttonVariants({ variant, size, className }))} ref={ref} {...props} />;
  },
);
Button.displayName = "Button";

export { Button, buttonVariants };
