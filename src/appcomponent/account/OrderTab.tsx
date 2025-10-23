'use client';
import React, { useState } from "react";
import { ordersData } from "@/data/OrdersData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Order } from "@/interfaces/Order";

export const OrderTab = () => {
  const [cancelDialog, setCancelDialog] = useState(false);
  const [ratingDialog, setRatingDialog] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<Order>('' as unknown as Order);
  const [rating, setRating] = useState(0);

  const handleCancel = (order:Order) => {
    setSelectedOrder(order);
    setCancelDialog(true);
  };

  const handleRating = (order:Order) => {
    setSelectedOrder(order);
    setRatingDialog(true);
  };

  return (
    <div className="flex flex-col gap-6 bg-[#121212] border border-primary/20 p-6 rounded-lg text-white">
      {/* Header Section */}
      <div className="flex flex-col gap-1">
        <h2 className="text-xl font-semibold">Order History</h2>
        <p className="text-sm text-gray-400">View your past orders and their status</p>
      </div>
      {/* Orders List */}
      <div className="flex flex-col gap-4">
        {ordersData.map((order) => (
          <div key={order.id} className="flex flex-col gap-2 border border-primary/20 rounded-md p-4">
            <div className="flex justify-between items-center">
              <p className="text-lg font-medium">{order.orderName}</p>
              <p
                className={
                  order.status === "Pending"
                    ? "text-red-500"
                    : order.status === "Delivered"
                    ? "text-primary"
                    : "text-gray-400"+"text-center"
                }
              >
                {order.status}
              </p>
            </div>
            <div className="flex justify-between items-center text-sm text-gray-300">
              <div className="flex flex-col">
                <p>Placed on {order.placeDate}</p>
                <p>
                  {order.items} Items - ${order.totalAmount}
                </p>
              </div>
              {order.status === "Pending" && (
                <Button  onClick={() => handleCancel(order)} className="bg-red-500 hover:bg-red-700">
                  Cancel
                </Button>
              )}
              {order.status === "Delivered" && (
                <Button onClick={() => handleRating(order)}>Review</Button>
              )}
              {order.status === "Shipped" && <Button variant="outline">Shipped</Button>}
            </div>
          </div>
        ))}
      </div>

      {/* Cancel Dialog */}
      <Dialog open={cancelDialog} onOpenChange={setCancelDialog}>
        <DialogContent className="text-center bg-[#1E1E1E] flex justify-center items-center flex-col border-primary" >
          <DialogHeader>
            <DialogTitle className="text-white text-center">Are You Sure To Cancel the Orders ?</DialogTitle>
          </DialogHeader>
          <DialogFooter className="flex items-center justify-center gap-3">
            <Button variant="default" className="bg-green-600 hover:bg-green-700">Yes</Button>
            <Button variant="default" onClick={() => setCancelDialog(false)} className="bg-red-500 hover:bg-red-700">No</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Rating Dialog */}
      <Dialog open={ratingDialog} onOpenChange={setRatingDialog}>
        <DialogContent className="bg-[#1E1E1E] border border-primary p-6">
          <DialogHeader className="hidden">
            <DialogTitle className="text-center ">Rate This Order</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col gap-4 text-white">
            {/* Stars */}
            <div className="flex gap-2">
              {[1, 2, 3, 4, 5].map((star) => (
                <span
                  key={star}
                  onClick={() => setRating(star)}
                  className={`text-2xl cursor-pointer ${rating >= star ? "text-yellow-400" : "text-gray-500"}`}
                >
                  ★
                </span>
              ))}
            </div>
            {/* Textbox */}
            <div className="flex flex-col w-full">
              <label className="text-sm mb-1">Add A Comment</label>
              <textarea
                rows={4}
                className="border border-primary/50 bg-transparent p-2 rounded-md outline-none"
                placeholder="Write your feedback"
              />
            </div>
            <div className="flex justify-center gap-4 w-full mt-4">
              <Button variant="outline" onClick={() => setRatingDialog(false)}>Cancel</Button>
              <Button>Submit</Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
};
