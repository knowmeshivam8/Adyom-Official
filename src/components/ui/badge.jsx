import * as React from "react"
import { cn } from "@/lib/utils"

const Badge = React.forwardRef(({ className, variant, ...props }, ref) => {
    const variants = {
        default: "bg-heritage-terracotta text-heritage-cream",
        gold: "bg-heritage-gold text-heritage-terracottaDark",
        outline: "border border-heritage-terracotta text-heritage-terracottaDark",
        outlineGold: "border border-heritage-gold text-heritage-gold",
        secondary: "bg-heritage-creamDark text-heritage-brown",
        success: "bg-green-100 text-green-800 border-green-200",
        warning: "bg-yellow-100 text-yellow-800 border-yellow-200",
        danger: "bg-red-100 text-red-800 border-red-200",
        info: "bg-blue-100 text-blue-800 border-blue-200",
    }

    return (
        <div
            ref={ref}
            className={cn(
                "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-body font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-heritage-gold focus:ring-offset-2",
                variants[variant || "default"],
                className
            )}
            {...props}
        />
    )
})
Badge.displayName = "Badge"

export { Badge }