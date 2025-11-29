"use client";

import { Resolver, useForm } from "react-hook-form";
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
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetFooter,
    SheetHeader,
    SheetTitle,
    SheetTrigger
} from "@/components/ui/sheet";
import { Loader2 } from "lucide-react";
import { FormCombobox } from "@/components/FormCombobox";

import { Owner } from "@/types/Owner";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
    registration_number: z.string().min(5).max(15),
    brand: z.string().min(1).max(30),
    model: z.string().min(1).max(30),
    production_year: z.coerce.number().int().min(1900),
    mileage: z.coerce.number().int().min(1),
    owner_id: z.coerce.number().int().min(1),
    vin: z.string().length(17).or(z.string().length(0)).optional()
});

export type CarEditFormValues = z.infer<typeof formSchema>;

interface CarEditSheetProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    owners: Owner[];
    isSaving: boolean;
    defaultValues: CarEditFormValues;
    onSubmit: (values: CarEditFormValues) => void;
}

export function CarEditSheet({
    open,
    onOpenChange,
    owners,
    isSaving,
    defaultValues,
    onSubmit
}: CarEditSheetProps) {

    const resolver = zodResolver(formSchema) as Resolver<CarEditFormValues>;

    const form = useForm<CarEditFormValues>({
        resolver,
        defaultValues
    });

    useEffect(() => {
        if (open) form.reset(defaultValues);
    }, [defaultValues, open]);

    return (
        <Sheet open={open} onOpenChange={onOpenChange}>
            <SheetTrigger asChild>
                <Button
                    variant="outline"
                    className="text-emerald-900 border-emerald-400 hover:bg-emerald-100 cursor-pointer"
                >
                    Edit
                </Button>
            </SheetTrigger>

            <SheetContent style={{ padding: "20px" }}>
                <SheetHeader>
                    <SheetTitle>Edit car</SheetTitle>
                </SheetHeader>
                {isSaving ? (
                    <div className="flex items-center justify-center py-20">
                        <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                        <span className="ml-2 text-gray-600">Saving...</span>
                    </div>
                ) : (
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)}>

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
                                            <Input {...field} />
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
                                            <Input {...field} />
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
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
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
                                            <Input
                                                {...field}
                                                value={field.value ?? ""}
                                                onChange={(e) => field.onChange(e.target.value)}
                                            />
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
                                        <FormCombobox
                                            value={field.value?.toString() ?? ""}
                                            onChange={field.onChange}
                                            options={owners.map((owner) => ({
                                                value: owner.owner_id.toString(),
                                                label: `${owner.firstname} ${owner.lastname}`,
                                            }))}
                                            placeholder="Select an owner"
                                        />
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
                                            <Input {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <SheetFooter>
                                <SheetClose asChild>
                                    <Button variant="outline" className="cursor-pointer">
                                        Cancel
                                    </Button>
                                </SheetClose>

                                <Button type="submit" className="cursor-pointer">
                                    Submit
                                </Button>
                            </SheetFooter>
                        </form>
                    </Form>
                )}
            </SheetContent>
        </Sheet>
    );
}