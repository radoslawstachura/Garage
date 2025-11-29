import { Skeleton } from "@/components/ui/skeleton";

export function OwnerInfoSkeleton() {
    return (
        <div className="flex items-center gap-6 w-full justify-between">
            <div className="flex items-center gap-6">
                <Skeleton className="w-20 h-20 rounded-full bg-gray-300 animate-pulse" />
                <div className="space-y-3">
                    <Skeleton className="h-6 w-40 bg-gray-300 animate-pulse" />
                    <div className="grid grid-cols-2 gap-3 mt-2">
                        <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                        <Skeleton className="h-4 w-28 bg-gray-300 animate-pulse" />
                        <Skeleton className="h-4 w-36 bg-gray-300 animate-pulse" />
                    </div>
                </div>
            </div>
            <Skeleton className="h-10 w-24 rounded-md bg-gray-300 animate-pulse" />
        </div>
    );
}