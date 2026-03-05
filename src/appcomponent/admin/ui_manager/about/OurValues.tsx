"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  useGetValuesSectionQuery,
  useUpdateValuesSectionMutation,
  useAddValuesSectionMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ValuesItem {
  id: number;
  icon: string;
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
}

interface ValuesSectionResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ValuesItem[];
}

interface CardFormState {
  title: string;
  description: string;
  iconFile: File | null;
  iconPreview: string;
}

const MAX_CARDS = 4;

const emptyForm = (): CardFormState => ({
  title: "",
  description: "",
  iconFile: null,
  iconPreview: "",
});

// ─── Sub-component: Value Card ─────────────────────────────────────────────────

interface ValueCardProps {
  item: ValuesItem;
  onSave: (id: number, form: CardFormState) => Promise<void>;
  isSaving: boolean;
}

const ValueCard = ({ item, onSave, isSaving }: ValueCardProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CardFormState>({
    title: item.title,
    description: item.description,
    iconFile: null,
    iconPreview: item.icon,
  });
  const [saved, setSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  const handleChange = (key: "title" | "description", value: string) => {
    setForm((p) => ({ ...p, [key]: value }));
    setIsDirty(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const preview = URL.createObjectURL(file);
    setForm((p) => ({ ...p, iconFile: file, iconPreview: preview }));
    setIsDirty(true);
  };

  const handleSave = async () => {
    await onSave(item.id, form);
    setSaved(true);
    setIsDirty(false);
    setTimeout(() => setSaved(false), 2500);
  };

  return (
    <div className="group relative flex flex-col gap-4 rounded-2xl border border-white/10 bg-white/5 p-5 backdrop-blur-sm transition-all hover:border-white/20 hover:bg-white/8">
      {/* Icon upload */}
      <div className="flex items-center gap-4">
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          className="relative h-16 w-16 flex-shrink-0 overflow-hidden rounded-xl border border-white/10 bg-white/5 transition hover:border-amber-400/50 hover:bg-white/10"
          title="Click to change icon"
        >
          {form.iconPreview ? (
            <Image
              src={form.iconPreview}
              alt={form.title}
              fill
              className="object-cover"
              unoptimized
            />
          ) : (
            <span className="flex h-full w-full items-center justify-center text-2xl text-white/20">
              +
            </span>
          )}
          {/* Overlay hint */}
          <span className="absolute inset-0 flex items-center justify-center rounded-xl bg-black/50 opacity-0 transition-opacity group-hover:opacity-100 text-[10px] text-white font-medium">
            Change
          </span>
        </button>
        <input
          ref={fileRef}
          type="file"
          accept="image/*"
          className="hidden"
          onChange={handleFileChange}
        />

        <div className="flex-1 min-w-0">
          <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/30">
            Title
          </label>
          <input
            type="text"
            value={form.title}
            onChange={(e) => handleChange("title", e.target.value)}
            placeholder="Value title…"
            className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm font-medium text-white placeholder:text-white/20 outline-none transition focus:border-amber-400/60 focus:bg-white/8 focus:ring-1 focus:ring-amber-400/20"
          />
        </div>
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Description
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) => handleChange("description", e.target.value)}
          placeholder="Write a short description…"
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm leading-relaxed text-white/80 placeholder:text-white/20 outline-none transition focus:border-amber-400/60 focus:bg-white/8 focus:ring-1 focus:ring-amber-400/20"
        />
      </div>

      {/* Save button */}
      <div className="flex items-center justify-between">
        <span className="text-[11px] text-white/20">ID #{item.id}</span>
        <button
          onClick={handleSave}
          disabled={isSaving || !isDirty}
          className={[
            "rounded-lg px-4 py-2 text-xs font-semibold transition-all duration-200 focus:outline-none",
            saved
              ? "bg-emerald-500 text-white"
              : !isDirty
                ? "cursor-default bg-white/5 text-white/20"
                : isSaving
                  ? "cursor-not-allowed bg-amber-400/30 text-amber-300"
                  : "bg-amber-400 text-black hover:bg-amber-300 active:scale-95",
          ].join(" ")}
        >
          {isSaving ? "Saving…" : saved ? "✓ Saved" : "Save"}
        </button>
      </div>
    </div>
  );
};

// ─── Sub-component: Add Card ───────────────────────────────────────────────────

interface AddCardProps {
  onAdd: (form: CardFormState) => Promise<void>;
  isAdding: boolean;
}

