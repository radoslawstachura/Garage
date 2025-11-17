import { Skeleton } from "@/components/ui/skeleton";

export function RepairInfoSkeleton() {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 md:col-span-2">

            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Repair Details</h2>
                <Skeleton className="h-9 w-20 rounded-md bg-gray-300 animate-pulse" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="flex gap-2 items-center">
                    <span className="font-medium w-40">Date:</span>
                    <Skeleton className="h-4 w-28 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-40">Time:</span>
                    <Skeleton className="h-4 w-20 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-40">Description:</span>
                    <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-40">Estimated Work Time:</span>
                    <Skeleton className="h-4 w-24 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-40">Work Time:</span>
                    <Skeleton className="h-4 w-16 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-40">Cost:</span>
                    <Skeleton className="h-4 w-24 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-40">Status:</span>
                    <Skeleton className="h-6 w-24 rounded-full bg-gray-300 animate-pulse" />
                </div>
            </div>
        </div>
    );
}