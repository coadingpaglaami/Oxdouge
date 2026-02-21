"use client";

import { AboutStoryResponse } from "@/lib/splitintoparagraph";
import Image from "next/image";
interface AboutCardProps {
  storyData: AboutStoryResponse | null;
}

export const AboutCard = ({ storyData }: AboutCardProps) => {
  // Default mission and vision if no data
  const defaultMission = "To empower outdoor enthusiasts with reliable, portable power solutions that enable unlimited adventures while embracing sustainable energy. We believe staying connected and powered shouldn't mean sacrificing your environmental values or adventure spirit.";
  
  const defaultVision = "To be the leading provider of innovative, eco-friendly portable power solutions for outdoor enthusiasts worldwide. We envision a future where every adventurer has access to clean, reliable energy that enhances their outdoor experiences while minimizing their environmental impact.";

  // Icons for mission and vision
  const icons = {
    mission: "/about/archer.svg",
    vision: "/about/heart.svg",
  };

  const missionVisionData = [
    {
      title: "Our Mission",
      description: storyData?.mission_description || defaultMission,
      icon: icons.mission,
    },
    {
      title: "Our Vision",
      description: storyData?.vision_description || defaultVision,
      icon: icons.vision,
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 px-4">
      {missionVisionData.map((item, idx) => (
        <div
          key={idx}
          className="w-full md:w-1/2 border border-[#8B8B8B]/50 p-10 flex flex-col gap-6 text-white rounded-lg hover:border-primary hover:shadow-lg hover:shadow-primary/20 transition-all duration-300 group"
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-primary/25 flex items-center justify-center group-hover:bg-primary/40 transition-colors duration-300">
            <Image 
              src={item.icon} 
              alt={item.title} 
              width={32} 
              height={32}
              className="group-hover:scale-110 transition-transform duration-300"
            />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-semibold text-primary">{item.title}</h3>

          {/* Description */}
          <p className="text-sm leading-relaxed text-gray-300">
            {item.description}
          </p>
        </div>
      ))}
    </div>
  );
};