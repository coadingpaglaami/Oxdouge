"use client";

import { useState } from "react";
import { ShoppingCartItem } from "@/interfaces/ShoppingCartItem"; // Your interface for left section items
import { shippingAddresses } from "@/data/ShippingAddressData";
import { Button } from "@/components/ui/button";
import { ShippingAddressSection } from "../reusable/ShippingAddressSelector";


interface CartRightChildProps {
  cartItems: ShoppingCartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<ShoppingCartItem[]>>;
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

      {/* 2. Shipping Address */}
      {/* <div className="flex justify-between items-start"> */}
 
        {/* <div className="flex flex-col gap-1">
          <p className="text-[#C8C8C8] text-sm">Shipping Address</p>
          {shippingAddresses
            .filter((a) => a.id === selectedAddress)
            .map((a) => (
              <div key={a.id} className="text-sm text-gray-300">
                <p>{a.label}</p>
                <p>
                  {a.street}, {a.addressLine2}
                </p>
                <p>
                  {a.city}, {a.state}, {a.zip}, {a.country}
                </p>
              </div>
            ))}
        </div> */}
  <ShippingAddressSection
  selectedAddress={selectedAddress}
  setSelectedAddress={setSelectedAddress}
/>


        {/* <Dialog >
          <DialogTrigger asChild>

          </DialogTrigger>

          <DialogContent className="min-w-[80vw] w-full h-[50vh] bg-[#121212] text-white border border-primary">
            <DialogHeader>
              <DialogTitle>{!showAddAddress ?'Set Your Default Shipping Address':'Add New Shipping Address'}</DialogTitle>
              <DialogDescription>
                {!showAddAddress ?'Update your default shipping address':'Update your default shipping address'}
              </DialogDescription>
            </DialogHeader>

            {!showAddAddress ? (
              <div className="flex flex-col gap-4 mt-4 w-full">
                <RadioGroup
                  value={selectedAddress.toString()}
                  onValueChange={(val) => setSelectedAddress(parseInt(val))}
                  className="flex flex-col gap-2 w-full"
                >
                  {shippingAddresses.map((a) => (
                    <div key={a.id} className="flex items-center gap-2 w-full border border-primary/20 p-4 rounded">
                      <RadioGroupItem value={a.id.toString()} />
                      <div className="flex flex-col gap-1 w-full">
                        <div className="flex justify-between">
                          <p>{a.label}</p>
                          {a.isDefault && (
                            <span className="text-primary font-semibold">
                              Default
                            </span>
                          )}
                        </div>
                        <div className="flex justify-between">
                          <p>{a.street}</p>
                          <p>{a.addressLine2}</p>
                          <p>
                            {a.city}, {a.state}, {a.zip}, {a.country}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))}
                </RadioGroup>

                <Button
                  onClick={() => setShowAddAddress(true)}
                  className="self-center"
                  size="sm"
                >
                  Add Address
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-4">

                <div className="flex flex-col gap-3">
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Street Address</label>
                    <input
                      type="text"
                      className="border border-primary/20 rounded p-2 text-white"
                    />
                  </div>
                  <div className="flex gap-2">
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-sm">City</label>
                      <input
                        type="text"
                        className="border border-primary/20 rounded p-2 text-white"
                      />
                    </div>
                    <div className="flex flex-col gap-1 flex-1">
                      <label className="text-sm">State</label>
                      <input
                        type="text"
                        className="border border-primary/20 rounded p-2 text-white"
                      />
                    </div>
                  </div>
                  <div className="flex flex-col gap-1">
                    <label className="text-sm">Zip Code</label>
                    <input
                      type="text"
                      className="border border-primary/20 rounded p-2 text-white"
                    />
                  </div>
                </div>

                <Button
                  onClick={() => setShowAddAddress(false)}
                  className="self-start"
                  size="sm"
                >
                  Save Address
                </Button>
              </div>
            )}
          </DialogContent>
        </Dialog> */}
      {/* </div> */}

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
