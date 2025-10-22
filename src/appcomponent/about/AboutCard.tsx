'use client';
import Image from "next/image";

export const AboutCard = () => {
  const data = [
    {
      title: "Our Mission",
      description:
        "To empower outdoor enthusiasts with reliable, portable power solutions that enable unlimited adventures while embracing sustainable energy. We believ staying connected and powered shouldn mean sacrificing your environmental values or adventure spirit.",
      icons: "/about/archer.svg",
    },
    {
      title: "Our Vision",
      description:
        "To be the leading provider of innovative, eco-friendly portable power solutions for outdoor enthusiasts worldwide. We envision a future where every adventurer has access to clean, reliable energy that enhances their outdoor experiences while minimizing their environmental impact.",
      icons: "/about/heart.svg",
    },
  ];

  return (
    <div className="w-full flex flex-col md:flex-row gap-6 px-4">
      {data.map((item, idx) => (
        <div
          key={idx}
          className="w-full md:w-1/2 border border-[#8B8B8B]/50 p-10 flex flex-col gap-6 text-white rounded-lg "
        >
          {/* Icon */}
          <div className="w-16 h-16 rounded-full bg-primary/25 flex items-center justify-center">
            <Image src={item.icons} alt={item.title} width={32} height={32} />
          </div>

          {/* Title */}
          <h3 className="text-2xl font-semibold">{item.title}</h3>

          {/* Description */}
          <p className="text-sm leading-relaxed">{item.description}</p>
        </div>
      ))}
    </div>
  );
};