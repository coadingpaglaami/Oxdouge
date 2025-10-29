import { Skeleton } from "@/components/ui/skeleton";

export const  ProductCardSkeleton=()=> {
  return (
    <div className="flex flex-col bg-[#121212] border border-primary rounded-lg overflow-hidden gap-4 animate-in fade-in-50">
      {/* Image Skeleton */}
      <div className="relative aspect-[3.9/2.2]">
        <Skeleton className="w-full h-full" />
      </div>

      {/* Content Skeleton */}
      <div className="flex flex-col p-6 gap-3">
        <Skeleton className="h-4 w-24" /> {/* category */}
        <Skeleton className="h-6 w-3/4" /> {/* title */}
        <Skeleton className="h-4 w-full" /> {/* desc line 1 */}
        <Skeleton className="h-4 w-5/6" /> {/* desc line 2 */}
        <Skeleton className="h-5 w-20 mt-2" /> {/* price */}
        <Skeleton className="h-10 w-full mt-3" /> {/* add to cart button */}
      </div>
    </div>
  );
}
