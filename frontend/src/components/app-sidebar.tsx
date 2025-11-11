import { LayoutDashboard, Car, Wrench, Hammer, Users, CalendarDays, User2, ChevronUp } from "lucide-react"

import {
    Sidebar,
    SidebarHeader,
    SidebarContent,
    SidebarGroup,
    SidebarGroupContent,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
    SidebarFooter,
} from "@/components/ui/sidebar"

import { useJwt } from "@/contexts/JwtContext";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "./ui/button";

import { auth } from "@/lib/auth";
import { apiClient } from "@/lib/apiClient";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@radix-ui/react-dropdown-menu";

const items = [
    {
        title: "Dashboard",
        url: "/",
        icon: LayoutDashboard,
    },
    {
        title: "Cars",
        url: "/cars",
        icon: Car,
    },
    {
        title: "Mechanics",
        url: "/mechanics",
        icon: Wrench,
    },
    {
        title: "Repairs",
        url: "/repairs",
        icon: Hammer,
    },
    {
        title: "Owners",
        url: "/owners",
        icon: Users,
    },
    {
        title: "Calendar",
        url: "/calendar",
        icon: CalendarDays,
    },
]

export function AppSidebar() {
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
        <Sidebar>
            <SidebarHeader>Garage</SidebarHeader>
            <SidebarContent>
                <SidebarGroup>
                    <SidebarGroupContent>
                        <SidebarMenu>
                            {items.map((item) => (
                                <SidebarMenuItem key={item.title}>
                                    <SidebarMenuButton asChild>
                                        <a href={item.url}>
                                            <item.icon />
                                            <span>{item.title}</span>
                                        </a>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            ))}
                        </SidebarMenu>
                    </SidebarGroupContent>
                </SidebarGroup>
                <SidebarFooter>
                    <span>role: {role}</span>
                    {!username ? (
                        <Link href="/login">
                            <Button className="w-full px-1 cursor-pointer">Login</Button>
                        </Link>
                    ) : (
                        <div className="flex items-center gap-2">
                            <span className="p-1 w-8 h-8 border flex items-center justify-center border-black rounded-full bg-slate-200 font-bold text-slate-700">
                                {username[0]}{username[1]}
                            </span>

                            <span className="font-medium">{username}</span>

                            <Button
                                onClick={logout}
                                variant="outline"
                                size="sm"
                                className="text-slate-700 border-slate-400 hover:bg-slate-100 ml-auto px-2 py-1 text-sm h-7 cursor-pointer"
                            >
                                Logout
                            </Button>
                        </div>

                        // <>
                        //     <p className="inline-block px-1">{username}</p>
                        //     <Button onClick={logout} className="px-1 cursor-pointer">Logout</Button>
                        // </>
                    )}
                </SidebarFooter>
            </SidebarContent>
        </Sidebar>
    )
}