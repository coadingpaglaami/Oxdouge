import { ExistingImage } from "@/interfaces/api";
import { Field } from "./Field";
import { useState } from "react";
import { resolveImage } from "./valueandfunction";

export const ExistingImageCard = ({
  img,
  id,
  displayIndex,
  onChange,
  onDelete,
}: {
  img: ExistingImage;
  id: number;
  displayIndex: number;
  onChange: (id: number, field: keyof ExistingImage, value: string) => void;
  onDelete: (id: number) => void;
}) => {
  const [imgError, setImgError] = useState(false);

  return (
    <div className="group bg-neutral-950 border border-white/6 rounded-xl overflow-hidden hover:border-white/10 transition-all duration-300 hover:-translate-y-0.5">
      {/* Preview */}
      <div className="relative">
        {imgError ? (
          <div className="w-full h-40 bg-neutral-900 flex items-center justify-center">
            <span className="text-gray-600 text-xs font-mono">No preview</span>
          </div>
        ) : (
          <img
            src={resolveImage(img.image)}
            alt={`existing-${displayIndex}`}
            className="w-full h-40 object-cover block"
            onError={() => setImgError(true)}
          />
        )}
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

        {/* Badge */}
        <span className="absolute top-2.5 left-2.5 text-[10px] font-mono tracking-wider bg-black/70 text-violet-400 border border-violet-500/25 px-2 py-0.5 rounded-md backdrop-blur-sm">
          #{displayIndex + 1}
        </span>

        {/* Delete — only existing images can be deleted */}
        <button
          onClick={() => onDelete(id)}
          title="Delete this image"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-red-500/80 hover:bg-red-500 text-white text-xs font-bold flex items-center justify-center backdrop-blur-sm transition-all duration-150 hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          ✕
        </button>
      </div>

      {/* Fields */}
      <div className="p-3.5 flex flex-col gap-3">
        <Field
          label="Heading"
          value={img.heading ?? ""}
          onChange={(v) => onChange(id, "heading", v)}
          placeholder="No heading"
        />
        <Field
          label="Sub-heading"
          value={img.sub_heading ?? ""}
          onChange={(v) => onChange(id, "sub_heading", v)}
          placeholder="No sub-heading"
        />
      </div>
    </div>
  );
};
