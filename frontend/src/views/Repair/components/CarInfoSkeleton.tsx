import { Skeleton } from "@/components/ui/skeleton";

export function CarInfoSkeleton() {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Car Information
            </h2>

            <div className="space-y-2">
                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Registration:</span>
                    <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Brand:</span>
                    <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Model:</span>
                    <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Year:</span>
                    <Skeleton className="h-4 w-20 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Mileage:</span>
                    <Skeleton className="h-4 w-28 bg-gray-300 animate-pulse" />
                </div>
            </div>
        </div>
    );
}