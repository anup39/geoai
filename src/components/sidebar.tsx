"use client";

import Image from "next/image";
import Link from "next/link";
import { Montserrat } from "next/font/google";


import { cn } from "@/lib/utils";
import { LayoutDashboard, MessageSquare } from "lucide-react";
import { usePathname } from "next/navigation";


const montserrat = Montserrat({
    weight: '600',
    subsets: ['latin']
});


const routes = [
    {
        label: 'Dashboard',
        href: '/dashboard',
        icon: LayoutDashboard,
        color: 'text-sky-500'
    },
    {
        label: "Conversation",
        icon: MessageSquare,
        href: "/conversation",
        color: 'text-violet-500'
    },

]


const Sidebar = () => {
    const pathname = usePathname();
    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#111827] text-white">
            <div className="px-3 py-2 flex-1">
                <Link href="/dashboard" className="flex items-center pl-3 mb-14">
                    <div
                        className="relative w-8 h-8 mr-4">
                        <Image fill alt="Logo" src="/globe.svg" />
                    </div>
                    <h1 className={cn("text-2xl font-bold", montserrat.className)}>LaxmiAI</h1>
                </Link>

                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link href={route.href} key={route.href} className={cn("text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition", pathname === route.href ? "text-white" : "text-zinc-400")}>

                            <div className="flex items-center flex-1">
                                <route.icon className={cn("w-5 h-5 mr-3", route.color)} />
                                {route.label}
                            </div>
                        </Link>

                    ))}
                </div>



            </div>
        </div >
    );
}
export default Sidebar;

