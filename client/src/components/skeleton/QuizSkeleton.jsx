
import { Skeleton } from "@/components/ui/skeleton"

export function QuizSkeleton() {
  return (
    <div className="border-gray-100 rounded-2xl p-5 bg-white shadow hover:shadow-md transition-all duration-300 mb-4">
      {/* Main information */}
      <div className="flex justify-between items-start mb-4">
      <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 bg-slate-300" />
          <div>
            <Skeleton className="h-4 w-32 bg-slate-300 mb-1" />
            <Skeleton className="h-3 w-24 bg-slate-300" />
          </div>
       
         
        </div>
      </div>
      
      {/* Quiz description */}
      <div className="py-2">
        <Skeleton className="h-4 w-full bg-slate-300 mb-2" />
        
        <Skeleton className="h-4 w-11/12 bg-slate-300" />
      </div>
      
      {/* Actions and additional information */}
      <div className="flex justify-between items-center border-t border-gray-100 pt-3 mt-2">
        <div className="flex items-center gap-5">
          <Skeleton className="h-6 w-44 bg-slate-300 rounded" />
         
        </div>
        
        <Skeleton className="h-8 w-28 bg-slate-300 rounded-full" />
      </div>
    </div>
  )
}