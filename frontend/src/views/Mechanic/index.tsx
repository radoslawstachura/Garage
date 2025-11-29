"use client";

import axios from "axios";
import { useState } from "react";
import { z } from "zod";
import { toast } from "sonner";
import { useQuery } from "@tanstack/react-query";

import { Mechanic } from "@/types/Mechanic";
import { Repair } from "@/types/Repair";
import { Car } from "@/types/Car";
import { apiClient } from "@/lib/apiClient";
import { Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "../../components/ui/card";
import { Skeleton } from "../../components/ui/skeleton";
import { MechanicInfo } from "./components/MechanicInfo";
import { MechanicInfoSkeleton } from "./components/MechanicInfoSkeleton";
import { RepairTimelineItemSkeleton } from "./components/RepairTimelineItemSkeleton";
import { RepairTimelineItem } from "./RepairTimelineItem";
import { MechanicEditSheet } from "./components/MechanicEditSheet";

interface MechanicClientProps {
    id: number;
}

const formSchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    specialization: z.string().min(1).max(50),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/)
});

export default function MechanicClient({ id }: MechanicClientProps) {
    const [errorMessage, setErrormessage] = useState("");
    const [openSheet, setOpenSheet] = useState(false);
    const [isSheetLoading, setIsSheetLoading] = useState(false);

    const {
        data: mechanic,
        isLoading: isMechanicLoading,
        refetch: refetchMechanic
    } = useQuery({
        queryKey: ["mechanic", id],
        queryFn: async () => {
            try {
                return await apiClient.get<Mechanic>(`/mechanics/${id}`);
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        setErrormessage(error.response.data);
                    }
                }
                throw error;
            }
        }
    });

    const {
        data: repairs,
        isLoading: isRepairsLoading
    } = useQuery({
        queryKey: ["repairsByMechanic", id],
        queryFn: async () => {
            try {
                const repairsData = await apiClient.get<Repair[]>(`/mechanics/${id}/repairs`);

                const withCars = await Promise.all(
                    repairsData.map(async (repair) => {
                        const carData = await apiClient.get<Car>(`/cars/${repair.car_id}`);
                        return { ...repair, carData };
                    })
                );

                return withCars.sort(
                    (a, b) =>
                        new Date(b.date).getTime() - new Date(a.date).getTime()
                );
            } catch (error) {
                if (axios.isAxiosError(error)) {
                    if (error.response?.status === 404) {
                        setErrormessage(error.response.data);
                    }
                }
                throw error;
            }
        }
    });

    async function editMechanicSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSheetLoading(true);

            await apiClient.put(`/mechanics/${id}`, values);

            toast.info("Mechanic updated successfully");

            await refetchMechanic();

            setOpenSheet(false);
        } catch (error) {
            console.log(error);
        } finally {
            setIsSheetLoading(false);
        }
    }

    const EditMechanicButton = () =>
        mechanic && (
            <MechanicEditSheet
                open={openSheet}
                onOpenChange={setOpenSheet}
                isSaving={isSheetLoading}
                defaultValues={{
                    firstname: mechanic.firstname,
                    lastname: mechanic.lastname,
                    specialization: mechanic.specialization,
                    phone_number: mechanic.phone_number ?? "",
                    email: mechanic.email
                }}
                onSubmit={editMechanicSubmit}
            />
        );

    return (
        <div style={{ padding: "20px" }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {isMechanicLoading ? (
                                <Skeleton className="h-6 w-40 bg-gray-300 animate-pulse" />
                            ) : mechanic ? (
                                `${mechanic.firstname} ${mechanic.lastname}`
                            ) : null}
                        </CardTitle>

                        {isMechanicLoading ? (
                            <Skeleton className="h-10 w-18 rounded-md bg-gray-300 animate-pulse" />
                        ) : (
                            <EditMechanicButton />
                        )}
                    </CardHeader>

                    <CardContent className="space-y-2">
                        {isMechanicLoading ? (
                            <MechanicInfoSkeleton />
                        ) : mechanic ? (
                            <MechanicInfo mechanic={mechanic} />
                        ) : null}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>Repair history</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isRepairsLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <RepairTimelineItemSkeleton key={i} />
                                ))}
                            </div>
                        ) : repairs && repairs.length > 0 ? (
                            <div className="relative border-l-2 border-gray-200 pl-4 space-y-6">
                                {repairs.map((repair) => (
                                    <RepairTimelineItem key={repair.repair_id} repair={repair} />
                                ))}
                            </div>
                        ) : (
                            <div className="flex flex-col items-center justify-center py-10 text-gray-500">
                                <Wrench className="h-10 w-10 mb-2 text-gray-400" />
                                <p className="text-center">No repairs have been added for this car yet.</p>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>

            {mechanic && (
                <pre>{JSON.stringify(mechanic, null, 2)}</pre>
            )}

            {repairs && (
                <pre>{JSON.stringify(repairs, null, 2)}</pre>
            )}
        </div>
    );
}
