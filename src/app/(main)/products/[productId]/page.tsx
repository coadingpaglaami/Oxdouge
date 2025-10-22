import { ProductDetails } from "@/appcomponent/products";
import { productPageData } from "@/data";
export function generateStaticParams() {
  return productPageData.map((p) => ({
    productId: p.id!.toString(),
  }));
}


interface PageProps {
  params: { productId: string };
}

export default async function ProductDetailsPage({ params }: PageProps) {
  const id = Number(params.productId); // just parse synchronously

  return <ProductDetails id={id} />;
}