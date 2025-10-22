"use client";
import { shippingAddresses } from "@/data/ShippingAddressData";
import { useState } from "react";
import { ShippingAddressSelector } from "../reusable/ShippingAddressTwo";

export const ShippingTab = () => {
  const [selectedAddress, setSelectedAddress] = useState<number>(
    shippingAddresses.find((a) => a.isDefault)?.id ?? shippingAddresses[0].id
  );
  return (
    <ShippingAddressSelector
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
    />
  );
};
