export interface DiselHeater {
  id?: number;                  // optional index/id for routing
  main_image_upload: string;                  // main product image
  subtitle: string;
  title: string;
  description: string;
  price: string;
  
  // Optional fields
  availability?: 'In Stock' | 'Out of Stock';
  quantity?: number;
  keyFeatures?: string[];       // list of main features
  moreImages?: string[];        // additional images paths
  howToUseVideo?: string; 
  category?:string;      // YouTube URL or local video path
}