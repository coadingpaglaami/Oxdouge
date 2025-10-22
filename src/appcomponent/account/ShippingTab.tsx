"use client";
import { shippingAddresses } from "@/data/ShippingAddressData";
import { useState } from "react";
import { ShippingAddressSection } from "../reusable/ShippingAddressSection";
export const ShippingTab = () => {
  const [selectedAddress, setSelectedAddress] = useState<number>(
    shippingAddresses.find((a) => a.isDefault)?.id ?? shippingAddresses[0].id
  );
  return (
    <ShippingAddressSection
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
    />
  );
};
