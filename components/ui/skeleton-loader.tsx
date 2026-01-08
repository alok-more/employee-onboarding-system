// Skeleton loader component for async data

"use client"

import { Skeleton } from "@/components/ui/skeleton"

interface SkeletonLoaderProps {
  type?: "form" | "card" | "text"
  lines?: number
}

export function SkeletonLoader({ type = "form", lines = 4 }: SkeletonLoaderProps) {
  if (type === "text") {
    return (
      <div className="space-y-2">
        {Array.from({ length: lines }).map((_, i) => (
          <Skeleton key={i} className="h-4 w-full" />
        ))}
      </div>
    )
  }

  if (type === "card") {
    return (
      <div className="p-6 border rounded-lg space-y-4">
        <Skeleton className="h-6 w-1/3" />
        <div className="space-y-2">
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-2/3" />
        </div>
      </div>
    )
  }

  // Form skeleton
  return (
    <div className="space-y-6">
      {Array.from({ length: lines }).map((_, i) => (
        <div key={i} className="space-y-2">
          <Skeleton className="h-4 w-24" />
          <Skeleton className="h-10 w-full" />
        </div>
      ))}
    </div>
  )
}
