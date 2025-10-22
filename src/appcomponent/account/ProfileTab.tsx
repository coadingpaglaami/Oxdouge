"use client";

import { useState } from "react";
import { Pencil, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";

export const ProfileTab = () => {
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    name: "John Doe",
    email: "johndoe@email.com",
    phone: "+880 1763 945 210",
    address: "House #7, Road #4, Dhanmondi, Dhaka",
  });

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  return (
    <div className="flex flex-col text-white w-full space-y-8 px-4 py-2
     border border-primary rounded-lg">
      {/* Header Section */}
      <div className="flex justify-between items-start">
        <div className="flex flex-col">
          <h2 className="text-xl font-semibold">Profile Information</h2>
          <p className="text-sm text-[#AEAEAE]">
            Update your personal information and contact details
          </p>
        </div>
        <button
          onClick={() => setIsEditing(!isEditing)}
          className="text-gray-400 hover:text-primary transition-colors"
        >
          <Pencil className="w-5 h-5" />
        </button>
      </div>

      {/* Form Section */}
      <form className="flex flex-col gap-6">
        {/* 1️⃣ Name Field */}
        <div className="flex flex-col gap-2">
          <label htmlFor="name" className="text-sm text-gray-300">
            Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            value={formData.name}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
              !isEditing ? "cursor-not-allowed opacity-70" : ""
            }`}
          />
        </div>

        {/* 2️⃣ Email + Phone Row */}
        <div className="flex flex-col md:flex-row gap-4">
          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="email" className="text-sm text-gray-300">
              Email
            </label>
            <input
              id="email"
              name="email"
              type="email"
              value={formData.email}
              disabled
              className="w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white cursor-not-allowed opacity-70"
            />
          </div>

          <div className="flex flex-col flex-1 gap-2">
            <label htmlFor="phone" className="text-sm text-gray-300">
              Phone No
            </label>
            <input
              id="phone"
              name="phone"
              type="text"
              value={formData.phone}
              onChange={handleChange}
              disabled={!isEditing}
              className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
                !isEditing ? "cursor-not-allowed opacity-70" : ""
              }`}
            />
          </div>
        </div>

        {/* 3️⃣ Address Textarea */}
        <div className="flex flex-col gap-2">
          <label htmlFor="address" className="text-sm text-gray-300">
            Address
          </label>
          <textarea
            id="address"
            name="address"
            rows={3}
            value={formData.address}
            onChange={handleChange}
            disabled={!isEditing}
            className={`w-full rounded-lg border border-primary bg-transparent px-4 py-2 text-white focus:outline-none focus:ring-1 focus:ring-primary ${
              !isEditing ? "cursor-not-allowed opacity-70" : ""
            }`}
          />
        </div>

        {/* 4️⃣ Action Row */}
        <div className={`flex ${isEditing ? 'justify-between items-center':'justify-end'} mt-4`}>
          {isEditing && (
            <Button
              type="button"
              className="bg-primary text-white hover:opacity-90"
              onClick={() => setIsEditing(false)}
            >
              Save Changes
            </Button>
          )}

          
            <Button
              variant="outline"
              className="flex items-center gap-2 text-white border-primary hover:bg-primary/10"
            >
              <LogOut className="w-4 h-4" />
              Log Out
            </Button>
        </div>
      </form>
    </div>
  );
};
