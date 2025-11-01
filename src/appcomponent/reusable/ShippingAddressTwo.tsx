"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  useCreateShippingMutation,
  useDeleteShippingMutation,
} from "@/api/shippingApi";
import { toast } from "sonner";
import { Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { ShippingAddressResponse } from "@/interfaces/api/ShippingAddress";

interface ShippingAddressSelectorProps {
  selectedAddress: number;
  setSelectedAddress: (val: number) => void;
  data: ShippingAddressResponse[] | undefined;
  shipLoading: boolean;
}

export const ShippingAddressSelector = ({
  selectedAddress,
  setSelectedAddress,
  data
}: ShippingAddressSelectorProps) => {
  const [showAddAddress, setShowAddAddress] = useState(false);
  const [shipping, { isLoading }] = useCreateShippingMutation();
  const [fullName, setFullName] = useState("");
  const [phoneNo, setPhoneNo] = useState("");
  const [email, setEmail] = useState("");
  const [streetAddress, setStreetAddress] = useState("");
  const [apartment, setApartment] = useState("");
  const [floor, setFloor] = useState("");
  const [city, setCity] = useState("");
  const [zipcode, setZipcode] = useState("");
  const [shippDelete, { isLoading: deleting }] = useDeleteShippingMutation();

  const handleSaveAddress = async () => {
    try {
      const payload = {
        full_name: fullName,
        phone_no: phoneNo,
        email,
        street_address: streetAddress,
        apartment: apartment || undefined, // optional
        floor: floor || undefined, // optional
        city,
        zipcode,
      };

      await shipping(payload).unwrap(); // RTK Query mutation call
      toast.success("Address saved successfully!");
      setShowAddAddress(false);

      // Optionally reset form
      setFullName("");
      setPhoneNo("");
      setEmail("");
      setStreetAddress("");
      setApartment("");
      setFloor("");
      setCity("");
      setZipcode("");
    } catch (err) {
      console.error("Failed to save address:", err);
      alert("Failed to save address");
    }
  };
  const handleDeleteAddress = async (id: number) => {
    try {
      await shippDelete(id).unwrap();
      toast.success("Address deleted successfully!");
    } catch (error) {
      console.error("Failed to delete address:", error);
      toast.error("Failed to delete address");
    }
  };
  return (
    <>
      <div className="flex flex-col gap-2">
        <span className="font-semibold text-white text-xl">
          {!showAddAddress
            ? "Set Your Default Shipping Address"
            : "Add New Shipping Address"}
        </span>
        <span className="text-[#AEAEAE]">
          {!showAddAddress
            ? "Update your default shipping address"
            : "Add a new shipping address"}
        </span>
      </div>

      {!showAddAddress ? (
        <div className="flex flex-col gap-4 mt-4 w-full">
          <RadioGroup
            value={selectedAddress.toString()}
            onValueChange={(val) => setSelectedAddress(parseInt(val))}
            className="flex flex-col gap-2 w-full"
          >
            {data?.map((shipping) => (
              <div
                key={shipping.shipping_id}
                className="flex items-center gap-2 w-full border border-primary/20 p-4 rounded"
              >
                <RadioGroupItem
                  value={shipping.shipping_id.toString()}
                  defaultValue={
                    data.length >= 1 ?data[data.length - 1].shipping_id.toString():''
                  }
                />
                <div className="flex flex-col gap-1 w-full">
                  <div className="flex justify-between">
                    <div className="flex gap-2">
                      <span>{shipping.shipping_id} </span>
                      <span className="font-medium">{shipping.full_name}</span>
                    </div>
                    <AlertDialog>
                      <AlertDialogTrigger asChild>
                        <Button className="bg-transparent hover:bg-transparent ">
                          <Trash2 className="text-red-500 " size={24} />
                        </Button>
                      </AlertDialogTrigger>
                      <AlertDialogContent className="bg-black">
                        <AlertDialogHeader>
                          <AlertDialogTitle className="text-white">
                            Are you absolutely sure?
                          </AlertDialogTitle>
                          <AlertDialogDescription className="text-white">
                            This action cannot be undone. This will permanently
                            delete your account and remove your data from our
                            servers.
                          </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancel</AlertDialogCancel>
                          <AlertDialogAction
                            onClick={() =>
                              handleDeleteAddress(shipping.shipping_id)
                            }
                            disabled={deleting}
                            className="disabled:opacity-50 "
                          >
                            {deleting ? "Delting" : "Delete"}
                          </AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </div>

                  <div className="flex justify-between">
                    <p className="w-1/3">Floor: {shipping.floor}</p>
                    <p className="w-1/3 flex justify-center">
                      Apartment: {shipping.apartment}
                    </p>
                    <p className="w-1/3 flex justify-end">
                      {shipping.street_address}, {shipping.city},{" "}
                      {shipping.zipcode}
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
          {/* Full Name */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Full Name</label>
            <input
              type="text"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="border border-primary/20 rounded p-2 text-white"
            />
          </div>

          {/* Phone & Email */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm">Phone Number</label>
              <input
                type="text"
                value={phoneNo}
                onChange={(e) => setPhoneNo(e.target.value)}
                className="border border-primary/20 rounded p-2 text-white"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm">Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="border border-primary/20 rounded p-2 text-white"
              />
            </div>
          </div>

          {/* Street Address */}
          <div className="flex flex-col gap-1">
            <label className="text-sm">Street Address</label>
            <input
              type="text"
              value={streetAddress}
              onChange={(e) => setStreetAddress(e.target.value)}
              className="border border-primary/20 rounded p-2 text-white"
            />
          </div>

          {/* Apartment & Floor */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm">Apartment (Optional)</label>
              <input
                type="text"
                value={apartment}
                onChange={(e) => setApartment(e.target.value)}
                className="border border-primary/20 rounded p-2 text-white"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm">Floor (Optional)</label>
              <input
                type="text"
                value={floor}
                onChange={(e) => setFloor(e.target.value)}
                className="border border-primary/20 rounded p-2 text-white"
              />
            </div>
          </div>

          {/* City & Zipcode */}
          <div className="flex gap-2">
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm">City</label>
              <input
                type="text"
                value={city}
                onChange={(e) => setCity(e.target.value)}
                className="border border-primary/20 rounded p-2 text-white"
              />
            </div>
            <div className="flex flex-col gap-1 flex-1">
              <label className="text-sm">Zip Code</label>
              <input
                type="text"
                value={zipcode}
                onChange={(e) => setZipcode(e.target.value)}
                className="border border-primary/20 rounded p-2 text-white"
              />
            </div>
          </div>

          {/* Save Button */}
          <Button
            onClick={handleSaveAddress}
            className="self-start"
            size="sm"
            disabled={isLoading}
          >
            {isLoading ? "Saving..." : "Save Address"}
          </Button>
        </div>
      )}
    </>
  );
};
