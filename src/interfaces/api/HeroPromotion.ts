export interface PostRequest {
  title1: string;
  title2: string;
  description: string;
  new_images: File[] | null;  // Assuming an array of files
  new_headings: string[];
  new_subheadings: string[];
  deleted_image_ids: number[]; // IDs of images to be deleted
}


export interface PostResponse {
  id: number;
  title1: string;
  title2: string;
  description: string;
  new_images: string[]; // URLs or paths of the uploaded images
  new_headings: string[];
  new_subheadings: string[];
}

export interface ExistingImage {
  id:number;
  image: string;
  heading: string | null;
  sub_heading: string | null;
}

export interface GetResponse {
  title1: string;
  title2: string;
  description: string;
  existing_images: ExistingImage[];
}
