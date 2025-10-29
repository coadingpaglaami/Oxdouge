"use client";

import Image from "next/image";
import Link from "next/link";
import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
} from "lucide-react";

export const Footer = () => {
  const quickLinks = [
    { name: "Home", href: "/" },
    { name: "Products", href: "/products" },
    { name: "About Us", href: "/about" },
    { name: "Contact Us", href: "/contact" },
  ];

  const resourcesLinks = [
    { name: "Shipping Policy", href: "/shipping-policy" },
    { name: "Return Policy", href: "/return-policy" },
    { name: "Terms and Conditions", href: "/terms" },
    { name: "FAQ", href: "/faq" },
  ];

  return (
    <footer className="w-full bg-[#121212] pt-12 border-t-[0.4px] border-[#FFD345]/20 ">
      {/* 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 text-white">
        {/* Column 1: Logo + Description */}
        <div className="flex flex-col gap-4">
          <Image
            src="/landing/logo.svg"
            alt="Logo"
            width={60}
            height={60}
            className="w-32 h-32 self-center "
          />
          <span className="font-bold text-lg">
            NOT <span className="text-primary">Overland</span> Tech
          </span>
          <p className=" text-sm">
            Portable power solutions for adventurers who demand reliability.
            Stay charged, stay connected, stay exploring.
          </p>
        </div>

        {/* Column 2: Quick Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold mb-2 text-xl">Quick Section</h3>
          <ul className="flex flex-col gap-2">
            {quickLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="relative pb-1 transition-all duration-200 hover:text-primary after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 3: Resources Links */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold mb-2 text-xl">Resources</h3>
          <ul className="flex flex-col gap-2">
            {resourcesLinks.map((link) => (
              <li key={link.name}>
                <Link
                  href={link.href}
                  className="relative pb-1  transition-all duration-200 hover:text-primary after:absolute after:left-0 after:bottom-0 after:w-0 after:h-[2px] after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
                >
                  {link.name}
                </Link>
              </li>
            ))}
          </ul>
        </div>

        {/* Column 4: Contact */}
        <div className="flex flex-col gap-3">
          <h3 className="font-semibold mb-2 text-xl">Contact Us</h3>
          <div className="flex items-center gap-2 ">
            <Mail className="w-5 h-5" />
            <span>contact@notoverland.com</span>
          </div>
          <div className="flex items-center gap-2 ">
            <Phone className="w-5 h-5" />
            <span>+123 456 7890</span>
          </div>
          <div className="flex items-center gap-2 ">
            <MapPin className="w-5 h-5" />
            <span>123 Adventure Lane, Explore City</span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            <Link href="https://facebook.com" target="_blank">
              <Facebook className="w-5 h-5  hover:text-primary transition-colors duration-200" />
            </Link>
            <Link href="https://instagram.com" target="_blank">
              <Instagram className="w-5 h-5  hover:text-primary transition-colors duration-200" />
            </Link>
            <Link href="https://twitter.com" target="_blank">
              <Twitter className="w-5 h-5  hover:text-primary transition-colors duration-200" />
            </Link>
          </div>
        </div>
      </div>

      {/* Bottom Copyright */}
      <div className="mt-8 border-t-[0.4px] border-[#FFD345]/20 pt-4 text-center text-white text-sm">
        © 2025 NOT Overland. All rights reserved.
      </div>
    </footer>
  );
};
