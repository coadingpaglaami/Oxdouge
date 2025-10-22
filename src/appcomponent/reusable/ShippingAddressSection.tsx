'use client';

import { useState } from "react";
import { shippingAddresses } from "@/data/ShippingAddressData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogTrigger,
} from "@/components/ui/dialog";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";

interface ShippingAddressSectionProps {
  selectedAddress: number;
  setSelectedAddress: React.Dispatch<React.SetStateAction<number>>;
}

export const ShippingAddressSection = ({
  selectedAddress,
  setSelectedAddress,
}: ShippingAddressSectionProps) => {
  const [showAddAddress, setShowAddAddress] = useState(false);

  return (
    <div className="flex justify-between items-start">
      {/* Address Info */}
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

      {/* Change Button → Dialog */}
      <Dialog>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm">
            Change
          </Button>
        </DialogTrigger>

        <DialogContent className="min-w-[80vw] w-full h-[60vh] bg-[#121212] text-white border border-primary">
          <DialogHeader>
            <DialogTitle>
              {!showAddAddress
                ? "Set Your Default Shipping Address"
                : "Add New Shipping Address"}
            </DialogTitle>
            <DialogDescription>
              {!showAddAddress
                ? "Update your default shipping address"
                : "Add a new shipping address"}
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
                  <div
                    key={a.id}
                    className="flex items-center gap-2 w-full border border-primary/20 p-4 rounded"
                  >
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
              {/* Add New Address Form */}
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
      </Dialog>
    </div>
  );
};
