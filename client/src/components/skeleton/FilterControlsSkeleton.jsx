import { Skeleton } from "@/components/ui/skeleton"

export function FilterControlsSkeleton() {
  return (
    <div className="flex flex-col md:flex-row md:items-center gap-4 my-6">
      {/* Search Input Skeleton */}
      <div className="relative w-full md:w-1/3 min-h-[56px] flex items-center">
        <div className="absolute right-3 w-5 h-5 bg-slate-300 rounded-full"></div>
        <Skeleton className="w-full h-12 rounded-lg bg-slate-300" />
      </div>

      {/* Filter Tags Skeleton */}
      <div className="w-full md:w-1/3 min-h-[56px] flex flex-wrap gap-2 justify-center md:justify-start">
        <Skeleton className="h-12 w-28 rounded-full bg-slate-300" />
       
      </div>
      {/* Sort Options Skeleton */}
      <div className="w-full md:w-1/3 min-h-[56px] flex flex-wrap gap-2 justify-center md:justify-start md:items-start">
        <Skeleton className="h-12 w-28 rounded-full bg-slate-300" />
      
      </div>
    </div>
  )
}