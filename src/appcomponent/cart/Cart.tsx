// "use client";
// import {
//   ArrowLeft,
//   CheckCircle,
//   Package,
//   MapPin,
//   Mail,
//   Phone,
// } from "lucide-react";
// import Link from "next/link";
// import Image from "next/image";
// import { CartLeftChild } from "./CartLeftChild";
// import { CartRightChild } from "./CartRightChild";
// import { useState, useEffect } from "react";
// import { useSearchParams } from "next/navigation";
// import { CartItemResponse } from "@/interfaces/api/AddToCart";
// import { useGetCartQuery } from "@/api/cartApi";
// import { useMyOrderQuery } from "@/api/ordersApi";
// export const Cart = () => {
//   const searchParams = useSearchParams();
//   const orderId = searchParams.get("order_id");
//   console.log("Order ID from URL:", typeof orderId);

//   const { data: cartData, isLoading } = useGetCartQuery();
//   const { data: orderData, isLoading: orderLoading } = useMyOrderQuery(
//     { id: Number(orderId) || 0 },
//     { skip: !orderId }
//   );

//   const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
//   const [selectedItems, setSelectedItems] = useState<number[]>([]);

//   // Initialize cart items and select first item by default
//   useEffect(() => {
//     if (cartData) {
//       setCartItems(cartData);
//       // Select first item by default
//       if (cartData.length > 0) {
//         setSelectedItems([cartData[0].id]);
//       }
//     }
//   }, [cartData]);

//   // If order_id exists, show success interface
// if (orderId) {
//   if (orderLoading) {
//     return (
//       <div className="flex items-center justify-center min-h-[80vh]">
//         <div className="text-white text-lg">Loading order details...</div>
//       </div>
//     );
//   }

//   if (!orderData) {
//     return (
//       <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
//         <div className="text-white text-lg">Order not found</div>
//         <Link
//           href="/products"
//           className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300"
//         >
//           <ArrowLeft className="w-4 h-4" />
//           Back to Products
//         </Link>
//       </div>
//     );
//   }

//   const order = orderData;
//   const paymentMethod = order.stripe_checkout_session_id
//     ? "Stripe"
//     : "Cash on Delivery";

//   return (
//     <div className="flex flex-col items-center min-h-[80vh] p-6 text-white">
//       <div className="max-w-[80vw] w-full ">
//         {/* Success Header */}
//         <div className=" rounded-lg shadow-lg p-8 text-center mb-6">
//           <div className="flex justify-center mb-6">
//             <div className="bg-green-100 rounded-full p-4">
//               <CheckCircle className="w-16 h-16 text-green-600" />
//             </div>
//           </div>
//           <h1 className="text-3xl font-bold text-white mb-4">
//             Order Placed Successfully!
//           </h1>
//           <p className="text-white mb-6">
//             Thank you for your order. We{"'"}ll send you a confirmation email
//             shortly.
//           </p>

//           {/* Order Summary */}
//           <div className=" rounded-lg p-4 text-left">
//             <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
//               <div>
//                 <span className="text-white block">Order Number</span>
//                 <span className="font-semibold text-white">
//                   {order.order_number}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-white block">Payment Method</span>
//                 <span className="font-semibold text-white">
//                   {paymentMethod}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-white block">Order Status</span>
//                 <span className="font-semibold text-white uppercase">
//                   {order.order_status}
//                 </span>
//               </div>
//               <div>
//                 <span className="text-white block">Total Amount</span>
//                 <span className="font-semibold text-white">
//                   ৳{order.final_amount}
//                 </span>
//               </div>
//             </div>
//           </div>
//         </div>

