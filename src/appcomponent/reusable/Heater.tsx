import { Button } from "@/components/ui/button";
import { DiselHeater } from "@/interfaces";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Heater = ({id, img, title, subtitle, description, price }:DiselHeater) => (
  <Link href={`/products/${id}`}>
  <div className="flex flex-col bg-[#121212] border border-primary rounded-lg overflow-hidden">
    <Image src={img} alt={title} className="w-full h-56 object-cover"  height={400} width={400}/>
    <div className="flex flex-col p-6 gap-3">
      <p className="text-sm text-[#9C9C9C]">{subtitle}</p>
      <h3 className="text-xl font-semibold text-white">{title}</h3>
      <p className="text-gray-400 text-sm">{description}</p>
      <p className="text-lg font-semibold text-white mt-2">{price}</p>
      <Button className="mt-3 flex items-center justify-center gap-2">
        <ShoppingCart className="w-4 h-4" /> Add to Cart
      </Button>
    </div>
  </div>
  </Link>
);