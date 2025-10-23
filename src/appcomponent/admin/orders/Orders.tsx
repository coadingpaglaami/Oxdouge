"use client";

import React, { useState } from "react";
import { Breadcrumb } from "@/appcomponent/reusable";
import { adminOrder } from "@/data/AdminOrderData";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Eye } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OrderData } from "@/interfaces/OrderData";

export const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState("All Orders");
  const [selectedOrder, setSelectedOrder] = useState<OrderData | null>(null);

  const statusStyles: Record<string, { bg: string; text: string }> = {
    Pending: { bg: "bg-primary/30", text: "text-primary" },
    Delivered: { bg: "bg-[#028C4F33]", text: "text-[#028C4F]" },
    Shipping: { bg: "bg-[#3B80FF33]", text: "text-[#3B80FF]" },
    Cancelled: { bg: "bg-[#FF391F33]", text: "text-[#FF391F]" },
  };

  // Filter orders by status
  const filteredOrders =
    selectedStatus === "All Orders"
      ? adminOrder
      : adminOrder.filter(
          (order: OrderData) => order.status === selectedStatus
        );

  return (
    <>
      <Breadcrumb title="Orders" subtitle="Track and update Customer Orders" />

      <div className="flex flex-col gap-6 mt-6">
        {/* ---- Status Filter ---- */}
        <div className="flex justify-start">
          <Select
            value={selectedStatus}
            onValueChange={(value: string) => setSelectedStatus(value)}
          >
            <SelectTrigger className="w-[200px] bg-transparent text-white border-primary">
              <SelectValue placeholder="All Orders" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 text-white">
              <SelectItem value="All Orders">All Orders</SelectItem>
              <SelectItem value="Pending">Pending</SelectItem>
              <SelectItem value="Delivered">Delivered</SelectItem>
              <SelectItem value="Shipping">Shipping</SelectItem>
              <SelectItem value="Cancelled">Cancelled</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* ---- Orders Table ---- */}
        <div className="overflow-hidden">
          <Table>
            <TableHeader className="">
              <TableRow>
                <TableHead className="text-white">Order ID</TableHead>
                <TableHead className="text-white">Customer</TableHead>
                <TableHead className="text-white">Product</TableHead>
                <TableHead className="text-white">Quantity</TableHead>
                <TableHead className="text-white">Price</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow
                  key={order.orderId}
                  className={`border-none rounded-lg my-2 transition-all duration-200 
        ${
          index % 2 === 0
            ? "bg-[#18181B] hover:bg-[#202024]"
            : "bg-[#25252A] hover:bg-[#2D2D33]"
        }`}
                  style={{ borderSpacing: "0 12px" }}
                >
                  <TableCell className="text-white py-4 rounded-l-lg">
                    {order.orderId}
                  </TableCell>
                  <TableCell className="text-white">
                    {order.customerName}
                  </TableCell>
                  <TableCell className="text-white">
                    {order.productName}
                  </TableCell>
                  <TableCell className="text-white">{order.quantity}</TableCell>
                  <TableCell className="text-white">
                    ${order.totalAmount}
                  </TableCell>
                  <TableCell className="text-white">
                    {order.orderDate}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium ${
                        statusStyles[order.status].bg
                      } ${statusStyles[order.status].text}`}
                    >
                      {order.status}
                    </span>
                  </TableCell>
                  <TableCell className="rounded-r-lg">
                    <Button
                      variant="ghost"
                      onClick={() => setSelectedOrder(order)}
                      className="text-blue-500 hover:bg-blue-500/10"
                    >
                      <Eye className="w-4 h-4" />
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </div>

      {/* ---- Order Details Dialog ---- */}
      <Dialog
        open={!!selectedOrder}
        onOpenChange={() => setSelectedOrder(null)}
      >
        <DialogContent className="bg-neutral-900 border border-primary text-white max-w-lg">
          <DialogHeader>
            <DialogTitle className="text-xl text-white">
              Order Details
            </DialogTitle>
          </DialogHeader>

          {selectedOrder && (
            <div className="flex flex-col gap-6 mt-4">
              {/* Info Grid */}
              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Customer</Label>
                  <span>{selectedOrder.customerName}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Order Date</Label>
                  <span>{selectedOrder.orderDate}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Product</Label>
                  <span>{selectedOrder.productName}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Quantity</Label>
                  <span>{selectedOrder.quantity}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Total Amount</Label>
                  <span>${selectedOrder.totalAmount}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Current Status</Label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                      statusStyles[selectedOrder.status].bg
                    } ${statusStyles[selectedOrder.status].text}`}
                  >
                    {selectedOrder.status}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <Label className="text-gray-400">Address</Label>
                  <span>{selectedOrder.address}</span>
                </div>
              </div>

              {/* Update Status */}
              <div className="w-full mt-4">
                <label className="text-sm text-gray-400 mb-1 block">
                  Update Status
                </label>
                <Select
                  value={selectedOrder.status}
                  onValueChange={(val) =>
                    setSelectedOrder({ ...selectedOrder, status: val || '' })
                  }
                >
                  <SelectTrigger className="w-full  text-white border-primary">
                    <SelectValue
                      placeholder={selectedOrder.status}
                      className="text-primary"
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-neutral-900 text-white">
                    {Object.keys(statusStyles)
                      .filter((status) => status !== selectedOrder.status)
                      .map((status) => (
                        <SelectItem key={status} value={status}>
                          {status}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
};