//         {/* Shipping Address */}
//         <div className=" rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <MapPin className="w-5 h-5 text-gray-600" />
//             <h2 className="text-xl font-semibold text-white">
//               Shipping Address
//             </h2>
//           </div>
//           <div className="space-y-2 text-white">
//             <p className="font-medium">{order.shipping_address.full_name}</p>
//             <p>{order.shipping_address.street_address}</p>
//             {order.shipping_address.apartment && (
//               <p>
//                 Apartment: {order.shipping_address.apartment}, Floor:{" "}
//                 {order.shipping_address.floor}
//               </p>
//             )}
//             <p>
//               {order.shipping_address.city} - {order.shipping_address.zipcode}
//             </p>
//             <div className="flex items-center gap-2 mt-3">
//               <Phone className="w-4 h-4" />
//               <span>{order.shipping_address.phone_no}</span>
//             </div>
//             <div className="flex items-center gap-2">
//               <Mail className="w-4 h-4" />
//               <span>{order.shipping_address.email}</span>
//             </div>
//           </div>
//         </div>

//         {/* Order Items */}
//         <div className=" rounded-lg shadow-lg p-6 mb-6">
//           <div className="flex items-center gap-2 mb-4">
//             <Package className="w-5 h-5 text-gray-600" />
//             <h2 className="text-xl font-semibold text-white">Order Items</h2>
//           </div>
//           <div className="space-y-4">
//             {order.items.map((item) => (
//               <div
//                 key={item.id}
//                 className="flex gap-4 border-b pb-4 last:border-b-0"
//               >
//                 <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
//                   <Image
//                     src={item.product_image[0] || ""}
//                     alt={item.product_name}
//                     fill
//                     className="object-cover"
//                   />
//                 </div>
//                 <div className="flex-1">
//                   <h3 className="font-semibold text-white mb-1">
//                     {item.product_name}
//                   </h3>
//                   <p className="text-sm text-white">
//                     Quantity: {item.quantity}
//                   </p>
//                   {item.product_discount > 0 && (
//                     <p className="text-sm text-white">
//                       Discount: {item.product_discount}%
//                     </p>
//                   )}
//                 </div>
//                 <div className="text-right">
//                   {item.product_discount > 0 && (
//                     <p className="text-sm text-white line-through">
//                       ৳{item.product.price}
//                     </p>
//                   )}
//                   <p className="font-semibold text-white">
//                     ৳{item.final_price}
//                   </p>
//                   <p className="text-sm text-white">
//                     Total: ৳{item.line_total}
//                   </p>
//                 </div>
//               </div>
//             ))}
//           </div>

//           {/* Price Summary */}
//           <div className="mt-6 pt-4 border-t space-y-2">
//             <div className="flex justify-between text-white">
//               <span>Subtotal:</span>
//               <span>৳{order.total_amount}</span>
//             </div>
//             {order.total_amount !== order.discounted_amount && (
//               <div className="flex justify-between text-white">
//                 <span>Discount:</span>
//                 <span>
//                   -৳
//                   {(
//                     parseFloat(order.total_amount) -
//                     parseFloat(order.discounted_amount)
//                   ).toFixed(2)}
//                 </span>
//               </div>
//             )}
//             <div className="flex justify-between text-lg font-bold text-white pt-2 border-t">
//               <span>Total:</span>
//               <span>৳{order.final_amount}</span>
//             </div>
//           </div>
//         </div>

//         {/* Action Buttons */}
//         <div className="flex flex-col sm:flex-row gap-3">
//           <Link
//             href="/products"
//             className=" flex items-center justify-center gap-2 bg-primary text-black w-fit py-3 px-6 rounded-lg font-medium  transition-colors"
//           >
//             <ArrowLeft className="w-4 h-4" />
//             Continue Shopping
//           </Link>
//         </div>
//       </div>
//     </div>
//   );
// }

//   // Default cart interface
//   return (
//     <div className="flex flex-col gap-6 p-6">
//       {/* Back Link */}
//       <div>
//         <Link
//           href="/products"
//           className="flex items-center gap-2 text-white font-medium"
//         >
//           <ArrowLeft /> Back to Products
//         </Link>
//       </div>

