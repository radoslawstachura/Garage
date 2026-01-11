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
import { Skeleton } from "@/components/ui/skeleton";

import { Owner } from "@/types/Owner";
import { apiClient } from "@/lib/apiClient";
import { useJwt } from "@/contexts/JwtContext";

const formSchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/).or(z.string().length(0)),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    address: z.string().min(5).max(100).optional()
});

export default function Owners() {
    const [owners, setOwners] = useState<Owner[]>([]);
    const [open, setOpen] = useState<boolean>(false);
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const { role } = useJwt();

    async function getOwners() {
        try {
            setIsLoading(true);
            const ownersData = await apiClient.get<Owner[]>("/owners");
            setOwners(ownersData);
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
            phone_number: "",
            address: "",
            email: ""
        }
    });

    async function addOwnerSubmit(values: z.infer<typeof formSchema>) {
        try {
            await apiClient.post("/owners", values);

            getOwners();

            toast.success("Owner created successfully");

            form.reset();

            setOpen(false);
        } catch (error) {
            console.log(error);
        }
    }

    async function handleDelete(id: number) {
        try {
            setIsLoading(true);
            await apiClient.delete(`/owners/${id}`);
        } catch (error) {
            console.log(error);
        } finally {
            getOwners();
        }
    }

    useEffect(() => {
        getOwners();
    }, []);

    return (
        <div style={{
            padding: "20px"
        }}>
            <div>
                Owners
                <Dialog open={open} onOpenChange={setOpen}>
                    <DialogTrigger asChild>
                        <Button className="cursor-pointer" style={{
                            background: "#08aa54"
                        }}>Add</Button>
                    </DialogTrigger>
                    <DialogContent>
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(addOwnerSubmit)}>
                                <DialogHeader>
                                    <DialogTitle>Add owner</DialogTitle>
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
                                Email
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Phone
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm">
                                Address
                            </TableHead>
                            <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm text-right">
                            </TableHead>
                            {role === "admin" &&
                                <TableHead className="px-3 py-2 font-semibold text-gray-700 text-sm text-right">
                                </TableHead>
                            }
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {isLoading ? (
                            [...Array(5)].map((_, i) => (
                                <TableRow key={i}>
                                    <TableCell colSpan={role === "admin" ? 7 : 6}>
                                        <Skeleton className="h-4 w-full rounded-md bg-gray-300 animate-pulse" />
                                    </TableCell>
                                </TableRow>
                            ))
                        ) : owners.length === 0 ? (
                            <TableRow>
                                <TableCell colSpan={6} className="text-center py-6 text-gray-500">
                                    No results found
                                </TableCell>
                            </TableRow>
                        ) : (
                            owners.map((owner) => (
                                <TableRow
                                    key={owner.owner_id}
                                    className="border-b last:border-0 hover:bg-gray-50 transition-colors"
                                >
                                    <TableCell className="px-3 py-2 text-sm">{owner.firstname}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{owner.lastname}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{owner.email}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{owner.phone_number}</TableCell>
                                    <TableCell className="px-3 py-2 text-sm">{owner.address}</TableCell>
                                    <TableCell className="px-3 py-2 text-right">
                                        <Link href={`/owner/${owner.owner_id}`}>
                                            <span className="bg-[#e4e6f7] text-[#5664d2] px-3 py-1 rounded-md text-sm font-medium hover:bg-[#cdd0f5] hover:text-[#333] cursor-pointer transition-colors">
                                                View
                                            </span>
                                        </Link>
                                    </TableCell>
                                    {role === "admin" &&
                                        <TableCell className="px-3 py-2 text-right">
                                            <span onClick={() => handleDelete(owner.owner_id)} className="bg-[#fee2e2] text-[#dc2626] px-3 py-1 rounded-md text-sm font-medium 
                                                    hover:bg-[#fecaca] hover:text-[#991b1b] cursor-pointer transition-colors">
                                                Delete
                                            </span>
                                        </TableCell>
                                    }
                                </TableRow>
                            ))
                        )}
                    </TableBody>
                </Table>
            </div>

            <pre>
                <code>
                    {JSON.stringify(owners, null, 5)}
                </code>
            </pre>
        </div>
    );
}