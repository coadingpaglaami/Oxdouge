"use client";

import Image from "next/image";

export const WarmSection = () => {
  const data = [
    {
      title: "Instant Heat, Anytime",
      description:
        "Feel the warmth in seconds with advanced ceramic heating technology.",
    },
    {
      title: "Smart Energy Saving",
      description:
        "Heats efficiently while keeping your electricity bill low.",
    },
    {
      title: "Safe for Everyone",
      description:
        "Auto shut-off and overheat protection for complete peace of mind.",
    },
    {
      title: "Portable & Travel-Friendly",
      description:
        "Heats efficiently while keeping your electricity bill low.",
    },
  ];

  return (
    <div className="flex flex-col md:flex-row gap-10 items-center">
      {/* ---------- Left Side (Image) ---------- */}
      <div className="w-full md:w-1/2 flex justify-center">
        <div className="border-2 border-primary rounded-2xl ">
          <Image
            src="/landing/warm.png"
            alt="Warm Heater"
            width={500}
            height={500}
            className="rounded-2xl object-cover shadow-orange-300"
            priority
          />
        </div>
      </div>

      {/* ---------- Right Side (Content) ---------- */}
      <div className="w-full md:w-1/2 flex flex-col justify-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Warm with <span className="text-primary">NOT Overland Tech</span>
        </h2>

        {/* Cards */}
        <div className="flex flex-col gap-6 mt-8">
          {data.map((item, index) => (
            <div
              key={index}
              className="flex items-start gap-4 bg-transparent py-3 px-4 border border-primary/30 rounded-lg"
            >
              {/* Icon */}
              <div
                className="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                style={{
                  background: "linear-gradient(135deg, #425003, #212717)",
                }}
              >
                <Image
                  src="/landing/warm.svg"
                  alt="Icon"
                  width={24}
                  height={24}
                />
              </div>

              {/* Text Content */}
              <div className="flex flex-col flex-1">
                <h3 className="text-2xl text-white font-semibold">
                  {item.title}
                </h3>
                <p className="text-gray-400 text-sm mt-1">
                  {item.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
