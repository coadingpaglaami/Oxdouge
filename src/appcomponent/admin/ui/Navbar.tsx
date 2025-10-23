'use client';
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";

export const Navbar=()=>{
    return (
    <nav className="flex justify-end items-center py-4">
<Button variant='outline'><User /> Logout</Button>
    </nav>
);
}