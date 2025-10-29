"use client";

import { useState } from "react";
import { shippingAddresses } from "@/data/ShippingAddressData";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShippingAddressSection } from "../reusable/ShippingAddressSelector";
import { CartItemResponse } from "@/interfaces/api/AddToCart";
import { useApplyCouponMutation } from "@/api/couponApi";
import { toast } from "sonner";
import { ApplyCouponResponse } from "@/interfaces/api/Coupon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { useChekOutSessionMutation, usePlaceOrderMutation } from "@/api/ordersApi";

interface CartRightChildProps {
  cartItems: CartItemResponse[];
  selectedItems: number[];
}

export const CartRightChild = ({
  cartItems,
  selectedItems,
}: CartRightChildProps) => {
  const [selectedAddress, setSelectedAddress] = useState<number>(
    shippingAddresses.find((a) => a.isDefault)?.id ?? shippingAddresses[0].id
  );
  const [applyCouponTwo, { isLoading }] = useApplyCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [couponeData, setCouponData] = useState<ApplyCouponResponse>(
    {} as ApplyCouponResponse
  );
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE" | "">("");
  const [checkOut,{isLoading:checking}]=useChekOutSessionMutation();

  // Filter only selected items
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );
  // Subtotal (only selected items)
  const subtotal = selectedCartItems.reduce((acc, item) => {
    return acc + item?.price * item?.quantity;
  }, 0);
  // Here you can add shipping, tax, etc.
  const total = subtotal;

  console.log("Selected Cart:", selectedCartItems);
  const applyCoupon = async () => {
    const onlyProdAndQty = selectedCartItems?.map((item) => ({
      id: item.product,
      quantity: item.quantity,
    }));

    const res = await applyCouponTwo({
      code: couponCode,
      products: onlyProdAndQty,
    }).unwrap();
    toast.success("Coupon applied successfully");
    // console.log("Coupon applied:", res);
    setCouponData(res);
    // Example coupon logic
  };
  console.log("Coupon Data:", couponeData);
  console.log("Selected Address ID:", selectedAddress);

  const placeOrderFunction = async () => {
    try {
      const cart_item_ids = selectedCartItems.map((item) => item.id);
      const res = await placeOrder({
        cart_item_ids,
        shipping_id: selectedAddress,
        payment_method: paymentMethod,
        coupon_code: couponCode,
      }).unwrap();
      console.log("Order placed successfully:", res);
      if(paymentMethod==="ONLINE"){
        const checkoutRes=await checkOut({order_id:res.order_id}).unwrap();
        window.location.href=checkoutRes.url;
      }
      toast.success("Order placed successfully");
    } catch (error) {
      console.error("Failed to place order:", error);
      toast.error("Failed to place order");
    }
  };


  return (
    <div className="flex flex-col border border-primary p-6 gap-6 w-full rounded-lg">
      {/* 1. Heading */}
      <h2 className="text-lg font-semibold text-white">Order Summary</h2>

      {/* 2. Selected Items Info */}
      {selectedCartItems.length > 0 && (
        <div className="flex flex-col gap-2 p-3 bg-primary/10 rounded-lg">
          <p className="text-sm text-primary font-medium">
            Selected Items ({selectedCartItems.length})
          </p>
          {selectedCartItems.map((item) => (
            <div key={item.id} className="flex justify-between text-sm">
              <span className="text-white">
                {item.product_name} x{item.quantity}
              </span>
              <span className="text-white">
                ${(item.price * item.quantity).toFixed(2)}
              </span>
            </div>
          ))}
        </div>
      )}

      {/* 3. Shipping Address */}
      <ShippingAddressSection
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
      />

      {/* 4. Coupon Code */}
      <div className="flex flex-col gap-2">
        <label className="text-white text-sm font-medium">Have a coupon?</label>
        <div className="flex gap-2">
          <Input
            type="text"
            placeholder="Enter coupon code"
            value={couponCode}
            onChange={(e) => setCouponCode(e.target.value)}
            className="flex-1 text-white"
          />
          <Button
            onClick={applyCoupon}
            disabled={isLoading}
            className="disabled:opacity-35 disabled:cursor-not-allowed"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 5. Subtotal, Shipping, Tax */}
      <div className="flex flex-col gap-2">
        <div className="flex justify-between">
          <span className="text-white">Subtotal</span>
          <span className="text-white">${subtotal.toFixed(2)}</span>
        </div>
      </div>
      {couponeData.applied_products && (
        <div className="flex justify-between">
          <span className="text-white">Discount</span>
          <span className="text-white">
            ${parseFloat(couponeData.coupon_discount_value).toFixed(2)}
          </span>
        </div>
      )}

      <div className="border-b border-primary" />

      {/* 6. Total */}
      <div className="flex justify-between text-lg font-semibold">
        <span className="text-white">Total</span>
        <span className="text-white">
          $
          {couponeData.applied_products
            ? parseFloat(couponeData.final_amount).toFixed(2)
            : total.toFixed(2)}
        </span>
      </div>

      {/* 7. Buttons */}
      {/* <div className="flex flex-col gap-2 mt-4">
        <Button className="w-full" disabled={selectedCartItems.length === 0}>
          Proceed to Checkout
        </Button>
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </div> */}
      <div className="flex flex-col gap-2 mt-4">
        <Button
          className="w-full"
          disabled={selectedCartItems.length === 0}
          onClick={() => setIsPaymentOpen(true)}
        >
          Proceed to Checkout
        </Button>
        <Button variant="outline" className="w-full">
          Continue Shopping
        </Button>
      </div>

      <Dialog open={isPaymentOpen} onOpenChange={setIsPaymentOpen}>
        <DialogContent className="bg-[#1E1E1E] border border-primary/20 text-white w-[380px]">
          <h3 className="text-lg font-semibold mb-3">Select Payment Method</h3>

          <div className="flex flex-col gap-3">
            <label
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setPaymentMethod("COD")}
            >
              <input
                type="checkbox"
                checked={paymentMethod === "COD"}
                readOnly
                className="accent-primary"
              />
              Cash on Delivery
            </label>

            <label
              className="flex items-center gap-2 cursor-pointer"
              onClick={() => setPaymentMethod("ONLINE")}
            >
              <input
                type="checkbox"
                checked={paymentMethod === "ONLINE"}
                readOnly
                className="accent-primary"
              />
              Pay with Stripe
            </label>
          </div>

          <div className="flex justify-end gap-3 mt-4">
            <Button variant="outline" onClick={() => setIsPaymentOpen(false)}>
              Cancel
            </Button>
            <Button
              disabled={!paymentMethod}
              onClick={() => {
                placeOrderFunction();
                setIsPaymentOpen(false);
                // call submit here later
              }}
            >
              Confirm
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
