"use client";
import Image from "next/image";

export const OurJourney = () => {
  return (
    <div className="bg-[#121212] w-full flex flex-col md:flex-row-reverse items-center md:items-stretch md:justify-between">
      {/* Left Content */}
      <div className="w-full md:w-1/2 flex flex-col justify-center gap-6 p-8 text-white">
        <h2 className="text-3xl font-semibold">Join <span className="text-primary">Our</span> Journey</h2>
        <p>
          Whether you{"'"}re a weekend camper, long-distance hiker, overlander,
          or preparing for emergencies, we{"'"}re here to power your journey.
          Our team of power specialists and outdoor enthusiasts is passionate
          about helping you find the perfect portable power solution.
        </p>
        <p>
          We offer comprehensive warranties on all our power stations, free
          expert advice, and a 30-day satisfaction guarantee. Because when your
          devices stay charged and your adventures continue, we all win.
        </p>
        <p>
          Thank you for choosing Not Overland. Here{"'"}s to powering countless
          adventures together.
        </p>
      </div>

      {/* Right Side Image */}
      <div className="w-full md:w-1/2 md:max-h-[500px] py-2 md:flex md:justify-end md:max-w-3/4 px-2 overflow-hidden">
        <Image
          src="/landing/warm.png"
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
