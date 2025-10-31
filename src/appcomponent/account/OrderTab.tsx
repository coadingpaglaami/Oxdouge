// "use client";
// import React, { useState } from "react";
// import { ordersData } from "@/data/OrdersData";
// import { Button } from "@/components/ui/button";
// import {
//   Dialog,
//   DialogContent,
//   DialogHeader,
//   DialogTitle,
//   DialogFooter,
// } from "@/components/ui/dialog";
// import { Order } from "@/interfaces/Order";
// import { useAllMyOrderQuery, useCancellMyOrderMutation, useMyOrderQuery } from "@/api/ordersApi";
// import { useReviewProductMutation } from "@/api/productApi";

// export const OrderTab = () => {
//   const [cancelDialog, setCancelDialog] = useState(false);
//   const [ratingDialog, setRatingDialog] = useState(false);
//   const [selectedOrder, setSelectedOrder] = useState<Order>(
//     "" as unknown as Order
//   );
//   const{data,isLoading}=useAllMyOrderQuery();
//   const [orderCancel, {isLoading:Cancelling}]=useCancellMyOrderMutation();
//   const [reviewProduct,{isLoading:reviewing}] = useReviewProductMutation();
//   const [rating, setRating] = useState(0);
//   console.log(selectedOrder);

//   const handleCancel = (order: Order) => {
//     setSelectedOrder(order);
//     setCancelDialog(true);
//   };

//   const handleRating = (order: Order) => {
//     setSelectedOrder(order);
//     setRatingDialog(true);
//   };

//   return (
//     <div className="flex flex-col gap-6 bg-[#121212] border border-primary/20 p-6 rounded-lg text-white">
//       {/* Header Section */}
//       <div className="flex flex-col gap-1">
//         <h2 className="text-xl font-semibold">Order History</h2>
//         <p className="text-sm text-gray-400">
//           View your past orders and their status
//         </p>
//       </div>
//       {/* Orders List */}
//       <div className="flex flex-col gap-4">
//         {ordersData.map((order) => (
//           <div
//             key={order.id}
//             className="flex flex-col gap-2 border border-primary/20 rounded-md p-4"
//           >
//             <div className="flex justify-between items-center">
//               <p className="text-lg font-medium">{order.orderName}</p>
//               <p
//                 className={
//                   order.status === "Pending"
//                     ? "text-red-500"
//                     : order.status === "Delivered"
//                     ? "text-primary"
//                     : "text-gray-400" + "text-center"
//                 }
//               >
//                 {order.status}
//               </p>
//             </div>
//             <div className="flex justify-between items-center text-sm text-gray-300">
//               <div className="flex flex-col">
//                 <p>Placed on {order.placeDate}</p>
//                 <p>
//                   {order.items} Items - ${order.totalAmount}
//                 </p>
//               </div>
//               {order.status === "Pending" && (
//                 <Button
//                   onClick={() => handleCancel(order)}
//                   className="bg-red-500 hover:bg-red-700"
//                 >
//                   Cancel
//                 </Button>
//               )}
//               {order.status === "Delivered" && (
//                 <Button onClick={() => handleRating(order)}>Review</Button>
//               )}
//               {order.status === "Shipped" && (
//                 <Button variant="outline">Shipped</Button>
//               )}
//             </div>
//           </div>
//         ))}
//       </div>

//       {/* Cancel Dialog */}
//       <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
//         <DialogContent className="text-center bg-[#1E1E1E] flex justify-center items-center flex-col border-primary">
//           <DialogHeader>
//             <DialogTitle className="text-white text-center">
//               Are You Sure To Cancel the Orders ?
//             </DialogTitle>
//           </DialogHeader>
//           <DialogFooter className="flex items-center justify-center gap-3">
//             <Button
//               variant="default"
//               className="bg-green-600 hover:bg-green-700"
//             >
//               Yes
//             </Button>
//             <Button
//               variant="default"
//               onClick={() => setCancelDialog(false)}
//               className="bg-red-500 hover:bg-red-700"
//             >
//               No
//             </Button>
//           </DialogFooter>
//         </DialogContent>
//       </Dialog>

