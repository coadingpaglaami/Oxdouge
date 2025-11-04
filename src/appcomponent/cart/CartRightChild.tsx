"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ShippingAddressSection } from "../reusable/ShippingAddressSelector";
import { CartItemResponse } from "@/interfaces/api/AddToCart";
import { ShippingAddressResponse } from "@/interfaces/api/ShippingAddress";
import { useApplyCouponMutation } from "@/api/couponApi";
import { toast } from "sonner";
import { ApplyCouponResponse } from "@/interfaces/api/Coupon";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import {
  useChekOutSessionMutation,
  usePlaceOrderMutation,
} from "@/api/ordersApi";
import { MapPin, Phone, Mail } from "lucide-react";
import { useRouter } from "next/navigation";
import { useGetShippingsQuery } from "@/api/shippingApi";

interface CartRightChildProps {
  cartItems: CartItemResponse[];
  selectedItems: number[];
}

export const CartRightChild = ({
  cartItems,
  selectedItems,
}: CartRightChildProps) => {
  // Select first address as default
  const [selectedAddress, setSelectedAddress] = useState<number>(0);
  const { data: shippingAddresses, isLoading: addressesLoading } =
    useGetShippingsQuery();

  // Set default address when shipping addresses are loaded
  useEffect(() => {
    if (
      shippingAddresses != undefined &&
      shippingAddresses.length > 0 &&
      selectedAddress === 0
    ) {
      setSelectedAddress(shippingAddresses[0].shipping_id);
    }
  }, [shippingAddresses]);
  const [applyCouponTwo, { isLoading }] = useApplyCouponMutation();
  const [couponCode, setCouponCode] = useState("");
  const [couponeData, setCouponData] = useState<ApplyCouponResponse>(
    {} as ApplyCouponResponse
  );
  const selectedAddressDetails = shippingAddresses?.find(
    (addr) => addr.shipping_id === selectedAddress
  );
  const [placeOrder, { isLoading: placing }] = usePlaceOrderMutation();
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState<"COD" | "ONLINE" | "">("");
  const [checkOut, { isLoading: checking }] = useChekOutSessionMutation();
  const router = useRouter();

  useEffect(() => {
    if (shippingAddresses != undefined && shippingAddresses.length > 0 && selectedAddress === 0) {
      setSelectedAddress(shippingAddresses[0].shipping_id);
    }
  }, [shippingAddresses, selectedAddress]);

  // Filter only selected items
  const selectedCartItems = cartItems.filter((item) =>
    selectedItems.includes(item.id)
  );

  // Subtotal (only selected items)
  const subtotal = selectedCartItems.reduce((acc, item) => {
    return acc + item?.price * item?.quantity;
  }, 0);

  const total = subtotal;

  const applyCoupon = async () => {
    const onlyProdAndQty = selectedCartItems?.map((item) => ({
      id: item.product,
      quantity: item.quantity,
    }));

    try {
      const res = await applyCouponTwo({
        code: couponCode,
        products: onlyProdAndQty,
      }).unwrap();
      toast.success("Coupon applied successfully");
      setCouponData(res);
    } catch (error) {
      toast.error("Failed to apply coupon");
    }
  };

  const placeOrderFunction = async () => {
    try {
      const cart_item_ids = selectedCartItems.map((item) => item.id);
      const res = await placeOrder({
        cart_item_ids,
        shipping_id: selectedAddress,
        payment_method: paymentMethod,
        coupon_code: couponCode,
      }).unwrap();

      if (paymentMethod === "ONLINE") {
        const checkoutRes = await checkOut({ order_id: res.order_id }).unwrap();
        window.location.href = checkoutRes.url;
      } else {
        window.location.href = `/cart?order_id=${res.order_id}`;
      }
      toast.success("Order placed successfully");
    } catch (error: unknown) {
      console.error("Failed to place order:", error);

      // Type-safe access
      const err = error as {
        data?: { detail?: string; message?: string };
        message?: string;
      };

      const message =
        err?.data?.detail ||
        err?.data?.message ||
        err?.message ||
        "Failed to place order";

      toast.error(message);
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

      {/* 3. Shipping Address Selector */}
      <ShippingAddressSection
        selectedAddress={selectedAddress}
        setSelectedAddress={setSelectedAddress}
        shippingAddresses={shippingAddresses || []}
        addressLoading={addressesLoading}
      />

      {/* 4. Selected Shipping Address Display */}
      {/* Selected Shipping Address Display */}
      {selectedAddressDetails ? (
        <div className="flex flex-col gap-3 p-4 bg-primary/5 rounded-lg border border-primary/20">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-primary" />
            <h3 className="text-sm font-semibold text-white">Shipping To:</h3>
          </div>

          <div className="space-y-1.5 text-sm text-white">
            <p className="font-medium">{selectedAddressDetails.full_name}</p>
            <p>{selectedAddressDetails.street_address}</p>
            {selectedAddressDetails.apartment && (
              <p className="text-white/80">
                {selectedAddressDetails.apartment}
                {selectedAddressDetails.floor &&
                  `, Floor: ${selectedAddressDetails.floor}`}
              </p>
            )}
            <p>
              {selectedAddressDetails.city} - {selectedAddressDetails.zipcode}
            </p>

            <div className="flex items-center gap-2 pt-2 text-white/80">
              <Phone className="w-3.5 h-3.5" />
              <span>{selectedAddressDetails.phone_no}</span>
            </div>

            <div className="flex items-center gap-2 text-white/80">
              <Mail className="w-3.5 h-3.5" />
              <span>{selectedAddressDetails.email}</span>
            </div>
          </div>
        </div>
      ):(
        <p className="text-sm text-red-500">No shipping address found.</p>
      )}

      {/* 5. Coupon Code */}
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
            disabled={isLoading || selectedCartItems.length === 0}
            className="disabled:opacity-35 disabled:cursor-not-allowed"
          >
            Apply
          </Button>
        </div>
      </div>

      {/* 6. Subtotal */}
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
            -${parseFloat(couponeData.coupon_discount_value).toFixed(2)}
          </span>
        </div>
      )}

      <div className="border-b border-primary" />

      {/* 7. Total */}
      <div className="flex justify-between text-lg font-semibold">
        <span className="text-white">Total</span>
        <span className="text-white">
          $
          {couponeData.applied_products
            ? parseFloat(couponeData.final_amount).toFixed(2)
            : total.toFixed(2)}
        </span>
      </div>

      {/* 8. Buttons */}
      <div className="flex flex-col gap-2 mt-4">
        <Button
          className="w-full"
          disabled={selectedCartItems.length === 0 || !selectedAddress}
          onClick={() => setIsPaymentOpen(true)}
          style={{display: !selectedAddress ? 'none': 'block'}}
        >
          Proceed to Checkout
        </Button>
        <Button
          variant="outline"
          className="w-full"
          onClick={() => router.push("/products")}
        >
          Continue Shopping
        </Button>
      </div>

      {/* Payment Method Dialog */}
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
              disabled={!paymentMethod || placing || checking}
              onClick={() => {
                placeOrderFunction();
                setIsPaymentOpen(false);
              }}
            >
              {placing || checking ? "Processing..." : "Confirm"}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