const AddCard = ({ onAdd, isAdding }: AddCardProps) => {
  const fileRef = useRef<HTMLInputElement>(null);
  const [form, setForm] = useState<CardFormState>(emptyForm());
  const [error, setError] = useState("");

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((p) => ({
      ...p,
      iconFile: file,
      iconPreview: URL.createObjectURL(file),
    }));
  };

  const handleSubmit = async () => {
    if (!form.iconFile) return setError("Please upload an icon.");
    if (!form.title.trim()) return setError("Title is required.");
    if (!form.description.trim()) return setError("Description is required.");
    setError("");
    await onAdd(form);
    setForm(emptyForm());
  };

  return (
    <div className="flex flex-col gap-4 rounded-2xl border border-dashed border-white/20 bg-white/3 p-5 transition-all hover:border-amber-400/30">
      <p className="text-[11px] font-semibold uppercase tracking-widest text-white/30">
        New Value Card
      </p>

      {/* Icon upload */}
      <button
        type="button"
        onClick={() => fileRef.current?.click()}
        className="flex h-20 w-full items-center justify-center gap-2 rounded-xl border border-dashed border-white/10 bg-white/5 text-sm text-white/30 transition hover:border-amber-400/40 hover:text-amber-400/60"
      >
        {form.iconPreview ? (
          <div className="relative h-14 w-14 overflow-hidden rounded-lg">
            <Image
              src={form.iconPreview}
              alt="preview"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
        ) : (
          <>
            <span className="text-xl">↑</span>
            <span>Upload Icon</span>
          </>
        )}
      </button>
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {/* Title */}
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Title
        </label>
        <input
          type="text"
          value={form.title}
          onChange={(e) => setForm((p) => ({ ...p, title: e.target.value }))}
          placeholder="Value title…"
          className="w-full rounded-lg border border-white/10 bg-white/5 px-3 py-2 text-sm text-white placeholder:text-white/20 outline-none transition focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-1 block text-[10px] font-semibold uppercase tracking-widest text-white/30">
          Description
        </label>
        <textarea
          rows={3}
          value={form.description}
          onChange={(e) =>
            setForm((p) => ({ ...p, description: e.target.value }))
          }
          placeholder="Write a short description…"
          className="w-full resize-none rounded-lg border border-white/10 bg-white/5 px-3 py-2.5 text-sm leading-relaxed text-white/80 placeholder:text-white/20 outline-none transition focus:border-amber-400/60 focus:ring-1 focus:ring-amber-400/20"
        />
      </div>

      {error && <p className="text-xs text-red-400">{error}</p>}

      <button
        onClick={handleSubmit}
        disabled={isAdding}
        className={[
          "w-full rounded-xl py-2.5 text-sm font-semibold transition-all duration-200 active:scale-95",
          isAdding
            ? "cursor-not-allowed bg-amber-400/30 text-amber-300"
            : "bg-amber-400 text-black hover:bg-amber-300",
        ].join(" ")}
      >
        {isAdding ? "Adding…" : "+ Add Value"}
      </button>
    </div>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const OurValues = () => {
  const { data: valuesSection, isLoading } = useGetValuesSectionQuery({});
  const [updateValuesSection, { isLoading: isUpdating }] =
    useUpdateValuesSectionMutation();
  const [addValuesSection, { isLoading: isAdding }] =
    useAddValuesSectionMutation();

  const response = valuesSection as ValuesSectionResponse | undefined;
  const items: ValuesItem[] = response?.results ?? [];
  const canAddMore = items.length < MAX_CARDS;

  const handleUpdate = async (id: number, form: CardFormState) => {
    try {
      await updateValuesSection({
        id,
        data: {
          ...(form.iconFile ? { icon: form.iconFile } : {}),
          title: form.title,
          description: form.description,
        },
      }).unwrap();

      toast.success("Card has been updated successfully");
    } catch (error) {
      console.error("Failed to update value card:", error);
      toast.error("Failed to update value card");
    }
  };

  const handleAdd = async (form: CardFormState) => {
    if (!form.iconFile) return;
    await addValuesSection({
      icon: form.iconFile,
      title: form.title,
      description: form.description,
    }).unwrap();
    toast.success("Card has been added successfully");
  };

  return (
    <div className="rounded-2xl border border-white/10 bg-black overflow-hidden">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 border-b border-white/10 bg-white/[0.03] px-8 py-6">
        <div className="space-y-1">
          <span className="inline-flex items-center rounded-full border border-amber-400/30 bg-amber-400/10 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-amber-400">
            About Page
          </span>
          <h2 className="text-xl font-bold tracking-tight text-white">
            Our Values
          </h2>
          <p className="text-sm text-white/40">
            Manage value cards displayed on the About page. Maximum {MAX_CARDS}{" "}
            cards.
          </p>
        </div>

        {/* Card count indicator */}
        <div className="flex items-center gap-2">
          {Array.from({ length: MAX_CARDS }).map((_, i) => (
            <span
              key={i}
              className={[
                "h-2 w-2 rounded-full transition-all",
                i < items.length ? "bg-amber-400" : "bg-white/10",
              ].join(" ")}
            />
          ))}
          <span className="ml-1 text-xs text-white/30 tabular-nums">
            {items.length}/{MAX_CARDS}
          </span>
        </div>
      </div>

      {/* ── Content ── */}
      <div className="p-8">
        {isLoading ? (
          <div className="flex items-center gap-3 py-12 text-white/30">
            <span className="h-5 w-5 rounded-full border-2 border-white/10 border-t-amber-400 animate-spin" />
            <span className="text-sm">Loading values…</span>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-2">
            {/* Existing cards */}
            {items.map((item) => (
              <ValueCard
                key={item.id}
                item={item}
                onSave={handleUpdate}
                isSaving={isUpdating}
              />
            ))}

            {/* Add card — hidden when at max */}
            {canAddMore && <AddCard onAdd={handleAdd} isAdding={isAdding} />}
          </div>
        )}

        {/* Max reached notice */}
        {!isLoading && !canAddMore && (
          <p className="mt-4 text-center text-xs text-white/20">
            Maximum of {MAX_CARDS} value cards reached. Remove a card to add a
            new one.
          </p>
        )}
      </div>
    </div>
  );
};
