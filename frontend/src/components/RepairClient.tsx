"use client"

import { useEffect, useState } from "react";
import { z } from "zod";
import { useForm, Resolver } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

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
    const [repair, setRepair] = useState<Repair | null>(null);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [errorMessage, setErrormessage] = useState("");
    const [open, setOpen] = useState(false);

    async function getRepair() {
        try {
            const repairData = await apiClient.get<Repair>(`/repairs/${id}`);

            try {
                const carData = await apiClient.get<Car>(`/cars/${repairData.car_id}`);

                repairData.carData = carData;
            } catch (error) {
                if (error.response.status == 404) {
                    setErrormessage(error.response.data);
                }
            }

            try {
                const mechanicData = await apiClient.get<Mechanic>(
                    `/mechanics/${repairData.mechanic_id}`
                );

                repairData.mechanicData = mechanicData;
            } catch (error) {
                if (error.response.status == 404) {
                    setErrormessage(error.response.data);
                }
            }

            setRepair(repairData);

            form.reset({
                car_id: repairData.car_id.toString(),
                mechanic_id: repairData.mechanic_id.toString(),
                date: repairData.date,
                time: repairData.time,
                description: repairData.description,
                estimated_work_time: repairData.estimated_work_time,
                work_time: repairData.work_time,
                cost: repairData.cost,
                status: repairData.status
            });
        } catch (error) {
            if (error.response.status == 404) {
                setErrormessage(error.response.data);
            }
        }
    }

    async function getMechanics() {
        try {
            const mechanicsData = await apiClient.get<Mechanic[]>("/mechanics");

            setMechanics(mechanicsData);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    async function getCars() {
        try {
            const carsData = await apiClient.get<Car[]>("/cars");

            setCars(carsData);
        } catch (error) {
            console.log(error.response.data.message);
        }
    }

    async function editRepairSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.put(`/repairs/${id}`, values);

            getRepair();

            toast.info("Repair updated successfully");

            setOpen(false);
        } catch (error) {
            console.log(error);
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

    useEffect(() => {
        getRepair();
        getMechanics();
        getCars();
    }, [id]);

    return (
        <div>
            <Dialog open={open} onOpenChange={setOpen}>
                <DialogTrigger asChild>
                    <Button className="cursor-pointer" style={{
                        background: "#08aa54"
                    }}>Edit</Button>
                </DialogTrigger>
                <DialogContent>
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
                                                {cars.map((car) => (
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
                                                {mechanics.map((mechanic) => (
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
                </DialogContent>
            </Dialog>
            {repair &&
                <pre>
                    {JSON.stringify(repair, null, 2)}
                </pre>
            }

            {/* Loader if not */}

        </div>
    );
}