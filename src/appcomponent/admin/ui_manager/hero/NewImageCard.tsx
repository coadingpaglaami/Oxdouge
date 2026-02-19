import { useEffect, useState } from "react";
import { Field } from "./Field";

export const NewImageCard = ({
  file,
  index,
  heading,
  subheading,
  onHeadingChange,
  onSubheadingChange,
  onRemove,
}: {
  file: File;
  index: number;
  heading: string;
  subheading: string;
  onHeadingChange: (i: number, v: string) => void;
  onSubheadingChange: (i: number, v: string) => void;
  onRemove: (i: number) => void;
}) => {
  const [preview, setPreview] = useState("");

  useEffect(() => {
    const url = URL.createObjectURL(file);
    setPreview(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  return (
    <div className="group bg-neutral-950 border border-emerald-500/10 rounded-xl overflow-hidden hover:border-emerald-500/20 transition-all duration-300 hover:-translate-y-0.5">
      <div className="relative">
        <img
          src={preview}
          alt={`new-${index}`}
          className="w-full h-40 object-cover block"
        />
        <div className="absolute inset-0 bg-linear-to-b from-black/40 via-transparent to-transparent pointer-events-none" />

        <span className="absolute top-2.5 left-2.5 text-[10px] font-mono tracking-wider bg-emerald-500/10 text-emerald-400 border border-emerald-500/25 px-2 py-0.5 rounded-md backdrop-blur-sm">
          NEW #{index + 1}
        </span>

        {/* Remove from queue — not a server delete */}
        <button
          onClick={() => onRemove(index)}
          title="Remove from queue"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full bg-white/10 hover:bg-white/20 text-white text-xs font-bold flex items-center justify-center backdrop-blur-sm transition-all duration-150 hover:scale-110 opacity-0 group-hover:opacity-100 cursor-pointer"
        >
          ✕
        </button>
      </div>

      <div className="p-3.5 flex flex-col gap-3">
        <Field
          label="Heading"
          value={heading}
          onChange={(v) => onHeadingChange(index, v)}
          placeholder="Enter heading…"
          accent="emerald"
        />
        <Field
          label="Sub-heading"
          value={subheading}
          onChange={(v) => onSubheadingChange(index, v)}
          placeholder="Enter sub-heading…"
          accent="emerald"
        />
      </div>
    </div>
  );
};
