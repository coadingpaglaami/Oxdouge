"use client";
import { useState } from "react";
import { ShippingAddressSelector } from "../reusable/ShippingAddressTwo";
import { useGetShippingsQuery } from "@/api/shippingApi";

export const ShippingTab = () => {
  const { data, isLoading: shipLoading } = useGetShippingsQuery();
  const [selectedAddress, setSelectedAddress] = useState<number>(0);

  return (

    
    <ShippingAddressSelector
      selectedAddress={selectedAddress}
      setSelectedAddress={setSelectedAddress}
      data={data?.results}
      shipLoading={shipLoading}
    />
  );
};
