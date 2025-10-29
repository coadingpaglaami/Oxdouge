"use client";

import { shippingAddresses } from "@/data/ShippingAddressData";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ShippingAddressSelector } from "./ShippingAddressTwo";

interface ShippingAddressSectionProps {
  selectedAddress: number;
  setSelectedAddress: React.Dispatch<React.SetStateAction<number>>;
}

export const ShippingAddressSection = ({
  selectedAddress,
  setSelectedAddress,
}: ShippingAddressSectionProps) => {
  
  return (
    <div className="flex justify-between items-start">
      <div className="flex flex-col gap-1">
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
      </div>

      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </DialogTrigger>

        <DialogContent className="min-w-[80vw] w-full h-[60vh] bg-[#121212] text-white border border-primary">
          <ShippingAddressSelector
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