//       {/* Rating Dialog */}
//       <Dialog open={ratingDialog} onOpenChange={setRatingDialog}>
//         <DialogContent className="bg-[#1E1E1E] border border-primary p-6">
//           <DialogHeader className="hidden">
//             <DialogTitle className="text-center ">Rate This Order</DialogTitle>
//           </DialogHeader>
//           <div className="flex flex-col gap-4 text-white">
//             {/* Stars */}
//             <div className="flex gap-2">
//               {[1, 2, 3, 4, 5].map((star) => (
//                 <span
//                   key={star}
//                   onClick={() => setRating(star)}
//                   className={`text-2xl cursor-pointer ${
//                     rating >= star ? "text-yellow-400" : "text-gray-500"
//                   }`}
//                 >
//                   ★
//                 </span>
//               ))}
//             </div>
//             {/* Textbox */}
//             <div className="flex flex-col w-full">
//               <label className="text-sm mb-1">Add A Comment</label>
//               <textarea
//                 rows={4}
//                 className="border border-primary/50 bg-transparent p-2 rounded-md outline-none"
//                 placeholder="Write your feedback"
//               />
//             </div>
//             <div className="flex justify-center gap-4 w-full mt-4">
//               <Button variant="outline" onClick={() => setRatingDialog(false)}>
//                 Cancel
//               </Button>
//               <Button>Submit</Button>
//             </div>
//           </div>
//         </DialogContent>
//       </Dialog>
//     </div>
//   );
// };

"use client";
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { useAllMyOrderQuery, useCancellMyOrderMutation } from "@/api/ordersApi";
import { useReviewProductMutation } from "@/api/productApi";
import {   UserOrderItemSummary, UserOrderSummary } from "@/interfaces/api/Orders";
import { toast } from "sonner";




