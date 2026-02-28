"use client";

import { useState } from "react";
import Link from "next/link";
import { Facebook, Instagram, Twitter, Pencil, X, Check, Loader2 } from "lucide-react";
import {
  useGetSocialLinksQuery,
  useUpdateSocialLinksMutation,
} from "@/api/ui_manager";

// ── Types ─────────────────────────────────────────────────────────────────────

// Matches the API interface exactly — id is a separate number, not part of SocialLinks fields
interface SocialLinks {
  facebook: string;
  instagram: string;
  x: string;
}

interface SocialLinksResponse extends SocialLinks {
  id: number;
}

// ── Platform config ───────────────────────────────────────────────────────────

const PLATFORMS: {
  key: keyof SocialLinks;
  label: string;
  Icon: React.ElementType;
  placeholder: string;
  brandColor: string;
}[] = [
  {
    key: "facebook",
    label: "Facebook",
    Icon: Facebook,
    placeholder: "https://facebook.com/yourpage",
    brandColor: "#1877F2",
  },
  {
    key: "instagram",
    label: "Instagram",
    Icon: Instagram,
    placeholder: "https://instagram.com/yourhandle",
    brandColor: "#E1306C",
  },
  {
    key: "x",
    label: "X (Twitter)",
    Icon: Twitter,
    placeholder: "https://x.com/yourhandle",
    brandColor: "#e2e8f0",
  },
];

// ── Component ─────────────────────────────────────────────────────────────────

export const SocialLinks = () => {
  const { data: socialLinks, isLoading, isError } = useGetSocialLinksQuery();
  const [updateSocialLinks, { isLoading: isUpdating }] =
    useUpdateSocialLinksMutation();

  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState<Partial<SocialLinks>>({});

  // Cast to our extended response type that includes id
  const data = socialLinks as SocialLinksResponse | undefined;

  const openEdit = () => {
    if (!data) return;
    setForm({
      facebook: data.facebook,
      instagram: data.instagram,
      x: data.x,
    });
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setIsEditing(false);
    setForm({});
  };

  const handleSave = async () => {
    if (!data) return;
    try {
      await updateSocialLinks({ id: data.id, ...form }).unwrap();
      setIsEditing(false);
    } catch (err) {
      console.error("Failed to update social links:", err);
    }
  };

  // ── Loading skeleton ───────────────────────────────────────────────────────

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 animate-pulse">
        {[...Array(3)].map((_, i) => (
          <div key={i} className="w-9 h-9 rounded-xl bg-white/10" />
        ))}
      </div>
    );
  }

  if (isError || !data) return null;

  // ── Edit mode ─────────────────────────────────────────────────────────────

  if (isEditing) {
    return (
      <div className="flex flex-col gap-3 p-4 rounded-xl border border-[#FFD345]/30 bg-white/[0.04] w-full max-w-sm">
        {/* Header */}
        <div className="flex items-center justify-between mb-1">
          <span className="text-xs font-semibold text-[#FFD345] uppercase tracking-widest">
            Edit Social Links
          </span>
          <div className="flex gap-1.5">
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
            <button
              onClick={cancelEdit}
              disabled={isUpdating}
              className="flex items-center justify-center w-7 h-7 rounded-md bg-white/10 hover:bg-white/20 text-white transition-colors duration-200 disabled:opacity-50"
              title="Cancel"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Fields */}
        {PLATFORMS.map(({ key, label, Icon, placeholder, brandColor }) => (
          <div key={key} className="flex items-center gap-3">
            <div
              className="flex items-center justify-center w-8 h-8 rounded-lg shrink-0"
              style={{ backgroundColor: `${brandColor}22` }}
            >
              <Icon
                className="w-4 h-4"
                style={{ color: brandColor }}
              />
            </div>
            <div className="flex-1 relative">
              <input
                type="url"
                value={(form[key] as string) ?? ""}
                onChange={(e) =>
                  setForm((prev) => ({ ...prev, [key]: e.target.value }))
                }
                placeholder={placeholder}
                className="w-full bg-white/5 border border-white/10 focus:border-[#FFD345]/40 rounded-lg px-3 py-1.5 text-white text-xs outline-none transition-colors duration-200 placeholder:text-gray-600"
              />
            </div>
          </div>
        ))}
      </div>
    );
  }

  // ── View mode ─────────────────────────────────────────────────────────────

  return (
    <div className="group flex items-center gap-3">
      {PLATFORMS.map(({ key, label, Icon, brandColor }) => {
        const url = data[key];
        if (!url) return null;
        return (
          <Link
            key={key}
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            title={label}
            className="group/icon relative flex items-center justify-center w-9 h-9 rounded-xl border border-white/5 bg-white/[0.03] hover:border-white/20 transition-all duration-200 hover:scale-105"
          >
            <Icon
              className="w-4 h-4 text-gray-400 transition-colors duration-200"
              style={
                {
                  "--tw-icon-color": brandColor,
                } as React.CSSProperties
              }
            />
            {/* Brand color overlay on hover via absolute sibling */}
            <span
              className="absolute inset-0 rounded-xl opacity-0 group-hover/icon:opacity-100 transition-opacity duration-200 pointer-events-none"
              style={{ boxShadow: `inset 0 0 0 1px ${brandColor}33` }}
            />
          </Link>
        );
      })}

      {/* Edit trigger */}
      <button
        onClick={openEdit}
        className="flex items-center justify-center w-7 h-7 rounded-lg bg-white/0 group-hover:bg-white/8 hover:!bg-[#FFD345]/20 text-transparent group-hover:text-gray-500 hover:!text-[#FFD345] transition-all duration-200"
        title="Edit social links"
      >
        <Pencil className="w-3 h-3" />
      </button>
    </div>
  );
};