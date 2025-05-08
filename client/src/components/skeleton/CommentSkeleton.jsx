import { Skeleton } from "../ui/skeleton";

export function CommentSkeleton({ isReply = false }) {
  return (
    <div
      className={`border border-gray-200 rounded-lg p-4 bg-white shadow-sm space-y-3 mb-4 ${
        isReply ? "ml-8" : ""
      }`}
    >
      {/* Avatar & data */}
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-2">
          <Skeleton className="h-10 w-10 rounded-full flex-shrink-0 bg-slate-300" />
          <div>
            <Skeleton className="h-4 w-32 bg-slate-300 mb-1" />
            <Skeleton className="h-3 w-24 bg-slate-300" />
          </div>
        </div>
      </div>
      {/* Comment content */}
      <div className="py-2">
        <Skeleton className="h-4 w-full bg-slate-300 mb-2" />
        <Skeleton className="h-4 w-full bg-slate-300 mb-2" />
        <Skeleton className="h-4 w-11/12 bg-slate-300" />
      </div>
    </div>
  );
}
