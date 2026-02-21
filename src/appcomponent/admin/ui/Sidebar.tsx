"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import {
  Home,
  Package,
  ShoppingCart,
  MessageCircleMore,
  Settings,
  Sliders,
  ChevronDown,
  LayoutDashboard,
  Info,
} from "lucide-react";

interface SidebarItem {
  name: string;
  href: string;
  icon: React.ReactNode;
  children?: { name: string; href: string; icon: React.ReactNode }[];
}

export const Sidebar = () => {
  const pathname = usePathname();
  const router = useRouter();

  const isUiManagerActive =
    pathname === "/admin/ui_manager" ||
    pathname.startsWith("/admin/ui_manager/");

  const [uiManagerOpen, setUiManagerOpen] = useState(isUiManagerActive);

  // Keep accordion open if a child is active
  useEffect(() => {
    if (isUiManagerActive) setUiManagerOpen(true);
  }, [isUiManagerActive]);

  const sidebarItems: SidebarItem[] = [
    { name: "Overview", href: "/admin", icon: <Home size={20} /> },
    { name: "Products", href: "/admin/products", icon: <Package size={20} /> },
    {
      name: "Orders",
      href: "/admin/orders",
      icon: <ShoppingCart size={20} />,
    },
    {
      name: "Messages",
      href: "/admin/messages",
      icon: <MessageCircleMore size={20} />,
    },
    {
      name: "Settings",
      href: "/admin/settings",
      icon: <Settings size={20} />,
    },
    { name: "Coupons", href: "/admin/coupon", icon: <Package size={20} /> },
    {
      name: "UI Manager",
      href: "/admin/ui_manager/home_page",
      icon: <Sliders size={20} />,
      children: [
        {
          name: "Home Page Management",
          href: "/admin/ui_manager/home_page",
          icon: <LayoutDashboard size={16} />,
        },
        {
          name: "About Page Management",
          href: "/admin/ui_manager/about_page",
          icon: <Info size={16} />,
        },
      ],
    },
  ];

  return (
    <div className="flex flex-col h-full p-6 gap-8 bg-[#121212]">
      {/* Logo */}
      <Link href="/" className="flex justify-center">
        <Image
          src="/landing/logo.svg"
          alt="Logo"
          width={130}
          height={130}
          className="object-contain"
        />
      </Link>

      {/* Title */}
      <div className="text-center text-primary text-lg font-semibold">
        Admin Dashboard
      </div>

      {/* Navigation Links */}
      <div className="flex flex-col gap-2 mt-4">
        {sidebarItems.map((item) => {
          if (item.children) {
            const isParentActive = isUiManagerActive;

            return (
              <div key={item.name}>
                {/* Accordion Trigger */}
                <button
                  onClick={() => {
                    if (!uiManagerOpen) {
                      router.push(item.href);
                    }
                    setUiManagerOpen((prev) => !prev);
                  }}
                  className={`w-full flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors
                    ${
                      isParentActive
                        ? "bg-primary text-black"
                        : "text-white hover:bg-primary/20"
                    }`}
                >
                  {item.icon}
                  <span className="font-medium flex-1 text-left">
                    {item.name}
                  </span>
                  <ChevronDown
                    size={16}
                    className="transition-transform duration-300"
                    style={{
                      transform: uiManagerOpen
                        ? "rotate(180deg)"
                        : "rotate(0deg)",
                    }}
                  />
                </button>

                {/* Animated Children */}
                <div
                  className="overflow-hidden transition-all duration-300 ease-in-out"
                  style={{
                    maxHeight: uiManagerOpen ? "200px" : "0px",
                    opacity: uiManagerOpen ? 1 : 0,
                  }}
                >
                  <div className="flex flex-col gap-1 mt-1 ml-4 pl-4 border-l border-white/10">
                    {item.children.map((child) => {
                      const isChildActive = pathname === child.href;
                      return (
                        <Link
                          key={child.name}
                          href={child.href}
                          className={`flex items-center gap-3 px-3 py-2 rounded-lg cursor-pointer text-sm transition-colors
                            ${
                              isChildActive
                                ? "border border-primary text-primary bg-primary/10"
                                : "text-white/70 hover:bg-primary/20 hover:text-white"
                            }`}
                        >
                          {child.icon}
                          <span className="font-medium">{child.name}</span>
                        </Link>
                      );
                    })}
                  </div>
                </div>
              </div>
            );
          }

          const isActive = pathname === item.href;
          return (
            <Link
              key={item.name}
              href={item.href}
              className={`flex items-center gap-3 px-4 py-2 rounded-lg cursor-pointer transition-colors
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
}
