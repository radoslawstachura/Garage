"use client"

import { useJwt } from "@/contexts/JwtContext";
import Link from "next/link";
import { Button } from "./ui/button";
import { useRouter } from "next/navigation";

import { auth } from "@/lib/auth";
import { apiClient } from "@/lib/apiClient";

export default function Header() {
    const { username, setUsername, role, setRole } = useJwt();

    const router = useRouter();

    async function logout() {
        try {
            await apiClient.post("/user/logout");

            auth.clearAccessToken();
            setUsername(null);
            setRole(null);
            router.push("/login");
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <nav style={{
            display: "flex",
            background: "#222",
            padding: "10px 20px",
            justifyContent: "space-between"
        }}>
            <div>
                <Link href="/">
                    <Button variant="ghost" className="text-white mx-2 cursor-pointer">Dashboard</Button>
                </Link>
                <Link href="/cars">
                    <Button variant="ghost" className="text-white mx-2 cursor-pointer">Cars</Button>
                </Link>
                <Link href="/mechanics">
                    <Button variant="ghost" className="text-white mx-2 cursor-pointer">Mechanics</Button>
                </Link>
                <Link href="/repairs">
                    <Button variant="ghost" className="text-white mx-2 cursor-pointer">Repairs</Button>
                </Link>
                <Link href="/owners">
                    <Button variant="ghost" className="text-white mx-2 cursor-pointer">Owners</Button>
                </Link>
                <Link href="/calendar">
                    <Button variant="ghost" className="text-white mx-2 cursor-pointer">Calendar</Button>
                </Link>
            </div>
            <div>
                <span className="text-white">role: {role}</span>
                {!username &&
                    <Link href="/login">
                        <Button variant="ghost" className="text-white mx-2 cursor-pointer">Login</Button>
                    </Link>
                }
                {username &&
                    <>
                        <p className="inline-block text-white mx-2">{username}</p>
                        <Button onClick={logout} variant="ghost" className="text-white mx-2 cursor-pointer">Logout</Button>
                    </>
                }
            </div>
        </nav>
    );
}