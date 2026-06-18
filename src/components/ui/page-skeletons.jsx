import { Skeleton } from "@/components/ui/skeleton"

function CardGridSkeleton({ items = 6 }) {
    return (
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="bg-surface rounded-xl shadow-md overflow-hidden border border-heritage-creamDark">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-6 space-y-3">
                        <Skeleton className="h-5 w-3/4" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-5/6" />
                        <div className="flex gap-2 pt-2">
                            <Skeleton className="h-6 w-20 rounded-full" />
                            <Skeleton className="h-6 w-24 rounded-full" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function PostGridSkeleton({ items = 6 }) {
    return (
        <div className="grid gap-8 sm:grid-cols-2 lg:grid-cols-3">
            {Array.from({ length: items }).map((_, i) => (
                <div key={i} className="bg-surface rounded-xl shadow-md overflow-hidden border border-heritage-creamDark">
                    <Skeleton className="h-48 w-full rounded-none" />
                    <div className="p-6 space-y-3">
                        <Skeleton className="h-5 w-5/6" />
                        <Skeleton className="h-4 w-full" />
                        <Skeleton className="h-4 w-4/5" />
                        <div className="flex items-center justify-between pt-2">
                            <Skeleton className="h-4 w-24" />
                            <Skeleton className="h-8 w-24 rounded-sm" />
                        </div>
                    </div>
                </div>
            ))}
        </div>
    )
}

function ProgramDetailSkeleton() {
    return (
        <div className="overflow-hidden">
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="space-y-6">
                        <Skeleton className="h-4 w-28 bg-heritage-creamDark/40" />
                        <div className="flex flex-wrap gap-2">
                            <Skeleton className="h-7 w-28 rounded-full bg-heritage-creamDark/40" />
                            <Skeleton className="h-7 w-40 rounded-full bg-heritage-creamDark/40" />
                        </div>
                        <Skeleton className="h-10 w-3/4 bg-heritage-creamDark/40" />
                        <Skeleton className="h-5 w-5/6 bg-heritage-creamDark/40" />
                        <div className="flex flex-wrap gap-4">
                            <Skeleton className="h-4 w-32 bg-heritage-creamDark/40" />
                            <Skeleton className="h-4 w-28 bg-heritage-creamDark/40" />
                            <Skeleton className="h-4 w-36 bg-heritage-creamDark/40" />
                            <Skeleton className="h-4 w-40 bg-heritage-creamDark/40" />
                        </div>
                        <div className="flex flex-wrap gap-4">
                            <Skeleton className="h-12 w-56 rounded-sm bg-heritage-creamDark/40" />
                            <Skeleton className="h-12 w-40 rounded-sm bg-heritage-creamDark/40" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 bg-heritage-creamLight">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
                    <Skeleton className="h-8 w-56" />
                    <div className="grid gap-6 md:grid-cols-3">
                        {Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-surface rounded-xl shadow-md border border-heritage-creamDark overflow-hidden">
                                <div className="p-6 space-y-3">
                                    <Skeleton className="h-5 w-4/5" />
                                    <Skeleton className="h-4 w-full" />
                                    <Skeleton className="h-4 w-5/6" />
                                    <div className="flex gap-2 pt-2">
                                        <Skeleton className="h-6 w-24 rounded-full" />
                                        <Skeleton className="h-6 w-20 rounded-full" />
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

function BlogPostSkeleton() {
    return (
        <div className="overflow-hidden">
            <section className="relative py-20 md:py-28 bg-heritage-terracotta">
                <div className="absolute inset-0 opacity-5 mandala-bg" />
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
                    <div className="space-y-6">
                        <Skeleton className="h-4 w-24 bg-heritage-creamDark/40" />
                        <Skeleton className="h-7 w-24 rounded-full bg-heritage-creamDark/40" />
                        <Skeleton className="h-10 w-5/6 bg-heritage-creamDark/40" />
                        <div className="flex flex-wrap gap-4">
                            <Skeleton className="h-4 w-32 bg-heritage-creamDark/40" />
                            <Skeleton className="h-4 w-28 bg-heritage-creamDark/40" />
                            <Skeleton className="h-4 w-24 bg-heritage-creamDark/40" />
                            <Skeleton className="h-4 w-28 bg-heritage-creamDark/40" />
                        </div>
                    </div>
                </div>
            </section>
            <section className="py-12 bg-heritage-creamLight">
                <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
                    <Skeleton className="h-64 w-full rounded-xl" />
                    <div className="space-y-3">
                        {Array.from({ length: 10 }).map((_, i) => (
                            <Skeleton key={i} className={i % 4 === 3 ? "h-4 w-2/3" : "h-4 w-full"} />
                        ))}
                    </div>
                </div>
            </section>
        </div>
    )
}

function VideoPageSkeleton({ variant = "dark" }) {
    return (
        <div className={variant === "dark" ? "min-h-screen bg-[#0A0A0A]" : "min-h-screen bg-heritage-creamLight"}>
            <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
                <Skeleton className={variant === "dark" ? "aspect-video w-full rounded-xl bg-white/10" : "aspect-video w-full rounded-xl"} />
                <div className="space-y-3">
                    <Skeleton className={variant === "dark" ? "h-8 w-3/4 bg-white/10" : "h-8 w-3/4"} />
                    <div className="flex flex-wrap gap-2">
                        <Skeleton className={variant === "dark" ? "h-6 w-24 rounded-full bg-white/10" : "h-6 w-24 rounded-full"} />
                        <Skeleton className={variant === "dark" ? "h-6 w-28 rounded-full bg-white/10" : "h-6 w-28 rounded-full"} />
                        <Skeleton className={variant === "dark" ? "h-6 w-20 rounded-full bg-white/10" : "h-6 w-20 rounded-full"} />
                    </div>
                    <Skeleton className={variant === "dark" ? "h-4 w-full bg-white/10" : "h-4 w-full"} />
                    <Skeleton className={variant === "dark" ? "h-4 w-5/6 bg-white/10" : "h-4 w-5/6"} />
                    <Skeleton className={variant === "dark" ? "h-4 w-2/3 bg-white/10" : "h-4 w-2/3"} />
                </div>
            </div>
        </div>
    )
}

function AdminTableSkeleton({ rows = 8, filters = 3 }) {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="space-y-2">
                    <Skeleton className="h-7 w-56" />
                    <Skeleton className="h-4 w-72" />
                </div>
                <Skeleton className="h-10 w-40 rounded-sm" />
            </div>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                {Array.from({ length: filters }).map((_, i) => (
                    <Skeleton key={i} className="h-10 w-full rounded-sm" />
                ))}
            </div>
            <div className="bg-surface border border-heritage-creamDark rounded-xl overflow-hidden">
                <div className="p-4 space-y-3">
                    {Array.from({ length: rows }).map((_, i) => (
                        <div key={i} className="flex items-center gap-4">
                            <Skeleton className="h-4 w-10" />
                            <Skeleton className="h-4 w-1/3" />
                            <Skeleton className="h-4 w-1/4" />
                            <Skeleton className="h-4 w-1/5" />
                            <div className="ml-auto flex items-center gap-2">
                                <Skeleton className="h-8 w-10 rounded-sm" />
                                <Skeleton className="h-8 w-10 rounded-sm" />
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export { AdminTableSkeleton, BlogPostSkeleton, CardGridSkeleton, PostGridSkeleton, ProgramDetailSkeleton, VideoPageSkeleton }
