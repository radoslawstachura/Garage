import { Skeleton } from "@/components/ui/skeleton";

export function MechanicInfoSkeleton() {
    return (
        <div className="space-y-2">
            <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-44 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-36 bg-gray-300 animate-pulse" />
            <Skeleton className="h-4 w-52 bg-gray-300 animate-pulse" />
        </div>
    );
}