"use client";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Heater } from "../reusable";
import { useGetProductUserQuery } from "@/api/productApi";
import { ProductCardSkeleton } from "../skeleton/ProductCardSkeleton";
import { useGetHeadingSectionQuery } from "@/api/ui_manager";

export const HeaterSolution = () => {
  const { data: product, isLoading } = useGetProductUserQuery({});
  const { data: headingData } = useGetHeadingSectionQuery({});
  const router = useRouter();
  return (
    <div className="flex flex-col">
      {/* ----------- Top Section ----------- */}
      <div className="flex flex-col items-center text-center">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          {headingData?.[0]?.heading2 || "The Ultimate Heater Solution for Outdoor Enthusiasts"}
        </h2>

        {/* Description */}
        <p className="text-[#C2C2C2] text-base md:text-lg mt-3 max-w-2xl">
          {headingData?.[0]?.subheading2 || "Experience the perfect blend of warmth, portability, and durability with our cutting-edge outdoor heaters designed for every adventure."}
        </p>
      </div>

      {/* ----------- Card Section ----------- */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
        {isLoading
          ? Array(4)
              .fill(0)
              .map((_, index) => <ProductCardSkeleton key={index} />)
          : product?.results
              .slice(0, 4)
              .map((item) => <Heater key={item.id} {...item} />)}
      </div>
      <Button
        variant="outline"
        className="self-center mt-8 text-white"
        onClick={() => router.push("/products")}
      >
        View All Product
      </Button>
    </div>
  );
};
