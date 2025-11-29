"use client";

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
    SheetTrigger,
} from "@/components/ui/sheet";
import { Loader2, Edit3 } from "lucide-react";
import { useForm } from "react-hook-form";
import z from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Owner } from "@/types/Owner";

interface OwnerEditSheetProps {
    open: boolean;
    setOpen: (open: boolean) => void;
    owner: Owner | null;
    isLoading: boolean;
    onSubmit: (values: z.infer<typeof formSchema>) => Promise<void>;
}

const formSchema = z.object({
    firstname: z.string().min(1).max(40),
    lastname: z.string().min(1).max(60),
    email: z.string().max(200).regex(/^((?!\.)[\w\-_.]*[^.])(@\w+)(\.\w+(\.\w+)?[^.\W])$/).or(z.string().length(0)),
    phone_number: z.string().regex(/[0-9]{9,10}/),
    address: z.string().min(5).max(100).optional()
});

export function OwnerEditSheet({
    open,
    setOpen,
    owner,
    isLoading,
    onSubmit
}: OwnerEditSheetProps) {
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            firstname: owner?.firstname ?? "",
            lastname: owner?.lastname ?? "",
            email: owner?.email ?? "",
            phone_number: owner?.phone_number ?? "",
            address: owner?.address ?? "",
        },
    });

    return (
        <div>
            <Sheet open={open} onOpenChange={setOpen}>
                <SheetTrigger asChild>
                    <Button
                        variant="outline"
                        className="text-emerald-700 border-emerald-500 hover:bg-emerald-50 cursor-pointer"
                    >
                        <Edit3 size={16} className="mr-2" /> Edit
                    </Button>
                </SheetTrigger>

                <SheetContent style={{ padding: "20px" }}>
                    {isLoading ? (
                        <div className="flex items-center justify-center py-20">
                            <Loader2 className="animate-spin h-8 w-8 text-gray-500" />
                            <span className="ml-2 text-gray-600">Saving...</span>
                        </div>
                    ) : (
                        <Form {...form}>
                            <form onSubmit={form.handleSubmit(onSubmit)}>
                                <SheetHeader>
                                    <SheetTitle>Edit owner</SheetTitle>
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
                                    name="address"
                                    render={({ field }) => (
                                        <FormItem>
                                            <FormLabel>Address</FormLabel>
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
                                        <Button className="cursor-pointer" variant="outline">
                                            Cancel
                                        </Button>
                                    </SheetClose>
                                    <Button className="cursor-pointer" type="submit">
                                        Submit
                                    </Button>
                                </SheetFooter>
                            </form>
                        </Form>
                    )}
                </SheetContent>
            </Sheet>
        </div>
    );
}