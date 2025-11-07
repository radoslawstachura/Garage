"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { Skeleton } from "@/components/ui/skeleton";
import { toast } from "sonner";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Search } from "lucide-react";
import { Wrench } from "lucide-react";
import { Loader2 } from "lucide-react";

import { FormCombobox } from "./FormCombobox";
import { Car } from "@/types/Car";
import { Repair } from "@/types/Repair";
import { Owner } from "@/types/Owner";
import { Mechanic } from "@/types/Mechanic";
import { apiClient } from "@/lib/apiClient";
import { useJwt } from "@/contexts/JwtContext";

const formSchema = z.object({
    registration_number: z.string().min(5).max(15),
    brand: z.string().min(1).max(30),
    model: z.string().min(1).max(30),
    production_year: z.coerce.number().int().min(1900),
    mileage: z.coerce.number().int().min(1),
    owner_id: z.coerce.number().int().min(1),
    vin: z.string().length(17).or(z.string().length(0)).optional()
});

interface CarClientProps {
    id: number;
}

export default function CarClient({ id }: CarClientProps) {
    const [car, setCar] = useState<Car | null>(null);
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSheetLoading, setIsSheetLoading] = useState<boolean>(false);
    const [openSheet, setOpenSheet] = useState<boolean>(false);

    const { role } = useJwt();

    async function editCarSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSheetLoading(true);

            await apiClient.put(`/cars/${id}`, values);

            setCar(null);

            getCar();

            toast.info("Car updated successfully");

            setOpenSheet(false);
            setIsSheetLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function getCar() {
        try {
            const carData = await apiClient.get<Car>(`/cars/${id}`);

            carData.ownerData = null;

            setCar(carData);
            try {
                const ownerData = await apiClient.get<Owner>(`/owners/${carData.owner_id}`);

                carData.ownerData = ownerData;

                setCar(carData);

                form.reset({
                    registration_number: carData.registration_number,
                    brand: carData.brand,
                    model: carData.model,
                    production_year: carData.production_year,
                    mileage: carData.mileage,
                    owner_id: carData.owner_id,
                    vin: carData.vin ?? ""
                });
            } catch (error: unknown) {
                if (axios.isAxiosError(error)) {
                    if (error?.response?.status == 404) {
                        console.log(error.response.data);
                    }
                } else {
                    console.log(error);
                }
            }
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error?.response?.status == 404) {
                    console.log(error.response.data);
                }
            } else {
                console.log(error);
            }
        }
    }

    async function getCarRepairs() {
        try {
            setIsLoading(true);

            const repairsData = await apiClient.get<Repair[]>(`/cars/${id}/repairs`);

            const repairsWithDetails = await Promise.all(
                repairsData.map(async (repair) => {
                    const mechanicData = await apiClient.get<Mechanic>(`/mechanics/${repair.mechanic_id}`);

                    return {
                        ...repair,
                        mechanicData
                    };
                })
            );

            repairsWithDetails.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setRepairs(repairsWithDetails);
        } catch (error) {
            if (axios.isAxiosError(error)) {
                if (error?.response?.status == 404) {
                    console.log(error.response.data);
                }
            } else {
                console.log(error);
            }
        } finally {
            setIsLoading(false);
        }
    }

    async function getOwners() {
        try {
            const ownersData = await apiClient.get<Owner[]>("/owners");

            setOwners(ownersData);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete() {
        try {
            await apiClient.delete(`/cars/${car?.car_id}`);

            getCar();

            setCar(null);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getCar();
        getCarRepairs();
        getOwners();
    }, [id]);

    type FormValues = z.infer<typeof formSchema>;

    const resolver = zodResolver(formSchema) as Resolver<FormValues>;

    const form = useForm<z.infer<typeof formSchema>>({
        resolver,
        defaultValues: {
            registration_number: "",
            brand: "",
            model: "",
            production_year: 0,
            mileage: 0,
            owner_id: 1,
            vin: ""
        }
    });

    return (
        <div style={{
            padding: "20px"
        }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card className={`${car?.is_deleted ? "border-red-400 bg-red-50" : ""}`}>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {car ? `${car.brand} ${car.model} (${car.production_year})` : (
                                <Skeleton className="h-6 w-40 bg-gray-300 animate-pulse" />
                            )}
                        </CardTitle>
                        {isLoading ? (
                            <Skeleton className="h-10 w-18 rounded-md bg-gray-300 animate-pulse" />
                        ) : (
                            <div className="flex items-center gap-3 ml-auto">
                                {car?.is_deleted ? (
                                    <>
                                        {role === "admin" &&
                                            <Button variant="outline" disabled className="opacity-50">
                                                Delete (disabled)
                                            </Button>
                                        }
                                        <Button variant="outline" disabled className="opacity-50">
                                            Edit (disabled)
                                        </Button>
                                    </>
                                ) : (
                                    <>
                                        {role === "admin" &&
                                            <Button
                                                variant="outline"
                                                className="border-red-500 hover:bg-red-100 cursor-pointer"
                                                onClick={handleDelete}
                                            >
                                                Delete
                                            </Button>
                                        }
                                        <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                                            <SheetTrigger asChild>
                                                <Button
                                                    variant="outline"
                                                    className="text-emerald-900 border-emerald-400 hover:bg-emerald-100 cursor-pointer"
                                                >
                                                    Edit
                                                </Button>
                                            </SheetTrigger>
                                            <SheetContent style={{
                                                padding: "20px"
                                            }}>
                                                {isSheetLoading ? (
                                                    <div className="flex items-center justify-center py-20">
                                                        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                                                        <span className="ml-2 text-gray-600">Saving...</span>
                                                    </div>
                                                ) : (
                                                    <Form {...form}>
                                                        <form onSubmit={form.handleSubmit(editCarSubmit)}>
                                                            <SheetHeader>
                                                                <SheetTitle>Edit owner</SheetTitle>
                                                            </SheetHeader>
                                                            <FormField
                                                                control={form.control}
                                                                name="registration_number"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Registration number</FormLabel>
                                                                        <FormControl>
                                                                            <Input {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="brand"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Brand</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="model"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Model</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="production_year"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Production year</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="mileage"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Mileage</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="owner_id"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>Owner</FormLabel>
                                                                        <FormCombobox
                                                                            value={field.value?.toString() ?? ""}
                                                                            onChange={field.onChange}
                                                                            options={owners.map((owner) => ({
                                                                                value: owner.owner_id.toString(),
                                                                                label: `${owner.firstname} ${owner.lastname}`,
                                                                            }))}
                                                                            placeholder="Select an owner"
                                                                        />
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <FormField
                                                                control={form.control}
                                                                name="vin"
                                                                render={({ field }) => (
                                                                    <FormItem>
                                                                        <FormLabel>VIN</FormLabel>
                                                                        <FormControl>
                                                                            <Input placeholder="..." {...field} />
                                                                        </FormControl>
                                                                        <FormMessage />
                                                                    </FormItem>
                                                                )}
                                                            />
                                                            <SheetFooter>
                                                                <SheetClose asChild>
                                                                    <Button className="cursor-pointer" variant="outline">Cancel</Button>
                                                                </SheetClose>
                                                                <Button className="cursor-pointer" type="submit">Submit</Button>
                                                            </SheetFooter>
                                                        </form>
                                                    </Form>
                                                )}
                                            </SheetContent>
                                        </Sheet>
                                    </>
                                )}
                            </div>
                        )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {car ? (
                            <>
                                <p><b>Registration:</b> {car.registration_number}</p>
                                <p><b>VIN:</b> {car.vin || "-"}</p>
                                <p><b>Mileage:</b> {car.mileage} km</p>
                                <div className="flex items-center gap-2">
                                    <b>Owner:</b> <Link href={`/owner/${car.owner_id}`} className="underline text-blue-600 hover:text-blue-800">
                                        {car.ownerData ? (
                                            <span>{car.ownerData.firstname} {car.ownerData.lastname}</span>
                                        ) : (
                                            <Skeleton className="h-5 w-36 bg-gray-300 animate-pulse" />
                                        )}
                                    </Link>
                                </div>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-34 bg-gray-300 animate-pulse" />
                                <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
                                <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                                <Skeleton className="h-4 w-34 bg-gray-300 animate-pulse" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card className={`${car?.is_deleted ? "border-red-400 bg-red-50" : ""}`}>
                    <CardHeader>
                        <CardTitle>Repair history</CardTitle>
                    </CardHeader>
                    <CardContent>
                        {isLoading ? (
                            <div className="space-y-4">
                                {[1, 2, 3].map((i) => (
                                    <div key={i} className="flex items-center space-x-4">
                                        <Skeleton className="h-5 w-5 rounded-full bg-gray-300 animate-pulse" />
                                        <div className="space-y-2 flex-1">
                                            <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                                            <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
                                        </div>
                                        <Skeleton className="h-8 w-8 rounded-md bg-gray-300 animate-pulse" />
                                    </div>
                                ))}
                            </div>
                        ) : repairs.length > 0 ? (
                            <div className="relative border-l-2 border-gray-200 pl-4 space-y-6">
                                {repairs.map((repair) => (
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
            {car &&
                <pre>
                    {JSON.stringify(car, null, 2)}
                </pre>
            }

            {/* Loader if not */}

            {repairs &&
                <pre>
                    {JSON.stringify(repairs, null, 2)}
                </pre>
            }
        </div>
    );
}