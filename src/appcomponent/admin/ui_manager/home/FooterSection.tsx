"use client";

import Image from "next/image";
import { useState, useRef } from "react";
import { Pencil, X, Check, ImagePlus, Loader2 } from "lucide-react";
import {
  useGetFooterSectionQuery,
  useUpdateFooterSectionMutation,
} from "@/api/ui_manager";

interface FooterSection {
  id: number;
  title: string;
  content: string;
  image: string;
  image_url: string;
}

interface FooterSectionForm {
  title: string;
  content: string;
  image?: File | null;
}

interface EditState {
  id: number;
  form: FooterSectionForm;
  previewUrl: string | null;
}

export const FooterSection = () => {
  const { data: sections, isLoading, isError } = useGetFooterSectionQuery();
  const [updateFooterSection, { isLoading: isUpdating }] =
    useUpdateFooterSectionMutation();

  const [editState, setEditState] = useState<EditState | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const openEdit = (section: FooterSection) => {
    setEditState({
      id: section.id,
      form: {
        title: section.title,
        content: section.content,
        image: null,
      },
      previewUrl: section.image_url || null,
    });
  };

  const closeEdit = () => {
    setEditState(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file || !editState) return;
    const url = URL.createObjectURL(file);
    setEditState((prev) =>
      prev
        ? { ...prev, form: { ...prev.form, image: file }, previewUrl: url }
        : prev
    );
  };

  const handleSave = async () => {
    if (!editState) return;
    try {
      await updateFooterSection({
        id: editState.id,
        data: editState.form,
      }).unwrap();
      closeEdit();
    } catch (err) {
      console.error("Failed to update footer section:", err);
    }
  };

  // ---------- Loading ----------
  if (isLoading) {
    return (
      <div className="w-full border-t-[0.4px] border-[#FFD345]/20 py-10 px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 animate-pulse">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="flex flex-col gap-3">
              <div className="w-12 h-12 bg-white/10 rounded-lg" />
              <div className="h-4 bg-white/10 rounded w-1/2" />
              <div className="h-3 bg-white/5 rounded w-full" />
              <div className="h-3 bg-white/5 rounded w-3/4" />
            </div>
          ))}
        </div>
      </div>
    );
  }

  if (isError || !sections || sections.length === 0) return null;

  // ---------- Render ----------
  return (
    <div className="w-full border-t-[0.4px] border-[#FFD345]/20 py-10 px-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {sections.map((section: FooterSection) => {
          const isEditing = editState?.id === section.id;

          return (
            <div
              key={section.id}
              className={`group relative flex flex-col gap-4 p-5 rounded-xl border transition-all duration-300 ${
                isEditing
                  ? "border-[#FFD345]/40 bg-white/[0.06]"
                  : "border-white/5 bg-white/[0.02] hover:bg-white/[0.05] hover:border-[#FFD345]/20"
              }`}
            >
              {/* ── Edit / Cancel / Save buttons (top-right) ── */}
              <div className="absolute top-3 right-3 flex gap-1.5">
                {isEditing ? (
                  <>
                    {/* Save */}
                    <button
                      onClick={handleSave}
                      disabled={isUpdating}
                      className="flex items-center justify-center w-7 h-7 rounded-md bg-[#FFD345] hover:bg-[#FFD345]/80 text-black transition-colors duration-200 disabled:opacity-50"
                      title="Save"
                    >
                      {isUpdating ? (
                        <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      ) : (
                        <Check className="w-3.5 h-3.5" />
                      )}
                    </button>
                    {/* Cancel */}
                    <button
                      onClick={closeEdit}
                      disabled={isUpdating}
                      className="flex items-center justify-center w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 disabled:opacity-50"
                      title="Cancel"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  </>
                ) : (
                  <button
                    onClick={() => openEdit(section)}
                    className="flex items-center justify-center w-7 h-7 rounded-md bg-white/0 group-hover:bg-white/10 hover:!bg-[#FFD345]/20 text-gray-500 group-hover:text-gray-300 hover:!text-[#FFD345] transition-all duration-200"
                    title="Edit"
                  >
                    <Pencil className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* ── Image ── */}
              <div className="flex items-center gap-3">
                <div
                  className={`relative w-12 h-12 rounded-lg overflow-hidden bg-white/10 flex items-center justify-center shrink-0 ${
                    isEditing ? "ring-2 ring-[#FFD345]/30 cursor-pointer" : ""
                  }`}
                  onClick={() => isEditing && fileInputRef.current?.click()}
                  title={isEditing ? "Click to change image" : undefined}
                >
                  {(isEditing ? editState?.previewUrl : section.image_url) && (
                    <Image
                      src={
                        isEditing && editState?.previewUrl
                          ? editState.previewUrl
                          : section.image_url
                      }
                      alt={section.title}
                      width={48}
                      height={48}
                      className="w-full h-full object-cover"
                    />
                  )}

                  {/* Overlay hint when editing */}
                  {isEditing && (
                    <div className="absolute inset-0 bg-black/50 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity duration-200">
                      <ImagePlus className="w-4 h-4 text-[#FFD345]" />
                    </div>
                  )}
                </div>

                {/* Hidden file input */}
                {isEditing && (
                  <>
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={handleImageChange}
                    />
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="text-xs text-[#FFD345]/70 hover:text-[#FFD345] flex items-center gap-1 transition-colors duration-200"
                    >
                      <ImagePlus className="w-3 h-3" />
                      Change image
                    </button>
                  </>
                )}
              </div>

              {/* ── Title ── */}
              {isEditing ? (
                <input
                  type="text"
                  value={editState.form.title}
                  onChange={(e) =>
                    setEditState((prev) =>
                      prev
                        ? {
                            ...prev,
                            form: { ...prev.form, title: e.target.value },
                          }
                        : prev
                    )
                  }
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FFD345]/40 rounded-lg px-3 py-2 text-white text-sm font-semibold outline-none transition-colors duration-200 placeholder:text-gray-600"
                  placeholder="Section title"
                />
              ) : (
                <h4 className="text-white font-semibold text-base leading-tight group-hover:text-[#FFD345] transition-colors duration-200 pr-8">
                  {section.title}
                </h4>
              )}

              {/* ── Content ── */}
              {isEditing ? (
                <textarea
                  value={editState.form.content}
                  onChange={(e) =>
                    setEditState((prev) =>
                      prev
                        ? {
                            ...prev,
                            form: { ...prev.form, content: e.target.value },
                          }
                        : prev
                    )
                  }
                  rows={4}
                  className="w-full bg-white/5 border border-white/10 focus:border-[#FFD345]/40 rounded-lg px-3 py-2 text-gray-300 text-sm outline-none resize-none transition-colors duration-200 placeholder:text-gray-600 leading-relaxed"
                  placeholder="Section content"
                />
              ) : (
                <p className="text-sm text-gray-400 leading-relaxed group-hover:text-gray-300 transition-colors duration-200">
                  {section.content}
                </p>
              )}

              {/* ── Accent line (view mode only) ── */}
              {!isEditing && (
                <div className="w-0 group-hover:w-8 h-0.5 bg-[#FFD345] transition-all duration-300 rounded-full mt-auto" />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};