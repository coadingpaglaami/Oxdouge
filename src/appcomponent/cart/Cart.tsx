"use client";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { CartLeftChild } from "./CartLeftChild";
import { CartRightChild } from "./CartRightChild";
import { useState, useEffect } from "react";
import { CartItemResponse } from "@/interfaces/api/AddToCart";
import { useGetCartQuery } from "@/api/cartApi";

export const Cart = () => {
  const { data: cartData, isLoading } = useGetCartQuery();
  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Initialize cart items and select first item by default
  useEffect(() => {
    if (cartData) {
      setCartItems(cartData);
      // Select first item by default
      if (cartData.length > 0) {
        setSelectedItems([cartData[0].id]);
      }
    }
  }, [cartData]);

  console.log("Cart Data:", cartData);

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
          <CartLeftChild
            cartItems={cartItems}
            setCartItems={setCartItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>
        <div className="md:w-[40%] w-full">
          <CartRightChild cartItems={cartItems} selectedItems={selectedItems} />
        </div>
      </div>
    </div>
  );
};
