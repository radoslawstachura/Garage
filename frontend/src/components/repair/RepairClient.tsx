"use client"

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";

import { Repair } from "@/types/Repair";
import { Car } from "@/types/Car";
import { Mechanic } from "@/types/Mechanic";
import { apiClient } from "@/lib/apiClient";
import { CarInfo } from "./components/CarInfo";
import { CarInfoSkeleton } from "./components/CarInfoSkeleton";
import { MechanicInfo } from "./components/MechanicInfo";
import { MechanicInfoSkeleton } from "./components/MechanicInfoSkeleton";
import { RepairInfo } from "./components/RepairInfo";
import { EditRepairDialog } from "./components/EditRepairDialog";

type RepairClientProps = {
    id: number;
}

export default function RepairClient({ id }: RepairClientProps) {
    const [errorMessage, setErrormessage] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);

    const {
        data: repair,
        isLoading: loadingRepair,
        isError: errorRepair,
        refetch: refetchRepair,
    } = useQuery({
        queryKey: ["repair", id],
        queryFn: () => apiClient.get<Repair>(`/repairs/${id}`),
    });

    const {
        data: car,
        isLoading: loadingCar,
        isError: errorCar
    } = useQuery({
        queryKey: ["car", repair?.car_id],
        queryFn: () => apiClient.get<Car>(`/cars/${repair!.car_id}`),
        enabled: !!repair
    });

    const {
        data: mechanic,
        isLoading: loadingMechanic,
        isError: errorMechanic
    } = useQuery({
        queryKey: ["mechanic", repair?.mechanic_id],
        queryFn: () => apiClient.get<Mechanic>(`/mechanics/${repair!.mechanic_id}`),
        enabled: !!repair
    });

    const { data: mechanicsList = [], isLoading: loadingMechanicsList } = useQuery({
        queryKey: ["mechanicsList"],
        queryFn: () => apiClient.get<Mechanic[]>("/mechanics"),
    });

    const { data: carsList = [], isLoading: loadingCarsList } = useQuery({
        queryKey: ["carsList"],
        queryFn: () => apiClient.get<Car[]>("/cars"),
    });

    function getStatusStyle(repair: Repair) {
        if (repair.status == "pending") {
            return {
                color: "#5664d2",
                background: "#e4e6f7",
            }
        } else if (repair.status == "in progress") {
            return {
                color: "#fcb92c",
                background: "#fef4e1"
            }
        } else {
            return {
                color: "#1ccb8c",
                background: "#d2f1e7"
            }
        }
    }

    return (
        <div className="p-5">
            <EditRepairDialog
                open={open}
                onOpenChange={setOpen}
                repair={repair!}
                carsList={carsList || []}
                mechanicsList={mechanicsList || []}
                onUpdated={() => refetchRepair()}
            />
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {!loadingCar && car ? (
                    <CarInfo car={car} />
                ) : (
                    <CarInfoSkeleton />
                )}

                {!loadingMechanic && mechanic ? (
                    <MechanicInfo mechanic={mechanic} />
                ) : (
                    <MechanicInfoSkeleton />
                )}

                <RepairInfo
                    repair={repair}
                    loadingRepair={loadingRepair}
                    loadingCar={loadingCar}
                    loadingMechanic={loadingMechanic}
                    getStatusStyle={getStatusStyle}
                    onEdit={() => setOpen(true)}
                />
            </div>

            {repair &&
                <pre>
                    {JSON.stringify(repair, null, 2)}
                </pre>
            }

        </div>
    );
}