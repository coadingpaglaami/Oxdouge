"use client";

import { useEffect, useState } from "react";
import {
  Sheet,
  SheetTrigger,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetDescription,
} from "@/components/ui/sheet";
import { User, ShoppingCart, Menu } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50); // change 50 to your threshold
    };

    window.addEventListener("scroll", handleScroll);

    // Clean up
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav
      className={`w-full py-4 px-6 flex items-center justify-between relative transition-all duration-300
        ${scrolled ? "bg-black/50 backdrop-blur-md" : "bg-transparent"}`}
    >
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image
          src="/landing/logo.svg"
          alt="Logo"
          width={80}
          height={80}
          priority
        />
      </Link>

      {/* Desktop Nav Links */}
      <ul className="hidden md:flex items-center gap-8">
        {navLinks.map((link) => {
          const isActive = pathname === link.href;
          return (
            <li key={link.name}>
              <Link
                href={link.href}
                className={`relative pb-1 transition-all duration-200
                  ${
                    isActive
                      ? "text-primary after:w-full"
                      : "text-white hover:text-primary"
                  }
                  after:absolute after:left-0 after:bottom-0 after:h-0.5 after:bg-primary
                  after:transition-all after:duration-200 after:w-0
                  hover:after:w-full`}
              >
                {link.name}
              </Link>
            </li>
          );
        })}
      </ul>

      {/* Desktop Icons */}
      <div className="max-md:hidden flex items-center gap-5">
        <Link href="/login">
          <User className="cursor-pointer text-white" />
        </Link>
        <Link href="/cart">
          <ShoppingCart className="cursor-pointer text-white" />
        </Link>
      </div>

      {/* Mobile Menu Button */}
      <Sheet open={isOpen} onOpenChange={setIsOpen}>
        <SheetTrigger asChild>
          <button className="md:hidden">
            <Menu className="text-white w-6 h-6" />
          </button>
        </SheetTrigger>

        <SheetContent side="right" className="w-72 p-6 bg-[#231D0D] text-white">
          <SheetHeader>
            <SheetTitle className="sr-only">Menu</SheetTitle>
            <SheetDescription className="sr-only">
              Navigate through our sections
            </SheetDescription>
          </SheetHeader>

          <ul className="flex flex-col gap-4 ">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <li key={link.name}>
                  <Link
                    href={link.href}
                    onClick={() => setIsOpen(false)}
                    className={`block pb-1 transition-all duration-200
                      ${
                        isActive
                          ? "text-primary border-primary"
                          : "border-transparent"
                      }
                      hover:text-primary hover:border-primary
                      border-b`}
                  >
                    {link.name}
                  </Link>
                </li>
              );
            })}
          </ul>

          {/* Icons */}
          <div className="flex items-center gap-5 mt-6">
            <button>
              <User className="cursor-pointer" />
            </button>
            <button onClick={() => router.push("/cart")}>
              <ShoppingCart className="cursor-pointer" />
            </button>
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
