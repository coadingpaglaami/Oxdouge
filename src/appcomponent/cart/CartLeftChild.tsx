"use client";
import Image from "next/image";
import { Trash2, Check, Delete } from "lucide-react";
import { CartItemResponse } from "@/interfaces/api/AddToCart";
import { useDeleteCartMutation } from "@/api/cartApi";
import { toast } from "sonner";
import { DialogFooter, DialogTrigger } from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";

interface CartLeftChildProps {
  cartItems: CartItemResponse[];
  setCartItems: React.Dispatch<React.SetStateAction<CartItemResponse[]>>;
  selectedItems: number[];
  setSelectedItems: React.Dispatch<React.SetStateAction<number[]>>;
}

export const CartLeftChild = ({
  cartItems,
  setCartItems,
  selectedItems,
  setSelectedItems,
}: CartLeftChildProps) => {
  const [cartDelete, { isLoading }] = useDeleteCartMutation();
  const updateQuantity = (id: number, type: "inc" | "dec") => {
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          let newQty = type === "inc" ? item.quantity + 1 : item.quantity - 1;
          if (newQty < 1) newQty = 1;
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );
  };

  const removeItem = async (id: number) => {
    await cartDelete(id).unwrap();
    console.log("Item removed from cart:", id);
    toast.success("Item removed from cart");
    // setCartItems((prev) => prev.filter((item) => item.id !== id));
    // setSelectedItems((prev) => prev.filter((itemId) => itemId !== id));
  };

  const toggleSelection = (id: number) => {
    setSelectedItems((prev) =>
      prev.includes(id) ? prev.filter((itemId) => itemId !== id) : [...prev, id]
    );
  };

  return (
    <div className="flex flex-col gap-6 w-full">
      <h2 className="text-2xl font-semibold text-white">Shopping Cart</h2>

      <div className="flex flex-col gap-6">
        {cartItems?.map((item) => {
          const total = item?.price * item?.quantity;
          const isSelected = selectedItems.includes(item.id);

          return (
            <div
              key={item?.id}
              className={`flex gap-4 border p-4 rounded-lg bg-[#121212] transition-colors ${
                isSelected ? "border-primary" : "border-primary/20"
              }`}
            >
              {/* Checkbox */}
              <div className="flex items-start pt-2">
                <button
                  onClick={() => toggleSelection(item.id)}
                  className={`w-6 h-6 rounded border-2 flex items-center justify-center transition-colors ${
                    isSelected
                      ? "bg-primary border-primary"
                      : "border-gray-600 hover:border-primary"
                  }`}
                >
                  {isSelected && <Check size={16} className="text-black" />}
                </button>
              </div>

              {/* Product Image */}
              <div className="w-28 h-28 relative rounded-lg overflow-hidden">
                <Image
                  src={item?.image}
                  alt={item?.product_name}
                  fill
                  className="object-cover"
                />
              </div>

              {/* Product Details */}
              <div className="flex flex-col justify-between w-full">
                {/* Title + Delete */}
                <div className="flex justify-between items-start">
                  <p className="font-medium text-white">{item?.product_name}</p>
                  <AlertDialog >
                    <AlertDialogTrigger asChild>
                      <Button className="bg-transparent"><Trash2 className="text-red-500 hover:bg-transparent" size={24} /></Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-white">
                          This action cannot be undone. This will permanently
                          delete your account and remove your data from our
                          servers.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={()=>removeItem(item.id)}>Delete</AlertDialogAction>
                      </AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </div>

                {/* Price */}
                <span className="text-sm text-gray-600">
                  <span className="font-semibold">{item?.price}</span> each
                </span>

                {/* Quantity + Total */}
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => updateQuantity(item?.id, "dec")}
                      className="px-2 py-1 rounded bg-primary/20 text-primary"
                    >
                      -
                    </button>
                    <span className="text-white">{item?.quantity}</span>
                    <button
                      onClick={() => updateQuantity(item?.id, "inc")}
                      className="px-2 py-1 rounded bg-primary/20 text-primary"
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
