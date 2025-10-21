'use client';
import { landingPageData } from "@/data";
import { Button } from "@/components/ui/button";
import { ShoppingCart } from "lucide-react";
import { useRouter } from "next/navigation";

export const HeaterSolution = () => {
    const router= useRouter();
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
      <div className="mt-10 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 ">
        {landingPageData.map((item, index) => (
          <div
            key={index}
            className="flex flex-col bg-[#121212] border border-primary rounded-lg overflow-hidden"
          >
            {/* Image */}
            <img
              src={item.img}
              alt={item.title}
              className="w-full h-56 object-cover"
            />

            {/* Content */}
            <div className="flex flex-col p-6 gap-3">
              {/* Subtitle */}
              <p className="text-sm text-[#9C9C9C]">{item.subtitle}</p>

              {/* Title */}
              <h3 className="text-xl font-semibold text-white">
                {item.title}
              </h3>

              {/* Description */}
              <p className="text-gray-400 text-sm">{item.description}</p>

              {/* Price */}
              <p className="text-lg font-semibold text-white mt-2">
                {item.price}
              </p>

              {/* Add to Cart Button */}
              <Button className="mt-3 flex items-center justify-center gap-2">
                <ShoppingCart className="w-4 h-4" />
                Add to Cart
              </Button>
            </div>
          </div>
        ))}
      </div>
      <Button variant='outline' className="self-center mt-8 text-white" onClick={()=>router.push('/products')} >
        View All Product
      </Button>
    </div>
  );
};
