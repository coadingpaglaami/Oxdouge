"use client";
import { Button } from "@/components/ui/button";
import { User } from "lucide-react";
import { useRouter } from "next/navigation";

export const Navbar = () => {
  const router = useRouter();
  return (
    <nav className="flex justify-end items-center py-4">
      <Button variant="outline" onClick={() => router.push("/")}>
        <User /> Logout
      </Button>
    </nav>
  );
};
