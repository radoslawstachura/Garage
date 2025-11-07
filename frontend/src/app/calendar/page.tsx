"use client"

import { useEffect, useState } from "react";

import { RepairsCalendar } from "@/components/RepairsCalendar";
import { apiClient } from "@/lib/apiClient";

import { Repair } from "@/types/Repair";
import { Mechanic } from "@/types/Mechanic";
import { Car } from "@/types/Car";

export default function Calendar() {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);

    async function getRepairs() {
        try {
            const repairsData = await apiClient.get<Repair[]>("/repairs");

            const repairsWithPlaceholders = repairsData.map(repair => ({
                ...repair,
                carData: null,
                mechanicData: null
            }));

            setRepairs(repairsWithPlaceholders);

            repairsWithPlaceholders.forEach(async (repair, index) => {
                try {
                    const [carData, mechanicData] = await Promise.all([
                        apiClient.get<Car>(`/cars/${repair.car_id}`),
                        apiClient.get<Mechanic>(`/mechanics/${repair.mechanic_id}`)
                    ]);

                    setRepairs(currentRepairs =>
                        currentRepairs.map((r, i) =>
                            i === index ? { ...r, carData, mechanicData } : r
                        )
                    );
                } catch (error) {
                    console.log(error);
                }
            });
        } catch (error) {
            console.log(error);
        }
    }

    async function getMechanics() {
        try {
            const mechanicsData = await apiClient.get<Mechanic[]>("/mechanics");

            setMechanics(mechanicsData);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRepairs();
        getMechanics();
    }, []);

    return (
        <div>
            <RepairsCalendar
                repairs={repairs}
                mechanics={mechanics}
            ></RepairsCalendar>
        </div>
    );
};