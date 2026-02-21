"use client";

import { useState, useEffect, useRef } from "react";
import Image from "next/image";
import {
  useGetAboutStoryQuery,
  useUpdateAboutStoryMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  BookOpen,
  Target,
  Eye,
  ImageIcon,
  Save,
  Loader2,
  RefreshCw,
  Pencil,
  Plus,
  Trash2,
} from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────── */
interface AboutStoryData {
  story_description: string;
  mission_description: string;
  vision_description: string;
  image: string | null;
  created_at: string;
  updated_at: string;
}

/** Each text field is stored as an array of paragraph strings */
interface FormState {
  story_paragraphs: string[];
  mission_paragraphs: string[];
  vision_paragraphs: string[];
  image: File | null;
  imagePreview: string | null;
}

type ParagraphField =
  | "story_paragraphs"
  | "mission_paragraphs"
  | "vision_paragraphs";

/* ─── Helpers ────────────────────────────────────────────────────── */

/** Split a \n-delimited string into non-empty paragraph array */
const toParagraphs = (text: string): string[] => {
  const parts = text.split("\n").map((p) => p.trim());
  return parts.length > 0 ? parts : [""];
};

/** Join paragraphs back to \n-delimited string for the payload */
const toPayloadString = (paragraphs: string[]): string =>
  paragraphs.filter((p) => p.trim() !== "").join("\n");

const DEFAULT_PARAGRAPHS = [""];

/* ─── ParagraphEditor — module scope to prevent focus loss ──────── */
interface ParagraphEditorProps {
  fieldKey: ParagraphField;
  label: string;
  Icon: React.ElementType;
  accent: string;
  paragraphs: string[];
  onChange: (field: ParagraphField, paragraphs: string[]) => void;
}

