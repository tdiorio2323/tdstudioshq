import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0",
  {
    variants: {
      variant: {
        default: "bg-primary text-primary-foreground hover:bg-primary/90",
        destructive:
          "bg-destructive text-destructive-foreground hover:bg-destructive/90",
        outline:
          "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
        secondary:
          "bg-secondary text-secondary-foreground hover:bg-secondary/80",
        ghost: "hover:bg-accent hover:text-accent-foreground",
        link: "text-primary underline-offset-4 hover:underline",
        chrome: "bg-gradient-to-br from-gray-300 via-gray-100 to-gray-300 text-gray-800 hover:from-gray-400 hover:via-gray-200 hover:to-gray-400 shadow-md border border-gray-200/50",
        platinum: "bg-gradient-to-br from-slate-400 via-slate-200 to-slate-400 text-slate-800 hover:from-slate-500 hover:via-slate-300 hover:to-slate-500 shadow-md border border-slate-300/50",
        gold: "bg-gradient-to-br from-yellow-400 via-yellow-200 to-yellow-400 text-yellow-900 hover:from-yellow-500 hover:via-yellow-300 hover:to-yellow-500 shadow-md border border-yellow-300/50",
        emerald: "bg-gradient-to-br from-emerald-400 via-emerald-200 to-emerald-400 text-emerald-900 hover:from-emerald-500 hover:via-emerald-300 hover:to-emerald-500 shadow-md border border-emerald-300/50",
      },
      size: {
        default: "h-10 px-4 py-2",
        sm: "h-9 rounded-md px-3",
        lg: "h-11 rounded-md px-8",
        icon: "h-10 w-10",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        {...props}
      />
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
