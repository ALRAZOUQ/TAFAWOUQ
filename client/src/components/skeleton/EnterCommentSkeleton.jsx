
import { Skeleton } from "../ui/skeleton";

export function EnterCommentSkeleton() {
  return (
    <div className="w-full bg-white p-4 shadow-md rounded-lg border border-gray-200 mb-4">
      {/* Textarea skeleton */}
      <Skeleton className="w-full h-14 rounded-md bg-slate-300" />

      {/* Action buttons skeleton */}
      <div className="flex justify-between items-center mt-2">
        <Skeleton className="h-8 w-24 rounded-lg bg-slate-300" />
       
      </div>
    </div>
  )
}