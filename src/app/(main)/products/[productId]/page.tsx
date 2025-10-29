import { ProductDetails } from "@/appcomponent/products";

interface PageProps {
  params: { productId: string };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  
  const id = Number(params.productId); // just parse synchronously

  return <ProductDetails id={id} />;
}