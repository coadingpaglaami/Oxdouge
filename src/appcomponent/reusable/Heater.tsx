"use client";
import { useAddToCartMutation } from "@/api/cartApi";
import { Button } from "@/components/ui/button";
import { ProductResponse } from "@/interfaces/api";
import { ShoppingCart } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import Cookies from "js-cookie";

export const Heater = ({
  id,
  main_image,
  title,
  description,
  category_detail,
  price,
}: ProductResponse) => {
  const [cart, { isLoading }] = useAddToCartMutation();
  
  const route = useRouter();
  
  async function addToCart(id: number) {
    // const token =  await cookieStore.get("token");
    // if (!token) {
    //   toast.error("You need to login first");
    //   setTimeout(() => {
    //     route.push("/login");
    //   }, 1000);
    //   return;
    // }
    const token = Cookies.get("access"); // get token from cookies
    if (!token) {
      toast.error("You need to login first");
      setTimeout(() => {
        route.push("/login");
      }, 1000);
      return;
    }
    try {
      const res = await cart({ product_id: id, quantity: 1 }).unwrap();
      console.log("Product added to cart", res);
      
        toast.success("Product added to cart");
      
    } catch (error) {
      const err = error as Error
      console.error("Failed to add to cart:", err);
      toast.error(err.message || "Failed to add to cart");
    }
  }
  console.log("Rendering Heater component for product ID:", id);

  return (
    <Link
      href={`/products/${id}`}
      className="hover:sccale-105 transition-transform duration-200"
    >
      <div className="flex flex-col bg-[#121212] border border-primary rounded-lg overflow-hidden gap-4 ">
        <div className="relative aspect-[3.9/2.2]">
          <Image
            src={main_image || "/placeholder.png"}
            alt={title}
            fill
            className="w-full h-56 object-cover"
          />
        </div>

        <div className="flex flex-col p-6 gap-3">
          <p className="text-sm text-[#9C9C9C]">{category_detail?.name}</p>
          <h3 className="text-xl font-semibold text-white">{title}</h3>
          <p className="text-gray-400 text-sm line-clamp-2 min-h-16">
            {description}
          </p>
          <p className="text-lg font-semibold text-white mt-2">{price}</p>
          <Button
            onClick={(e) => {
              e.preventDefault(); // stop <Link> from triggering
              e.stopPropagation(); // stop bubbling to parent

              addToCart(id!);
              console.log("Added to cart"); // here call your add-to-cart ap
            }}
            className="mt-3 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            disabled={isLoading}
          >
            <ShoppingCart className="w-4 h-4" /> Add to Cart
          </Button>
        </div>
      </div>
    </Link>
  );
};
