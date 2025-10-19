// "use client";

// import Image from "next/image";
// import Link from "next/link";
// import { Menu, User, ShoppingCart, X } from "lucide-react";
// import { useEffect, useState } from "react";
// import { usePathname } from "next/navigation";

// export const NavBar = () => {
//   const [isOpen, setIsOpen] = useState(false);
//     const [showPanel, setShowPanel] = useState(false); // for animation
//   const pathname = usePathname();

//   const navLinks = [
//     { name: "Home", href: "/" },
//     { name: "Products", href: "/products" },
//     { name: "About Us", href: "/about" },
//     { name: "Contact Us", href: "/contact" },
//   ];

//     // Handle animation when opening/closing
//   useEffect(() => {
//     if (isOpen) {
//       setShowPanel(true);
//     } else {
//       const timeout = setTimeout(() => setShowPanel(false), 300); // match transition duration
//       return () => clearTimeout(timeout);
//     }
//   }, [isOpen]);

//   return (
//     <nav className="w-full py-4 px-6 flex items-center justify-between bg-[#73737321]">
//       {/* 1️⃣ Left: Logo */}
//       <Link href="/" className="flex items-center gap-2">
//         <Image
//           src="/landing/logo.svg"
//           alt="Logo"
//           width={80}
//           height={80}
//           priority
//         />
//       </Link>

//       {/* 2️⃣ Middle: Nav Links (Desktop) */}
//       <ul className="hidden md:flex items-center gap-8">
//         {navLinks.map((link) => {
//           const isActive = pathname === link.href;
//           return (
//             <li key={link.name}>
//               <Link
//                 href={link.href}
//                 className={`relative pb-1 transition-all duration-200
//                   ${
//                     isActive
//                       ? "text-primary after:w-full"
//                       : "text-white hover:text-primary"
//                   }
//                   after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-primary
//                   after:transition-all after:duration-200 after:w-0
//                   hover:after:w-full`}
//               >
//                 {link.name}
//               </Link>
//             </li>
//           );
//         })}
//       </ul>

//       {/* 3️⃣ Right: Icons */}
//       <div className="hidden md:flex items-center gap-5">
//         <User className="cursor-pointer text-white" />
//         <ShoppingCart className="cursor-pointer text-white" />
//       </div>

//       {/* Mobile Menu Button */}
//       <button
//         className="md:hidden"
//         onClick={() => setIsOpen(!isOpen)}
//         aria-label="Toggle Menu"
//       >
//         <Menu className="text-white" />
//       </button>

//       {/* Mobile Dropdown */}
//       {/* {isOpen && (
//         <div className="absolute top-full left-0 w-full bg-white shadow-md p-4 flex flex-col gap-4 md:hidden">
//           <ul className="flex flex-col gap-3">
//             {navLinks.map((link) => {
//               const isActive = pathname === link.href;
//               return (
//                 <li key={link.name}>
//                   <Link
//                     href={link.href}
//                     onClick={() => setIsOpen(false)}
//                     className={`block w-full pb-1 transition-all duration-200
//                       ${
//                         isActive
//                           ? "text-primary border-primary"
//                           : "border-transparent"
//                       }
//                       hover:text-primary hover:border-primary
//                       border-b`}
//                   >
//                     {link.name}
//                   </Link>
//                 </li>
//               );
//             })}
//           </ul>
//           <div className="flex items-center gap-5 pt-2">
//             <User className="cursor-pointer" />
//             <ShoppingCart className="cursor-pointer" />
//           </div>
//         </div>
//       )} */}
// {showPanel && (
//   <>
//     {/* Overlay */}
//     <div
//       className={`fixed inset-0 bg-black/50 z-40 transition-opacity duration-300 ${
//         isOpen ? "opacity-100" : "opacity-0"
//       }`}
//       onClick={() => setIsOpen(false)}
//     />

//     {/* Panel */}
//     <div className="fixed inset-0 z-50 flex justify-end">
//       <div
//         className={`w-72 bg-white h-full p-6 flex flex-col transform transition-transform duration-300 ${
//           isOpen ? "translate-x-0" : "translate-x-full"
//         }`}
//       >
//         {/* Close Button */}
//         <button
//           className="self-end mb-6"
//           onClick={() => setIsOpen(false)}
//           aria-label="Close Menu"
//         >
//           <X className="w-6 h-6" />
//         </button>

//         {/* Nav Links */}
//         <ul className="flex flex-col gap-4">
//           {navLinks.map((link) => {
//             const isActive = pathname === link.href;
//             return (
//               <li key={link.name}>
//                 <Link
//                   href={link.href}
//                   onClick={() => setIsOpen(false)}
//                   className={`block pb-1 transition-all duration-200
//                     ${
//                       isActive
//                         ? "text-primary border-primary"
//                         : "border-transparent"
//                     }
//                     hover:text-primary hover:border-primary
//                     border-b`}
//                 >
//                   {link.name}
//                 </Link>
//               </li>
//             );
//           })}
//         </ul>

//         {/* Icons */}
//         <div className="flex items-center gap-5 mt-6">
//           <User className="cursor-pointer" />
//           <ShoppingCart className="cursor-pointer" />
//         </div>
//       </div>
//     </div>
//   </>
// )}
//     </nav>
//   );
// };
"use client";

import { useState } from "react";
import { Sheet, SheetTrigger, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetClose } from "@/components/ui/sheet";
import { User, ShoppingCart, Menu } from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import Image from "next/image";

export const NavBar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const pathname = usePathname();

  const navLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  return (
    <nav className="w-full py-4 px-6 flex items-center justify-between bg-[#73737321] relative z-50">
      {/* Logo */}
      <Link href="/" className="flex items-center gap-2">
        <Image src="/landing/logo.svg" alt="Logo" width={80} height={80} priority />
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
                  ${isActive ? "text-primary after:w-full" : "text-white hover:text-primary"}
                  after:absolute after:left-0 after:bottom-0 after:h-[2px] after:bg-primary
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
      <div className="hidden md:flex items-center gap-5">
        <User className="cursor-pointer text-white" />
        <ShoppingCart className="cursor-pointer text-white" />
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
            <SheetDescription className="sr-only">Navigate through our sections</SheetDescription>
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
                      ${isActive ? "text-primary border-primary" : "border-transparent"}
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
            <User className="cursor-pointer" />
            <ShoppingCart className="cursor-pointer" />
          </div>
        </SheetContent>
      </Sheet>
    </nav>
  );
};
