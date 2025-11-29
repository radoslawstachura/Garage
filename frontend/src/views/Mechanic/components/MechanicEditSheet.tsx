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
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { useEffect } from "react";

const formSchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    specialization: z.string().min(1).max(50),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    email: z.string().max(200).regex(
        /^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/
    )
});

export type MechanicEditFormValues = z.infer<typeof formSchema>;

interface MechanicEditSheetProps {
    open: boolean;
    onOpenChange: (v: boolean) => void;
    isSaving: boolean;
    defaultValues: MechanicEditFormValues;
    onSubmit: (values: MechanicEditFormValues) => void;
}

export function MechanicEditSheet({
    open,
    onOpenChange,
    isSaving,
    defaultValues,
    onSubmit
}: MechanicEditSheetProps) {

    const resolver = zodResolver(formSchema) as Resolver<MechanicEditFormValues>;

    const form = useForm<MechanicEditFormValues>({
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
                    <SheetTitle>Edit mechanic</SheetTitle>
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
                                            <Input {...field} />
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
                                            <Input {...field} />
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
                                            <Input {...field} />
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