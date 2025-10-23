"use client"

import { useEffect, useState } from "react";
import Link from "next/link";
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
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import { toast } from "sonner";
import { Mail, Phone, MapPin, Edit3, Car as CarIcon, Loader2 } from "lucide-react";

import { Owner } from "@/types/Owner";
import { Car } from "@/types/Car";
import { apiClient } from "@/lib/apiClient";
import { Skeleton } from "./ui/skeleton";
import { useJwt } from "@/contexts/JwtContext";
import CarSkeleton from "./CarSkeleton";

type OwnerClientProps = {
    id: number;
}

const formSchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/).or(z.string().length(0)),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    address: z.string().min(5).max(100).optional()
});

export default function OwnerClient({ id }: OwnerClientProps) {
    const [owner, setOwner] = useState<Owner | null>(null);
    const [errorMessage, setErrormessage] = useState<string>("");
    const [cars, setCars] = useState<Car[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSheetLoading, setIsSheetLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openSheet, setOpenSheet] = useState<boolean>(false);

    const { role } = useJwt();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            phone_number: "",
            address: "",
            email: ""
        }
    });

    async function editOwnerSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSheetLoading(true);

            await apiClient.put(`/owners/${id}`, values);

            getOwner();

            setOwner(null);

            toast.info("Owner updated successfully");

            setOpenSheet(false);
            setIsSheetLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function getOwner() {
        try {
            const ownerData = await apiClient.get<Owner>(`/owners/${id}`);

            setOwner(ownerData);

            form.reset({
                firstname: ownerData.firstname,
                lastname: ownerData.lastname,
                phone_number: ownerData.phone_number,
                address: ownerData.address,
                email: ownerData.email
            });
        } catch (error) {
            if (error.response.status == 404) {
                setErrormessage(error.response.data);
            }
        }
    }

    async function getOwnerCars() {
        try {
            setIsLoading(true);

            const carsData = await apiClient.get<Car[]>(`/owners/${id}/cars`);

            setCars(carsData);
            setIsLoading(false);
        } catch (error) {
            if (error.response.status == 404) {
                setErrormessage(error.response.data);
            }
        }
    }

    async function deleteCarSubmit(id: number) {
        try {
            await apiClient.delete(`/cars/${id}`);

            getOwnerCars();

            toast.info("Car deleted successfully");
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getOwner();
        getOwnerCars();
    }, [id]);

    return (
        <div style={{
            padding: "20px"
        }}>
            <section className="owner-profile bg-gradient-to-r from-slate-50 to-slate-100 rounded-xl p-8 mb-8 shadow-md flex items-center justify-between">
                {owner ? (
                    <>
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 rounded-full bg-slate-200 flex items-center justify-center text-xl font-bold text-slate-700">
                                {owner.firstname[0]}
                            </div>

                            <div>
                                <h2 className="text-2xl font-semibold text-slate-800">
                                    {owner.firstname} {owner.lastname}
                                </h2>
                                <div className="grid grid-cols-2 gap-x-8 gap-y-2 mt-3 text-slate-600 text-sm">
                                    <div className="flex items-center gap-2">
                                        <Mail size={16} className="text-slate-500" />
                                        {owner.email}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={16} className="text-slate-500" />
                                        {owner.phone_number}
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <MapPin size={16} className="text-slate-500" />
                                        {owner.address}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>


                            <Sheet open={openSheet} onOpenChange={setOpenSheet}>
                                <SheetTrigger asChild>
                                    <Button
                                        variant="outline"
                                        className="text-emerald-700 border-emerald-500 hover:bg-emerald-50 cursor-pointer"
                                    >
                                        <Edit3 size={16} className="mr-2" /> Edit
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
                                            <form onSubmit={form.handleSubmit(editOwnerSubmit)}>
                                                <SheetHeader>
                                                    <SheetTitle>Edit mechanic</SheetTitle>
                                                </SheetHeader>
                                                <FormField
                                                    control={form.control}
                                                    name="firstname"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Firstname</FormLabel>
                                                            <FormControl>
                                                                <Input {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="lastname"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Lastname</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="phone_number"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Phone</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="address"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Address</FormLabel>
                                                            <FormControl>
                                                                <Input placeholder="..." {...field} />
                                                            </FormControl>
                                                            <FormMessage />
                                                        </FormItem>
                                                    )}
                                                />
                                                <FormField
                                                    control={form.control}
                                                    name="email"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Email</FormLabel>
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
                        </div>
                    </>
                ) : (
                    <div className="flex items-center gap-6 w-full justify-between">
                        <div className="flex items-center gap-6">
                            <Skeleton className="w-20 h-20 rounded-full bg-gray-300 animate-pulse" />
                            <div className="space-y-3">
                                <Skeleton className="h-6 w-40 bg-gray-300 animate-pulse" />
                                <div className="grid grid-cols-2 gap-3 mt-2">
                                    <Skeleton className="h-4 w-32 bg-gray-300 animate-pulse" />
                                    <Skeleton className="h-4 w-28 bg-gray-300 animate-pulse" />
                                    <Skeleton className="h-4 w-36 bg-gray-300 animate-pulse" />
                                </div>
                            </div>
                        </div>
                        <Skeleton className="h-10 w-24 rounded-md bg-gray-300 animate-pulse" />
                    </div>
                )}
            </section>

            <section className="owner-cars">
                <div className="flex items-center justify-between mb-6">
                    <h3 className="text-xl font-semibold text-slate-900">My Cars</h3>
                </div>

                {isLoading ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {Array.from({ length: 6 }).map((_, i) => (
                            <CarSkeleton key={i} />
                        ))}
                    </div>
                ) : cars.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {cars.filter(c => !c.is_deleted).map((car) => (
                            <div
                                key={car.car_id}
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
                                            <button className="cursor-pointer flex-1 px-2 py-1 rounded-md border border-yellow-400 bg-yellow-50 hover:bg-yellow-100 text-sm">
                                                Edit
                                            </button>
                                            <button className="cursor-pointer flex-1 px-2 py-1 rounded-md border border-red-400 bg-red-50 hover:bg-red-100 text-sm text-red-600"
                                                onClick={() => deleteCarSubmit(car.car_id)}
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
                        ))}
                    </div>
                ) : (
                    <div className="text-center text-slate-400 py-12 border-2 border-dashed border-slate-200 rounded-lg">
                        <CarIcon className="mx-auto h-12 w-12 mb-3 text-slate-300" />
                        <p>No cars added yet. Add your first car to keep track of repairs.</p>
                    </div>
                )}
            </section>


            {owner &&
                <pre>
                    {JSON.stringify(owner, null, 2)}
                </pre>
            }

            {/* Loader if not */}

            {cars &&
                <pre>
                    {JSON.stringify(cars, null, 2)}
                </pre>
            }
        </div>
    );
}