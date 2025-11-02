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
import {
  User,
  ShoppingCart,
  Menu,
  UserCheck2,
  LogIn,
  LogOut,
} from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { removeAuthTokens } from "@/lib/token";
import { useGetCartQuery } from "@/api/cartApi";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);

  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const {
    data: cartData,
    isLoading,
    isError,
    refetch,
  } = useGetCartQuery(undefined, {
    skip: !isLoggedIn,
  });
  const [cartCount, setCartCount] = useState<number>(0);

  useEffect(() => {
    if (cartData && Array.isArray(cartData)) {
      setCartCount(cartData.length);
    }
  }, [cartData]);

  useEffect(() => {
    // refetch();
    if (isLoggedIn && !isLoading) {
      refetch();
    }
  }, [pathname]);

  // read cookies client side
  useEffect(() => {
    const access = document.cookie
      .split("; ")
      .find((c) => c.startsWith("access="));

    const role = document.cookie
      .split("; ")
      .find((c) => c.startsWith("role="))
      ?.split("=")[1];

    console.log("Access Cookie:", access);
    console.log("Role Cookie:", role);

    setIsLoggedIn(!!access);
    setIsAdmin(role === "admin");
  }, []);

  // Scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 50);
    };
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];
  const handleLogOut = async () => {
    // Clear cookies by setting their expiration date to the past
    removeAuthTokens();
    console.log("Logged out, cookies cleared.");
    // Redirect to home or login page
    return router.push("/login");
  };

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
        <Popover>
          <PopoverTrigger asChild>
            <button>
              <User className="cursor-pointer text-white" />
            </button>
          </PopoverTrigger>
          <PopoverContent className="w-32 bg-[#040403] p-2 rounded-md shadow-lg">
            <div className="flex flex-col gap-2">
              {!isLoggedIn && (
                <Link
                  href="/login"
                  className="flex items-center gap-2 text-white"
                >
                  <LogIn /> Login
                </Link>
              )}

              {isLoggedIn && (
                <>
                  <Link
                    href="/profile"
                    className="flex items-center gap-2 text-white"
                  >
                    <User /> Profile
                  </Link>
                  <button
                    className="text-white flex justify-start items-center gap-2 mt-1"
                    onClick={() => handleLogOut()}
                  >
                    <LogOut /> Logout
                  </button>
                </>
              )}

              {isAdmin && (
                <Link
                  href="/admin"
                  className="flex items-center gap-2 text-white"
                >
                  <UserCheck2 /> Dashboard
                </Link>
              )}
            </div>
          </PopoverContent>
        </Popover>

        {/* {isLoggedIn && (
          <Link href="/cart">
            <ShoppingCart className="cursor-pointer text-white" />
          </Link>
        )} */}
        {isLoggedIn && (
          <Link href="/cart" className="relative">
            <ShoppingCart className="cursor-pointer text-white" />

            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                {cartCount > 99 ? "99+" : cartCount}
              </span>
            )}
          </Link>
        )}
      </div>

      {/* ---------------- MOBILE SIDE MENU ---------------- */}
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

          <div className="flex flex-col gap-4 mt-6">
            {!isLoggedIn && (
              <button
                onClick={() => {
                  router.push("/login");
                  setIsOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <LogIn /> Login
              </button>
            )}

            {isLoggedIn && (
              <button
                onClick={() => {
                  router.push("/profile");
                  setIsOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <User /> Profile
              </button>
            )}

            {isAdmin && (
              <button
                onClick={() => {
                  router.push("/admin");
                  setIsOpen(false);
                }}
                className="flex items-center gap-2"
              >
                <UserCheck2 /> Admin
              </button>
            )}

            {isLoggedIn && (
              <Link href="/cart" className="relative">
                <ShoppingCart className="cursor-pointer text-white" />
                {cartCount > 0 && (
                  <span className="absolute -top-2 -right-2 bg-primary text-black text-xs font-bold w-5 h-5 flex items-center justify-center rounded-full">
                    {cartCount > 99 ? "99+" : cartCount}
                  </span>
                )}
              </Link>
            )}
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
