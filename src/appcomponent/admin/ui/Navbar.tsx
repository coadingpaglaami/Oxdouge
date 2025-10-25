"use client";
import { Button } from "@/components/ui/button";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { Menu, User } from "lucide-react";
import { useRouter } from "next/navigation";
import { Sidebar } from "./Sidebar";

export const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="flex md:justify-end justify-between items-center py-4 px-2 bg-[#121212]  border-b border-primary/20 sticky top-0 z-20 ">
      
      <Sheet >
        <SheetTrigger asChild >
          <Menu  className="max-md:hidden"/>
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="sr-only" >
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <Sidebar />
          <SheetClose className="hidden" ></SheetClose>
        </SheetContent>
      </Sheet>
      <Button variant="outline" onClick={() => router.push("/")}>
        <User /> Logout
      </Button>
    </nav>
  );
};
