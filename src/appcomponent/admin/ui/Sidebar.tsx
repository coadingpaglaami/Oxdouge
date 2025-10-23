"use client";
import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Package, MessageSquare, Settings, Users } from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
}
export const Sidebar = () => {
  const pathname = usePathname();

  const sidebarItems: SidebarItem[] = [
    { name: "Overview", href: "/admin", icon: <Home size={20} /> },
    { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageSquare size={20} />,
    },
    { name: "Users", href: "/admin/users", icon: <Users size={20} /> },
    { name: "Settings", href: "/admin/settings", icon: <Settings size={20} /> },
  ];

  return (
    <div className="flex flex-col h-full p-6 gap-8 bg-[#121212]">
      {/* Logo */}
      <div className="flex justify-center">
        <Image
          src="/landing/logo.svg"
          alt="Logo"
          width={130}
          height={130}
          className="object-contain"
        />
      </div>

      {/* Title */}
      <div className="text-center text-primary text-lg font-semibold">
        Admin Dashboard
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 mt-4">
        {sidebarItems.map((item) => {
          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer
                ${
                  isActive
                    ? "bg-primary text-black"
                    : "text-white hover:bg-primary/20"
                }`}
            >
              {item.icon}
              <span className="font-medium">{item.name}</span>
            </Link>
          );
        })}
      </div>
    </div>
  );
};
