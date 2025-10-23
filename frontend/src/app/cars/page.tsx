"use client"

import { useEffect, useState } from "react"
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
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
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2 } from "lucide-react";

import { Car } from "@/types/Car";
import { Owner } from "@/types/Owner";
import { apiClient } from "@/lib/apiClient";

const formSchema = z.object({
    registration_number: z.string().min(5).max(15),
    brand: z.string().min(1).max(30),
    model: z.string().min(1).max(30),
    production_year: z.coerce.number().int().min(1900),
    mileage: z.coerce.number().int().min(1),
    owner_id: z.coerce.number().int().min(1),
    vin: z.string().length(17).or(z.string().length(0)).optional()
});

export default function Cars() {
    const [cars, setCars] = useState<Car[]>([]);
    const [owners, setOwners] = useState<Owner[]>([]);
    const [filter, setFilter] = useState<string>("all");
    const [error, setError] = useState<string>("");
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function getCars() {
        try {
            setIsLoading(true);

            const carsData = await apiClient.get<Car[]>("/cars");

            const carsWithPlaceholder = carsData.map(car => ({
                ...car,
                ownerData: null
            }));

            setCars(carsWithPlaceholder);

            setIsLoading(false);

            carsWithPlaceholder.forEach(async (car, index) => {
                try {
                    const ownerData = await apiClient.get<Owner>(`/owners/${car.owner_id}`);

                    setCars(currentCars =>
                        currentCars.map((c, i) =>
                            i === index ? { ...c, ownerData } : c
                        )
                    );
                } catch (error) {
                    console.log(error);
                }
            });

            // const carsWithDetails = await Promise.all(
            //     carsData.map(async (car) => {
            //         const ownerData = await apiClient.get<Owner>(`/owners/${car.owner_id}`);

            //         return {
            //             ...car,
            //             ownerData
            //         }
            //     })
            // );

            //setCars(carsWithDetails);
        } catch (error) {
            setError(error.response.data.message);
        }
    }

    async function getOwners() {
        try {
            const ownersData = await apiClient.get<Owner[]>("/owners");

            setOwners(ownersData);
        } catch (error) {
            setError(error.response.data.message);
        }
    }

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

    async function addCarSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.post("/cars", values);

            getCars();

            toast.success("Car created successfully");

            form.reset();

            setOpen(false);
        } catch (error) {
            console.log(error.response.data);
        }
    }

    function formatMileage(mileage: number) {
        return mileage.toLocaleString("it-IT");
    }

    const filteredCars = cars.filter((car) => {
        if (filter === "all") return true;
        if (filter === "active") return !car.is_deleted;
        if (filter === "deleted") return car.is_deleted;
        return true;
    });


    useEffect(() => {
        getCars();
        getOwners();
    }, []);

    return (
        <div style={{
            padding: "20px"
        }}>
            <div>
                Cars {filter}
                <div className="flex items-center gap-3">
                    <Select value={filter} onValueChange={(val) => setFilter(val)}>
                        <SelectTrigger className="w-[180px]">
                            <SelectValue placeholder="Filter cars" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All</SelectItem>
                            <SelectItem value="active">Active</SelectItem>
                            <SelectItem value="deleted">Deleted</SelectItem>
                        </SelectContent>
                    </Select>
                    <Dialog open={open} onOpenChange={setOpen}>
                        <DialogTrigger asChild>
                            <Button className="cursor-pointer" style={{
                                background: "#08aa54"
                            }}>Add</Button>
                        </DialogTrigger>
                        <DialogContent>
                            <Form {...form}>
                                <form onSubmit={form.handleSubmit(addCarSubmit)}>
                                    <DialogHeader>
                                        <DialogTitle>Add car</DialogTitle>
                                    </DialogHeader>
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
                                                <Select onValueChange={field.onChange} defaultValue="1">
                                                    <FormControl>
                                                        <SelectTrigger>
                                                            <SelectValue placeholder="Select an owner" />
                                                        </SelectTrigger>
                                                    </FormControl>
                                                    <SelectContent>
                                                        {owners.map((owner) => (
                                                            <SelectItem key={owner.owner_id} value={owner.owner_id.toString()}>{owner.firstname + " " + owner.lastname}</SelectItem>
                                                        ))}
                                                    </SelectContent>
                                                </Select>
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
                                    <DialogFooter>
                                        <DialogClose asChild>
                                            <Button className="cursor-pointer" variant="outline">Cancel</Button>
                                        </DialogClose>
                                        <Button className="cursor-pointer" type="submit">Submit</Button>
                                    </DialogFooter>
                                </form>
                            </Form>
                        </DialogContent>
                    </Dialog>
                </div>
            </div>
            <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200 mt-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Registration number
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Brand
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Model
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Production year
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Mileage [km]
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Owner
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                VIN
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm text-right">
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={8}>
                                        <Skeleton className="h-4 w-full rounded-md bg-gray-300 animate-pulse" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : cars.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={8} className="text-center py-6 text-gray-500">
                                    No results found
                                </TableCell>
                            </TableRow>
                        ) : (
                            filteredCars.map((car) => (
                                <TableRow
                                    key={car.car_id}
                                    className={`border-b last:border-0 hover:bg-gray-50 transition-colors ${car.is_deleted ? "bg-red-100" : ""
                                        }`}
                                >
                                    <TableCell className="px-3 py-2 text-sm">{car.registration_number}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{car.brand}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{car.model}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{car.production_year}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{formatMileage(car.mileage)}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">
                                        {car.ownerData ? (
                                            <Link
                                                href={`/owner/${car.owner_id}`}
                                                className="underline text-blue-600 hover:text-blue-800"
                                            >
                                                {car.ownerData.firstname} {car.ownerData.lastname}
                                            </Link>
                                        ) : (
                                            <Skeleton className="h-4 w-24 rounded-md bg-gray-300 animate-pulse" />
                                        )}
                                    </TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{car.vin}</TableCell>
                                    <TableCell className="px-3 py-2 text-right flex items-center justify-end gap-2">
                                        <Link href={`/car/${car.car_id}`}>
                                            <span className="bg-[#e4e6f7] text-[#5664d2] px-3 py-1 rounded-md text-sm font-medium hover:bg-[#cdd0f5] hover:text-[#333] cursor-pointer transition-colors">
                                                View
                                            </span>
                                        </Link>
                                    </TableCell>
                                </TableRow>

                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <pre>
                <code>
                    {JSON.stringify(cars, null, 5)}
                </code>
            </pre>
            <pre>
                <code>
                    {JSON.stringify(owners, null, 5)}
                </code>
            </pre>
        </div>
    );
}