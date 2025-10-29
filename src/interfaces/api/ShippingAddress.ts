export interface ShippingAddressRequest {
  full_name: string;
  phone_no: string;
  email: string;
  street_address: string;
  apartment?: string; // optional if sometimes not provided
  floor?: string;     // optional if sometimes not provided
  city: string;
  zipcode: string;
}

export interface ShippingAddressResponse {
  shipping_id: number;
  user: number;           // user id reference
  full_name: string;
  phone_no: string;
  email: string;
  street_address: string;
  apartment?: string;     // optional
  floor?: string;         // optional
  city: string;
  zipcode: string;
  order: number | null;   // nullable, as shown
  created_at: string;     // ISO datetime string
  updated_at: string;     // ISO datetime string
}