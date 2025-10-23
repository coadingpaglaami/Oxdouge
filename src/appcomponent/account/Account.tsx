"use client";
import { useState } from "react";
import { ArrowLeft, User, Lock, MapPin, Package } from "lucide-react";
import { Sheet, SheetTrigger, SheetContent } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

// Import tab components
import { ProfileTab } from "./ProfileTab";
import { SecurityTab } from "./SecurityTab";
import { ShippingTab } from "./ShippingTab";
import { OrderTab } from "./OrderTab";

export const Account = () => {
  const [activeTab, setActiveTab] = useState<
    "profile" | "password" | "shipping" | "order"
  >("profile");

  const tabs = [
    { key: "profile", label: "Profile", icon: <User className="w-4 h-4" /> },
    { key: "password", label: "Security", icon: <Lock className="w-4 h-4" /> },
    {
      key: "shipping",
      label: "Shipping",
      icon: <MapPin className="w-4 h-4" />,
    },
    { key: "order", label: "Order", icon: <Package className="w-4 h-4" /> },
  ];

  const renderTabContent = () => {
    switch (activeTab) {
      case "profile":
        return <ProfileTab />;
      case "password":
        return <SecurityTab />;
      case "shipping":
        return <ShippingTab />;
      case "order":
        return <OrderTab />;
      default:
        return null;
    }
  };

  return (
    <div className="flex flex-col text-white space-y-10">
      {/* Top Section */}
      <div className="flex flex-col items-center text-center mt-4">
        <div className="flex items-center gap-2 self-start text-sm text-gray-300 hover:text-primary cursor-pointer">
          <ArrowLeft className="w-4 h-4" />
          <span>Back To Products</span>
        </div>

        <div className="mt-4">
          <h2 className="text-lg font-semibold">My Account</h2>
          <p className="text-sm text-[#A1A1A1]">
            Manage your account settings and order history
          </p>
        </div>
      </div>

      {/* Tabs Section (Desktop) */}
      <div className="hidden md:flex flex-col items-center justify-center">
        {/* Tabs Row */}
        <div className="w-4/5 flex justify-center">
          <div className="w-full flex justify-around gap-10 mb-8 border border-primary p-4 rounded-lg">
            {tabs.map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key as typeof activeTab)}
                className={`flex items-center gap-2 transition-colors ${
                  activeTab === tab.key
                    ? "text-primary"
                    : "text-gray-400 hover:text-white"
                }`}
              >
                {tab.icon}
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>
        {/* Active Tab Content */}
        <div className="w-4/5">{renderTabContent()}</div>
      </div>

      {/* Mobile Version (Tabs inside Sheet) */}
      <div className="md:hidden flex flex-col items-center justify-center">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="outline" className="text-sm">
              Open Tabs
            </Button>
          </SheetTrigger>
          <SheetContent
            side="bottom"
            className="bg-[#121212] text-white border-t border-gray-700"
          >
            <div className="flex justify-around py-4">
              {tabs.map((tab) => (
                <button
                  key={tab.key}
                  onClick={() => setActiveTab(tab.key as typeof activeTab)}
                  className={`flex flex-col items-center gap-1 ${
                    activeTab === tab.key ? "text-primary" : "text-gray-400"
                  }`}
                >
                  {tab.icon}
                  <span className="text-xs">{tab.label}</span>
                </button>
              ))}
            </div>
          </SheetContent>
        </Sheet>

        <div className="w-full mt-6 px-4">{renderTabContent()}</div>
      </div>
    </div>
  );
};
