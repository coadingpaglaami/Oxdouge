'use client';
import { useGetHowWorksQuery } from "@/api/ui_manager";
import { WorkItem } from "@/lib/getStepNumber";
import Image from "next/image";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";


// Fallback data in case API returns no results
const fallbackCards: WorkItem[] = [
  {
    id: 1,
    title: "Browse",
    description: "Designed to deliver maximum heat while consuming minimal power.",
    icon: "/temp/fire.svg",
    created_at: new Date().toISOString(),
  },
  {
    id: 2,
    title: "Choose",
    description: "Enjoy clean, odorless warmth — no smoke, no fumes, just pure comfort.",
    icon: "/temp/air.svg",
    created_at: new Date().toISOString(),
  },
  {
    id: 3,
    title: "Checkout",
    description: "Weather-resistant and durable construction for harsh outdoor conditions.",
    icon: "/temp/shield.svg",
    created_at: new Date().toISOString(),
  },
  {
    id: 4,
    title: "Adventure Ready",
    description: "Designed for hiking, camping, overlanding, and emergency preparedness.",
    icon: "/temp/badge.svg",
    created_at: new Date().toISOString(),
  },
];

// Fallback icon if API icon is null or fails to load
const FALLBACK_ICON = "/temp/fire.svg";

export const Work = () => {
  const { data: apiData, isLoading, isError } = useGetHowWorksQuery({});
  
  // Extract results from API response
  const apiCards = apiData?.results || [];
  
  // Use API cards if available, otherwise use fallback
  const displayCards = apiCards.length > 0 ? apiCards : fallbackCards;

  if (isLoading) {
    return (
      <div className="bg-[#001211] text-white py-10 px-4 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-[#FFD345] border-r-transparent align-[-0.125em] motion-reduce:animate-[spin_1.5s_linear_infinite]"></div>
          <p className="mt-4 text-[#FFD345]">Loading...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#001211] text-white py-10 px-4 min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Error loading content</p>
          <button 
            onClick={() => window.location.reload()} 
            className="mt-4 px-4 py-2 bg-[#FFD345] text-black rounded-md hover:bg-[#FFD345]/80 transition-colors"
          >
            Retry
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-[#001211] text-white py-10 px-4">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-10">
        <div className="text-[#FFD345] border border-[#FFD345D6] px-4 py-2 rounded-lg inline-flex items-center justify-center mb-4">
          <Image
            src="/temp/starts.svg"
            alt="Starts"
            className="h-6 w-6 mr-2"
            height={40}
            width={40}
          />
          <p className="font-medium">Simple Process</p>
        </div>
        <h1 className="text-3xl md:text-5xl font-bold mb-2">How it works</h1>
        <p className="text-base md:text-lg text-[#C2C2C2]">
          Four simple steps to warmth and comfort
        </p>
      </div>

      {/* Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {displayCards.slice(0, 4).map((card: { id: Key | null | undefined; icon: any; title: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; }, index: number) => (
          <div
            key={card.id}
            className="relative border border-[#FFD34599] p-6 rounded-md bg-opacity-10 hover:border-[#FFD345] hover:shadow-lg hover:shadow-[#FFD345]/20 transition-all duration-300 group"
          >
            {/* Icon */}
            <div className="h-14 w-14 mb-4 bg-[#FFD34540] p-3 rounded-md group-hover:bg-[#FFD34560] transition-colors">
              <Image
                src={card.icon || FALLBACK_ICON}
                alt={"Step Icon"}
                height={40}
                width={40}
                className="h-full w-full object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.src = FALLBACK_ICON;
                }}
              />
            </div>

            {/* Step Number */}
            <h1 className="font-bold text-[#FFD34538] absolute -top-2.5 right-4 text-[48px] md:text-[64px] select-none group-hover:text-[#FFD34550] transition-colors">
              0{index + 1}
            </h1>

            {/* Title and Description */}
            <h2 className="font-semibold text-[#FFD345] text-xl md:text-2xl mb-2">
              {card.title}
            </h2>
            <p className="text-sm text-[#D9D9D9]">{card.description}</p>

            {/* Connector line (only on larger screens) */}
            {index !== Math.min(displayCards.length, 4) - 1 && (
              <div className="hidden lg:block h-1 w-7 bg-linear-to-r from-[#FFD345] to-[#241C05] absolute right-[-22px] top-1/2 transform -translate-y-1/2" />
            )}
          </div>
        ))}
      </div>

      {/* Show message if less than 4 items from API */}
      {apiCards.length > 0 && apiCards.length < 4 && (
        <p className="text-center text-[#C2C2C2] mt-6 text-sm">
          Showing {apiCards.length} of 4 steps
        </p>
      )}
    </div>
  );
};