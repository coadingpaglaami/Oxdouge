import { ProductResponse } from "./Product";

export interface CheckoutRequest {
  shipping_id: number;
  cart_item_ids: number[];
  coupon_code?: string;
  payment_method: string; // you can later convert this into a union: "COD" | "CARD" | "BKASH" etc.
}

export interface CheckOutResponse {
  success: string;
  order_id: number;
  order_number: string;
  total_amount: string;
  discounted_amount: string;
  final_amount: string;
  coupon_code: string | null;
}

export interface OrderDetailsResponse {
  id: number;
  order_number: string;
  user: number;
  user_email: string;
  shipping_address: ShippingAddress;
  items: OrderItem[];
  coupon: string | null;
  total_amount: string;
  discounted_amount: string;
  final_amount: string;
  is_paid: boolean;
  payment_status: string;
  order_status: string;
  stripe_payment_intent: string | null;
  stripe_checkout_session_id: string | null;
  created_at: string;
}

export interface OrderItem {
  id: number;
  product: ProductResponse;
  product_image: string[];
  product_name: string;
  quantity: number;
  price: string;
  product_discount: number;
  coupon_discount: number;
  final_price: number;
  line_total: number;
}

export interface ShippingAddress {
  shipping_id: number;
  user: number;
  full_name: string;
  phone_no: string;
  email: string;
  street_address: string;
  apartment: string;
  floor: string;
  city: string;
  zipcode: string;
  order: number | null;
  created_at: string;
  updated_at: string;
}
export interface OrderListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: OrderDetailsResponse[];
}



export interface UserOrderItemSummary {
  product_id: number;
  product: string;
  quantity: number;
  price: number;
}

export interface UserOrderSummary {
  id: number;
  order_number: string;
  user_email: string;
  order_status: string;
  total_amount?: string;
  final_amount?: string;
  created_at: string;
  order_items: UserOrderItemSummary[];
}

export interface UserOrderListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: UserOrderSummary[];
}
