"use client";

import { useGetAboutJourneyQuery } from "@/api/ui_manager";
import { splitIntoParagraphs } from "@/lib/splitintoparagraph";
import Image from "next/image";

export const OurJourney = () => {
  const {
    data: aboutJourney,
    isLoading,
    isError,
  } = useGetAboutJourneyQuery({});

  // Default journey text if no data
  const defaultJourney = `Whether you're a weekend camper, long-distance hiker, overlander, or preparing for emergencies, we're here to power your journey. Our team of power specialists and outdoor enthusiasts is passionate about helping you find the perfect portable power solution.

We offer comprehensive warranties on all our power stations, free expert advice, and a 30-day satisfaction guarantee. Because when your devices stay charged and your adventures continue, we all win.

Thank you for choosing Not Overland. Here's to powering countless adventures together.`;

  if (isLoading) {
    return (
      <div className="bg-[#121212] w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-primary border-r-transparent"></div>
          <p className="mt-4 text-white">Loading journey...</p>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="bg-[#121212] w-full min-h-[400px] flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-500">Unable to load journey content</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-primary text-black rounded-md hover:bg-primary/80 transition-colors"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  // Get description from API or use default
  const journeyText = aboutJourney?.description || defaultJourney;

  // Split into paragraphs
  const paragraphs = splitIntoParagraphs(journeyText);

  // Get image from API or use default
  const journeyImage = aboutJourney?.image || "/landing/warm.png";

  return (
    <div className="bg-[#121212] w-full flex flex-col md:flex-row-reverse items-center md:items-stretch md:justify-between">
      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 p-8 text-white">
        <h2 className="text-3xl font-semibold">
          Join <span className="text-primary">Our</span> Journey
        </h2>

        {/* Dynamic paragraphs from API */}
        {paragraphs.map((paragraph, index) => (
          <p key={index} className={index > 0 ? "mt-4" : ""}>
            {paragraph}
          </p>
        ))}
      </div>

      {/* Right Side Image */}
      <div className="w-full md:w-1/2 md:max-h-[500px] py-2 md:flex md:justify-end md:max-w-3/4 px-2 overflow-hidden">
        <Image
          src={journeyImage}
          alt="Our Journey Background"
          height={600}
          width={600}
          className="object-cover aspect-square w-full rounded-lg hover:scale-105 transition-transform duration-500"
          priority
          onError={(e) => {
            const target = e.target as HTMLImageElement;
            target.src = "/landing/warm.png";
          }}
        />
      </div>
    </div>
  );
};
