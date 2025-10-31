export interface ProductResponse {
  id: number | undefined;
  title: string;
  product_code?: string;
  category_detail?: CategoryResponse;
  category?:number | string;
  colors?: string[]; // Array of hex color codes
  available_stock?: number;
  price: string; // Keeping as string to match API
  discount?: number;
  discounted_price?: number;
  description?: string;
  images?: string[] | null; // Array of image URLs or null
  main_image: string | null; // Nullable string for main image URL
  features?: string[]; // Array of features
  video?: string | null; // Nullable string for video URL
}

export interface PaginatedProductsResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ProductResponse[];
}

export interface UpdateProductResponse {
  message: string;
  product: ProductResponse; // reuse previously defined Product interface
}

export interface ProductCreateRequest {
  title: string;
  category: number;
  colors: string[];
  available_stock: number;
  price: string;
  discount: number;
  description: string;
  features: string[];
  images: File[];
  video_upload: File | null;
  main_image_upload: File | null;
}

export interface PaginatedCategories {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryResponse[]; // Reusing the previously defined Category interface
}

export interface CategoryResponse {
  id: number;
  name: string;
}

export interface ProductReviewResponse {
  id: number;
  product: string;
  user: string;
  name: string;
  rating: string; // comes as string ("5.0", "4.0"), not number
  user_image: string | null;
  comment: string;
  created_at: string;
}