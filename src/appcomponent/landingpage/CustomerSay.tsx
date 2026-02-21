"use client";

import Image from "next/image";
import { Star } from "lucide-react";
import { useReviewListQuery } from "@/api/productApi";
import { Loader2 } from "lucide-react";

export const CustomerSay = () => {
  const { data: customerReview, isLoading } = useReviewListQuery();

  // Helper: pick first letter
  const getInitial = (name: string) => name.charAt(0).toUpperCase();

  // Helper: random pastel color based on name
  const getColorFromName = (name: string) => {
    const colors = [
      "bg-red-500",
      "bg-blue-500",
      "bg-green-500",
      "bg-yellow-500",
      "bg-purple-500",
      "bg-pink-500",
      "bg-orange-500",
    ];
    const index = name.charCodeAt(0) % colors.length;
    return colors[index];
  };

  return (
    <div className="flex flex-col">
      {/* ---------- Top Section ---------- */}
      <div className="flex flex-col items-center text-center">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          What Our <span className="text-primary">Customers</span> Say
        </h2>
        <p className="text-[#686868] text-base md:text-lg mt-3">
          Don’t just take our word for it – hear from fellow adventurers.
        </p>
      </div>

      {/* ---------- Cards Section ---------- */}
      {isLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="animate-spin text-white" size={28} />
        </div>
      ) : (
        <div className="mt-12 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          {customerReview?.map((item) => {
            const ratingNum = Number(item.rating) || 5;
            return (
              <div
                key={item.id}
                className="flex flex-col bg-[#121212] rounded-2xl p-6 border border-primary/30 hover:scale-105 transition-transform duration-200"
              >
                {/* Rating */}
                <div className="flex mb-4 gap-2">
                  {Array.from({ length: ratingNum }).map((_, i) => (
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
                  {item.user_image ? (
                    <Image
                      src={item.user_image}
                      alt={item.name}
                      width={64}
                      height={64}
                      className="rounded-full object-cover w-9 h-9"
                    />
                  ) : (
                    <div
                      className={`w-9 h-9 rounded-full flex items-center justify-center text-white font-medium ${getColorFromName(
                        item.name
                      )}`}
                    >
                      {getInitial(item.name)}
                    </div>
                  )}
                  <p className="text-white text-base font-medium ">
                    {item.name}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
