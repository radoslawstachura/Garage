"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { toast } from "sonner";
import { Car as CarIcon } from "lucide-react";

import { Owner } from "@/types/Owner";
import { Car } from "@/types/Car";

import { apiClient } from "@/lib/apiClient";
import { useJwt } from "@/contexts/JwtContext";

import { OwnerInfoSkeleton } from "./components/OwnerInfoSkeleton";
import CarSkeleton from "@/components/skeletons/CarSkeleton";

import { OwnerInfo } from "./components/OwnerInfo";
import { OwnerEditSheet } from "./components/OwnerEditSheet";
import { CarCard } from "./components/CarCard";

const formSchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/).or(z.string().length(0)),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    address: z.string().min(5).max(100).optional()
});

type OwnerClientProps = {
    id: number;
};

export default function OwnerClient({ id }: OwnerClientProps) {
    const { role } = useJwt();

    const [openSheet, setOpenSheet] = useState(false);
    const [isSheetLoading, setIsSheetLoading] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);

    const {
        data: owner,
        isLoading: loadingOwner,
        refetch: refetchOwner
    } = useQuery({
        queryKey: ["owner", id],
        queryFn: () => apiClient.get<Owner>(`/owners/${id}`)
    });

    const {
        data: cars = [],
        isLoading: loadingCars,
        refetch: refetchCars
    } = useQuery({
        queryKey: ["owner-cars", id],
        queryFn: async () => {
            const list = await apiClient.get<Car[]>(`/owners/${id}/cars`);
            return list.filter((c) => !c.is_deleted);
        }
    });

    async function deleteCarSubmit(carId: number) {
        try {
            setIsDeleting(true);
            await apiClient.delete(`/cars/${carId}`);

            toast.info("Car deleted successfully");
            await refetchCars();
        } catch (err) {
            console.log(err);
        } finally {
            setIsDeleting(false);
        }
    }

    async function editOwnerSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSheetLoading(true);

            await apiClient.put(`/owners/${id}`, values);

            toast.info("Owner updated successfully");

            await refetchOwner();

            setOpenSheet(false);
            setIsSheetLoading(false);
        } catch (err) {
            console.log(err);
        }
    }

    return (
        <div className="p-5">

            <section className="owner-profile bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8 mb-8 shadow-md flex items-center justify-between">
                {loadingOwner ? (
                    <OwnerInfoSkeleton />
                ) : owner ? (
                    <>
                        <OwnerInfo owner={owner} />

                        <OwnerEditSheet
                            open={openSheet}
                            setOpen={setOpenSheet}
                            owner={owner}
                            isLoading={isSheetLoading}
                            onSubmit={editOwnerSubmit}
                        />
                    </>
                ) : (
                    <p className="text-red-500">Owner not found</p>
                )}
            </section>

            <section className="owner-cars">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">My Cars</h3>
                </div>

                {loadingCars || isDeleting ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {[...Array(6)].map((_, i) => (
                            <CarSkeleton key={i} />
                        ))}
                    </div>
                ) : cars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.map((car) => (
                            <CarCard
                                key={car.car_id}
                                car={car}
                                role={role}
                                onDelete={deleteCarSubmit}
                            />
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-400 py-12 border-2 border-dashed border-slate-200 rounded-lg">
                        <CarIcon className="mx-auto h-12 w-12 mb-3 text-slate-300" />
                        <p>No cars added yet. Add your first car to keep track of repairs.</p>
                    </div>
                )}
            </section>

            {owner && (
                <pre className="mt-5">{JSON.stringify(owner, null, 2)}</pre>
            )}

            {cars && (
                <pre className="mt-5">{JSON.stringify(cars, null, 2)}</pre>
            )}
        </div>
    );
}