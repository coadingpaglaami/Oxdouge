import { Order } from "@/interfaces/Order";

export const ordersData: Order[] = [
  {
    id: 101,
    orderName: "Order #101",
    placeDate: "2025-01-14",
    status: "Pending",
    items: 2,
    totalAmount: 149.99,
  },
  {
    id: 102,
    orderName: "Order #102",
    placeDate: "2025-01-10",
    status: "Shipped",
    items: 1,
    totalAmount: 89.99,
  },
  {
    id: 103,
    orderName: "Order #103",
    placeDate: "2025-01-02",
    status: "Delivered",
    items: 3,
    totalAmount: 259.49,
  },
];