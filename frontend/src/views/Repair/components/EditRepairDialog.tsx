"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from "@/components/ui/form";
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";

import { Car } from "@/types/Car";
import { Mechanic } from "@/types/Mechanic";
import { apiClient } from "@/lib/apiClient";
import { Repair } from "@/types/Repair";

interface EditRepairDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    repair: Repair;
    carsList: Car[];
    mechanicsList: Mechanic[];
    onUpdated: () => void;
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

export function EditRepairDialog({ open, onOpenChange, repair, carsList, mechanicsList, onUpdated }: EditRepairDialogProps) {
    const [isLoading, setIsLoading] = useState(false);

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: repair ? {
            car_id: repair.car_id.toString(),
            mechanic_id: repair.mechanic_id.toString(),
            date: repair.date.split("T")[0],
            time: repair.time,
            description: repair.description,
            estimated_work_time: repair.estimated_work_time,
            work_time: repair.work_time,
            cost: repair.cost,
            status: repair.status
        } : {
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

    async function submit(values: z.infer<typeof formSchema>) {
        try {
            setIsLoading(true);
            await apiClient.put(`/repairs/${repair.repair_id}`, values);
            toast.info("Repair updated successfully");
            onUpdated();
            onOpenChange(false);
        } catch (err) {
            console.error(err);
        } finally {
            setIsLoading(false);
        }
    }

    function formatLabel(name: string) {
        return name
            .split("_")
            .map(word => word[0].toUpperCase() + word.slice(1))
            .join(" ");
    }

    useEffect(() => {
        if (repair) {
            form.reset({
                car_id: repair.car_id.toString(),
                mechanic_id: repair.mechanic_id.toString(),
                date: repair.date.split("T")[0],
                time: repair.time,
                description: repair.description,
                estimated_work_time: repair.estimated_work_time,
                work_time: repair.work_time,
                cost: repair.cost,
                status: repair.status
            });
            console.log("Zmiana car_id na:", repair.car_id);
        }
    }, [repair]);

    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                        <span className="ml-2 text-gray-600">Saving...</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(submit)}>
                            <DialogHeader>
                                <DialogTitle>Edit repair</DialogTitle>
                            </DialogHeader>

                            <FormField
                                control={form.control}
                                name="car_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Car</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value.toString()}>
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a car" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {carsList.map((car) => (
                                                    <SelectItem key={car.car_id} value={car.car_id.toString()}>
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
                                            <SelectTrigger>
                                                <SelectValue placeholder="Select a mechanic" />
                                            </SelectTrigger>
                                            <SelectContent>
                                                {mechanicsList.map((mechanic) => (
                                                    <SelectItem key={mechanic.mechanic_id} value={mechanic.mechanic_id.toString()}>
                                                        {mechanic.firstname + " " + mechanic.lastname}
                                                    </SelectItem>
                                                ))}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            {["date", "time", "description", "estimated_work_time", "work_time", "cost", "status"].map((fieldName) => (
                                <FormField
                                    key={fieldName}
                                    control={form.control}
                                    name={fieldName as keyof z.infer<typeof formSchema>}
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>{formatLabel(fieldName)}</FormLabel>
                                            <FormControl>
                                                <Input placeholder="..." {...field} />
                                            </FormControl>
                                            <FormMessage />
                                        </FormItem>
                                    )}
                                />
                            ))}

                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="submit">Submit</Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}