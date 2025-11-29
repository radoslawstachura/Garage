"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

import {
    Dialog,
    DialogClose,
    DialogContent,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger
} from "@/components/ui/dialog";

import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Loader2 } from "lucide-react";
import { Plus } from "lucide-react";

import { FormCombobox } from "./FormCombobox";
import { Car } from "@/types/Car";
import { Mechanic } from "@/types/Mechanic";

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

interface AddRepairDialogProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    cars: Car[];
    mechanics: Mechanic[];
    onSubmit: (values: z.infer<typeof formSchema>) => void;
    isLoading: boolean;
}

export function AddRepairDialog({ open, setOpen, cars, mechanics, onSubmit, isLoading }: AddRepairDialogProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            car_id: cars[0]?.car_id.toString() ?? "1",
            mechanic_id: mechanics[0]?.mechanic_id.toString() ?? "1",
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
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer">
                    <Plus className="w-4 h-4" />
                    Add Record
                </Button>
            </DialogTrigger>

            <DialogContent showCloseButton={false}>
                {isLoading ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                        <span className="ml-2 text-gray-600">Saving...</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>
                            <DialogHeader>
                                <DialogTitle>Add repair</DialogTitle>
                            </DialogHeader>

                            <FormField
                                control={form.control}
                                name="car_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Car</FormLabel>
                                        <FormCombobox
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={cars.map((car) => ({
                                                value: car.car_id.toString(),
                                                label: car.registration_number,
                                            }))}
                                            placeholder="Select a car"
                                        />
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
                                        <FormCombobox
                                            value={field.value}
                                            onChange={field.onChange}
                                            options={mechanics.map((m) => ({
                                                value: m.mechanic_id.toString(),
                                                label: `${m.firstname} ${m.lastname}`,
                                            }))}
                                            placeholder="Select a mechanic"
                                        />
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField control={form.control} name="date" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Date</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Time</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="description" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Description</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="estimated_work_time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Estimated work time</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="work_time" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Work time</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="cost" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Cost</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <FormField control={form.control} name="status" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Status</FormLabel>
                                    <FormControl>
                                        <Input {...field} placeholder="..." />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <DialogFooter className="pt-5">
                                <DialogClose asChild>
                                    <Button className="bg-gray-500 hover:bg-gray-600 text-white font-medium flex items-center gap-2 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer">
                                        Cancel
                                    </Button>
                                </DialogClose>
                                <Button
                                    type="submit"
                                    className="bg-emerald-600 hover:bg-emerald-700 text-white font-medium flex items-center gap-2 rounded-xl shadow-md transition-all hover:shadow-lg cursor-pointer"
                                >
                                    Submit
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                )}
            </DialogContent>
        </Dialog>
    );
}