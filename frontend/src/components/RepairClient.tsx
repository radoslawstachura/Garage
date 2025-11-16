"use client"

import axios from "axios";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";

import { Button } from "@/components/ui/button";
import { Dialog, DialogClose, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

import { Repair } from "@/types/Repair";
import { Car } from "@/types/Car";
import { Mechanic } from "@/types/Mechanic";
import { apiClient } from "@/lib/apiClient";
import { Loader2 } from "lucide-react";
import { Skeleton } from "./ui/skeleton";

type RepairClientProps = {
    id: number;
}

const formSchema = z.object({
    car_id: z.string().regex(/\b[0-9]+\b/),
    mechanic_id: z.string().regex(/\b[0-9]+\b/),
    date: z.string().regex(/\b[0-9]{4}.[0-9]{2}.[0-9]{2}\b/),
    time: z.string().regex(/\b[0-9]{1,2}:[0-9]{2}\b/),
    description: z.string().min(1),
    estimated_work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    cost: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    status: z.string()
});

export default function RepairClient({ id }: RepairClientProps) {
    const [errorMessage, setErrormessage] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [isDialogLoading, setIsDialogLoading] = useState<boolean>(false);

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

    async function editRepairSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsDialogLoading(true);

            await apiClient.put(`/repairs/${id}`, values);

            refetchRepair();

            toast.info("Repair updated successfully");

            setOpen(false);
            setIsDialogLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

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

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            car_id: "1",
            mechanic_id: "1",
            date: "",
            time: "",
            description: "",
            estimated_work_time: "",
            work_time: "",
            cost: "",
            status: ""
        }
    });

    return (
        <div className="p-5">
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogContent>
                    {
                        isDialogLoading ? (
                            <div className="flex items-center justify-center py-20">
                                <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                                <span className="ml-2 text-gray-600">Saving...</span>
                            </div>
                        ) : (
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(editRepairSubmit)}>
                                    <DialogHeader>
                                        <DialogTitle>Edit repair</DialogTitle>
                                    </DialogHeader>
                                    <FormField
                                        control={form.control}
                                        name="car_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Car</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue="1">
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a car" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {carsList.map((car) => (
                                                            <SelectItem
                                                                key={car.car_id}
                                                                value={car.car_id.toString()}>
                                                                {car.registration_number}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="mechanic_id"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Mechanic</FormLabel>
                                                <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select a mechanic" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {mechanicsList.map((mechanic) => (
                                                            <SelectItem
                                                                key={mechanic.mechanic_id}
                                                                value={mechanic.mechanic_id.toString()}>
                                                                {mechanic.firstname + " " + mechanic.lastname}
                                                            </SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="date"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Date</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Time</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="description"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Description</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="estimated_work_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Estimated work time</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="work_time"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Work time</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="cost"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Cost</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <FormField
                                        control={form.control}
                                        name="status"
                                        render={({ field }) => (
                                            <FormItem>
                                                <FormLabel>Status</FormLabel>
                                                <FormControl>
                                                    <Input placeholder="..." {...field} />
                                                </FormControl>
                                                <FormMessage />
                                            </FormItem>
                                        )}
                                    />
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button className="cursor-pointer" variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button className="cursor-pointer" type="submit">Submit</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        )
                    }
                </DialogContent>
            </Dialog>
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-6">
                {!loadingCar && car ? (
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Car Information</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Registration:</span> {car.registration_number ?? "N/A"}</p>
                            <p><span className="font-medium">Brand:</span> {car.brand ?? "N/A"}</p>
                            <p><span className="font-medium">Model:</span> {car.model ?? "N/A"}</p>
                            <p><span className="font-medium">Year:</span> {car.production_year ?? "N/A"}</p>
                            <p><span className="font-medium">Mileage:</span> {car.mileage?.toLocaleString() ?? "N/A"} km</p>
                            {car.is_deleted && (
                                <p className="text-red-500 font-semibold">Deleted</p>
                            )}
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Car Information
                        </h2>

                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Registration:</span>
                                <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Brand:</span>
                                <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Model:</span>
                                <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Year:</span>
                                <Skeleton className="h-4 w-20 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Mileage:</span>
                                <Skeleton className="h-4 w-28 bg-gray-300 animate-pulse" />
                            </div>
                        </div>
                    </div>
                )}

                {!loadingMechanic && mechanic ? (
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">Mechanic Information</h2>
                        <div className="space-y-2">
                            <p><span className="font-medium">Name:</span> {`${mechanic.firstname} ${mechanic.lastname}`}</p>
                            <p><span className="font-medium">Specialization:</span> {mechanic.specialization}</p>
                            <p><span className="font-medium">Phone:</span> {mechanic.phone_number}</p>
                            <p><span className="font-medium">Email:</span> {mechanic.email}</p>
                        </div>
                    </div>

                ) : (
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200">
                        <h2 className="text-xl font-semibold mb-4 text-gray-800">
                            Mechanic Information
                        </h2>

                        <div className="space-y-2">
                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Name:</span>
                                <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Specialization:</span>
                                <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Phone:</span>
                                <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-32">Email:</span>
                                <Skeleton className="h-4 w-52 bg-gray-300 animate-pulse" />
                            </div>
                        </div>
                    </div>
                )}

                {!loadingRepair && repair ? (
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 md:col-span-2">
                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Repair Details</h2>
                            {!loadingCar && !loadingMechanic ? (
                                <Button
                                    onClick={() => setOpen(true)}
                                    variant="outline"
                                    className="text-emerald-900 border-emerald-400 hover:bg-emerald-100 cursor-pointer"
                                >
                                    Edit
                                </Button>
                            ) : (
                                <Skeleton className="h-9 w-20 rounded-md bg-gray-300 animate-pulse" />
                            )}

                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <p><span className="font-medium">Date:</span> {repair.date.split("T")[0]}</p>
                            <p><span className="font-medium">Time:</span> {repair.time}</p>
                            <p><span className="font-medium">Description:</span> {repair.description}</p>
                            <p><span className="font-medium">Estimated Work Time:</span> {repair.estimated_work_time} h</p>
                            <p><span className="font-medium">Work Time:</span> {repair.work_time} h</p>
                            <p><span className="font-medium">Cost:</span> ${repair.cost}</p>
                            <p>
                                <span className="font-medium">Status:</span>
                                <span
                                    className="ml-2 px-2 py-1 rounded-full text-white font-semibold"
                                    style={{
                                        ...getStatusStyle(repair)
                                    }}
                                >
                                    {repair.status}
                                </span>
                            </p>
                        </div>
                    </div>
                ) : (
                    <div className="bg-white shadow-md rounded-xl p-6 border border-gray-200 md:col-span-2">

                        <div className="flex justify-between items-center mb-4">
                            <h2 className="text-xl font-semibold">Repair Details</h2>
                            <Skeleton className="h-9 w-20 rounded-md bg-gray-300 animate-pulse" />
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-40">Date:</span>
                                <Skeleton className="h-4 w-28 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-40">Time:</span>
                                <Skeleton className="h-4 w-20 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-40">Description:</span>
                                <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-40">Estimated Work Time:</span>
                                <Skeleton className="h-4 w-24 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-40">Work Time:</span>
                                <Skeleton className="h-4 w-16 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-40">Cost:</span>
                                <Skeleton className="h-4 w-24 bg-gray-300 animate-pulse" />
                            </div>

                            <div className="flex gap-2 items-center">
                                <span className="font-medium w-40">Status:</span>
                                <Skeleton className="h-6 w-24 rounded-full bg-gray-300 animate-pulse" />
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {repair &&
                <pre>
                    {JSON.stringify(repair, null, 2)}
                </pre>
            }

        </div>
    );
}