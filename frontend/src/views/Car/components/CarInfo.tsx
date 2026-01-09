import Link from "next/link";
import { Skeleton } from "@/components/ui/skeleton";
import { CarInfoSkeleton } from "./CarInfoSkeleton";
import { Car } from "@/types/Car";

interface CarInfoProps {
    car: Car | null;
    isDeleting: boolean;
}

export default function CarInfo({ car, isDeleting }: CarInfoProps) {
    if (!car || isDeleting) {
        return <CarInfoSkeleton />;
    }

    return (
        <>
            <p><b>Registration:</b> {car.registration_number}</p>
            <p><b>VIN:</b> {car.vin || "-"}</p>
            <p><b>Mileage:</b> {car.mileage} km</p>

            <div className="flex items-center gap-2">
                <b>Owner:</b>

                {car.ownerLoading ? (
                    <Skeleton className="h-5 w-36 bg-gray-300 animate-pulse" />
                ) : car.ownerData ? (
                    <Link
                        href={`/owner/${car.owner_id}`}
                        className="underline text-blue-600 hover:text-blue-800"
                    >
                        {car.ownerData.firstname} {car.ownerData.lastname}
                    </Link>
                ) : (
                    <span>N/A</span>
                )}
            </div>
        </>
    );
}
