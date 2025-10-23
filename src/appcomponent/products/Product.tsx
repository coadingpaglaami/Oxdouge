'use client';
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { productPageData } from "@/data";
import { Heater } from "../reusable";

export const Products = () => {
  const [activeTab, setActiveTab] = useState("All");

  const filteredProducts =
    activeTab === "All"
      ? productPageData
      : productPageData.filter((item) =>
          item.subtitle.toLowerCase().includes("heater")
        );

  return (
    <div className="flex flex-col gap-10 w-full py-20">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">Our Products</h2>
        <p className="mt-4 max-w-3xl text-[#BEBABA]">
          We{"'"}re committed to providing outdoor enthusiasts with reliable,
          portable power solutions that keep you connected and powered wherever
          your adventures take you.
        </p>
      </div>

      {/* Tabs */}
      <div className="flex justify-center gap-4">
        <Button
          variant={activeTab === "All" ? "default" : "outline"}
          onClick={() => setActiveTab("All")}
        >
          All
        </Button>
        <Button
          variant={activeTab === "Heater" ? "default" : "outline"}
          onClick={() => setActiveTab("Heater")}
        >
          Heater
        </Button>
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
        {filteredProducts.map((item, index) => (
          <Heater key={index} {...item} />
        ))}
      </div>
    </div>
  );
};
