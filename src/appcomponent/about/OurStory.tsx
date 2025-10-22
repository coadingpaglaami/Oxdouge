"use client";
import Image from "next/image";

export const OurStory = () => {
  return (
    <div className="bg-[#121212] w-full flex flex-col md:flex-row items-center md:items-stretch md:justify-between">
      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 p-8 text-white">
        <h2 className="text-3xl font-semibold">Our Story</h2>
        <p>
          Not Overland was born from a simple frustration: outdoor enthusiasts
          needed reliable power for their adventures, but existing solutions
          were either too heavy, too expensive, or simply unreliable when it
          mattered most.
        </p>
        <p>
          Founded in 2018 by a group of backcountry adventurers and engineers in
          Boulder, Colorado, we set out to change that. Our mission was clear:
          create portable power solutions that don{"'"}t compromise on capacity,
          portability, or sustainability.
        </p>
        <p>
          Today, Not Overland serves thousands of outdoor enthusiasts across
          North America—from weekend campers to full-time overlanders to
          emergency preparedness experts. Every power station and solar panel we
          design goes through rigorous field testing in real conditions,
          ensuring it delivers when you need it most.
        </p>
      </div>

      {/* Right Side Image */}
      <div className="w-full md:w-1/2 md:max-h-[500px] py-2 md:flex md:justify-end md:max-w-3/4 px-2 overflow-hidden">
        <Image
          src="/landing/background2.png"
          alt="Our Story Background"
          height={600}
          width={600}
          className="object-cover aspect-square w-full rounded-lg"
          priority
        />
      </div>
    </div>
  );
};
