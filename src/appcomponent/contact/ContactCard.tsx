'use client';
import { useGetContactInfoQuery } from "@/api/ui_manager";
import Image from "next/image";
import { useState } from "react";

export const ContactCard = () => {
  const { data: contactInfo, isLoading, error } = useGetContactInfoQuery({});
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const data = [
    {
      title: "Email Us",
      description: "Send us an email anytime",
      icons: "/contactus/message.svg",
      contact: contactInfo?.email || "support@notoverland.com",
      action: "Send Email",
      href: `mailto:${contactInfo?.email || "support@notoverland.com"}`,
      gradient: "from-blue-500/20 to-cyan-500/20",
    },
    {
      title: "Call Us",
      description: "Mon-Fri from 8am to 6pm MST",
      contact: contactInfo?.phone || "+1 (546) 875-3546",
      icons: "/contactus/phone.svg",
      action: "Call Now",
      href: `tel:${contactInfo?.phone || "+15468753546"}`,
      gradient: "from-green-500/20 to-emerald-500/20",
    },
    {
      title: "Visit Us",
      description: "Come say hello at our office",
      contact: contactInfo?.address || "1234 Adventure Blvd, Suite 100",
      icons: "/contactus/location.svg",
      action: "Get Directions",
      href: "https://maps.google.com/?q=1234+Adventure+Blvd",
      gradient: "from-purple-500/20 to-pink-500/20",
    },
  ];

  const handleCopy = (text: string, index: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 2000);
  };

  if (isLoading) {
    return (
      <div className="w-full grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 p-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-64 rounded-2xl bg-[#1a1a1a] animate-pulse" />
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="w-full text-center py-12">
        <p className="text-red-400">Failed to load contact information</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-6 lg:px-8 py-12">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="group relative overflow-hidden rounded-2xl bg-linear-to-br from-[#1a1a1a] to-[#0d0d0d] border border-white/5 hover:border-primary/30 transition-all duration-300 hover:shadow-2xl hover:shadow-primary/10"
          >
            {/* Gradient background effect */}
            <div className={`absolute inset-0 bg-linear-to-br ${item.gradient} opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
            
            {/* Content */}
            <div className="relative p-8 flex flex-col items-center text-center gap-4">
              {/* Icon with animated background */}
              <div className="relative">
                <div className="absolute inset-0 bg-primary/20 rounded-full blur-xl group-hover:blur-2xl transition-all duration-300" />
                <div className="relative w-20 h-20 rounded-full bg-linear-to-br from-primary/20 to-primary/5 flex items-center justify-center border border-white/10 group-hover:border-primary/30 transition-all duration-300">
                  <Image 
                    src={item.icons} 
                    alt={item.title} 
                    width={36} 
                    height={36} 
                    className="group-hover:scale-110 transition-transform duration-300" 
                  />
                </div>
              </div>

              {/* Title */}
              <h3 className="text-2xl font-bold text-white group-hover:text-primary transition-colors duration-300">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-sm text-gray-400 group-hover:text-gray-300 transition-colors duration-300">
                {item.description}
              </p>

              {/* Contact info with copy button */}
              <div className="relative w-full mt-2">
                <div className="flex items-center justify-center gap-2">
                  <p className="text-primary font-medium text-sm sm:text-base break-all">
                    {item.contact}
                  </p>
                  <button
                    onClick={() => handleCopy(item.contact, idx)}
                    className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 transition-colors duration-200 group/copy"
                    title="Copy to clipboard"
                  >
                    {copiedIndex === idx ? (
                      <span className="text-xs text-green-400">Copied!</span>
                    ) : (
                      <svg 
                        className="w-4 h-4 text-gray-400 group-hover/copy:text-white" 
                        fill="none" 
                        stroke="currentColor" 
                        viewBox="0 0 24 24"
                      >
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                    )}
                  </button>
                </div>
              </div>

              {/* Action button */}
              <a
                href={item.href}
                target={item.title === "Visit Us" ? "_blank" : undefined}
                rel={item.title === "Visit Us" ? "noopener noreferrer" : undefined}
                className="w-full mt-4 px-6 py-3 rounded-xl bg-linear-to-r from-primary to-primary/80 text-white font-medium hover:from-primary/90 hover:to-primary transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-primary/25 hover:shadow-xl hover:shadow-primary/30 flex items-center justify-center gap-2 group/btn"
              >
                <span>{item.action}</span>
                <svg 
                  className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-200" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                </svg>
              </a>
            </div>

            {/* Decorative corner */}
            <div className="absolute top-0 right-0 w-20 h-20 bg-linear-to-br from-primary/10 to-transparent rounded-bl-full" />
          </div>
        ))}
      </div>
    </div>
  );
};