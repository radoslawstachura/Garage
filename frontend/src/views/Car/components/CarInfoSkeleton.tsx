import { Skeleton } from "@/components/ui/skeleton";

export function CarInfoSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-4 w-34 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-34 bg-gray-300 animate-pulse" />
        </div>
    );
}