"use client"

import { useEffect, useState } from "react"
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import Link from "next/link";

import {
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    Tooltip,
} from "recharts";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
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
import { Skeleton } from "@/components/ui/skeleton";

import { Mechanic } from "@/types/Mechanic";
import { apiClient } from "@/lib/apiClient";
import { Repair } from "@/types/Repair";

const formSchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    specialization: z.string().min(1).max(50),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/)
});

export default function Mechanics() {
    const [mechanics, setMechanics] = useState<Mechanic[]>([]);
    const [repairs, setRepairs] = useState<Repair[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    async function getMechanics() {
        try {
            setIsLoading(true);

            const mechanicsData = await apiClient.get<Mechanic[]>("/mechanics");

            setMechanics(mechanicsData);

            setIsLoading(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function getRepairs() {
        try {
            setIsLoading(true);

            const repairsData = await apiClient.get<Repair[]>("/repairs");

            setRepairs(repairsData);

            setIsLoading(false);
        } catch (error) {
            console.log(error);
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

    async function addMechanicSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.post("/mechanics", values);

            getMechanics();

            toast.success("Mechanic created successfully");

            form.reset();

            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    const repairsPerMechanic = (mechanics.length && repairs.length)
        ? mechanics.map((m) => {
            return {
                mechanic: m,
                count: repairs.filter(r => r.mechanic_id === m.mechanic_id).length
            }
        })
            .sort((a, b) => b.count - a.count)
        : [];

    const mechanicsChartData = repairsPerMechanic.map(item => (
        {
            label: `${item.mechanic.firstname} ${item.mechanic.lastname}`,
            value: item.count
        }
    ));

    useEffect(() => {
        getMechanics();
        getRepairs();
    }, []);

    return (
        <div style={{
            padding: "20px"
        }}>
            <div>
                Mechanics
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer" style={{
                            background: "#08aa54"
                        }}>Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addMechanicSubmit)}>
                                <DialogHeader>
                                    <DialogTitle>Add mechanic</DialogTitle>
                                </DialogHeader>
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
            <div>
                <Card
                    className="shadow-md hover:shadow-lg transition-all duration-300 border border-gray-200"
                >
                    <CardHeader>
                        <CardTitle className="text-lg font-semibold text-gray-800">
                            Repairs per mechanic
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <ResponsiveContainer width="100%" height={200}>
                            <BarChart data={mechanicsChartData} margin={{ top: 10, right: 10, left: 0, bottom: 20 }}>
                                <XAxis
                                    dataKey="label"
                                    tickLine={false}
                                    axisLine={false}
                                    tick={{ fill: "#6b7280", fontSize: 12 }}
                                />
                                <Tooltip
                                    cursor={{ fill: "rgba(0, 0, 0, 0.05)" }}
                                    contentStyle={{
                                        backgroundColor: "white",
                                        borderRadius: "8px",
                                        border: "1px solid #e5e7eb",
                                        boxShadow: "0 4px 10px rgba(0,0,0,0.1)",
                                        padding: "8px 12px",
                                    }}
                                    labelStyle={{ color: "#111827", fontWeight: 600 }}
                                    itemStyle={{ color: "#3b82f6" }}
                                />

                                <defs>
                                    <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                                        <stop offset="0%" stopColor="#3b82f6" stopOpacity={0.9} />
                                        <stop offset="100%" stopColor="#60a5fa" stopOpacity={0.6} />
                                    </linearGradient>
                                </defs>
                                <Bar dataKey="value" fill="url(#barGradient)" radius={[6, 6, 0, 0]} barSize={30} />
                            </BarChart>
                        </ResponsiveContainer>
                    </CardContent>
                </Card>
            </div>
            <div className="rounded-lg shadow-sm overflow-hidden border border-gray-200 mt-4">
                <Table>
                    <TableHeader>
                        <TableRow className="bg-gray-100">
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Firstname
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Lastname
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Specialization
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Phone
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Email
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-right">
                            </TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={6}>
                                        <Skeleton className="h-4 w-full rounded-md bg-gray-300 animate-pulse" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : mechanics.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                    No results found
                                </TableCell>
                            </TableRow>
                        ) : (
                            mechanics.map((mechanic) => (
                                <TableRow
                                    key={mechanic.mechanic_id}
                                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    <TableCell className="px-3 py-2 text-sm">{mechanic.firstname}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{mechanic.lastname}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{mechanic.specialization}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{mechanic.phone_number}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{mechanic.email}</TableCell>
                                    <TableCell className="px-3 py-2 text-right">
                                        <Link href={`/mechanic/${mechanic.mechanic_id}`}>
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
                    {JSON.stringify(mechanics, null, 5)}
                </code>
            </pre>
            <pre>
                {JSON.stringify(repairsPerMechanic, null, 2)}
            </pre>
        </div>
    );
}