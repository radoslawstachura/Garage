"use client";

import Link from "next/link";
import { Car } from "@/types/Car";

type CarCardProps = {
    car: Car;
    role: string | null;
    onDelete: (id: number) => void;
};

export function CarCard({ car, role, onDelete }: CarCardProps) {
    return (
        <div
            className="border border-slate-200 rounded-lg p-4 bg-white shadow-sm flex flex-col justify-between"
        >
            <div>
                <h4 className="text-lg font-semibold text-slate-800">
                    {car.brand} {car.model}
                </h4>
                <p className="text-slate-600 text-sm">Plate: {car.registration_number}</p>
                <p className="text-slate-500 text-xs">Year: {car.production_year}</p>
            </div>

            <div className="mt-4 flex gap-2">
                {role === "admin" ? (
                    <>
                        <Link href={`/car/${car.car_id}`} className="flex-1">
                            <button className="w-full cursor-pointer px-2 py-1 rounded-md border border-blue-400 bg-blue-50 hover:bg-blue-100 text-sm">
                                Details
                            </button>
                        </Link>

                        {/* <button className="cursor-pointer flex-1 px-2 py-1 rounded-md border border-yellow-400 bg-yellow-50 hover:bg-yellow-100 text-sm">
                            Edit
                        </button> */}

                        <button
                            className="cursor-pointer flex-1 px-2 py-1 rounded-md border border-red-400 bg-red-50 hover:bg-red-100 text-sm text-red-600"
                            onClick={() => onDelete(car.car_id)}
                        >
                            Delete
                        </button>
                    </>
                ) : (
                    <Link href={`/car/${car.car_id}`} className="flex-1">
                        <button className="cursor-pointer w-full px-2 py-1 rounded-md border border-blue-400 bg-blue-50 hover:bg-blue-100 text-sm">
                            Details
                        </button>
                    </Link>
                )}
            </div>
        </div>
    );
}