const ParagraphEditor = ({
  fieldKey,
  label,
  Icon,
  accent,
  paragraphs,
  onChange,
}: ParagraphEditorProps) => {
  const update = (index: number, value: string) => {
    const next = [...paragraphs];
    next[index] = value;
    onChange(fieldKey, next);
  };

  const addParagraph = () => onChange(fieldKey, [...paragraphs, ""]);

  const removeParagraph = (index: number) => {
    if (paragraphs.length === 1) {
      onChange(fieldKey, [""]);
      return;
    }
    onChange(
      fieldKey,
      paragraphs.filter((_, i) => i !== index),
    );
  };

  return (
    <div className="flex flex-col gap-3">
      {/* Section label */}
      <Label className="flex items-center gap-1.5 text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        <Icon className={`w-3.5 h-3.5 ${accent}`} />
        {label}
      </Label>

      {/* Paragraphs */}
      <div className="flex flex-col gap-2.5">
        {paragraphs.map((para, index) => (
          <div key={index} className="flex gap-2 items-start group">
            {/* Index badge */}
            <div className="shrink-0 w-6 h-7 flex items-center justify-center mt-[9px]">
              <span className="text-[10px] font-bold text-neutral-600 font-mono">
                {String(index + 1).padStart(2, "0")}
              </span>
            </div>

            <Textarea
              value={para}
              onChange={(e) => update(index, e.target.value)}
              placeholder={`Paragraph ${index + 1}…`}
              rows={3}
              className="flex-1 bg-[#1a1a1a] border-white/8 text-white placeholder-neutral-600 focus-visible:ring-primary focus-visible:border-primary resize-none transition-colors text-sm"
            />

            {/* Remove button */}
            <button
              type="button"
              onClick={() => removeParagraph(index)}
              className="shrink-0 mt-[9px] w-7 h-7 flex items-center justify-center rounded-lg text-neutral-700 hover:text-red-400 hover:bg-red-500/10 transition-colors opacity-0 group-hover:opacity-100"
              title="Remove paragraph"
            >
              <Trash2 className="w-3.5 h-3.5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add paragraph */}
      <button
        type="button"
        onClick={addParagraph}
        className="flex items-center gap-2 text-xs text-neutral-500 hover:text-primary border border-dashed border-white/10 hover:border-primary/40 rounded-lg px-3 py-2 transition-all w-full justify-center"
      >
        <Plus className="w-3.5 h-3.5" />
        Add paragraph
      </button>
    </div>
  );
};

/* ─── Field config ───────────────────────────────────────────────── */
const TEXT_FIELDS: {
  paragraphKey: ParagraphField;
  payloadKey: keyof Pick<
    AboutStoryData,
    "story_description" | "mission_description" | "vision_description"
  >;
  label: string;
  Icon: React.ElementType;
  accent: string;
}[] = [
  {
    paragraphKey: "story_paragraphs",
    payloadKey: "story_description",
    label: "Our Story",
    Icon: BookOpen,
    accent: "text-blue-400",
  },
  {
    paragraphKey: "mission_paragraphs",
    payloadKey: "mission_description",
    label: "Our Mission",
    Icon: Target,
    accent: "text-emerald-400",
  },
  {
    paragraphKey: "vision_paragraphs",
    payloadKey: "vision_description",
    label: "Our Vision",
    Icon: Eye,
    accent: "text-violet-400",
  },
];

/* ─── ImageUploadZone — module scope ─────────────────────────────── */
interface ImageUploadZoneProps {
  preview: string | null;
  currentUrl: string | null;
  fileRef: React.RefObject<HTMLInputElement | null>;
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
              alt="Story section image"
              fill
              className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            />
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/55 transition-all duration-300 flex items-center justify-center">
              <div className="opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center gap-2 bg-black/70 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2.5 rounded-xl border border-white/15">
                <Pencil className="w-4 h-4" /> Click to replace
              </div>
            </div>
            <div className="absolute bottom-3 left-3 bg-black/60 backdrop-blur-sm text-[11px] text-neutral-300 font-medium px-2.5 py-1 rounded-lg border border-white/10">
              Story Image
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
export const OurStoryManagement = () => {
  const { data, isLoading } = useGetAboutStoryQuery({});
  const [updateAboutStory, { isLoading: isUpdating }] =
    useUpdateAboutStoryMutation();

  const story = data as AboutStoryData | undefined;
  const fileRef = useRef<HTMLInputElement>(null);

  const [form, setForm] = useState<FormState>({
    story_paragraphs: DEFAULT_PARAGRAPHS,
    mission_paragraphs: DEFAULT_PARAGRAPHS,
    vision_paragraphs: DEFAULT_PARAGRAPHS,
    image: null,
    imagePreview: null,
  });

  // Seed form — split existing \n-delimited strings into paragraph arrays
  useEffect(() => {
    if (story) {
      setForm({
        story_paragraphs: toParagraphs(story.story_description ?? ""),
        mission_paragraphs: toParagraphs(story.mission_description ?? ""),
        vision_paragraphs: toParagraphs(story.vision_description ?? ""),
        image: null,
        imagePreview: null,
      });
    }
  }, [story]);

  const isDirty =
    toPayloadString(form.story_paragraphs) !==
      (story?.story_description ?? "") ||
    toPayloadString(form.mission_paragraphs) !==
      (story?.mission_description ?? "") ||
    toPayloadString(form.vision_paragraphs) !==
      (story?.vision_description ?? "") ||
    form.image !== null;

  const handleParagraphChange = (
    field: ParagraphField,
    paragraphs: string[],
  ) => {
    setForm((prev) => ({ ...prev, [field]: paragraphs }));
  };

  const handleReset = () => {
    if (!story) return;
    setForm({
      story_paragraphs: toParagraphs(story.story_description ?? ""),
      mission_paragraphs: toParagraphs(story.mission_description ?? ""),
      vision_paragraphs: toParagraphs(story.vision_description ?? ""),
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
    // Join paragraphs with \n before sending
    fd.append("story_description", toPayloadString(form.story_paragraphs));
    fd.append("mission_description", toPayloadString(form.mission_paragraphs));
    fd.append("vision_description", toPayloadString(form.vision_paragraphs));
    if (form.image) fd.append("image", form.image, form.image.name);
    await updateAboutStory({ data: fd });
    toast.success("Story updated successfully!");
  };

  return (
    <div className="bg-[#0a0a0a] text-white px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Manage <span className="text-primary">Our Story</span>
          </h2>
          <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary bg-primary/10 rounded-full px-3 py-1">
            Admin
          </span>
        </div>
        <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
          Update the story, mission, vision and section image. Each field
          supports multiple paragraphs.
        </p>
      </div>

      {isLoading ? (
        <div className="flex items-center gap-3 py-16 text-neutral-500">
          <Loader2 className="w-4 h-4 animate-spin" /> Loading…
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-start">
          {/* ── Left: Text fields ── */}
          <div className="flex flex-col bg-[#121212] border border-white/8 rounded-2xl overflow-hidden">
            <div className="flex items-center gap-2.5 px-6 pt-5 pb-4 border-b border-white/6">
              <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
                <BookOpen className="w-4 h-4 text-primary" />
              </div>
              <div>
                <span className="text-sm font-semibold text-neutral-200 block">
                  Text Content
                </span>
                <span className="text-[11px] text-neutral-600">
                  Each section supports multiple paragraphs — joined with ↵ on
                  save
                </span>
              </div>
            </div>

            <div className="px-6 py-5 flex flex-col gap-7">
              {TEXT_FIELDS.map(({ paragraphKey, label, Icon, accent }) => (
                <ParagraphEditor
                  key={paragraphKey}
                  fieldKey={paragraphKey}
                  label={label}
                  Icon={Icon}
                  accent={accent}
                  paragraphs={form[paragraphKey]}
                  onChange={handleParagraphChange}
                />
              ))}
            </div>

            {/* Footer */}
            <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/6 bg-[#0f0f0f]">
              {story?.updated_at && (
                <span className="text-[11px] text-neutral-600 font-mono hidden sm:block">
                  Updated {new Date(story.updated_at).toLocaleDateString()}
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
                currentUrl={story?.image ?? null}
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
