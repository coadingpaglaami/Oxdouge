"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CartLeftChild } from "./CartLeftChild";
import { CartRightChild } from "./CartRightChild";
import { ShoppingCartItem } from "@/interfaces/ShoppingCartItem";
import { useState } from "react";

export const Cart = () => {
  const [cartItems, setCartItems] = useState<ShoppingCartItem[]>([
    {
      id: 1,
      img: "/heaterimg/heater1.jpg",
      title: "NOT Overland Mini",
      price: "$299.99",
      quantity: 1,
    },
    {
      id: 2,
      img: "/heaterimg/heater2.jpg",
      title: "NOT Overland Max",
      price: "$399.99",
      quantity: 2,
    },
    {
      id: 3,
      img: "/heaterimg/heater3.jpg",
      title: "NOT Overland Pro Duo",
      price: "$499.99",
      quantity: 1,
    },
  ]);

  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back Link */}
      <div>
        <Link
          href="/products"
          className="flex items-center gap-2 text-white font-medium"
        >
          <ArrowLeft /> Back to Products
        </Link>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        {/* Left Child */}
        <div className="md:w-[60%] w-full">
 <CartLeftChild cartItems={cartItems} setCartItems={setCartItems} />
        </div>
        <div className="md:w-[40%] w-full">
            <CartRightChild cartItems={cartItems} setCartItems={setCartItems} />
        </div>
       
      </div>
      
    </div>
  );
};
