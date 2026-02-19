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

export const HeroSectionManagement = () => {
  const { data, isLoading, error } = useGetHeroPromotionQuery();
  const [updateHeroPromotion, { isLoading: isUpdating }] =
    useHeropromotionMutation();

  // ── Local editable state (initialised from API data) ──
  const [title1, setTitle1] = useState("");
  const [title2, setTitle2] = useState("");
  const [description, setDescription] = useState("");

  // existingImages: keyed by their ORIGINAL index so deletes map correctly
  const [existingImages, setExistingImages] = useState<
    Array<ExistingImage & { originalIndex: number }>
  >([]);

  // Indexes from the original array that the user has deleted
  const [deletedOriginalIndexes, setDeletedOriginalIndexes] = useState<
    number[]
  >([]);

  // New images to upload
  const [newFiles, setNewFiles] = useState<File[]>([]);
  const [newHeadings, setNewHeadings] = useState<string[]>([]);
  const [newSubheadings, setNewSubheadings] = useState<string[]>([]);

  const [saved, setSaved] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ── Seed state from API ──
  useEffect(() => {
    if (!data) return;
    setTitle1(data.title1 ?? "");
    setTitle2(data.title2 ?? "");
    setDescription(data.description ?? "");
    setExistingImages(
      (data.existing_images ?? []).map((img, i) => ({
        ...img,
        originalIndex: i,
      })),
    );
    setDeletedOriginalIndexes([]);
    setNewFiles([]);
    setNewHeadings([]);
    setNewSubheadings([]);
  }, [data]);

  // ── Existing image handlers ──

  const handleExistingImageChange = (
    originalIndex: number,
    field: keyof ExistingImage,
    value: string,
  ) => {
    setExistingImages((prev) =>
      prev.map((img) =>
        img.originalIndex === originalIndex
          ? { ...img, [field]: value || null }
          : img,
      ),
    );
  };

  const handleDeleteExistingImage = (originalIndex: number) => {
    setDeletedOriginalIndexes((prev) => [...prev, originalIndex]);
    setExistingImages((prev) =>
      prev.filter((img) => img.originalIndex !== originalIndex),
    );
  };

  // ── New image handlers ──

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const slots = MAX_NEW_IMAGES - newFiles.length;
    const toAdd = files.slice(0, slots);
    setNewFiles((prev) => [...prev, ...toAdd]);
    setNewHeadings((prev) => [...prev, ...toAdd.map(() => "")]);
    setNewSubheadings((prev) => [...prev, ...toAdd.map(() => "")]);
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

  // ── Save ──

  const handleSave = async () => {
    try {
      await updateHeroPromotion({
        title1,
        title2,
        description,
        new_images: newFiles.length > 0 ? newFiles : null,
        new_headings: newHeadings,
        new_subheadings: newSubheadings,
      }).unwrap();

      // Clear queued new images after successful save
      setNewFiles([]);
      setNewHeadings([]);
      setNewSubheadings([]);
      setDeletedOriginalIndexes([]);

      setSaved(true);
      setTimeout(() => setSaved(false), 2500);
    } catch (err) {
      console.error("Failed to update hero promotion:", err);
    }
  };

  const canAddMore = newFiles.length < MAX_NEW_IMAGES;

  // ─── Loading state ────────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className=" p-10">
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

  // ─── Error state ──────────────────────────────────────────────────────────

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

  // ─── Main render ──────────────────────────────────────────────────────────

  return (
    <div className="min-h-screen bg-black text-gray-200">
      {/* Sticky header */}
      <header className="sticky top-0 z-20 border-b border-white/5 bg-black/90 backdrop-blur-md px-6 md:px-10 py-4 flex items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-0.5">
            <span className="w-1.5 h-1.5 rounded-full bg-violet-400 animate-pulse" />
            <span className="text-[10px] font-mono tracking-widest text-gray-600 uppercase">
              Admin / Content
            </span>
          </div>
          <h1 className="text-lg md:text-xl font-bold tracking-tight text-white">
            Hero Section Management
          </h1>
        </div>

        <button
          onClick={handleSave}
          disabled={isUpdating}
          className={`flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-semibold text-white transition-all duration-300 disabled:opacity-60 disabled:cursor-not-allowed shrink-0
            ${
              saved
                ? "bg-emerald-600 shadow-[0_0_18px_rgba(16,185,129,0.25)]"
                : "bg-violet-600 hover:bg-violet-500 shadow-[0_0_18px_rgba(124,58,237,0.2)] hover:shadow-[0_0_26px_rgba(124,58,237,0.35)]"
            }`}
        >
          {isUpdating ? (
            <>
              <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              Saving…
            </>
          ) : saved ? (
            <>✓ Saved</>
          ) : (
            <>Save Changes</>
          )}
        </button>
      </header>

      {/* Body */}
      <main className=" px-6 md:px-10 py-10 flex flex-col gap-12">
        {/* ── 01 Content ── */}
        <section>
          <SectionHeader label="Content" index="01" />
          <div className=" border border-white/6 rounded-2xl p-6 md:p-7 grid grid-cols-1 md:grid-cols-2 gap-5">
            <Field
              label="Title Line 1"
              value={title1}
              onChange={setTitle1}
              placeholder="First title line…"
            />
            <Field
              label="Title Line 2"
              value={title2}
              onChange={setTitle2}
              placeholder="Second title line…"
            />
            <div className="md:col-span-2">
              <Field
                label="Description"
                value={description}
                onChange={setDescription}
                multiline
                placeholder="Hero description…"
              />
            </div>
          </div>
        </section>

        {/* ── 02 Existing Images ── */}
        <section>
          <SectionHeader
            label="Existing Images"
            index="02"
            badge={`${existingImages.length} image${existingImages.length !== 1 ? "s" : ""}`}
            badgeVariant="violet"
          />

          {/* Info row */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-[10px] font-mono text-gray-600 bg-white/3 border border-white/5 px-2.5 py-1 rounded-md">
              Hover a card to reveal the delete button
            </span>
            {deletedOriginalIndexes.length > 0 && (
              <span className="text-[10px] font-mono text-red-400 bg-red-500/5 border border-red-500/15 px-2.5 py-1 rounded-md">
                {deletedOriginalIndexes.length} pending deletion
              </span>
            )}
          </div>

          {existingImages.length === 0 ? (
            <div className=" border border-dashed border-white/6 rounded-2xl py-14 flex flex-col items-center justify-center gap-2">
              <p className="text-gray-600 text-sm font-mono">
                All existing images removed
              </p>
              <p className="text-gray-700 text-xs font-mono">
                Changes apply after saving
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {existingImages.map((img, displayIndex) => (
                <ExistingImageCard
                  key={img.originalIndex}
                  img={img}
                  originalIndex={img.originalIndex}
                  displayIndex={displayIndex}
                  onChange={handleExistingImageChange}
                  onDelete={handleDeleteExistingImage}
                />
              ))}
            </div>
          )}
        </section>

        {/* ── 03 New Images ── */}
        <section>
          <SectionHeader
            label="Upload New Images"
            index="03"
            badge={
              newFiles.length > 0
                ? `${newFiles.length} / ${MAX_NEW_IMAGES} queued`
                : undefined
            }
            badgeVariant="emerald"
          />

          {/* Max cap warning */}
          {!canAddMore && (
            <div className="mb-4 flex items-center gap-2.5 bg-amber-500/5 border border-amber-500/15 rounded-xl px-4 py-3">
              <span className="text-amber-400 text-sm">⚠</span>
              <p className="text-amber-400 text-xs font-mono">
                Maximum {MAX_NEW_IMAGES} new images per upload. Save first to
                add more.
              </p>
            </div>
          )}

          {/* Drop zone */}
          {canAddMore && (
            <div
              onClick={() => fileInputRef.current?.click()}
              className="mb-5 border border-dashed border-white/8 hover:border-emerald-500/30 rounded-2xl py-10 flex flex-col items-center gap-2.5 cursor-pointer transition-all duration-200 hover:bg-emerald-500/3 group"
            >
              <div className="w-10 h-10 rounded-full bg-emerald-500/8 border border-emerald-500/15 flex items-center justify-center text-emerald-400 text-xl group-hover:scale-110 transition-transform duration-200">
                +
              </div>
              <p className="text-gray-500 text-sm">Click to upload images</p>
              <p className="text-gray-700 text-[11px] font-mono">
                {MAX_NEW_IMAGES - newFiles.length} slot
                {MAX_NEW_IMAGES - newFiles.length !== 1 ? "s" : ""} remaining ·
                PNG, JPG, WEBP
              </p>
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