export const OrderTab = () => {
  const [cancelDialog, setCancelDialog] = useState(false);
  const [productListDialog, setProductListDialog] = useState(false);
  const [ratingDialog, setRatingDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<UserOrderSummary | null>(null);
  const [selectedProduct, setSelectedProduct] = useState<UserOrderItemSummary | null>(null);
  
  const { data, isLoading } = useAllMyOrderQuery();
  const [orderCancel, { isLoading: cancelling }] = useCancellMyOrderMutation();
  const [reviewProduct, { isLoading: reviewing }] = useReviewProductMutation();
  
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");

  const handleCancel = (order: UserOrderSummary) => {
    setSelectedOrder(order);
    setCancelDialog(true);
  };

  const confirmCancel = async () => {
    if (selectedOrder) {
      try {
        await orderCancel({ id: selectedOrder.id }).unwrap();
        setCancelDialog(false);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Failed to cancel order:", error);
      }
    }
  };

  const handleReviewClick = (order: UserOrderSummary) => {
    setSelectedOrder(order);
    setProductListDialog(true);
  };

  const handleProductSelect = (item: UserOrderItemSummary): void => {
    setSelectedProduct(item);
    setProductListDialog(false);
    setRatingDialog(true);
  };

  const handleSubmitReview = async (product_id:number): Promise<void> => {
    if (selectedProduct && rating > 0) {
      try {
        // Note: Replace with actual product ID from your API
         // Placeholder - update with actual product ID
        
        await reviewProduct({
          productId: product_id,
          rating,
          comment,
        }).unwrap();
        toast.success("Review submitted successfully");
        // Reset states
        setRatingDialog(false);
        setRating(0);
        setComment("");
        setSelectedProduct(null);
        setSelectedOrder(null);
      } catch (error) {
        console.error("Failed to submit review:", error);
      }
    }
  };

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64 text-white">
        Loading orders...
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-6 bg-[#121212] border border-primary/20 p-6 rounded-lg text-white">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Order History</h2>
        <p className="text-sm text-gray-400">
          View your past orders and their status
        </p>
      </div>

      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {data?.results && data.results.length > 0 ? (
          data.results.map((order) => (
            <div
              key={order.id}
              className="flex flex-col gap-2 border border-primary/20 rounded-md p-4"
            >
              <div className="flex justify-between items-center">
                <p className="text-lg font-medium">{order.order_number}</p>
                <p
                  className={`text-center ${
                    order.order_status === "PENDING"
                      ? "text-yellow-500"
                      : order.order_status === "DELIVERED"
                      ? "text-primary"
                      : order.order_status === "SHIPPED"
                      ? "text-blue-400"
                      : "text-gray-400"
                  }`}
                >
                  {order.order_status}
                </p>
              </div>
              <div className="flex justify-between items-center text-sm text-gray-300">
                <div className="flex flex-col">
                  <p>Placed on {formatDate(order.created_at)}</p>
                  <p>
                    Items - ${order.total_amount}
                  </p>
                </div>
                {order.order_status === "PENDING" && (
                  <Button
                    onClick={() => handleCancel(order)}
                    className="bg-red-500 hover:bg-red-700"
                    disabled={cancelling}
                  >
                    {cancelling ? "Cancelling..." : "Cancel"}
                  </Button>
                )}
                {order.order_status === "DELIVERED" && (
                  <Button onClick={() => handleReviewClick(order)}>
                    Review
                  </Button>
                )}
                {order.order_status === "SHIPPED" && (
                  <Button variant="outline">Shipped</Button>
                )}
              </div>
            </div>
          ))
        ) : (
          <p className="text-center text-gray-400">No orders found</p>
        )}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="text-center bg-[#1E1E1E] flex justify-center items-center flex-col border-primary">
          <DialogHeader>
            <DialogTitle className="text-white text-center">
              Are You Sure To Cancel the Order?
            </DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-center gap-3">
            <Button
              variant="default"
              className="bg-green-600 hover:bg-green-700"
              onClick={confirmCancel}
              disabled={cancelling}
            >
              {cancelling ? "Cancelling..." : "Yes"}
            </Button>
            <Button
              variant="default"
              onClick={() => setCancelDialog(false)}
              className="bg-red-500 hover:bg-red-700"
              disabled={cancelling}
            >
              No
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Product List Dialog */}
      <Dialog open={productListDialog} onOpenChange={setProductListDialog}>
        <DialogContent className="bg-[#1E1E1E] border border-primary p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-center">
              Select a Product to Review
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-3 max-h-96 overflow-y-auto">
            {selectedOrder?.order_items.map((item,index) => (
              <div
                key={index}
                className="flex justify-between items-center border border-primary/30 p-3 rounded-md hover:bg-primary/10 transition-colors"
              >
                <div className="flex flex-col text-white">
                  <p className="font-medium">{item.product}</p>
                  <p className="text-sm text-gray-400">
                    Qty: {item.quantity} - ${item.price}
                  </p>
                </div>
                <Button
                  size="sm"
                  onClick={() => handleProductSelect(item)}
                >
                  Review This Product
                </Button>
              </div>
            ))}
          </div>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialog} onOpenChange={setRatingDialog}>
        <DialogContent className="bg-[#1E1E1E] border border-primary p-6">
          <DialogHeader>
            <DialogTitle className="text-white text-center">
              Review: {selectedProduct?.product}
            </DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 text-white">
            {/* Stars */}
            <div className="flex gap-2 justify-center">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-3xl cursor-pointer ${
                    rating >= star ? "text-yellow-400" : "text-gray-500"
                  }`}
                >
                  ★
                </span>
              ))}
            </div>
            <p className="text-center text-sm text-gray-400">
              {rating > 0 ? `You rated ${rating} out of 5 stars` : "Select a rating"}
            </p>
            {/* Textbox */}
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">Add A Comment</label>
              <textarea
                rows={4}
                className="border border-primary/50 bg-transparent p-2 rounded-md outline-none"
                placeholder="Write your feedback"
                value={comment}
                onChange={(e) => setComment(e.target.value)}
              />
            </div>
            <div className="flex justify-center gap-4 w-full mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setRatingDialog(false);
                  setRating(0);
                  setComment("");
                }}
                disabled={reviewing}
              >
                Cancel
              </Button>
              <Button
                onClick={()=>handleSubmitReview(selectedProduct?.product_id || 0)}
                disabled={rating === 0 || reviewing}
              >
                {reviewing ? "Submitting..." : "Submit"}
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};