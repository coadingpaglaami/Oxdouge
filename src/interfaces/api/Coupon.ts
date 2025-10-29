export interface CouponPayload {
  code: string;
  description?: string;
  discount_type?: "percentage" | "fixed"; // <-- optional
  discount_value: number;
  active: boolean;
  valid_from: string;
  valid_to: string;
  products: number[];
  categories: number[];
}

export interface Coupon {
  id: number;
  products: number[];
  categories: number[];
  code: string;
  discount_type?: "percentage" | "fixed"; // optional if you want
  discount_value: string; // comes from backend as string "50.00"
  description?: string;
  active: boolean;
  valid_from: string;
  valid_to: string;
}

export interface CouponListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Coupon[];
}

export interface AppliedProduct {
  id: number;
  title: string;
  price: string;
  quantity: number;
  subtotal: string;
}

export interface ApplyCouponResponse {
  message: string;
  discount_type: "fixed" | "percentage" | string; // keep it flexible
  coupon_discount_value: string;
  total_amount: string;
  final_amount: string;
  applied_products: AppliedProduct[];
}

export interface ApplyCouponProduct {
  id: number;
  quantity: number;
}

export interface ApplyCouponRequest {
  code: string;
  products: ApplyCouponProduct[];
}