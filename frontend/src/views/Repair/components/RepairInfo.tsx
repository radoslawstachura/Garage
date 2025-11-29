import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Repair } from "@/types/Repair";
import { RepairInfoSkeleton } from "./RepairInfoSkeleton";

interface RepairInfoProps {
    repair: Repair | undefined;
    loadingRepair: boolean;
    loadingCar: boolean;
    loadingMechanic: boolean;
    getStatusStyle: (repair: Repair) => React.CSSProperties;
    onEdit: () => void;
}

export function RepairInfo({
    repair,
    loadingRepair,
    loadingCar,
    loadingMechanic,
    getStatusStyle,
    onEdit
}: RepairInfoProps) {

    if (!repair || loadingRepair) {
        return <RepairInfoSkeleton />;
    }

    return (
        <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 md:col-span-2">
            <div className="flex justify-between items-center mb-4">
                <h2 className="text-xl font-semibold">Repair Details</h2>

                {!loadingCar && !loadingMechanic ? (
                    <Button
                        onClick={onEdit}
                        variant="outline"
                        className="text-emerald-900 border-emerald-400 hover:bg-emerald-100 cursor-pointer"
                    >
                        Edit
                    </Button>
                ) : (
                    <Skeleton className="h-9 w-20 rounded-md bg-gray-300 animate-pulse" />
                )}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <p><span className="font-medium">Date:</span> {repair.date.split("T")[0]}</p>
                <p><span className="font-medium">Time:</span> {repair.time}</p>
                <p><span className="font-medium">Description:</span> {repair.description}</p>
                <p><span className="font-medium">Estimated Work Time:</span> {repair.estimated_work_time} h</p>
                <p><span className="font-medium">Work Time:</span> {repair.work_time} h</p>
                <p><span className="font-medium">Cost:</span> ${repair.cost}</p>

                <p>
                    <span className="font-medium">Status:</span>
                    <span
                        className="ml-2 px-2 py-1 rounded-full text-white font-semibold"
                        style={getStatusStyle(repair)}
                    >
                        {repair.status}
                    </span>
                </p>
            </div>
        </div>
    );
}
