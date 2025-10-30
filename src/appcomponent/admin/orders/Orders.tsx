"use client";

import React, { useEffect, useState } from "react";
import { Breadcrumb } from "@/appcomponent/reusable";
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
import { Eye, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { OrderDetailsResponse } from "@/interfaces/api/Orders";
import {
  useDeleteOrderMutation,
  useOrderStatusQuery,
  useUpdateStatusMutation,
} from "@/api/ordersApi";
import { toast } from "sonner";
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
export const Orders = () => {
  const [selectedStatus, setSelectedStatus] = useState("");
  const [page, setPage] = useState<number | undefined>(undefined);
  const [selectedOrder, setSelectedOrder] =
    useState<OrderDetailsResponse | null>(null);
  const { data: order, isLoading } = useOrderStatusQuery({
    page,
    status: selectedStatus,
  });
  const totalPages = order ? Math.ceil(order.count / 10) : 1;
  const [statusUpdate, { isLoading: statusUpdating }] =
    useUpdateStatusMutation();
  const [orderDelete, { isLoading: Delting }] = useDeleteOrderMutation();
  const orderDelte = async (id: number) => {
    // Implement order delete functionality here
    try {
      await orderDelete(id).unwrap();
      toast.success(`Order with ID ${id} deleted successfully`);
    } catch (error) {
      console.error("Failed to delete order:", error);
      toast.error("Failed to delete order");
    }
  };
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setPage(newPage);
    }
  };
  // Add a default fallback style
  const statusStyles: Record<string, { bg: string; text: string }> = {
    PENDING: { bg: "bg-primary/30", text: "text-primary" },
    DELIVERED: { bg: "bg-[#028C4F33]", text: "text-[#028C4F]" },
    SHIPPED: { bg: "bg-[#3B80FF33]", text: "text-[#3B80FF]" },
    CANCELLED: { bg: "bg-[#FF391F33]", text: "text-[#FF391F]" },
  };

  // Helper function to get status style safely
  const getStatusStyle = (status: string) => {
    return (
      statusStyles[status] || { bg: "bg-gray-500/30", text: "text-gray-500" }
    );
  };

  // Filter orders by status
  const filteredOrders =
    selectedStatus === ""
      ? order?.results || []
      : order?.results.filter((o) => o.order_status === selectedStatus) || [];

  return (
    <>
      <Breadcrumb title="Orders" subtitle="Track and update Customer Orders" />

      <div className="flex flex-col gap-6 mt-6">
        {/* ---- Status Filter ---- */}
        <div className="flex justify-start">
          <Select
            value={selectedStatus}
            onValueChange={(value: string) => {
              setSelectedStatus(value);
              setPage(1);
            }}
          >
            <SelectTrigger className="w-[200px] bg-transparent text-white border-primary">
              <SelectValue placeholder="All Orders" />
            </SelectTrigger>
            <SelectContent className="bg-neutral-900 text-white">
              <SelectItem value="ALL">All Orders</SelectItem>
              <SelectItem value="PENDING">Pending</SelectItem>
              <SelectItem value="DELIVERED">Delivered</SelectItem>
              <SelectItem value="SHIPPED">Shipped</SelectItem>
              <SelectItem value="CANCELLED">Cancelled</SelectItem>
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
                <TableHead className="text-white">Price</TableHead>
                <TableHead className="text-white">Date</TableHead>
                <TableHead className="text-white">Status</TableHead>
                <TableHead className="text-white">Action</TableHead>
              </TableRow>
            </TableHeader>

            <TableBody>
              {filteredOrders.map((order, index) => (
                <TableRow
                  key={order.id}
                  className={`border-none rounded-lg my-2 transition-all duration-200 
        ${
          index % 2 === 0
            ? "bg-[#18181B] hover:bg-[#202024]"
            : "bg-[#25252A] hover:bg-[#2D2D33]"
        }`}
                  style={{ borderSpacing: "0 12px" }}
                >
                  <TableCell className="text-white py-4 rounded-l-lg">
                    {order.order_number}
                  </TableCell>
                  <TableCell className="text-white">
                    {order.user_email}
                  </TableCell>
                  <TableCell className="text-white">
                    <div className="flex flex-col">
                      {order.items.map((item) => (
                        <div className="flex gap-2" key={item.id}>
                          <span>{item.product_name}</span>
                          <span>x{item.quantity}</span>
                        </div>
                      ))}
                    </div>
                  </TableCell>
                  <TableCell className="text-white">
                    ${order.total_amount}
                  </TableCell>
                  <TableCell className="text-white">
                    {order.created_at}
                  </TableCell>
                  <TableCell>
                    <span
                      className={`px-3 py-1 rounded-full text-sm font-medium 
      ${getStatusStyle(order.order_status).bg} ${
                        getStatusStyle(order.order_status).text
                      }`}
                    >
                      {order.order_status}
                    </span>
                  </TableCell>

                  <TableCell className="rounded-r-lg">
                    <div className="flex items-center gap-2">
                      <Button
                        variant="ghost"
                        onClick={() => setSelectedOrder(order)}
                        className="text-blue-500 hover:bg-blue-500/10"
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
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
                              This action cannot be undone. This will
                              permanently delete your cart item.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => orderDelte(order.id)}
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
            <div className="flex justify-center items-center gap-2 mt-4">
              {order?.previous && (
                <Button onClick={() => handlePageChange(page || 0 - 1 )}>Prev</Button>
              )}

              {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
                <Button
                  key={p}
                  variant={p == page ? "default" : "outline"}
                  className={p === page ? "bg-primary " : ""}
                  onClick={() => handlePageChange(p)}
                >
                  {p}
                </Button>
              ))}

              {order?.next && (
                <Button onClick={() => handlePageChange(page || 0 + 1)}>Next</Button>
              )}
            </div>
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
                  <span>{selectedOrder.user_email}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Order Date</Label>
                  <span>{selectedOrder.created_at}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Product</Label>
                  {selectedOrder.items.map((item) => (
                    <div className="flex gap-2" key={item.id}>
                      <span>{item.product_name}</span>
                      <span>x{item.quantity}</span>
                    </div>
                  ))}
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Total Amount</Label>
                  <span>${selectedOrder.final_amount}</span>
                </div>
                <div className="flex flex-col gap-2.5">
                  <Label className="text-gray-400">Current Status</Label>
                  <span
                    className={`px-3 py-1 rounded-full text-sm font-medium w-fit ${
                      getStatusStyle(selectedOrder.order_status).bg
                    } ${getStatusStyle(selectedOrder.order_status).text}`}
                  >
                    {selectedOrder.order_status}
                  </span>
                </div>
                <div className="flex flex-col col-span-2">
                  <Label className="text-gray-400">Address</Label>
                  <span>{selectedOrder.shipping_address.apartment}</span>
                </div>
              </div>

              {/* Update Status */}
              <div className="w-full mt-4">
                <label className="text-sm text-gray-400 mb-1 block">
                  Update Status
                </label>
                <Select
                  value={selectedOrder.order_status}
                  onValueChange={async (val) => {
                    setSelectedOrder({
                      ...selectedOrder,
                      order_status: val || "",
                    });

                    // Automatically update status when changed
                    try {
                      await statusUpdate({
                        id: selectedOrder.id, // Make sure selectedOrder has an id
                        order_status: val || "",
                      }).unwrap();
                      toast.success("Order status updated successfully");
                    } catch (error) {
                      console.error("Failed to update status:", error);
                      toast.error("Failed to update order status");
                    }
                  }}
                >
                  <SelectTrigger className="w-full  text-white border-primary">
                    <SelectValue
                      placeholder={selectedOrder.order_status}
                      className="text-primary"
                      defaultValue={selectedOrder.order_status.toUpperCase()}
                    />
                  </SelectTrigger>
                  <SelectContent className="w-full bg-neutral-900 text-white">
                    {Object.keys(statusStyles)
                      .filter((status) => status !== selectedOrder.order_status)
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
