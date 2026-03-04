import { ProductDetails } from "@/appcomponent/products";

interface PageProps {
  params: Promise<{ productId: string }>;
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const { productId } = await params;

  const id = Number(productId.split("-").pop());

  return <ProductDetails id={id} />;
}
