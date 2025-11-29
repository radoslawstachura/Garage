import { Skeleton } from "@/components/ui/skeleton";

export function MechanicInfoSkeleton() {
    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
            <h2 className="text-xl font-semibold mb-4 text-gray-800">
                Mechanic Information
            </h2>

            <div className="space-y-2">
                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Name:</span>
                    <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Specialization:</span>
                    <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Phone:</span>
                    <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                </div>

                <div className="flex gap-2 items-center">
                    <span className="font-medium w-32">Email:</span>
                    <Skeleton className="h-4 w-52 bg-gray-300 animate-pulse" />
                </div>
            </div>
        </div>
    );
}