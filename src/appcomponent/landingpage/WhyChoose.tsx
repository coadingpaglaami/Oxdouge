// export const WhyChoose = () => {
//     const data=[
//         {
//             icon:'/landing/fire.svg',
//             title:'Energy Efficient',
//             description:'Designed to deliver maximum heat while consuming minimal power.',
//             icongradinet1:'#033350',
//             icongradinet2:'#172527',
//         },
//         {
//             icon:'/landing/tie.svg',
//             title:'Smoke Free',
//             description:'Enjoy clean, odorless warmth — no smoke, no fumes, just pure comfort.',
//             icongradinet1:'#425003',
//             icongradinet2:'#212717',
//         },
//         {
//             icon:'/landing/gurad.svg',
//             title:'Built Rugged',
//             description:'Weather-resistant and durable construction for harsh outdoor conditions.',
//             icongradinet1:'#044B34',
//             icongradinet2:'#172327',
//         },
//         {
//             icon:'/landing/vector.svg',
//             title:'Built Rugged',
//             description:'Weather-resistant and durable construction for harsh outdoor conditions.',
//             icongradinet1:'#240463',
//             icongradinet2:'#141A36',
//         }
//     ]

//     return(
//         <div>

//         </div>
//     )

// };

import Image from "next/image";
import React from "react";

export const WhyChoose = () => {
  const data = [
    {
      icon: "/landing/fire.svg",
      title: "Energy Efficient",
      description:
        "Designed to deliver maximum heat while consuming minimal power.",
      icongradinet1: "#033350",
      icongradinet2: "#172527",
    },
    {
      icon: "/landing/tie.svg",
      title: "Smoke Free",
      description:
        "Enjoy clean, odorless warmth — no smoke, no fumes, just pure comfort.",
      icongradinet1: "#425003",
      icongradinet2: "#212717",
    },
    {
      icon: "/landing/guard.svg",
      title: "Built Rugged",
      description:
        "Weather-resistant and durable construction for harsh outdoor conditions.",
      icongradinet1: "#044B34",
      icongradinet2: "#172327",
    },
    {
      icon: "/landing/vector.svg",
      title: "Built Rugged",
      description:
        "Weather-resistant and durable construction for harsh outdoor conditions.",
      icongradinet1: "#240463",
      icongradinet2: "#141A36",
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {/* ---------- Top Section ---------- */}
      <div className="flex flex-col items-center text-center">
        {/* Header */}
        <div className="flex items-center gap-2 md:text-4xl text-2xl font-bold relative">
          <h2 className="text-white  ">Why choose</h2>
          <span className="text-primary">Overland Tech</span>
          <Image
            src="/landing/quotation.svg"
            alt="line"
            width={50}
            height={20}
            className="absolute -right-16 -top-7 md:block hidden"
          />
        </div>

        {/* Quote */}

        {/* Description */}
        <p className="text-gray-300 text-base md:text-lg max-w-2xl mt-4">
          We’re committed to providing outdoor enthusiasts with reliable,
          portable power solutions that keep you connected and powered wherever
          your adventures take you.
        </p>
      </div>

      {/* ---------- Card Section ---------- */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#121212] rounded-2xl p-6 border border-primary hover:scale-105 transition-transform duration-300"
          >
            {/* Icon */}
            <div
              className="w-16 h-16 flex items-center justify-center rounded-xl mb-4"
              style={{
                background: `linear-gradient(135deg, ${item.icongradinet1}, ${item.icongradinet2})`,
              }}
            >
              <Image
                src={item.icon}
                alt={item.title}
                height={40}
                width={40}
                className="w-8 h-8"
              />
            </div>

            {/* Title */}
            <h3 className="text-primary text-lg font-semibold mb-2">
              {item.title}
            </h3>

            {/* Description */}
            <p className="text-gray-400 text-sm leading-relaxed">
              {item.description}
            </p>
          </div>
        ))}
      </div>
    </div>
  );
};
