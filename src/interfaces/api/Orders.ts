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