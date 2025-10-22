import Image from "next/image";

export const OurValues = () => {
  const data = [
    {
      icon: "/about/badge.svg",
      icongradient1: "#033350",
      icongradient2: "#172527",
      title: "Quality First",
      descripion:
        "We never cut corners. Every product is built to exceed expectations and withstand the toughest conditions.",
    },
    {
      icon: "/about/shield.svg",
      icongradient1: "#425003",
      icongradient2: "#172327",
      title: "Community",
      descripion:
        "We're more than a company – we're a community of adventurers supporting each other's journeys.",
    },
    {
      icon: "/about/heartwhite.svg",
      icongradient1: "#044B34",
      icongradient2: "#17251F",
      title: "Sustainability",
      descripion:
        "We're committed to protecting the places we love to explore through responsible manufacturing.",
    },
    {
      icon: "/about/archerwhite.svg",
      icongradient1: "#4C2E88",
      icongradient2: "#0E1951",
      title: "Innovation",
      descripion:
        "We constantly push boundaries in battery technology and solar efficiency to deliver better power solutions.",
    },
  ];

  return (
    <div className="bg-[#121212] w-full flex flex-col items-center gap-12 py-16 text-white">
      {/* Header */}
      <h2 className="text-3xl md:text-4xl font-bold text-center">Our Values</h2>
      
      {/* Subtitle */}
      <p className="text-[#C2C2C2] text-center max-w-2xl">
        Getting your outdoor gear is simple and straightforward.
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
              style={{ background: `linear-gradient(135deg, ${item.icongradient1}, ${item.icongradient2})` }}
            >
              <Image src={item.icon} alt={item.title} width={40} height={40} />
            </div>

            <h3 className="text-xl font-semibold text-primary">{item.title}</h3>
            <p className="text-sm leading-relaxed">{item.descripion}</p>
          </div>
        ))}
      </div>
    </div>
  );
};