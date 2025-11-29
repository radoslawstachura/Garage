import { Button } from "@/components/ui/button";
import { Car } from "@/types/Car";
import { Repair } from "@/types/Repair";
import { Search } from "lucide-react";
import Link from "next/link";

interface RepairTimelineProps {
    repair: Repair;
    car: Car | null;
}

export function RepairTimeline({ repair, car }: RepairTimelineProps) {
    return (
        <div key={repair.repair_id} className="relative flex items-start justify-between">
            {car?.is_deleted ?
                <div className="absolute -left-3 top-1 w-5 h-5 bg-gray-300 rounded-full border-2 border-white" />
                :
                <div className="absolute -left-3 top-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
            }
            <div className="ml-2">
                <p className="text-sm text-gray-500">{new Date(repair.date).toLocaleDateString("pl-PL", {
                    day: "2-digit",
                    month: "2-digit",
                    year: "numeric"
                })}</p>
                <p className="font-semibold">{repair.description}</p>
                <p className="text-sm text-gray-600">
                    Mechanic: <Link href={`/mechanic/${repair.mechanic_id}`} className="underline text-blue-600 hover:text-blue-800">
                        {repair.mechanicData?.firstname} {repair.mechanicData?.lastname}
                    </Link>
                </p>
            </div>
            <Link href={`/repair/${repair.repair_id}`} passHref>
                <Button variant="ghost" size="icon" className="ml-4 shrink-0">
                    <Search className="h-4 w-4" />
                </Button>
            </Link>
        </div>
    );
}