//       {/* Main Content Row */}
//       <div className="flex flex-col md:flex-row md:justify-between gap-6">
//         {/* Left Child */}
//         <div className="md:w-[60%] w-full">
//           <CartLeftChild
//             cartItems={cartItems}
//             setCartItems={setCartItems}
//             selectedItems={selectedItems}
//             setSelectedItems={setSelectedItems}
//           />
//         </div>
//         <div className="md:w-[40%] w-full">
//           <CartRightChild cartItems={cartItems} selectedItems={selectedItems} />
//         </div>
//       </div>
//     </div>
//   );
// };

"use client";
import {
  ArrowLeft,
  CheckCircle,
  Package,
  MapPin,
  Mail,
  Phone,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import { CartLeftChild } from "./CartLeftChild";
import { CartRightChild } from "./CartRightChild";
import { useState, useEffect } from "react";
import { useSearchParams } from "next/navigation";
import { CartItemResponse } from "@/interfaces/api/AddToCart";
import { useGetCartQuery } from "@/api/cartApi";
import { useMyOrderQuery } from "@/api/ordersApi";
import { useGetShippingsQuery } from "@/api/shippingApi";

export const Cart = () => {
  const searchParams = useSearchParams();
  const orderId = searchParams.get("order_id");

  const { data: cartData, isLoading } = useGetCartQuery();
  const { data: orderData, isLoading: orderLoading } = useMyOrderQuery(
    { id: Number(orderId) || 0 },
    { skip: !orderId }
  );

  // Fetch shipping addresses
  const { data: shippingAddresses, isLoading: addressesLoading } =
    useGetShippingsQuery();

  const [cartItems, setCartItems] = useState<CartItemResponse[]>([]);
  const [selectedItems, setSelectedItems] = useState<number[]>([]);

  // Initialize cart items and select first item by default
  useEffect(() => {
    if (cartData) {
      setCartItems(cartData);
      // Select first item by default
      if (cartData.length > 0) {
        setSelectedItems([cartData[0].id]);
      }
    }
  }, [cartData]);

  // If order_id exists, show success interface
  if (orderId) {
    if (orderLoading) {
      return (
        <div className="flex items-center justify-center min-h-[80vh]">
          <div className="text-white text-lg">Loading order details...</div>
        </div>
      );
    }

    if (!orderData) {
      return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] p-6">
          <div className="text-white text-lg">Order not found</div>
          <Link
            href="/products"
            className="mt-4 flex items-center gap-2 text-blue-400 hover:text-blue-300"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Products
          </Link>
        </div>
      );
    }

    const order = orderData;
    const paymentMethod = order.stripe_checkout_session_id
      ? "Stripe"
      : "Cash on Delivery";

    return (
      <div className="flex flex-col items-center min-h-[80vh] p-6 text-white">
        <div className="max-w-[80vw] w-full ">
          {/* Success Header */}
          <div className=" rounded-lg shadow-lg p-8 text-center mb-6">
            <div className="flex justify-center mb-6">
              <div className="bg-green-100 rounded-full p-4">
                <CheckCircle className="w-16 h-16 text-green-600" />
              </div>
            </div>
            <h1 className="text-3xl font-bold text-white mb-4">
              Order Placed Successfully!
            </h1>
            <p className="text-white mb-6">
              Thank you for your order. We{"'"}ll send you a confirmation email
              shortly.
            </p>

            {/* Order Summary */}
            <div className=" rounded-lg p-4 text-left">
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                <div>
                  <span className="text-white block">Order Number</span>
                  <span className="font-semibold text-white">
                    {order.order_number}
                  </span>
                </div>
                <div>
                  <span className="text-white block">Payment Method</span>
                  <span className="font-semibold text-white">
                    {paymentMethod}
                  </span>
                </div>
                <div>
                  <span className="text-white block">Order Status</span>
                  <span className="font-semibold text-white uppercase">
                    {order.order_status}
                  </span>
                </div>
                <div>
                  <span className="text-white block">Total Amount</span>
                  <span className="font-semibold text-white">
                    ৳{order.final_amount}
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Shipping Address */}
          <div className=" rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-white">
                Shipping Address
              </h2>
            </div>
            <div className="space-y-2 text-white">
              <p className="font-medium">{order.shipping_address.full_name}</p>
              <p>{order.shipping_address.street_address}</p>
              {order.shipping_address.apartment && (
                <p>
                  Apartment: {order.shipping_address.apartment}, Floor:{" "}
                  {order.shipping_address.floor}
                </p>
              )}
              <p>
                {order.shipping_address.city} - {order.shipping_address.zipcode}
              </p>
              <div className="flex items-center gap-2 mt-3">
                <Phone className="w-4 h-4" />
                <span>{order.shipping_address.phone_no}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-4 h-4" />
                <span>{order.shipping_address.email}</span>
              </div>
            </div>
          </div>

          {/* Order Items */}
          <div className=" rounded-lg shadow-lg p-6 mb-6">
            <div className="flex items-center gap-2 mb-4">
              <Package className="w-5 h-5 text-gray-600" />
              <h2 className="text-xl font-semibold text-white">Order Items</h2>
            </div>
            <div className="space-y-4">
              {order.items.map((item) => (
                <div
                  key={item.id}
                  className="flex gap-4 border-b pb-4 last:border-b-0"
                >
                  <div className="relative w-24 h-24 shrink-0 bg-gray-100 rounded-lg overflow-hidden">
                    <Image
                      src={item.product.main_image || ""}
                      alt={item.product_name}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-semibold text-white mb-1">
                      {item.product_name}
                    </h3>
                    <p className="text-sm text-white">
                      Quantity: {item.quantity}
                    </p>
                    {item.product_discount > 0 && (
                      <p className="text-sm text-white">
                        Discount: {item.product_discount}%
                      </p>
                    )}
                  </div>
                  <div className="text-right">
                    {item.product_discount > 0 && (
                      <p className="text-sm text-white line-through">
                        ${item.product.price} 
                      </p>
                    )}
                    <p className="font-semibold text-white">
                      ${item.final_price}
                    </p>
                    <p className="text-sm text-white">
                      Total: ${item.line_total}
                    </p>
                  </div>
                </div>
              ))}
            </div>

            {/* Price Summary */}
            <div className="mt-6 pt-4 border-t space-y-2">
              <div className="flex justify-between text-white">
                <span>Subtotal:</span>
                <span>৳{order.total_amount}</span>
              </div>
              {order.total_amount !== order.discounted_amount && (
                <div className="flex justify-between text-white">
                  <span>Discount:</span>
                  <span>
                    -৳
                    {(
                      parseFloat(order.total_amount) -
                      parseFloat(order.discounted_amount)
                    ).toFixed(2)}
                  </span>
                </div>
              )}
              <div className="flex justify-between text-lg font-bold text-white pt-2 border-t">
                <span>Total:</span>
                <span>৳{order.final_amount}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-3">
            <Link
              href="/products"
              className=" flex items-center justify-center gap-2 bg-primary text-black w-fit py-3 px-6 rounded-lg font-medium  transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    );
  }
  // Show loading state while fetching
  if (isLoading || addressesLoading) {
    return (
      <div className="flex items-center justify-center min-h-[80vh]">
        <div className="text-white text-lg">Loading...</div>
      </div>
    );
  }

  // Default cart interface
  return (
    <div className="flex flex-col gap-6 p-6">
      {/* Back Link */}
      <div>
        <Link
          href="/products"
          className="flex items-center gap-2 text-white font-medium"
        >
          <ArrowLeft /> Back to Products
        </Link>
      </div>

      {/* Main Content Row */}
      <div className="flex flex-col md:flex-row md:justify-between gap-6">
        {/* Left Child */}
        <div className="md:w-[60%] w-full">
          <CartLeftChild
            cartItems={cartItems}
            setCartItems={setCartItems}
            selectedItems={selectedItems}
            setSelectedItems={setSelectedItems}
          />
        </div>

        {/* Right Child */}
        <div className="md:w-[40%] w-full">
          <CartRightChild
            cartItems={cartItems}
            selectedItems={selectedItems}
            shippingAddresses={shippingAddresses || []}
          />
        </div>
      </div>
    </div>
  );
};
