"use client";
import Image from "next/image";
import { Trash2, Check } from "lucide-react";
import { CartItemResponse } from "@/interfaces/api/AddToCart";
import { useDeleteCartMutation, useUpdateCartMutation } from "@/api/cartApi";
import { toast } from "sonner";
import { useEffect, useRef } from "react";
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
  const [cartDelete] = useDeleteCartMutation();
  const [updateCart] = useUpdateCartMutation();

  // Debounce timer refs for each cart item
  const debounceTimers = useRef<{ [key: number]: NodeJS.Timeout }>({});

  // Cleanup timers on unmount
  useEffect(() => {
    return () => {
      Object.values(debounceTimers.current).forEach((timer) =>
        clearTimeout(timer)
      );
    };
  }, []);

  const updateQuantity = (id: number, type: "inc" | "dec") => {
    const currentItem = cartItems.find((item) => item.id === id);
    if (!currentItem) return;

    let newQty =
      type === "inc" ? currentItem.quantity + 1 : currentItem.quantity - 1;
    if (newQty < 1) newQty = 1;

    // Immediately update UI for instant feedback
    setCartItems((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          return { ...item, quantity: newQty };
        }
        return item;
      })
    );

    // Clear existing timer for this item
    if (debounceTimers.current[id]) {
      clearTimeout(debounceTimers.current[id]);
    }

    // Set new timer - API call after 800ms of no changes
    debounceTimers.current[id] = setTimeout(async () => {
      try {
        await updateCart({
          id: id,
          product_id: currentItem.product,
          quantity: newQty,
        }).unwrap();
        console.log(`Quantity updated for item ${id}: ${newQty}`);
      } catch (error) {
        console.error("Failed to update quantity:", error);
        toast.error("Failed to update quantity");
        // Revert on error
        setCartItems((prev) =>
          prev.map((item) => {
            if (item.id === id) {
              return { ...item, quantity: currentItem.quantity };
            }
            return item;
          })
        );
      }
    }, 800);
  };

  const removeItem = async (id: number) => {
    try {
      await cartDelete(id).unwrap();
      console.log("Item removed from cart:", id);
      toast.success("Item removed from cart");
    } catch (error) {
      console.error("Failed to remove item:", error);
      toast.error("Failed to remove item");
    }
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
                  <AlertDialog>
                    <AlertDialogTrigger asChild>
                      <Button className="bg-transparent">
                        <Trash2
                          className="text-red-500 hover:bg-transparent"
                          size={24}
                        />
                      </Button>
                    </AlertDialogTrigger>
                    <AlertDialogContent className="bg-black">
                      <AlertDialogHeader>
                        <AlertDialogTitle className="text-white">
                          Are you absolutely sure?
                        </AlertDialogTitle>
                        <AlertDialogDescription className="text-white">
                          This action cannot be undone. This will permanently
                          delete your cart item.
                        </AlertDialogDescription>
                      </AlertDialogHeader>
                      <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={() => removeItem(item.id)}>
                          Delete
                        </AlertDialogAction>
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
                      className="px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
                    >
                      -
                    </button>
                    <span className="text-white min-w-8 text-center">
                      {item?.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item?.id, "inc")}
                      className="px-2 py-1 rounded bg-primary/20 text-primary hover:bg-primary/30 transition-colors"
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
