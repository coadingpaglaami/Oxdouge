'use client';
import React from "react";
import { CheckCircle2, Clock, Package, ShoppingCart } from "lucide-react";

interface CardProps {
  data?: {
    total_stock: number;
    total_order: number;
    total_orders_pending: number;
    total_orders_completed: number;
  };
}

export const Card = ({ data }: CardProps) => {
  const cardData = [
    {
      title: "Total Products",
      value: data?.total_stock || 0,
      icon: <Package />,
      iconcolor: "#FFD345",
      iconbg: "#FFD34536",
    },
    {
      title: "Total Orders",
      value: data?.total_order || 0,
      icon: <ShoppingCart />,
      iconcolor: "#4193FF",
      iconbg: "#3B90FF36",
    },
    {
      title: "Pending Orders",
      value: data?.total_orders_pending || 0,
      icon: <Clock />,
      iconcolor: "#FFD345",
      iconbg: "#FFD34536",
    },
    {
      title: "Completed Orders",
      value: data?.total_orders_completed || 0,
      icon: <CheckCircle2 />,
      iconcolor: "#00CD72",
      iconbg: "#00CD7236",
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {cardData.map((card, index) => (
        <div
          key={index}
          className="flex justify-between items-center p-4 bg-[#121212] border border-primary/20 rounded-lg"
        >
          {/* Left Content */}
          <div className="flex flex-col gap-8">
            <p className="text-gray-400 text-sm">{card.title}</p>
            <p className="text-white text-xl font-semibold">{card.value}</p>
          </div>

          {/* Right Icon */}
          <div
            className="p-2 rounded-lg"
            style={{
              backgroundColor: card.iconbg,
              color: card.iconcolor,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
