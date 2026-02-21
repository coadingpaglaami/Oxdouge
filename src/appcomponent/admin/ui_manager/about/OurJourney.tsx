"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  useGetAboutJourneyQuery,
  useUpdateAboutJourneyMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  MapPin,
  ImageIcon,
  Save,
  Loader2,
  RefreshCw,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────── */
interface AboutJourneyData {
  description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

interface FormState {
  paragraphs: string[];
  image: File | null;
  imagePreview: string | null;
}

/* ─── Helpers ────────────────────────────────────────────────────── */
const toParagraphs = (text: string): string[] => {
  const parts = text.split("\n").map((p) => p.trim());
  return parts.length > 0 ? parts : [""];
};

const toPayloadString = (paragraphs: string[]): string =>
  paragraphs.filter((p) => p.trim() !== "").join("\n");

/* ─── ParagraphEditor — module scope to prevent focus loss ──────── */
interface ParagraphEditorProps {
  paragraphs: string[];
  onChange: (paragraphs: string[]) => void;
}

const ParagraphEditor = ({ paragraphs, onChange }: ParagraphEditorProps) => {
  const update = (index: number, value: string) => {
    const next = [...paragraphs];
    next[index] = value;
    onChange(next);
  };

  const add = () => onChange([...paragraphs, ""]);

  const remove = (index: number) => {
    if (paragraphs.length === 1) {
      onChange([""]);
      return;
    }
    onChange(paragraphs.filter((_, i) => i !== index));
  };

  return (
    <div className="flex flex-col gap-2.5">
      {paragraphs.map((para, index) => (
        <div key={index} className="flex gap-2 items-start group">
          <div className="shrink-0 w-6 flex items-center justify-center mt-2.5">
            <span className="text-[10px] font-bold text-neutral-600 font-mono">
              {String(index + 1).padStart(2, "0")}
            </span>
          </div>

          <Textarea
            value={para}
            onChange={(e) => update(index, e.target.value)}
            placeholder={`Paragraph ${index + 1}…`}
            rows={3}
            className="flex-1 bg-[#1a1a1a] border-white/8 text-white placeholder-neutral-600 focus-visible:ring-primary focus-visible:border-primary resize-none text-sm transition-colors"
          />

          <button
            type="button"
            onClick={() => remove(index)}
            className="shrink-0 mt-2.5 w-7 h-7 flex items-center justify-center rounded-lg text-neutral-700 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
            title="Remove paragraph"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      ))}

      <button
        type="button"
        onClick={add}
        className="flex items-center justify-center gap-2 text-xs text-neutral-500 hover:text-primary border border-dashed border-white/10 hover:border-primary/40 rounded-lg px-3 py-2 transition-all w-full"
      >
        <Plus className="w-3.5 h-3.5" />
        Add paragraph
      </button>
    </div>
  );
};

/* ─── ImageUploadZone — module scope ─────────────────────────────── */
interface ImageUploadZoneProps {
  preview: string | null;
  currentUrl: string | null;
  fileRef: React.RefObject<HTMLInputElement>;
  onFilePick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  newFile: File | null;
}

const ImageUploadZone = ({
  preview,
  currentUrl,
  fileRef,
  onFilePick,
  onFileChange,
  newFile,
}: ImageUploadZoneProps) => {
  const displaySrc = preview ?? currentUrl;
  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between">
        <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
          <ImageIcon className="w-3.5 h-3.5 text-primary" />
          Section Image
        </Label>
        <Button
          type="button"
          size="sm"
          variant="outline"
          onClick={onFilePick}
          className="flex items-center gap-1.5 border-white/10 text-neutral-300 hover:bg-white/5 bg-transparent text-xs h-7 px-3"
        >
          <Pencil className="w-3 h-3" /> Replace
        </Button>
      </div>

      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={onFileChange}
      />

      <div
        role="button"
        tabIndex={0}
        onClick={onFilePick}
        onKeyDown={(e) => e.key === "Enter" && onFilePick()}
        className="relative w-full rounded-2xl overflow-hidden border border-white/8 bg-[#1a1a1a] cursor-pointer group transition-all hover:border-primary"
        style={{ aspectRatio: "16/9" }}
      >
        {displaySrc ? (
          <>
            <Image
              src={displaySrc}
              alt="Journey section image"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/15">
                <Pencil className="w-4 h-4" /> Click to replace
              </div>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[11px] text-neutral-300 font-medium px-2.5 py-1 rounded-lg border border-white/10">
              Journey Image
            </div>
          </>
        ) : (
          <div className="absolute inset-0 flex flex-col items-center justify-center gap-3 text-neutral-600">
            <ImageIcon className="w-10 h-10" />
            <p className="text-sm">No image — click to upload</p>
          </div>
        )}
      </div>

      {newFile && (
        <p className="text-xs text-primary flex items-center gap-1.5">
          <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
            <path
              d="M20 6L9 17l-5-5"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          New image selected: {newFile.name}
        </p>
      )}
    </div>
  );
};

