"use client";

import { useRef, useState, useTransition } from "react";
import { uploadImageAction } from "@/lib/actions/upload-actions";

const inputClass =
  "w-full rounded-lg border border-white/15 bg-black/30 px-3 py-2.5 text-sm text-white outline-none focus:border-[#c9a24b]";
const labelClass = "mb-1 block text-xs font-semibold uppercase tracking-wide text-white/50";

export function ImageUploadField({
  name,
  label,
  defaultValue,
  folder,
}: {
  name: string;
  label: string;
  defaultValue?: string | null;
  folder: "products" | "carousel";
}) {
  const [url, setUrl] = useState(defaultValue ?? "");
  const [error, setError] = useState<string | null>(null);
  const [pending, startTransition] = useTransition();
  const fileInputRef = useRef<HTMLInputElement>(null);

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);

    const formData = new FormData();
    formData.set("file", file);
    formData.set("folder", folder);

    startTransition(async () => {
      const result = await uploadImageAction(formData);
      if (result.url) {
        setUrl(result.url);
      } else {
        setError(result.error ?? "No se pudo subir la imagen.");
      }
      if (fileInputRef.current) fileInputRef.current.value = "";
    });
  }

  return (
    <div>
      <label className={labelClass}>{label}</label>
      <input
        name={name}
        value={url}
        onChange={(e) => setUrl(e.target.value)}
        placeholder="https://…"
        className={inputClass}
      />

      <div className="mt-2 flex items-center gap-3">
        <label className="cursor-pointer rounded-full border border-white/20 px-4 py-1.5 text-xs font-semibold text-white/80 hover:border-[#c9a24b] hover:text-[#c9a24b]">
          {pending ? "Subiendo…" : "Examinar…"}
          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp,image/gif"
            onChange={handleFileChange}
            disabled={pending}
            className="hidden"
          />
        </label>
        <span className="text-xs text-white/40">o pega un enlace arriba</span>

        {url && (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={url}
            alt="Vista previa"
            className="h-10 w-10 rounded-lg border border-white/15 object-cover"
          />
        )}
      </div>

      {error && <p className="mt-2 text-xs text-red-400">{error}</p>}
    </div>
  );
}
