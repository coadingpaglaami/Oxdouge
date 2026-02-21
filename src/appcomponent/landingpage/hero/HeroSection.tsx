"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import { SwipperCards } from "./SwipperCards";
import { useRouter } from "next/navigation";
import { useGetHeroPromotionQuery } from "@/api/ui_manager";

export const HeroSection = () => {
  const { data, isLoading, isError } = useGetHeroPromotionQuery();
  const router = useRouter();

  if (isLoading) {
    return (
      <section className="w-full md:h-screen flex items-center justify-center">
        <div className="text-white">Loading...</div>
      </section>
    );
  }

  if (isError) {
    return (
      <section className="w-full md:h-screen flex items-center justify-center">
        <div className="text-red-500">Error loading content</div>
      </section>
    );
  }

  // Split title1 to get the first word for colored highlight
  const titleWords = data?.title1?.split(' ') || ['Power', 'Everything'];
  const firstWord = titleWords[0] || 'Power';
  const remainingWords = titleWords.slice(1).join(' ') || 'Everything';

  return (
    <section className="w-full md:h-screen relative flex flex-col md:flex-row overflow-hidden max-md:gap-8">
      {/* Left Section */}
      <div
        className="md:w-1/2 flex flex-col justify-center-safe px-12 gap-8 z-10 w-full"
        style={{
          backgroundImage: "url('/landing/backgroundgrid.svg')",
          backgroundSize: "contain",
          backgroundPosition: "",
        }}
      >
        {/* 4 Column Layout */}
        <div className="flex flex-col gap-6 items-start">
          {/* Column 1: Rounded border with dot + svg */}
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center justify-center rounded-full border-[#FFD345D6] px-2 py-1 gap-2 border">
              <div className="w-3 h-3 rounded-full bg-primary mr-2" />
              <span className="text-primary">
                {data?.title2 || "Premium portable Heater"}
              </span>
              <Image
                src="/landing/yello.svg"
                alt="Hero SVG"
                width={40}
                height={40}
                className="w-6 h-6"
              />
            </div>
          </div>

          {/* Column 2: Huge text with dynamic title1 */}
          <div className="flex flex-col">
            <h1 className="text-white md:text-[80px] text-4xl md:leading-20 font-bold">
              {firstWord}{' '}
              <span className="text-primary">{remainingWords}</span>
            </h1>
          </div>

          {/* Column 3: Dynamic description from API */}
          <div className="max-w-lg">
            <p className="text-white md:text-[24px] text-sm max-md:text-justify">
              {data?.description || "Experience ultimate warmth with our smoke-free, energy-efficient portable heaters. Engineered for outdoor adventures, camping, and emergency preparedness."}
            </p>
          </div>

          {/* Column 4: Buttons */}
          <div className="flex flex-row gap-4 mt-4">
            <Button
              className="flex items-center gap-2 px-6 py-4 text-black"
              variant="defaultGradient"
              onClick={() => router.push("/products")}
            >
              Explore Product
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="text-white flex items-center gap-2 px-6 py-4"
              onClick={() => router.push("/about")}
            >
              Learn More
              <Image
                src="/landing/white.svg"
                alt="Arrow Right"
                width={20}
                height={20}
                className="w-5 h-5"
              />
            </Button>
          </div>
        </div>
      </div>

      {/* Right Section with dynamic SwipperCards */}
      <div className="md:w-1/2 w-full flex items-center max-md:hidden">
        <SwipperCards images={(data?.existing_images || []).filter((img) => img.heading !== null) as any} />
      </div>

      {/* Optional Overlay if needed */}
      <div className="absolute inset-0 bg-black/30"></div>
    </section>
  );
};