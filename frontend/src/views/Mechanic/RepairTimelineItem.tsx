"use client";

import Link from "next/link";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { Repair } from "@/types/Repair";

type RepairTimelineItemProps = {
    repair: Repair;
};

export function RepairTimelineItem({ repair }: RepairTimelineItemProps) {
    return (
        <div className="relative flex items-start justify-between">
            <div className="absolute -left-3 top-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />

            <div className="ml-2">
                <p className="text-sm text-gray-500">
                    {new Date(repair.date).toLocaleDateString("pl-PL", {
                        day: "2-digit",
                        month: "2-digit",
                        year: "numeric",
                    })}
                </p>

                <p className="font-semibold">{repair.description}</p>

                <p className="text-sm text-gray-600">
                    Car:{" "}
                    <Link
                        href={`/car/${repair.car_id}`}
                        className="underline text-blue-600 hover:text-blue-800"
                    >
                        {repair.carData?.brand} {repair.carData?.model} ({repair.carData?.registration_number})
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