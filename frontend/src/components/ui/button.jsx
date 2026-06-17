import * as React from "react"
import { cn } from "@/lib/utils"

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const variants = {
        default: "bg-primary text-white hover:opacity-90 shadow-sm transition-all",
        secondary: "border border-primary text-primary hover:bg-primary/5 transition-all",
        gold: "bg-heritage-gold text-heritage-terracottaDark hover:bg-heritage-goldLight shadow-sm",
        outline: "border border-primary text-primary hover:bg-primary hover:text-white transition-all",
        outlineGold: "border border-heritage-gold text-heritage-gold hover:bg-heritage-gold hover:text-heritage-terracottaDark",
        ghost: "text-primary hover:bg-surface hover:text-text-main",
        ghostGold: "text-heritage-gold hover:bg-heritage-cream",
        link: "text-primary underline-offset-4 hover:underline",
        destructive: "bg-red-600 text-white hover:bg-red-700",
    }

    const sizes = {
        default: "h-10 px-4 py-2",
        sm: "h-9 px-3",
        lg: "h-11 px-8",
        xl: "h-12 px-10 text-base",
        icon: "h-10 w-10",
    }

    return (
        <button
            className={cn(
                "inline-flex items-center justify-center whitespace-nowrap rounded-sm font-sans font-medium transition-all duration-200 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
                variants[variant || "default"],
                sizes[size || "default"],
                className
            )}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button }