/* ─── Main Component ─────────────────────────────────────────────── */
export const OurJourneyManagement = () => {
  const { data, isLoading } = useGetAboutJourneyQuery({});
  const [updateAboutJourney, { isLoading: isUpdating }] =
    useUpdateAboutJourneyMutation();

  const journey = data as AboutJourneyData | undefined;
  const fileRef = useRef<HTMLInputElement>(
    null,
  ) as React.RefObject<HTMLInputElement>;

  const [form, setForm] = useState<FormState>({
    paragraphs: [""],
    image: null,
    imagePreview: null,
  });

  useEffect(() => {
    if (journey) {
      setForm({
        paragraphs: toParagraphs(journey.description ?? ""),
        image: null,
        imagePreview: null,
      });
    }
  }, [journey]);

  const isDirty =
    toPayloadString(form.paragraphs) !== (journey?.description ?? "") ||
    form.image !== null;

  const handleReset = () => {
    if (!journey) return;
    setForm({
      paragraphs: toParagraphs(journey.description ?? ""),
      image: null,
      imagePreview: null,
    });
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      image: file,
      imagePreview: URL.createObjectURL(file),
    }));
    e.target.value = "";
  };

  const triggerFilePick = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.click();
    }
  };

  const handleSave = async () => {
    const fd = new FormData();
    fd.append("description", toPayloadString(form.paragraphs));
    if (form.image) fd.append("image", form.image, form.image.name);
    await updateAboutJourney({ data: fd });
    toast.success("Journey updated successfully!");
  };

  return (
    <div className="bg-[#0a0a0a] text-white px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Manage <span className="text-primary">Our Journey</span>
          </h2>
          <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary bg-primary/10 rounded-full px-3 py-1">
            Admin
          </span>
        </div>
        <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
          Update the journey description and section image. Supports multiple
          paragraphs — joined with ↵ on save.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 py-16 text-neutral-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Left: Description paragraphs ── */}
          <div className="flex flex-col bg-[#121212] border border-white/8 rounded-2xl overflow-hidden">
            {/* Card header */}
            <div className="flex items-center gap-2.5 px-6 pt-5 pb-4 border-b border-white/6">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <MapPin className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold text-neutral-200 block">
                  Description
                </span>
                <span className="text-[11px] text-neutral-600">
                  Multiple paragraphs — joined with ↵ on save
                </span>
              </div>
            </div>

            <div className="px-6 py-5">
              <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider mb-3">
                <MapPin className="w-3.5 h-3.5 text-primary" />
                Journey Description
              </Label>
              <ParagraphEditor
                paragraphs={form.paragraphs}
                onChange={(paragraphs) =>
                  setForm((prev) => ({ ...prev, paragraphs }))
                }
              />
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/6 bg-[#0f0f0f] mt-auto">
              {journey?.updated_at && (
                <span className="text-[11px] text-neutral-600 font-mono hidden sm:block">
                  Updated {new Date(journey.updated_at).toLocaleDateString()}
                </span>
              )}
              <div className="flex items-center gap-2 ml-auto">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleReset}
                  disabled={!isDirty || isUpdating}
                  className="flex items-center gap-2 text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
                >
                  <RefreshCw className="w-3.5 h-3.5" /> Reset
                </Button>
                <Button
                  size="sm"
                  onClick={handleSave}
                  disabled={!isDirty || isUpdating}
                  className="flex items-center gap-2 bg-primary text-black font-semibold hover:bg-primary/80 disabled:opacity-50 text-xs px-5"
                >
                  {isUpdating ? (
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  ) : (
                    <Save className="w-3.5 h-3.5" />
                  )}
                  {isUpdating ? "Saving…" : "Save Changes"}
                </Button>
              </div>
            </div>
          </div>

          {/* ── Right: Image ── */}
          <div className="bg-[#121212] border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 pt-5 pb-4 border-b border-white/6">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <ImageIcon className="w-4 h-4 text-primary" />
              </div>
              <span className="text-sm font-semibold text-neutral-200">
                Section Image
              </span>
            </div>

            <div className="p-6">
              <ImageUploadZone
                preview={form.imagePreview}
                currentUrl={journey?.image ?? null}
                fileRef={fileRef}
                onFilePick={triggerFilePick}
                onFileChange={handleFileChange}
                newFile={form.image}
              />
            </div>

            <div className="flex justify-end px-6 pb-5">
              <Button
                size="sm"
                onClick={handleSave}
                disabled={!form.image || isUpdating}
                className="flex items-center gap-2 bg-primary text-black font-semibold hover:bg-primary/80 disabled:opacity-50 text-xs px-5"
              >
                {isUpdating ? (
                  <Loader2 className="w-3.5 h-3.5 animate-spin" />
                ) : (
                  <Save className="w-3.5 h-3.5" />
                )}
                {isUpdating ? "Saving…" : "Save Image"}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
