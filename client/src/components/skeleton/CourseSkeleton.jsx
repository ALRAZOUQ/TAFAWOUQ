import { Skeleton } from "@/components/ui/skeleton"

export function CourseSkeleton() {
  return (
    <div className="w-full h-auto bg-white shadow-lg rounded-3xl p-6 border-y border-y-gray-200 border-x-4 border-x-TAF-300 hover:shadow-xl transition-shadow">
      <div className="space-y-4">
        <div className="border-b border-gray-200 pb-4">
          <div className="flex items-center justify-between">
            <Skeleton className="h-8 w-24 bg-slate-300" />
            <Skeleton className="h-6 w-2 rounded-full bg-slate-300" />
          </div>
        </div>

        <div className="flex items-center gap-2 mt-1 relative">
          <Skeleton className="h-6 w-48 bg-slate-300" />
          
        </div>
      </div>

      <div className="py-2">
        <Skeleton className="h-4 w-full bg-slate-300 mb-2" />
        <Skeleton className="h-4 w-full bg-slate-300 mb-2" />
        <Skeleton className="h-4 w-full bg-slate-300 mb-2" />
        <Skeleton className="h-4 w-11/12 bg-slate-300" />
      </div>

    </div>
  )
}