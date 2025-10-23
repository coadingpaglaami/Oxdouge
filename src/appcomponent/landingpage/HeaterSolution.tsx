"use client";
import { landingPageData } from "@/data";
import { Button } from "@/components/ui/button";
import { useRouter } from "next/navigation";
import { Heater } from "../reusable";

export const HeaterSolution = () => {
  const router = useRouter();
  return (
    <div className="flex flex-col">
      {/* ----------- Top Section ----------- */}
      <div className="flex flex-col items-center text-center">
        {/* Header */}
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Featured <span className="text-primary">Heater</span> Solutions
        </h2>

        {/* Description */}
        <p className="text-[#C2C2C2] text-base md:text-lg mt-3 max-w-2xl">
          Discover our hand-picked selection of portable power stations, Heater,
          and accessories engineered for outdoor enthusiasts.
        </p>
      </div>

      {/* ----------- Card Section ----------- */}
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8 ">
        {landingPageData.map((item, index) => (
          <Heater
            img={item.img}
            description={item.description}
            price={item.price}
            subtitle={item.subtitle}
            title={item.title}
            key={index}
            id={item.id}
          />
        ))}
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
