"use client";

import { useState } from "react";
import { ShoppingCartItem } from "@/interfaces/ShoppingCartItem"; // Your interface for left section items
import { shippingAddresses } from "@/data/ShippingAddressData";
import { Button } from "@/components/ui/button";
import { ShippingAddressSection } from "../reusable/ShippingAddressSelector";

interface CartRightChildProps {
  cartItems: ShoppingCartItem[];
  // setCartItems: React.Dispatch<React.SetStateAction<ShoppingCartItem[]>>;
}
export const CartRightChild = ({ cartItems }: CartRightChildProps) => {
  const [selectedAddress, setSelectedAddress] = useState<number>(
    shippingAddresses.find((a) => a.isDefault)?.id ?? shippingAddresses[0].id
  );

  // Subtotal
  const subtotal = cartItems.reduce((acc, item) => {
    const price = parseFloat(item.price.replace("$", ""));
    return acc + price * item.quantity;
  }, 0);

  // Shipping calculation
  const shipping = subtotal > 100 ? 0 : 9.99;

  // Tax 10%
  const tax = subtotal * 0.1;

  const total = subtotal + tax + shipping;

  return (
    <div className="flex flex-col border border-primary p-6 gap-6 w-full  rounded-lg">
      {/* 1. Heading */}
      <h2 className="text-lg font-semibold text-white">Order Summary</h2>
      <ShippingAddressSection
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />
      {/* 3. Subtotal, Shipping, Tax */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-white">Subtotal</span>
          <span className="text-white">${subtotal.toFixed(2)}</span>
        </div>
        <div className="flex justify-between ">
          <span className="text-white">Shipping</span>
          <span className="text-primary ">
            {shipping === 0 ? "FREE" : `$${shipping.toFixed(2)}`}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-white">Tax</span>
          <span className="text-white">${tax.toFixed(2)}</span>
        </div>
      </div>

      <div className="border-b border-primary" />

      {/* 4. Total */}
      <div className="flex justify-between text-lg font-semibold">
        <span className="text-white">Total</span>
        <span className="text-white">${total.toFixed(2)}</span>
      </div>

      {/* 5. Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <Button className="w-full">Proceed to Checkout</Button>
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </div>
    </div>
  );
};
