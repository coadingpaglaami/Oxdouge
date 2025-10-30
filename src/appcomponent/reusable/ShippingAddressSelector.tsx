"use client";

import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { ShippingAddressSelector } from "./ShippingAddressTwo";
import { useGetShippingsQuery } from "@/api/shippingApi";
import { ShippingAddressResponse } from "@/interfaces/api/ShippingAddress";

interface ShippingAddressSectionProps {
  selectedAddress: number;
  setSelectedAddress: React.Dispatch<React.SetStateAction<number>>;
  shippingAddresses:ShippingAddressResponse[]
}

export const ShippingAddressSection = ({
  selectedAddress,
  setSelectedAddress,
}: ShippingAddressSectionProps) => {

  const { data, isLoading: shipLoading } = useGetShippingsQuery();


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
          <Button variant="outline" size="sm">
            Change
          </Button>
        </DialogTrigger>

        <DialogContent className="min-w-[80vw] w-full h-auto bg-[#121212] text-white border border-primary">
          <ShippingAddressSelector
            selectedAddress={selectedAddress}
            setSelectedAddress={setSelectedAddress}
            data={data}
            shipLoading={shipLoading}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};
