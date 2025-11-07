"use client"

import { useEffect, useState } from "react"
import { z } from "zod";
import { useForm } from "react-hook-form";
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
import { Repair } from "@/types/Repair";
import { Car } from "@/types/Car";
import { Mechanic } from "@/types/Mechanic";
import { apiClient } from "@/lib/apiClient";

const formSchema = z.object({
    car_id: z.string().regex(/\b[0-9]+\b/),
    mechanic_id: z.string().regex(/\b[0-9]+\b/),
    date: z.string().regex(/\b[0-9]{2}.[0-9]{2}.[0-9]{4}\b/),
    time: z.string().regex(/\b[0-9]{1,2}:[0-9]{2}\b/),
    description: z.string().min(1),
    estimated_work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    cost: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    work_time: z.string().regex(/\b[0-9]+\.?[0-9]{0,}\b/),
    status: z.string()
});

export default function Repairs() {
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [cars, setCars] = useState<Car[]>([]);
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [open, setOpen] = useState<boolean>(false);

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

    async function getCars() {
        try {
            const carsData = await apiClient.get<Car[]>("/cars");

            setCars(carsData);
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

    async function addRepairSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.post("/repairs", values);

            getRepairs();

            toast.success("Repair created successfully");

            form.reset();

            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        getRepairs();
        getCars();
        getMechanics();
    }, []);

    return (
        <div>
            <div>
                Repairs
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer" style={{
                            background: "#08aa54"
                        }}>Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addRepairSubmit)}>
                                <DialogHeader>
                                    <DialogTitle>Add repair</DialogTitle>
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
                                            <Select onValueChange={field.onChange} defaultValue="1">
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
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Repair ID</TableHead>
                        <TableHead>Car ID</TableHead>
                        <TableHead>Mechanic ID</TableHead>
                        <TableHead>Date</TableHead>
                        <TableHead>Time</TableHead>
                        <TableHead>Description</TableHead>
                        <TableHead>Estimated work time</TableHead>
                        <TableHead>Work time</TableHead>
                        <TableHead>Cost</TableHead>
                        <TableHead>Status</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {repairs.map((repair) => (
                        <TableRow key={repair.repair_id}>
                            <TableCell>
                                <Link
                                    href={`/repair/${repair.repair_id}`}
                                    className="underline text-blue-600 hover:text-blue-800"
                                >
                                    {repair.repair_id}
                                </Link>
                            </TableCell>
                            <TableCell>
                                {repair.carData ? (
                                    <Link
                                        href={`/car/${repair.car_id}`}
                                        className="underline text-blue-600 hover:text-blue-800"
                                    >
                                        {repair.carData.registration_number}
                                    </Link>
                                ) : (
                                    <Skeleton className="h-4 w-24 rounded-md bg-gray-300 animate-pulse" />
                                )}
                            </TableCell>
                            <TableCell>
                                {repair.mechanicData ? (
                                    <Link
                                        href={`/mechanic/${repair.mechanic_id}`}
                                        className="underline text-blue-600 hover:text-blue-800"
                                    >
                                        {repair.mechanicData.firstname} {repair.mechanicData.lastname}
                                    </Link>
                                ) : (
                                    <Skeleton className="h-4 w-24 rounded-md bg-gray-300 animate-pulse" />
                                )}
                            </TableCell>
                            <TableCell>{repair.date}</TableCell>
                            <TableCell>{repair.time}</TableCell>
                            <TableCell>{repair.description}</TableCell>
                            <TableCell>{repair.estimated_work_time}</TableCell>
                            <TableCell>{repair.work_time}</TableCell>
                            <TableCell>{repair.cost}</TableCell>
                            <TableCell>{repair.status}</TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>
            <pre>
                <code>
                    {JSON.stringify(repairs, null, 5)}
                </code>
            </pre>
            <pre>
                <code>
                    {JSON.stringify(cars, null, 5)}
                </code>
            </pre>
            <pre>
                <code>
                    {JSON.stringify(mechanics, null, 5)}
                </code>
            </pre>
        </div>
    );
}