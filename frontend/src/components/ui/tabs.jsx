import * as React from "react"
import { cn } from "@/lib/utils"

const Tabs = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("w-full", className)} {...props} />
))
Tabs.displayName = "Tabs"

const TabsList = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "inline-flex h-10 items-center justify-center rounded-md bg-heritage-cream p-1 text-text-main font-body",
            className
        )}
        {...props}
    />
))
TabsList.displayName = "TabsList"

const TabsTrigger = React.forwardRef(({ className, active, ...props }, ref) => (
    <button
        ref={ref}
        className={cn(
            "inline-flex items-center justify-center whitespace-nowrap rounded-sm px-3 py-1.5 text-sm font-medium transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold disabled:pointer-events-none disabled:opacity-50",
            active
                ? "bg-heritage-terracotta text-heritage-cream shadow-sm"
                : "text-text-main hover:bg-heritage-creamDark hover:text-heritage-terracottaDark",
            className
        )}
        {...props}
    />
))
TabsTrigger.displayName = "TabsTrigger"

const TabsContent = React.forwardRef(({ className, active, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "mt-2 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-heritage-gold",
            active ? "block" : "hidden",
            className
        )}
        {...props}
    />
))
TabsContent.displayName = "TabsContent"

export { Tabs, TabsList, TabsTrigger, TabsContent }