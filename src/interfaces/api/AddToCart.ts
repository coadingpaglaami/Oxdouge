export interface AddToCartRequest {
  product_id: number;
  quantity: number;
}

export interface CartItemResponse {
  id: number;
  product: number;         // product id reference
  quantity: number;
  added_at: string;        // ISO date string
  product_name: string;
  price: number;
  total_price: number;
  image: string;
}