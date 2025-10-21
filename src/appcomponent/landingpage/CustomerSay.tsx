"use client";

import Image from "next/image";
import { Star } from "lucide-react";

export const CustomerSay = () => {
  const data = [
    {
      name: "Sarah Mitchell",
      img: "/landing/customer1.png",
      comment:
        "“The Not Overland Mini is perfect for my small apartment. It heats up instantly and looks super stylish!”",
      rating: 5,
    },
    {
      name: "David Lee",
      img: "/landing/customer2.png",
      comment:
        "“Took the Not Overland Go on a camping trip — worked flawlessly even in windy weather. Truly adventure-ready!”",
      rating: 5,
    },
    {
      name: "Mike Rodriguez",
      img: "/landing/customer3.png",
      comment:
        "“Silent, powerful, and energy-efficient. I use the Pro model in my office and it’s just perfect.”",
      rating: 4,
    },
  ];

  return (
    <div className="flex flex-col">
      {/* ---------- Top Section ---------- */}
      <div className="flex flex-col items-center text-center">
        {/* Heading */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          What Our <span className="text-primary">Customers</span> Say
        </h2>

        {/* Subtext */}
        <p className="text-[#686868] text-base md:text-lg mt-3">
          Don’t just take our word for it – hear from fellow adventurers.
        </p>
      </div>

      {/* ---------- Cards Section ---------- */}
      <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
        {data.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#121212] rounded-2xl p-6 border border-primary/30"
          >
            {/* Rating */}
            <div className="flex mb-4 gap-2">
              {Array.from({ length: item.rating ?? 5 }).map((_, i) => (
                <Star
                  key={i}
                  className="w-5 h-5 text-primary fill-primary"
                />
              ))}
            </div>

            {/* Comment */}
            <p className="text-[#C8C8C8] text-sm leading-relaxed mb-6">
              {item.comment}
            </p>

            {/* User Info */}
            <div className="flex flex-row items-center gap-2">
              <Image
                src={item.img}
                alt={item.name}
                width={64}
                height={64}
                className="rounded-full object-cover w-9 h-9"
              />
              <p className="text-white text-base font-medium ">
                {item.name}
              </p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
