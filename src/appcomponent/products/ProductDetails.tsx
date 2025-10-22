import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { ProductLeftChild } from "./ProductLeftchild";
import { productPageData } from "@/data";
import { ProductRightChild } from "./ProductRightChild";
import { Heater } from "../reusable";

interface ProductDetailsProps {
  id: number;
  // you can also pass rightChild later
}

export const ProductDetails = ({ id }: ProductDetailsProps) => {
  const product = productPageData.find((p) => p.id === id);

  const related = productPageData.filter((p) => p.id !== id).slice(0, 3); // get 3 related products excluding current
  return (
    <>
      <div className="flex flex-col gap-6 p-6">
        {/* Back Link */}
        <div>
          <Link
            href="/products"
            className="flex items-center gap-2 text-primary font-medium"
          >
            <ArrowLeft /> Back to Products
          </Link>
        </div>

        {/* Main Content Row */}
        <div className="flex flex-col md:flex-row md:justify-between gap-8">
          {/* Left Child */}
          <ProductLeftChild product={product} />

          {/* Right Child placeholder */}
          <div className="w-full md:w-1/2 md:flex md:justify-center">
            <ProductRightChild product={product!} />
          </div>
        </div>
        <div className="flex flex-col gap-3 ">
          <h4 className="text-white text-lg font-medium">Related Products</h4>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2">
            {related.map((item, index) => (
              <Heater key={index} {...item} />
            ))}
          </div>
        </div>
      </div>
      <h2 className="text-center md:text-2xl text-white font-bold p-8 bg-[#FFD34585]">
        Enjoy Free Delivery on NOT Overland Tech
      </h2>
    </>
  );
};
