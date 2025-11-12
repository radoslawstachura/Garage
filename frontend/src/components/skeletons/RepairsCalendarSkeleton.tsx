"use client";

import { Card } from "@/components/ui/card";

type RepairsCalendarSkeletonProps = {
    daysCount?: number; // liczba dni w widoku, domyślnie 7
    maxItemsPerDay?: number; // maksymalna liczba skeletonów w dniu
};

export function RepairsCalendarSkeleton({
    daysCount = 7,
    maxItemsPerDay = 3,
}: RepairsCalendarSkeletonProps) {
    return (
        <div className="space-y-6">
            {/* Header skeleton */}
            <div className="flex flex-wrap items-center justify-between gap-4">
                <div className="h-6 w-40 bg-gray-300 rounded animate-pulse" />
                <div className="flex items-center gap-2">
                    <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
                    <div className="h-4 w-24 bg-gray-300 rounded animate-pulse" />
                    <div className="h-8 w-8 bg-gray-300 rounded-full animate-pulse" />
                </div>
                <div className="h-10 w-64 bg-gray-300 rounded animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-7 gap-3">
                {Array.from({ length: daysCount }).map((_, dayIndex) => (
                    <Card key={dayIndex} className="p-3 min-h-[200px] flex flex-col">
                        <div className="h-5 bg-gray-300 rounded animate-pulse mb-2 w-3/4 mx-auto" />
                        <div className="h-3 bg-gray-300 rounded animate-pulse w-1/2 mx-auto mb-4" />

                        <div className="space-y-2 flex-1">
                            {Array.from({ length: maxItemsPerDay }).map((_, itemIndex) => (
                                <div
                                    key={itemIndex}
                                    className="h-12 bg-gray-300 rounded-md animate-pulse"
                                />
                            ))}
                        </div>
                    </Card>
                ))}
            </div>
        </div>
    );
}