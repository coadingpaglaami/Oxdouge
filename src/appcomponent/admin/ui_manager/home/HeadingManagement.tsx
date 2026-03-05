"use client";

import { useState, useEffect } from "react";
import {
  useGetHeadingSectionQuery,
  useUpdateHeadingSectionMutation,
} from "@/api/ui_manager";

// ─── Types ────────────────────────────────────────────────────────────────────

interface HeadingSection {
  id: number;
  heading1: string;
  subheading1: string;
  heading2: string;
  subheading2: string;
  heading3: string;
  subheading3: string;
  heading4: string;
  subheading4: string;
  heading5: string;
  subheading5: string;
  created_at: string;
  updated_at: string;
}

interface HeadingSectionUpdatePayload {
  heading1?: string;
  subheading1?: string;
  heading2?: string;
  subheading2?: string;
  heading3?: string;
  subheading3?: string;
}

interface FormState {
  heading1: string;
  subheading1: string;
  heading2: string;
  subheading2: string;
  heading3: string;
  subheading3: string;
}

// ─── Config ───────────────────────────────────────────────────────────────────

const FIELD_CONFIG: {
  label: string;
  icon: string;
  headingKey: keyof FormState;
  subheadingKey: keyof FormState;
}[] = [
  {
    label: "Why Choose Us",
    icon: "✦",
    headingKey: "heading1",
    subheadingKey: "subheading1",
  },
  {
    label: "Features",
    icon: "◈",
    headingKey: "heading2",
    subheadingKey: "subheading2",
  },
  {
    label: "Customer Says",
    icon: "❝",
    headingKey: "heading3",
    subheadingKey: "subheading3",
  },
];

// ─── Component ────────────────────────────────────────────────────────────────

export const HeadingManagement = () => {
  const { data: headingData, isLoading } = useGetHeadingSectionQuery({});
  const [updateHeadingSection, { isLoading: isUpdating }] =
    useUpdateHeadingSectionMutation();

  const record = (headingData as HeadingSection[] | undefined)?.[0];

  const [form, setForm] = useState<FormState>({
    heading1: "",
    subheading1: "",
    heading2: "",
    subheading2: "",
    heading3: "",
    subheading3: "",
  });
  const [saved, setSaved] = useState(false);

  useEffect(() => {
    if (record) {
      setForm({
        heading1: record.heading1,
        subheading1: record.subheading1,
        heading2: record.heading2,
        subheading2: record.subheading2,
        heading3: record.heading3,
        subheading3: record.subheading3,
      });
    }
  }, [record]);

  const handleChange = (key: keyof FormState, value: string) =>
    setForm((prev) => ({ ...prev, [key]: value }));

  const handleSubmit = async () => {
    if (!record) return;
    const payload: HeadingSectionUpdatePayload = {
      heading1: form.heading1,
      subheading1: form.subheading1,
      heading2: form.heading2,
      subheading2: form.subheading2,
      heading3: form.heading3,
      subheading3: form.subheading3,
    };
    await updateHeadingSection({ id: record.id, data: payload });
    setSaved(true);
    setTimeout(() => setSaved(false), 2500);
  };

  if (isLoading) {
    return (
      <div className="flex items-center gap-3 p-10 text-slate-600">
        <span className="h-5 w-5 rounded-full border-2 border-slate-700 border-t-indigo-500 animate-spin" />
        <span className="text-sm">Loading headings…</span>
      </div>
    );
  }

  return (
    <div className="bg-slate-900 rounded-2xl border border-slate-800 shadow-sm overflow-hidden">
      {/* ── Header ── */}
      <div className="flex flex-wrap items-start justify-between gap-4 px-8 py-6">
        <div className="space-y-1">
          <span className="inline-flex items-center rounded-full bg-indigo-950 px-3 py-1 text-[11px] font-semibold uppercase tracking-widest text-indigo-400">
            Homepage Sections
          </span>
          <h2 className="text-xl font-bold tracking-tight text-slate-100">
            Homepage Headings
          </h2>
          <p className="text-sm text-slate-400">
            Manage the heading &amp; subheading copy for your main homepage
            sections.
          </p>
        </div>

        <button
          onClick={handleSubmit}
          disabled={isUpdating}
          className={[
            "rounded-xl px-5 py-2.5 text-sm font-semibold transition-all duration-200",
            "focus:outline-none focus:ring-2 focus:ring-offset-2",
            saved
              ? "bg-primary text-black focus:ring-primary"
              : isUpdating
                ? "cursor-not-allowed bg-slate-600 text-slate-400"
                : "bg-primary text-black hover:brightness-110 focus:ring-primary",
          ].join(" ")}
        >
          {isUpdating ? "Saving…" : saved ? "✓ Saved" : "Save Changes"}
        </button>
      </div>

      {/* ── Section Rows ── */}
      <div className="divide-y divide-slate-800">
        {FIELD_CONFIG.map((field, idx) => (
          <div
            key={field.headingKey}
            className="group px-8 py-6 transition-colors hover:bg-slate-800/50"
          >
            {/* Row label */}
            <div className="mb-4 flex items-center gap-2.5">
              <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-slate-800 text-xs font-bold text-slate-400 transition-colors group-hover:bg-indigo-950 group-hover:text-indigo-400">
                {String(idx + 1).padStart(2, "0")}
              </span>
              <span className="text-sm font-semibold text-slate-200">
                {field.label}
              </span>
              <span className="ml-auto text-base text-slate-700 transition-colors group-hover:text-indigo-600 select-none">
                {field.icon}
              </span>
            </div>

            {/* Inputs */}
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              {/* Heading */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Heading
                </label>
                <input
                  type="text"
                  value={form[field.headingKey]}
                  onChange={(e) =>
                    handleChange(field.headingKey, e.target.value)
                  }
                  placeholder={`${field.label} heading…`}
                  className="rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900"
                />
              </div>

              {/* Subheading */}
              <div className="flex flex-col gap-1.5">
                <label className="text-[11px] font-semibold uppercase tracking-widest text-slate-500">
                  Subheading
                </label>
                <textarea
                  rows={2}
                  value={form[field.subheadingKey]}
                  onChange={(e) =>
                    handleChange(field.subheadingKey, e.target.value)
                  }
                  placeholder={`${field.label} subheading…`}
                  className="resize-y rounded-lg border border-slate-700 bg-slate-800 px-3.5 py-2.5 text-sm leading-relaxed text-slate-100 placeholder:text-slate-500 outline-none transition focus:border-indigo-500 focus:ring-2 focus:ring-indigo-900"
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Footer ── */}
      {record && (
        <div className="border-t border-slate-800 bg-slate-900/60 px-8 py-3 text-right">
          <span className="text-xs text-slate-500">
            Last updated:{" "}
            {new Date(record.updated_at).toLocaleString("en-US", {
              dateStyle: "medium",
              timeStyle: "short",
            })}
          </span>
        </div>
      )}
    </div>
  );
};
