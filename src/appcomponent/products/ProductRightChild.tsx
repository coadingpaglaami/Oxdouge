'use client';
import { DiselHeater } from "@/interfaces";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";

interface ProductRightProps {
  product: DiselHeater;
}

export const ProductRightChild = ({ product }: ProductRightProps) => {
  const [quantity, setQuantity] = useState(1);

  // convert price string like "$299.99" to number
  const unitPrice = parseFloat(product.price.replace("$", ""));
  const totalPrice = (unitPrice * quantity).toFixed(2);

  const increase = () => {
    if (product.quantity && quantity < product.quantity) {
      setQuantity(quantity + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  return (
    <div className="flex flex-col gap-6 w-full md:w-1/2">
      {/* Rating */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="text-yellow-400 " fill="yellow" size={20} />
        ))}
      </div>

      {/* Subtitle */}
      <p className="text-sm text-[#BAB8B8]">{product.subtitle}</p>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white">{product.title}</h1>

      {/* Price */}
      <p className="text-2xl font-semibold text-primary">${unitPrice.toFixed(2)}</p>

      {/* Description */}
      <p className="text-[#C2C2C2]">{product.description}</p>

      {/* Key Features */}
      {product.keyFeatures && (
        <div className="flex flex-col gap-2">
          <h3 className="text-primary font-semibold">Key Features</h3>
          <div className="flex flex-col gap-1 border border-primary rounded">
            {product.keyFeatures.map((feature, idx) => (
              <div
                key={idx}
                className="flex items-center gap-2   p-2"
              >
                <Image src="/product/sign.svg" alt="icon" height={40} width={40} className="w-5 h-5" />
                <span className="text-[#C2C2C2]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {product.availability && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Availability:</span>
          <span
            className={
              product.availability === "In Stock" ? "text-green-500" : "text-primary"
            }
          >
            {product.availability}
          </span>
        </div>
      )}

      {/* Quantity and Total */}
      <div className="flex flex-col gap-2 rounded p-4">
        {/* Quantity Selector */}
        <div className="flex flex-col gap-2">
          <span className="font-semibold text-white">Quantity:</span>
          <div className="flex items-center  rounded">
            <button
              onClick={decrease}
              className="px-3 py-1 text-lg font-semibold text-white bg-primary/20"
            >
              -
            </button>
            <span className="px-4 text-white">{quantity}</span>
            <button
              onClick={increase}
              className="px-3 py-1 text-lg font-semibold text-white bg-primary/20
              "
            >
              +
            </button>
          </div>
        </div>

        {/* Total Price */}
        <div className="flex justify-between font-semibold text-lg border-t border-primary/30">
          <span className="text-white">Total:</span>
          <span className="text-primary">${totalPrice}</span>
        </div>
      </div>

      {/* Add to Cart Button */}
      <Button className="w-full mt-4"><ShoppingCart /> Add To Cart</Button>
    </div>
  );
};
