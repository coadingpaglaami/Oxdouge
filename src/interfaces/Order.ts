export interface Order{
    id: number;
    orderName: string;
    placeDate: string;
    status: 'Pending' | 'Shipped' | 'Delivered' | 'Cancelled';
    items: number;
    totalAmount: number;
}