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
import {
  useGetContactInfoQuery,
  useGetFooterSectionQuery,
  useGetSocialLinksQuery,
} from "@/api/ui_manager";

export interface ContactInfoResponse {
  email: string;
  contact_number: string;
  location: string;
  created_at: string;
  updated_at: string;
}

// Social media links interface for better organization
export interface SocialLink {
  name: string;
  href: string;
  icon: React.ElementType;
}

// Quick links interface
export interface QuickLink {
  name: string;
  href: string;
}
// Quick links data
const quickLinks: QuickLink[] = [
  { name: "Home", href: "/" },
  { name: "Products", href: "/products" },
  { name: "About Us", href: "/about" },
  { name: "Contact Us", href: "/contact" },
];

// Resources links data
const resourcesLinks: QuickLink[] = [
  { name: "Shipping Policy", href: "/shipping-policy" },
  { name: "Return Policy", href: "/return-policy" },
  { name: "Terms and Conditions", href: "/terms" },
  { name: "FAQ", href: "/faq" },
];

// Social media links data

// Fallback contact info
const fallbackContact: ContactInfoResponse = {
  email: "contact@notoverland.com",
  contact_number: "+123 456 7890",
  location: "123 Adventure Lane, Explore City",
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString(),
};

export const Footer = () => {
  const { data: contactInfo, isLoading, isError } = useGetContactInfoQuery({});
  const { data: footerSections, isLoading: isFooterSectionsLoading } =
    useGetFooterSectionQuery();
  const { data: socialLinks, isLoading: isSocialLinksLoading } =
    useGetSocialLinksQuery();

  const socialLinksList: SocialLink[] = [
    {
      name: "Facebook",
      href: socialLinks?.facebook || "https://facebook.com",
      icon: Facebook,
    },
    {
      name: "Instagram",
      href: socialLinks?.instagram || "https://instagram.com",
      icon: Instagram,
    },
    {
      name: "Twitter",
      href: socialLinks?.x || "https://twitter.com",
      icon: Twitter,
    },
  ];

  // Use API data if available, otherwise use fallback
  const displayContact = contactInfo || fallbackContact;

  // Format phone number if needed (you can customize this based on your needs)
  const formatPhoneNumber = (phone: string) => {
    // If it's already formatted, return as is
    if (phone.includes(" ")) return phone;

    // Simple formatting for international numbers
    // This is a basic example - adjust based on your needs
    if (phone.startsWith("+")) {
      return phone; // Return as is if it has country code
    }
    return phone;
  };

  if (isLoading) {
    return (
      <footer className="w-full bg-[#121212] pt-12 border-t-[0.4px] border-[#FFD345]/20">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-white">Loading...</div>
        </div>
      </footer>
    );
  }

  if (isError) {
    return (
      <footer className="w-full bg-[#121212] pt-12 border-t-[0.4px] border-[#FFD345]/20">
        <div className="flex justify-center items-center min-h-[300px]">
          <div className="text-red-500">Error loading contact information</div>
        </div>
      </footer>
    );
  }

  return (
    <footer className="w-full bg-[#121212] pt-12 border-t-[0.4px] border-[#FFD345]/20">
      {/* 4 Columns */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-8 px-6 text-white">
        {/* Column 1: Logo + Description */}
        <div className="flex flex-col gap-4">
          <Image
            src="/landing/logo.svg"
            alt="Logo"
            width={60}
            height={60}
            className="w-32 h-32 self-center"
          />
          <span className="font-bold text-lg">
            {/* NOT <span className="text-primary">Overland</span> Tech */}
            {footerSections && footerSections.length > 0
              ? footerSections[0].title
              : "Overland Tech"}
          </span>
          <p className="text-sm">
            {footerSections && footerSections.length > 0
              ? footerSections[0].content
              : "Explore the world with confidence. Our expert gear and trusted advice ensure you're ready for every adventure."}
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
                  className="relative pb-1 transition-all duration-200 hover:text-primary after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
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
                  className="relative pb-1 transition-all duration-200 hover:text-primary after:absolute after:left-0 after:bottom-0 after:w-0 after:h-0.5 after:bg-primary after:transition-all after:duration-200 hover:after:w-full"
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

          {/* Email */}
          <div className="flex items-center gap-2 group">
            <Mail className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
              {displayContact.email}
            </span>
          </div>

          {/* Phone */}
          <div className="flex items-center gap-2 group">
            <Phone className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
              {formatPhoneNumber(displayContact.contact_number)}
            </span>
          </div>

          {/* Location */}
          <div className="flex items-center gap-2 group">
            <MapPin className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
            <span className="text-sm text-gray-300 group-hover:text-white transition-colors duration-200">
              {displayContact.location}
            </span>
          </div>

          {/* Social Icons */}
          <div className="flex items-center gap-4 mt-4">
            {socialLinksList.map((social) => {
              const Icon = social.icon;
              return (
                <Link
                  key={social.name}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group"
                >
                  <Icon className="w-5 h-5 text-gray-400 group-hover:text-primary transition-colors duration-200" />
                </Link>
              );
            })}
          </div>
        </div>
      </div>

      {/* Bottom Copyright with dynamic year */}
      <div className="mt-8 border-t-[0.4px] border-[#FFD345]/20 pt-4 text-center text-white text-sm">
        © {new Date().getFullYear()} NOT Overland. All rights reserved.
        {displayContact.updated_at && (
          <span className="block text-xs text-gray-500 mt-1">
            Last updated:{" "}
            {new Date(displayContact.updated_at).toLocaleDateString()}
          </span>
        )}
      </div>
    </footer>
  );
};
