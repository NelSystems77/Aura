import { notFound } from "next/navigation";
import { getSlideById } from "@/lib/repo/carousel";
import { SlideForm } from "../SlideForm";

export default async function EditSlidePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const slide = getSlideById(Number(id));
  if (!slide) notFound();

  return (
    <div>
      <h1 className="mb-6 font-[family-name:var(--font-display)] text-2xl font-bold">
        Editar diapositiva
      </h1>
      <SlideForm slide={slide} />
    </div>
  );
}
