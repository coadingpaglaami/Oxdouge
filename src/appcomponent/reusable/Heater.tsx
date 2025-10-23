import { Button } from "@/components/ui/button";
import { DiselHeater } from "@/interfaces";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

export const Heater = ({
  id,
  img,
  title,
  subtitle,
  description,
  price,
}: DiselHeater) => (
  <Link
    href={`/products/${id}`}
    className="hover:sccale-105 transition-transform duration-200"
  >
    <div className="flex flex-col bg-[#121212] border border-primary rounded-lg overflow-hidden gap-4 ">
      <div className="relative aspect-[3.9/2.2]">
        <Image
          src={img}
          alt={title}
          fill
          className="w-full h-56 object-cover"
        />
      </div>

      <div className="flex flex-col p-6 gap-3">
        <p className="text-sm text-[#9C9C9C]">{subtitle}</p>
        <h3 className="text-xl font-semibold text-white">{title}</h3>
        <p className="text-gray-400 text-sm line-clamp-2 min-h-16">
          {description}
        </p>
        <p className="text-lg font-semibold text-white mt-2">{price}</p>
        <Button className="mt-3 flex items-center justify-center gap-2">
          <ShoppingCart className="w-4 h-4" /> Add to Cart
        </Button>
      </div>
    </div>
  </Link>
);
