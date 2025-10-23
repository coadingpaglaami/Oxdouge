export interface OrderData{
    orderId: string;
    customerName: string;
    totalAmount: string;
    status: 'Pending' | 'Delivered' | 'Cancelled' | 'Shipping';
    orderDate: string;
    productName: string;
    quantity: number;
    address: string;
}