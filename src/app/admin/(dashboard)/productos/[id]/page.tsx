import { notFound } from "next/navigation";
import { getProductById } from "@/lib/repo/products";
import { ProductForm } from "../ProductForm";
import { DeleteButton } from "../DeleteButton";

export default async function EditProductPage({
  params,
  searchParams,
}: {
  params: Promise<{ id: string }>;
  searchParams: Promise<{ returnTo?: string }>;
}) {
  const { id } = await params;
  const { returnTo } = await searchParams;
  const product = await getProductById(id);
  if (!product) notFound();

  return (
    <div>
      <div className="mb-6 flex items-center justify-between">
        <h1 className="font-[family-name:var(--font-display)] text-2xl font-bold">
          Editar producto
        </h1>
        <DeleteButton id={product.id} returnTo={returnTo} />
      </div>
      <ProductForm product={product} returnTo={returnTo} />
    </div>
  );
}
