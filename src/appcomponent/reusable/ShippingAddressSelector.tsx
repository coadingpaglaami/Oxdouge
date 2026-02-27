"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ShippingAddressSelector } from "./ShippingAddressTwo";
import { ShippingAddressResponse } from "@/interfaces/api/ShippingAddress";
import { useEffect, useState } from "react";
import { getAccessToken } from "@/lib/token";
import { useRouter } from "next/navigation";

interface ShippingAddressSectionProps {
  selectedAddress: number;
  setSelectedAddress: React.Dispatch<React.SetStateAction<number>>;
  shippingAddresses: ShippingAddressResponse[];
  addressLoading: boolean;
}

export const ShippingAddressSection = ({
  selectedAddress,
  setSelectedAddress,
  shippingAddresses,
  addressLoading,
}: ShippingAddressSectionProps) => {
  const token = getAccessToken();
  const router = useRouter();
  // const { data, isLoading: shipLoading } = useGetShippingsQuery();
  const [showAddAddress, setShowAddAddress] = useState(false);
  useEffect(() => {
    if (shippingAddresses.length === 0) {
      setShowAddAddress(true);
    } else {
      setShowAddAddress(false);
    }
  }, [shippingAddresses]);

  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
        <p className="text-[#C8C8C8] text-sm">Shipping Address</p>
        {
          // shi
        }
        {/* {shippingAddresses
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
          ))} */}
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button
            variant={shippingAddresses.length > 0 ? "outline" : "default"}
            size="sm"
            onClick={() => {
              if (!token) {
                router.push("/login?redirect=/cart");
              }
            }}
          >
            {shippingAddresses.length > 0 ? "Change" : "Add Address"}
          </Button>
        </DialogTrigger>

        <DialogContent className="min-w-[80vw] w-full h-auto bg-[#121212] text-white border border-primary">
          <ShippingAddressSelector
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            data={shippingAddresses}
            shipLoading={addressLoading}
            showAddAddress={showAddAddress}
            setShowAddAddress={setShowAddAddress}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
