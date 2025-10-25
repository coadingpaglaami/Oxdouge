"use client";
import Image from "next/image";
import { Trash2 } from "lucide-react";

interface CartItem {
  id: number;
  img: string;
  title: string;
  price: string;
  quantity: number;
}

interface CartLeftChildProps {
  cartItems: CartItem[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItem[]>>;
}

export const CartLeftChild = ({
  cartItems,
  setCartItems,
}: CartLeftChildProps) => {
  // helper: parse price from string like "$299.99"
  const parsePrice = (price: string) => Number(price.replace("$", ""));

  const updateQuantity = (id: number, type: "inc" | "dec") => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
          if (newQty < 1) newQty = 1; // prevent negative
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = (id: number) => {
    setCartItems((prev) => prev.filter((item) => item.id !== id));
  };

  return (
    <div className=" flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-semibold text-white">Shopping Cart</h2>

      <div className="flex flex-col gap-6">
        {cartItems.map((item) => {
          const total = parsePrice(item.price) * item.quantity;
          return (
            <div
              key={item.id}
              className="flex gap-4 border p-4 border-primary/20 rounded-lg bg-[#121212]"
            >
              {/* Product Image */}
              <div className="w-28 h-28 relative rounded-lg overflow-hidden">
                <Image
                  src={item.img}
                  alt={item.title}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between w-full">
                {/* Title + Delete */}
                <div className="flex justify-between items-start">
                  <p className="font-medium text-white">{item.title}</p>
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 cursor-pointer"
                  >
                    <Trash2 size={24} />
                  </button>
                </div>

                {/* Price */}
                <span className="text-sm text-gray-600">
                  <span className="font-semibold ">{item.price}</span> each
                </span>

                {/* Quantity + Total */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item.id, "dec")}
                      className="px-2 py-1  rounded bg-primary/20 text-primary"
                    >
                      -
                    </button>
                    <span className="text-white">{item.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item.id, "inc")}
                      className="px-2 py-1  rounded bg-primary/20 text-primary"
                    >
                      +
                    </button>
                  </div>

                  <p className="font-semibold text-primary">
                    ${total.toFixed(2)}
                  </p>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
