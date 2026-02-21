"use client";
import { useGetWhyChooseQuery } from "@/api/ui_manager";
import { CardResponse } from "@/interfaces/api";
import Image from "next/image";
import React from "react";

interface WhyChooseItem {
  id: number;
  description: string; // This appears to be a general description
  card_heading: string;
  card_description: string;
  icon: string | null;
  created_at: string;
}

// Gradient colors array for dynamic icon backgrounds
const gradientColors = [
  { icongradinet1: "#033350", icongradinet2: "#172527" }, // Blue theme
  { icongradinet1: "#425003", icongradinet2: "#212717" }, // Green theme
  { icongradinet1: "#044B34", icongradinet2: "#172327" }, // Teal theme
  { icongradinet1: "#240463", icongradinet2: "#141A36" }, // Purple theme
  { icongradinet1: "#6d28d9", icongradinet2: "#2e1065" }, // Violet theme
  { icongradinet1: "#b45309", icongradinet2: "#78350f" }, // Amber theme
  { icongradinet1: "#be185d", icongradinet2: "#831843" }, // Pink theme
  { icongradinet1: "#1e3a8a", icongradinet2: "#172554" }, // Dark blue theme
];

// Fallback icon if API icon is null
const FALLBACK_ICON = "/landing/fire.svg";

export const WhyChoose = () => {
  const { data: whyChooseData, isLoading, isError } = useGetWhyChooseQuery();

  // Extract the array from the response

  // Use API data if available, otherwise use fallback data
  const displayItems: CardResponse[] =
    (whyChooseData?.length ?? 0) > 0
      ? whyChooseData || []
      : [
          {
            id: 1,
            description:
              "Designed to deliver maximum heat while consuming minimal power.",
            card_heading: "Energy Efficient",
            card_description: "Maximum heat, minimal power consumption",
            icon: "/landing/fire.svg",
            created_at: new Date().toISOString(),
          },
          {
            id: 2,
            description:
              "Enjoy clean, odorless warmth — no smoke, no fumes, just pure comfort.",
            card_heading: "Smoke Free",
            card_description: "Clean, odorless warmth",
            icon: "/landing/tie.svg",
            created_at: new Date().toISOString(),
          },
          {
            id: 3,
            description:
              "Weather-resistant and durable construction for harsh outdoor conditions.",
            card_heading: "Built Rugged",
            card_description: "Weather-resistant construction",
            icon: "/landing/guard.svg",
            created_at: new Date().toISOString(),
          },
          {
            id: 4,
            description:
              "Weather-resistant and durable construction for harsh outdoor conditions.",
            card_heading: "Built Rugged",
            card_description: "Harsh outdoor conditions",
            icon: "/landing/vector.svg",
            created_at: new Date().toISOString(),
          },
        ];

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-white">Loading...</div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center min-h-[400px]">
        <div className="text-red-500">Error loading content</div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {/* ---------- Top Section ---------- */}
      <div className="flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex items-center gap-2 md:text-4xl text-2xl font-bold relative">
          <h2 className="text-white">Why choose</h2>
          <span className="text-primary">Overland Tech</span>
          <Image
            src="/landing/quotation.svg"
            alt="line"
            width={50}
            height={20}
            className="absolute -right-16 -top-7 md:block hidden"
          />
        </div>

        {/* Description */}
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mt-4">
          We&apos;re committed to providing outdoor enthusiasts with reliable,
          portable power solutions that keep you connected and powered wherever
          your adventures take you.
        </p>
      </div>

      {/* ---------- Card Section ---------- */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayItems.map((item, index) => (
          <div
            key={item.id || index}
            className="flex flex-col bg-[#121212] rounded-2xl p-6 border border-primary hover:scale-105 transition-transform duration-300"
          >
            {/* Icon */}
            <div
              className="w-16 h-16 flex items-center justify-center rounded-xl mb-4"
              style={{
                background: `linear-gradient(135deg, ${
                  gradientColors[index % gradientColors.length].icongradinet1
                }, ${
                  gradientColors[index % gradientColors.length].icongradinet2
                })`,
              }}
            >
              <Image
                src={item.icon || FALLBACK_ICON}
                alt={item.card_heading}
                height={40}
                width={40}
                className="w-8 h-8 object-contain"
                onError={(e) => {
                  // If image fails to load, replace with fallback
                  const target = e.target as HTMLImageElement;
                  target.src = FALLBACK_ICON;
                }}
              />
            </div>

            {/* Card Heading */}
            <h3 className="text-primary text-lg font-semibold mb-2">
              {item.card_heading}
            </h3>

            {/* Card Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.card_description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
