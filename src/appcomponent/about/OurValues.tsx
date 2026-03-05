"use client";
import {
  useGetHeadingSectionQuery,
  useGetValuesSectionQuery,
} from "@/api/ui_manager";
import Image from "next/image";

export const OurValues = () => {
  useGetHeadingSectionQuery({});
  const { data: headingData } = useGetHeadingSectionQuery({});
  const { data: valuesData } = useGetValuesSectionQuery({});

  // Helper function to find item by ID
  const findItemById = (id: number) => {
    return valuesData?.results?.find((item: { id: number }) => item.id === id);
  };

  const data = [
    {
      icon: "/about/badge.svg",
      icongradient1: "#033350",
      icongradient2: "#172527",
      title: findItemById(2)?.title || "Quality",
      description:
        findItemById(2)?.description ||
        "We are committed to delivering the highest quality products that meet rigorous standards for performance, durability, and reliability.",
    },
    {
      icon: "/about/shield.svg",
      icongradient1: "#425003",
      icongradient2: "#172327",
      title: findItemById(3)?.title || "Community",
      description:
        findItemById(3)?.description ||
        "We're more than a brand — we're a community of adventurers who share a passion for exploring the outdoors.",
    },
    {
      icon: "/about/heartwhite.svg",
      icongradient1: "#044B34",
      icongradient2: "#17251F",
      title: findItemById(4)?.title || "Sustainability",
      description:
        findItemById(4)?.description ||
        "We care deeply about our planet. Our products are designed with sustainability in mind, using eco-friendly materials and processes.",
    },
    {
      icon: "/about/archerwhite.svg",
      icongradient1: "#4C2E88",
      icongradient2: "#0E1951",
      title: findItemById(1)?.title || "Innovation",
      description:
        findItemById(1)?.description ||
        "We constantly push boundaries in battery technology and solar efficiency to deliver better power solutions.",
    },
  ];

  return (
    <div className="bg-[#121212] w-full flex flex-col items-center gap-12 py-16 text-white">
      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-bold text-center">
        {headingData?.[0]?.heading5 || "Our Values"}
      </h2>

      {/* Subtitle */}
      <p className="text-[#C2C2C2] text-center max-w-2xl">
        {headingData?.[0]?.subheading5 ||
          "Getting your outdoor gear is simple and straightforward."}
      </p>

      {/* Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 w-full px-6">
        {data.map((item, idx) => (
          <div
            key={idx}
            className="flex flex-col items-center text-center gap-6 p-8 "
          >
            <div
              className="w-20 h-20 rounded-full flex items-center justify-center"
              style={{
                background: `linear-gradient(135deg, ${item.icongradient1}, ${item.icongradient2})`,
              }}
            >
              <Image src={item.icon} alt={item.title} width={40} height={40} />
            </div>

            <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
            <p className="text-sm leading-relaxed">{item.description}</p>
          </div>
        ))}
      </div>
    </div>
  );
};
