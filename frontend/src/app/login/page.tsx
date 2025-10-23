"use client"

import { zodResolver } from "@hookform/resolvers/zod"
import { useForm } from "react-hook-form"
import { z } from "zod"
import { Button } from "@/components/ui/button"
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input";
import { useState } from "react"
import { useRouter } from "next/navigation"
import { AxiosError } from "axios"

import { useJwt } from "../../contexts/JwtContext"
import { auth } from "@/lib/auth"
import { apiClient } from "@/lib/apiClient"

const formSchema = z.object({
    login: z.string().min(3).max(30),
    password: z.string().min(1).max(50)
});

export default function Login() {
    const { setUsername, setRole } = useJwt();
    const [logged, setLogged] = useState(false);
    const [error, setError] = useState("");

    const router = useRouter();

    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            login: "",
            password: ""
        },
    });

    async function loginSubmit(values: z.infer<typeof formSchema>) {
        type ResponseFromLogin = {
            accessToken: string,
            login: string,
            role: string
        };

        try {
            const response: ResponseFromLogin = await apiClient.post("/user/login", values);

            auth.setAccessToken(response.accessToken);
            setUsername(response.login);
            setRole(response.role);
            setLogged(true);
            router.push("/");
        } catch (error: AxiosError) {
            setError(error.response.data.message);
        }
    }

    function back() {
        setLogged(false);
        setError("");
    }

    return (
        <div style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            height: "calc(100vh - 150px)"
        }}>
            {!logged &&
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(loginSubmit)} className="space-y-8" style={{
                        width: "300px"
                    }}>
                        <h1 className="text-center font-semibold text-xl">Login</h1>
                        {error &&
                            <p style={{
                                textAlign: "center",
                                color: "red"
                            }}>{error}</p>
                        }
                        <FormField
                            control={form.control}
                            name="login"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Login</FormLabel>
                                    <FormControl>
                                        <Input {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Password</FormLabel>
                                    <FormControl>
                                        <Input placeholder="..." {...field} />
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div style={{
                            textAlign: "center"
                        }}>
                            <Button type="submit">Submit</Button>
                        </div>
                    </form>
                </Form>
            }
            {/* {!logged && error &&
                <div className="text-center">
                    <h1>Error</h1>
                    <h2>{error}</h2>
                    <Button onClick={back}>Back</Button>
                </div>
            } */}
            {logged && !error &&
                <div className="text-center">
                    <h1>Success</h1>
                    <h2>You are logged</h2>
                    <div style={{
                        textAlign: "center"
                    }}>
                        <Button onClick={back}>Back</Button>
                    </div>
                </div>
            }
        </div>
    )
}