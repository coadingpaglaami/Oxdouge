"use client";

import Image from "next/image";
import { Button } from "@/components/ui/button";
import { ArrowRight, ShoppingCart } from "lucide-react";
import { SwipperCards } from "./SwipperCards";

export const HeroSection = () => {
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
            <div className="flex items-center justify-center rounded-full  border-[#FFD345D6] px-2 py-1 gap-2 border">
              {/* Dot */}

              <div className="w-3 h-3 rounded-full bg-primary mr-2" />
              <span className="text-primary">Premium portable Heater</span>
              {/* Placeholder for SVG */}
              <Image
                src="/landing/yello.svg"
                alt="Hero SVG"
                width={40}
                height={40}
                className="w-6 h-6"
              />
            </div>
          </div>

          {/* Column 2: Huge text */}
          <div className="flex flex-col">
            <h1 className="text-white md:text-[80px] text-4xl md:leading-20 font-bold ">
              Power <span className="text-primary">Everything</span>
            </h1>
          </div>

          {/* Column 3: Paragraph */}
          <div className="max-w-lg">
            <span className="text-4xl text-gray-300">You Need</span>
            <p className="text-white md:text-[24px] text-sm max-md:text-justify">
              Experience ultimate warmth with our smoke-free, energy-efficient
              portable heaters. Engineered for outdoor adventures, camping, and
              emergency preparedness.
            </p>
          </div>

          {/* Column 4: Buttons */}
          <div className="flex flex-row gap-4 mt-4">
            <Button
              className="flex items-center gap-2 px-6 py-4"
              variant="defaultGradient"
            >
              Buy Now
              <ArrowRight className="w-5 h-5" />
            </Button>
            <Button
              variant="outline"
              className="text-white flex items-center gap-2 px-6 py-4"
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

      {/* Right Section (Empty for now) */}
      <div className="md:w-1/2 w-full flex items-center max-md:hidden">
        <SwipperCards />
      </div>

      {/* Optional Overlay if needed */}
      <div className="absolute inset-0 bg-black/30"></div>
    </section>
  );
};
