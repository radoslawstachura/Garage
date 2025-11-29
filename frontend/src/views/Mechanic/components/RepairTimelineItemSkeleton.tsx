"use client";

import { Skeleton } from "@/components/ui/skeleton";

export function RepairTimelineItemSkeleton() {
    return (
        <div className="flex items-center space-x-4">
            <Skeleton className="h-5 w-5 rounded-full bg-gray-300 animate-pulse" />

            <div className="space-y-2 flex-1">
                <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
            </div>

            <Skeleton className="h-8 w-8 rounded-md bg-gray-300 animate-pulse" />
        </div>
    );
}