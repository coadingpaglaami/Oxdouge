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
import { useEffect, useState } from "react";
import { removeAuthTokens } from "@/lib/token";

export const Navbar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const router = useRouter();
  useEffect(() => {
    const access = document.cookie
      .split("; ")
      .find((c) => c.startsWith("access="));
    setIsLoggedIn(!!access);
  }, []);

  const handleLogOut = async () => {
    // Clear cookies by setting their expiration date to the past
    removeAuthTokens();
    console.log("Logged out, cookies cleared.");
    // Redirect to home or login page
    return router.push("/login");
  };

  return (
    <nav className="flex md:justify-end justify-between items-center py-4 px-2 bg-[#121212]  border-b border-primary/20 sticky top-0 z-20 ">
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <Menu className="md:hidden" />
        </SheetTrigger>
        <SheetContent side="left">
          <SheetHeader className="sr-only">
            <SheetTitle>Navigation Menu</SheetTitle>
          </SheetHeader>
          <Sidebar />
          <SheetClose className="hidden"></SheetClose>
        </SheetContent>
      </Sheet>
      {isLoggedIn ? (
        <Button variant="outline" onClick={() => handleLogOut()}>
          <User /> Logout
        </Button>
      ) : (
        ""
      )}
    </nav>
  );
};
