export function PieChartSkeleton({ size = 260 }: { size?: number }) {
    return (
        <div
            className="mx-auto rounded-full bg-gray-300 animate-pulse"
            style={{ width: size, height: size }}
        />
    );
}