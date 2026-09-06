import { ProductForm } from "../ProductForm";

export default function NewProductPage() {
  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">
        Nuevo producto
      </h1>
      <ProductForm />
    </div>
  );
}
