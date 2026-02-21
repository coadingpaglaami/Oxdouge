"use client";

import {
  useGetHeroPromotionQuery,
  useHeropromotionMutation,
} from "@/api/ui_manager";
import { Skeleton } from "@/components/ui/skeleton";
import { ExistingImage } from "@/interfaces/api";
import { useEffect, useRef, useState } from "react";
import { SectionHeader } from "./SectionHeader";
import { Field } from "./Field";
import { ExistingImageCard } from "./ExistingImageCard";
import { NewImageCard } from "./NewImageCard";
import { MAX_NEW_IMAGES } from "./valueandfunction";
import { toast } from "sonner";

export const HeroSectionManagement = () => {
  const { data, isLoading, error } = useGetHeroPromotionQuery();
  const [updateHeroPromotion, { isLoading: isUpdating }] =
    useHeropromotionMutation();

  // ── Content State ──
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [description, setDescription] = useState("");

  // ── Existing Images (ID-based) ──
  const [existingImages, setExistingImages] = useState<ExistingImage[]>([]);
  const [deletedImageIds, setDeletedImageIds] = useState<number[]>([]);
  console.log(deletedImageIds);

  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newHeadings, setNewHeadings] = useState<string[]>([]);
  const [newSubheadings, setNewSubheadings] = useState<string[]>([]);

  const [saved, setSaved] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Seed From API ──
  useEffect(() => {
    if (!data) return;

    setTitle1(data.title1 ?? "");
    setTitle2(data.title2 ?? "");
    setDescription(data.description ?? "");
    setExistingImages(data.existing_images ?? []);
    setDeletedImageIds([]);
    setNewFiles([]);
    setNewHeadings([]);
    setNewSubheadings([]);
  }, [data]);

  // ── Existing Image Handlers ──

  const handleExistingImageChange = (
    id: number,
    field: keyof ExistingImage,
    value: string,
  ) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.id === id ? { ...img, [field]: value || null } : img,
      ),
    );
  };

  const handleDeleteExistingImage = (id: number) => {
    setDeletedImageIds((prev) => (prev.includes(id) ? prev : [...prev, id]));
    setExistingImages((prev) => prev.filter((img) => img.id !== id));
  };

  // ── New Image Handlers ──

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    if (files.length === 0) return;

    setNewFiles((prev) => {
      const slots = MAX_NEW_IMAGES - prev.length;
      if (slots <= 0) return prev;

      const filtered = files.filter(
        (file) =>
          !prev.some(
            (existing) =>
              existing.name === file.name &&
              existing.size === file.size &&
              existing.lastModified === file.lastModified,
          ),
      );

      const toAdd = filtered.slice(0, slots);
      if (toAdd.length === 0) return prev;

      setNewHeadings((hPrev) => [...hPrev, ...toAdd.map(() => "")]);
      setNewSubheadings((sPrev) => [...sPrev, ...toAdd.map(() => "")]);

      return [...prev, ...toAdd];
    });

    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleRemoveNewFile = (index: number) => {
    setNewFiles((prev) => prev.filter((_, i) => i !== index));
    setNewHeadings((prev) => prev.filter((_, i) => i !== index));
    setNewSubheadings((prev) => prev.filter((_, i) => i !== index));
  };

  const handleNewHeadingChange = (index: number, value: string) => {
    setNewHeadings((prev) => prev.map((h, i) => (i === index ? value : h)));
  };

  const handleNewSubheadingChange = (index: number, value: string) => {
    setNewSubheadings((prev) => prev.map((s, i) => (i === index ? value : s)));
  };

  // ── Save Handler ──

  const handleSave = async () => {
    if (isSaving || isUpdating) return;
    setIsSaving(true);
    try {
      await updateHeroPromotion({
        title1,
        title2,
        description,
        deleted_image_ids: deletedImageIds,
        new_images: newFiles.length > 0 ? newFiles : null,
        new_headings: newHeadings,
        new_subheadings: newSubheadings,
      }).unwrap();
      toast.success("Hero section updated successfully!");

      // Reset temporary states after success
      setDeletedImageIds([]);
      setNewFiles([]);
      setNewHeadings([]);
      setNewSubheadings([]);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to update hero promotion:", err);
      toast.error("Failed to update hero section");
    } finally {
      setIsSaving(false);
    }
  };

  const canAddMore = newFiles.length < MAX_NEW_IMAGES;

  // ─────────────────────────────────────────
  // Loading
  // ─────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="p-10">
        <div className="flex flex-col gap-10">
          <Skeleton className="h-10 w-64" />
          <div className="flex flex-col gap-5">
            <Skeleton className="h-5 w-32" />
            <div className="grid grid-cols-2 gap-5">
              <Skeleton className="h-12" />
              <Skeleton className="h-12" />
              <Skeleton className="h-28 col-span-2" />
            </div>
          </div>
          <div className="grid grid-cols-3 gap-4">
            {[...Array(6)].map((_, i) => (
              <Skeleton key={i} className="h-52" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // Error
  // ─────────────────────────────────────────

  if (error) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-400 text-sm font-mono mb-2">
            Failed to load hero section data
          </p>
          <p className="text-gray-600 text-xs font-mono">
            Check your network and try refreshing
          </p>
        </div>
      </div>
    );
  }

  // ─────────────────────────────────────────
  // UI
  // ─────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/90 backdrop-blur-md px-6 md:px-10 py-4 flex items-center justify-between gap-4">
        <div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
            Hero Section Management
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isSaving || isUpdating}
          className={`px-5 py-2.5 rounded-lg text-sm text-black font-semibold transition-all duration-300 disabled:opacity-60
            ${saved ? "bg-emerald-600" : "bg-primary hover:bg-primary/80"}`}
        >
          {isSaving || isUpdating ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </header>

      <main className="px-6 md:px-10 py-10 flex flex-col gap-12">
        {/* Content Section */}
        <section>
          <SectionHeader label="Content" index="01" />
          <div className="border border-white/6 rounded-2xl p-6 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field label="Title Line 1" value={title1} onChange={setTitle1} />
            <Field label="Title Line 2" value={title2} onChange={setTitle2} />
            <div className="md:col-span-2">
              <Field
                label="Description"
                value={description}
                onChange={setDescription}
                multiline
              />
            </div>
          </div>
        </section>

        {/* Existing Images */}
        <section>
          <SectionHeader
            label="Existing Images"
            index="02"
            badge={`${existingImages.length} image${
              existingImages.length !== 1 ? "s" : ""
            }`}
            badgeVariant="violet"
          />

          {existingImages.length === 0 ? (
            <div className="border border-dashed border-white/6 rounded-2xl py-14 text-center">
              <p className="text-gray-600 text-sm font-mono">
                All existing images removed
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {existingImages.map((img, displayIndex) => (
                <ExistingImageCard
                  key={img.id}
                  img={img}
                  id={img.id} // ✅ pass real ID
                  displayIndex={displayIndex}
                  onChange={handleExistingImageChange}
                  onDelete={handleDeleteExistingImage}
                />
              ))}
            </div>
          )}
        </section>

        {/* New Images */}
        <section>
          <SectionHeader label="Upload New Images" index="03" />

          {canAddMore && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mb-5 border border-dashed border-white/8 rounded-2xl py-10 flex flex-col items-center gap-2.5 cursor-pointer"
            >
              <p className="text-gray-500 text-sm">Click to upload images</p>
            </div>
          )}

          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            multiple
            className="hidden"
            onChange={handleFileSelect}
          />

          {newFiles.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {newFiles.map((file, i) => (
                <NewImageCard
                  key={`new-${i}`}
                  file={file}
                  index={i}
                  heading={newHeadings[i] ?? ""}
                  subheading={newSubheadings[i] ?? ""}
                  onHeadingChange={handleNewHeadingChange}
                  onSubheadingChange={handleNewSubheadingChange}
                  onRemove={handleRemoveNewFile}
                />
              ))}
            </div>
          )}
        </section>
      </main>
    </div>
  );
};
