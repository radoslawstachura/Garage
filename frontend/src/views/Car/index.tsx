"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Car } from "@/types/Car";
import { Repair } from "@/types/Repair";
import { Owner } from "@/types/Owner";
import { Mechanic } from "@/types/Mechanic";

import { apiClient } from "@/lib/apiClient";
import { useJwt } from "@/contexts/JwtContext";

import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { Wrench } from "lucide-react";

import CarInfo from "./components/CarInfo";
import { CarEditSheet } from "./components/CarEditSheet";
import { RepairTimeline } from "./components/RepairTimelineItem";
import { RepairTimelineSkeleton } from "./components/RepairTimelineItemSkeleton";

type CarClientProps = {
    id: number;
};

export default function CarClient({ id }: CarClientProps) {
    const { role } = useJwt();
    const [open, setOpen] = useState(false);
    const [isSheetLoading, setIsSheetLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: car,
        isLoading: loadingCar,
        refetch: refetchCar
    } = useQuery({
        queryKey: ["car", id],
        queryFn: async () => {
            const car = await apiClient.get<Car>(`/cars/${id}`);
            try {
                const owner = await apiClient.get<Owner>(`/owners/${car.owner_id}`);
                car.ownerData = owner;
            } catch {
                car.ownerData = null;
            }
            return car;
        }
    });

    const {
        data: repairs = [],
        isLoading: loadingRepairs,
        refetch: refetchRepairs
    } = useQuery({
        queryKey: ["car-repairs", id],
        queryFn: async () => {
            const repairs = await apiClient.get<Repair[]>(`/cars/${id}/repairs`);

            const detailed = await Promise.all(
                repairs.map(async (repair) => {
                    const mech = await apiClient.get<Mechanic>(`/mechanics/${repair.mechanic_id}`);
                    return { ...repair, mechanicData: mech };
                })
            );

            detailed.sort(
                (a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            return detailed;
        }
    });

    const { data: owners = [] } = useQuery({
        queryKey: ["owners"],
        queryFn: () => apiClient.get<Owner[]>("/owners")
    });

    async function handleDelete() {
        if (!car) return;

        try {
            setIsDeleting(true);

            await apiClient.delete(`/cars/${car.car_id}`);

            await refetchCar();
            await refetchRepairs?.();
        } catch (err) {
            console.log(err);
        } finally {
            setIsDeleting(false);
        }
    }

    const EditCarButton = () => (
        car && (
            <CarEditSheet
                open={open}
                onOpenChange={setOpen}
                owners={owners}
                isSaving={isSheetLoading}
                defaultValues={{
                    registration_number: car.registration_number,
                    brand: car.brand,
                    model: car.model,
                    production_year: car.production_year,
                    mileage: car.mileage,
                    owner_id: car.owner_id,
                    vin: car.vin ?? ""
                }}
                onSubmit={async (values) => {
                    try {
                        setIsSheetLoading(true);
                        await apiClient.put(`/cars/${id}`, values);
                        await refetchCar();
                        setOpen(false);
                        setIsSheetLoading(false);
                    } catch (err) {
                        console.log(err);
                    }
                }}
            />
        )
    );

    return (
        <div className="p-5">

            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">

                <Card className={`${car?.is_deleted ? "border-red-400 bg-red-50" : ""}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {loadingCar || isDeleting ? (
                                <Skeleton className="h-6 w-40 bg-gray-300 animate-pulse" />
                            ) : car ? (
                                `${car.brand} ${car.model} (${car.production_year})`
                            ) : (
                                "Car not found"
                            )}
                        </CardTitle>

                        {!loadingCar && car ? (
                            <div className="flex items-center gap-3">
                                {role === "admin" && !isDeleting && (
                                    <Button
                                        variant="outline"
                                        className={car.is_deleted ? "opacity-50" : "border-red-500 hover:bg-red-100 cursor-pointer"}
                                        disabled={car.is_deleted}
                                        onClick={car.is_deleted ? undefined : handleDelete}
                                    >
                                        Delete
                                    </Button>
                                )}
                                {role === "admin" && isDeleting && (
                                    <Skeleton className="h-10 w-18 rounded-md bg-gray-300 animate-pulse" />
                                )}

                                {isDeleting ? (
                                    <Skeleton className="h-10 w-18 rounded-md bg-gray-300 animate-pulse" />
                                ) : !car.is_deleted ? (
                                    <EditCarButton />
                                ) : (
                                    <Button variant="outline" disabled className="opacity-50">
                                        Edit
                                    </Button>
                                )}
                            </div>
                        ) : (
                            <Skeleton className="h-10 w-18 rounded-md bg-gray-300 animate-pulse" />
                        )}
                    </CardHeader>

                    <CardContent className="space-y-2">
                        <CarInfo
                            car={car ?? null}
                            isDeleting={isDeleting}
                        />
                    </CardContent>
                </Card>

                <Card className={`${car?.is_deleted ? "border-red-400 bg-red-50" : ""}`}>
                    <CardHeader>
                        <CardTitle>Repair History</CardTitle>
                    </CardHeader>

                    <CardContent>
                        {loadingRepairs || isDeleting ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <RepairTimelineSkeleton key={i} />
                                ))}
                            </div>
                        ) : repairs.length > 0 && car ? (
                            <div className="relative border-l-2 border-gray-200 pl-4 space-y-6">
                                {repairs.map((repair) => (
                                    <RepairTimeline key={repair.repair_id} repair={repair} car={car} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                <Wrench className="h-10 w-10 mb-2 text-gray-400" />
                                <p className="text-center">
                                    No repairs have been added for this car yet.
                                </p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {car && <pre className="mt-5">{JSON.stringify(car, null, 2)}</pre>}
            {repairs && <pre className="mt-5">{JSON.stringify(repairs, null, 2)}</pre>}
        </div>
    );
}
