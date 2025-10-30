import { Cart } from "@/appcomponent/cart";
import { Suspense } from "react";

export default function CartPage() {
  return (
    <Suspense>
      <Cart />
    </Suspense>
  );
}
