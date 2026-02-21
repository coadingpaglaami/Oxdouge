"use client";

import { useGetWarmQuery } from "@/api/ui_manager";
import { transformWarmFeatures } from "@/lib/warmfeatures";
import Image from "next/image";

// Gradient colors for icons
const gradientColors = [
  { from: "#033350", to: "#172527" }, // Blue theme
  { from: "#425003", to: "#212717" }, // Green theme
  { from: "#044B34", to: "#172327" }, // Teal theme
  { from: "#240463", to: "#141A36" }, // Purple theme
];

// Fallback icon
const FALLBACK_ICON = "/landing/warm.svg";

// Fallback data
const fallbackFeatures = [
  {
    heading: "Instant Heat, Anytime",
    description: "Feel the warmth in seconds with advanced ceramic heating technology.",
    icon: null,
  },
  {
    heading: "Smart Energy Saving",
    description: "Heats efficiently while keeping your electricity bill low.",
    icon: null,
  },
  {
    heading: "Safe for Everyone",
    description: "Auto shut-off and overheat protection for complete peace of mind.",
    icon: null,
  },
  {
    heading: "Portable & Travel-Friendly",
    description: "Compact design for easy carrying during travels.",
    icon: null,
  },
];

export const WarmSection = () => {
  const { data: apiData, isLoading, isError } = useGetWarmQuery({});
  
  // Transform API data into features array
  const features = apiData ? transformWarmFeatures(apiData) : [];
  
  // Use API features if available, otherwise use fallback
  const displayFeatures = features.length > 0 ? features : fallbackFeatures;
  
  // Get image from API or use fallback
  const heroImage = apiData?.image || "/landing/warm.png";
  
  // Get heading text from API or use default
  const headingText = apiData?.heading1?.split(' ') || ["Warm", "with"];
  const firstPart = headingText[0] || "Warm";
  const restParts = headingText.slice(1).join(' ') || "with";
  const brandName = "Overland Tech"; // This could also come from API if available

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
    <div className="flex flex-col md:flex-row gap-10 items-center">
      {/* ---------- Left Side (Image) ---------- */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="border-2 border-primary rounded-2xl overflow-hidden">
          <Image
            src={heroImage}
            alt="Warm Heater"
            width={500}
            height={500}
            className="rounded-2xl object-cover shadow-orange-300 hover:scale-105 transition-transform duration-300"
            priority
            onError={(e) => {
              // If image fails to load, replace with fallback
              const target = e.target as HTMLImageElement;
              target.src = "/landing/warm.png";
            }}
          />
        </div>
      </div>

      {/* ---------- Right Side (Content) ---------- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          {firstPart}{' '}
          <span className="text-primary">{restParts} {brandName}</span>
        </h2>

        {/* Cards */}
        <div className="flex flex-col gap-6 mt-8">
          {displayFeatures.map((feature, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-transparent py-3 px-4 border border-primary/30 rounded-lg hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: `linear-gradient(135deg, ${
                    gradientColors[index % gradientColors.length].from
                  }, ${
                    gradientColors[index % gradientColors.length].to
                  })`,
                }}
              >
                <Image
                  src={feature.icon || FALLBACK_ICON}
                  alt={feature.heading || "Feature icon"}
                  width={24}
                  height={24}
                  className="object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = FALLBACK_ICON;
                  }}
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl text-white font-semibold">
                  {feature.heading || `Feature ${index + 1}`}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {feature.description || "Description not available"}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};