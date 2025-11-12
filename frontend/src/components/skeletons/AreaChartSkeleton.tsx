export function AreaChartSkeleton({ height = 180 }: { height?: number }) {
    return (
        <div className="w-full flex flex-col gap-2">
            <div className={`h-[${height}px] w-full bg-gray-300 rounded animate-pulse`} />
            <div className="h-4 w-3/4 bg-gray-300 rounded animate-pulse mt-2" />
            <div className="h-4 w-1/2 bg-gray-300 rounded animate-pulse" />
        </div>
    );
}