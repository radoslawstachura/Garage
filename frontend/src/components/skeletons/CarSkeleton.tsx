export default function CarSkeleton() {
    return (
        <div className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm animate-pulse flex flex-col justify-between">
            <div>
                <div className="h-5 w-2/3 bg-gray-300 animate-pulse rounded mb-2"></div>
                <div className="h-3 w-1/2 bg-gray-300 animate-pulse rounded mb-1"></div>
                <div className="h-3 w-1/3 bg-gray-300 animate-pulse rounded"></div>
            </div>
            <div className="mt-4 flex">
                <div className="h-8 w-full bg-gray-300 animate-pulse rounded"></div>
            </div>
        </div>
    );
}