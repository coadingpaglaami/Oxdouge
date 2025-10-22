"use client";
import Image from "next/image";

export const HeroSection = () => {
  return (
    <div className="relative w-full h-[30vh] flex items-center justify-center">
      {/* Background Image */}
      <Image
        src="/about/abouthero.png"
        alt="about hero background"
        fill
        className="object-cover"
        priority
      />

      {/* Overlay Content */}
      <div className="relative z-10 flex flex-col items-center text-center gap-6 px-4">
        <h1 className="text-3xl md:text-5xl font-bold text-white">
          About <span className="text-primary">NOT Overland </span>Tech
        </h1>
        <p className="text-lg md:text-xl max-w-2xl text-white ">
          Portable Power. Unlimited Adventures. Engineered for Explorers.
        </p>
      </div>

      {/* Optional dark overlay over BG for readability */}
      <div className="absolute inset-0 bg-black/30" />
    </div>
  );
};
