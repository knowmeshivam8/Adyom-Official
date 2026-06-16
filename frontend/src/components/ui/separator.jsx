import * as React from "react"
import { cn } from "@/lib/utils"

const Separator = React.forwardRef(
    ({ className, orientation = "horizontal", decorative = true, ...props }, ref) => (
        <div
            ref={ref}
            decorative={decorative}
            orientation={orientation}
            className={cn(
                "shrink-0 bg-heritage-gold",
                orientation === "horizontal" ? "h-[2px] w-full" : "h-full w-[2px]",
                className
            )}
            {...props}
        />
    )
)
Separator.displayName = "Separator"

export { Separator }