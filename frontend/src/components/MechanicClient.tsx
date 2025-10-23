"use client"

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { toast } from "sonner";

import { Mechanic } from "@/types/Mechanic";
import { Repair } from "@/types/Repair";
import { Car } from "@/types/Car";
import { apiClient } from "@/lib/apiClient";
import { Loader2, Search, Wrench } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Skeleton } from "./ui/skeleton";
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";

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
    const [mechanic, setMechanic] = useState<Mechanic | null>(null);
    const [errorMessage, setErrormessage] = useState("");
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [isLoading, setIsLoading] = useState<boolean>(false);
    const [isSheetLoading, setIsSheetLoading] = useState<boolean>(false);
    const [open, setOpen] = useState<boolean>(false);
    const [openSheet, setOpenSheet] = useState<boolean>(false);

    async function getMechanic() {
        try {
            const mechanicData = await apiClient.get<Mechanic>(`/mechanics/${id}`);

            setMechanic(mechanicData);

            form.reset({
                firstname: mechanicData.firstname,
                lastname: mechanicData.lastname,
                specialization: mechanicData.specialization,
                phone_number: mechanicData?.phone_number,
                email: mechanicData.email
            });
        } catch (error) {
            if (error.response.status == 404) {
                setErrormessage(error.response.data);
            }
        }
    }

    async function getMechanicRepairs() {
        try {
            setIsLoading(true);

            const repairsData = await apiClient.get<Repair[]>(`/mechanics/${id}/repairs`);

            const repairsWithDetails = await Promise.all(
                repairsData.map(async (repair) => {
                    const carData = await apiClient.get<Car>(`/cars/${repair.car_id}`);

                    return {
                        ...repair,
                        carData
                    };
                })
            );

            repairsWithDetails.sort((a, b) =>
                new Date(b.date).getTime() - new Date(a.date).getTime()
            );

            setRepairs(repairsWithDetails);
        } catch (error) {
            if (error.response.status == 404) {
                setErrormessage(error.response.data);
            }
        } finally {
            setIsLoading(false);
        }
    }

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: "",
            lastname: "",
            specialization: "",
            phone_number: "",
            email: ""
        }
    });

    async function editMechanicSubmit(values: z.infer<typeof formSchema>) {
        try {
            setIsSheetLoading(true);

            await apiClient.put(`/mechanics/${id}`, values);

            setMechanic(null);

            getMechanic();

            toast.info("Mechanic updated successfully");

            setOpenSheet(false);
            setIsSheetLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getMechanic();
        getMechanicRepairs();
    }, [id]);

    return (
        <div style={{
            padding: "20px"
        }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>
                            {mechanic ? `${mechanic.firstname} ${mechanic.lastname}` : (
                                <Skeleton className="h-6 w-40 bg-gray-300 animate-pulse" />
                            )}
                        </CardTitle>
                        {isLoading ? (
                            <Skeleton className="h-10 w-18 rounded-md bg-gray-300 animate-pulse" />
                        ) : (
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
                                            <form onSubmit={form.handleSubmit(editMechanicSubmit)}>
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
                                                    name="specialization"
                                                    render={({ field }) => (
                                                        <FormItem>
                                                            <FormLabel>Specialization</FormLabel>
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
                        )}
                    </CardHeader>
                    <CardContent className="space-y-2">
                        {mechanic ? (
                            <>
                                <p><b>Firstname:</b> {mechanic.firstname}</p>
                                <p><b>Lastname:</b> {mechanic.lastname}</p>
                                <p><b>Specialization:</b> {mechanic.specialization}</p>
                                <p><b>Phone:</b> {mechanic.phone_number || "-"}</p>
                                <p><b>Email:</b> {mechanic.email}</p>
                            </>
                        ) : (
                            <div className="space-y-2">
                                <Skeleton className="h-4 w-40 bg-gray-300 animate-pulse" />
                                <Skeleton className="h-4 w-44 bg-gray-300 animate-pulse" />
                                <Skeleton className="h-4 w-48 bg-gray-300 animate-pulse" />
                                <Skeleton className="h-4 w-36 bg-gray-300 animate-pulse" />
                                <Skeleton className="h-4 w-52 bg-gray-300 animate-pulse" />
                            </div>
                        )}
                    </CardContent>
                </Card>

                <Card>
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
                                        <div className="absolute -left-3 top-1 w-5 h-5 bg-green-500 rounded-full border-2 border-white" />
                                        <div className="ml-2">
                                            <p className="text-sm text-gray-500">{new Date(repair.date).toLocaleDateString("pl-PL", {
                                                day: "2-digit",
                                                month: "2-digit",
                                                year: "numeric"
                                            })}</p>
                                            <p className="font-semibold">{repair.description}</p>
                                            <p className="text-sm text-gray-600">
                                                Car: <Link href={`/car/${repair.car_id}`} className="underline text-blue-600 hover:text-blue-800">
                                                    {repair.carData?.brand} {repair.carData?.model} ({repair.carData?.registration_number})
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

            {mechanic &&
                <pre>
                    {JSON.stringify(mechanic, null, 2)}
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