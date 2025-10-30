"use client";
import { ShoppingCart, Star } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import Image from "next/image";
import { ProductResponse } from "@/interfaces/api";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import { useAddToCartMutation } from "@/api/cartApi";

interface ProductRightProps {
  product: ProductResponse | undefined;
}

export const ProductRightChild = ({ product }: ProductRightProps) => {
  const [quantity, setQuantity] = useState(1);
  const [cart, { isLoading }] = useAddToCartMutation();
  const router = useRouter();
  if (!product) return <div>Product not found</div>;
  

  const unitPrice = product.price;
  const totalPrice = (parseFloat(product.price) * quantity).toFixed(2);

  const increase = () => {
    console.log("Available Stock:", product.available_stock);
    if (product.available_stock && quantity < product.available_stock) {
      console.log("Increasing quantity");
      setQuantity(quantity + 1);
    }
  };

  const decrease = () => {
    if (quantity > 1) {
      setQuantity(quantity - 1);
    }
  };

  async function addToCart() {
    const token = await cookieStore.get("access");
    if (!token) {
      toast.error("You need to login first");
      setTimeout(() => {
        router.push("/login");
      }, 1000);
      return;
    }
    try {
      if (!product?.id) {
        toast.error("Invalid product");
        return;
      }
      const res = await cart({ product_id: product?.id, quantity }).unwrap();
      console.log("Product added to cart", res);
      toast.success("Product added to cart");
      router.push("/cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      toast.error("Failed to add to cart");
    }
  }

  return (
    <div className="flex flex-col gap-6 w-full md:w-1/2">
      {/* Rating */}
      <div className="flex items-center gap-1">
        {[...Array(5)].map((_, i) => (
          <Star key={i} className="text-yellow-400 " fill="yellow" size={20} />
        ))}
      </div>

      {/* Subtitle */}
      <p className="text-sm text-[#BAB8B8]">{product.category_detail.name}</p>

      {/* Title */}
      <h1 className="text-3xl font-bold text-white">{product.title}</h1>

      {/* Price */}
      <p className="text-2xl font-semibold text-primary">
        ${parseFloat(unitPrice).toFixed(2)}
      </p>

      {/* Description */}
      <p className="text-[#C2C2C2]">{product.description}</p>

      {/* Key Features */}
      {product.features && (
        <div className="flex flex-col gap-2">
          <h3 className="text-primary font-semibold">Key Features</h3>
          <div className="flex flex-col gap-1 border border-primary rounded">
            {product.features.map((feature, idx) => (
              <div key={idx} className="flex items-center gap-2   p-2">
                <Image
                  src="/product/sign.svg"
                  alt="icon"
                  height={40}
                  width={40}
                  className="w-5 h-5"
                />
                <span className="text-[#C2C2C2]">{feature}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Availability */}
      {product.available_stock && (
        <div className="flex items-center gap-2">
          <span className="font-semibold text-white">Availability:</span>
          <span
            className={
              product.available_stock > 0 ? "text-green-500" : "text-primary"
            }
          >
            {product.available_stock > 0 ? "In Stock" : "Out of Stock"}
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
      <Button
        className="w-full mt-4 disabled:cursor-not-allowed disabled:opacity-50"
        disabled={isLoading}
        onClick={addToCart}
      >
        <ShoppingCart /> {isLoading ? "Adding..." : "Add to Cart"}
      </Button>
    </div>
  );
};
