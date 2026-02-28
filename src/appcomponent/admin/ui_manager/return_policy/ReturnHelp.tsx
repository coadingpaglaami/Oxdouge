"use client";

import { useState, useEffect } from "react";
import {
  useGetReturnHelpQuery,
  useUpdateReturnHelpMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Pencil,
  X,
  Check,
  Mail,
  Phone,
  Clock,
  MapPin,
  HelpCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ReturnHelp {
  id: number;
  title: string;
  heading1: string;
  email: string;
  phone: string;
  hours: string;
  heading2: string;
  address_line1: string;
  address_line2: string;
  city_state_zip: string;
  updated_at: string;
}

// ─── Field Row ────────────────────────────────────────────────────────────────

const FieldRow = ({
  label,
  value,
  icon,
  editing,
  inputValue,
  onChange,
  placeholder,
}: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  editing: boolean;
  inputValue: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) => (
  <div className="flex flex-col gap-1.5">
    <label className="text-[#aaa] text-xs font-semibold uppercase tracking-widest flex items-center gap-1.5">
      {icon}
      {label}
    </label>
    {editing ? (
      <Input
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder ?? label}
        className="bg-[#121212] border-[#2A2A2A] text-white placeholder:text-[#555] rounded-lg focus-visible:ring-[#FFD345] focus-visible:ring-1 focus-visible:border-[#FFD345] h-9"
      />
    ) : (
      <p className="text-white text-sm leading-relaxed m-0 py-2 px-3 bg-[#181818] rounded-lg border border-[#222] min-h-[36px]">
        {value || <span className="text-[#444] italic">Not set</span>}
      </p>
    )}
  </div>
);

// ─── Section Divider ──────────────────────────────────────────────────────────

const SectionHeading = ({
  value,
  editing,
  inputValue,
  onChange,
}: {
  value: string;
  editing: boolean;
  inputValue: string;
  onChange: (v: string) => void;
}) => (
  <div className="flex items-center gap-3 mb-1">
    <span className="w-1 h-5 rounded-full bg-[#FFD345] shrink-0" />
    {editing ? (
      <Input
        value={inputValue}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Section heading..."
        className="bg-[#121212] border-[#2A2A2A] text-white placeholder:text-[#555] rounded-lg focus-visible:ring-[#FFD345] focus-visible:ring-1 focus-visible:border-[#FFD345] h-8 text-sm font-semibold flex-1"
      />
    ) : (
      <h4 className="text-white font-semibold text-sm m-0">{value}</h4>
    )}
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const ReturnHelpSkeleton = () => (
  <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-6 py-5 flex flex-col gap-4">
    <Skeleton className="h-4 w-1/4 bg-[#2A2A2A]" />
    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
      {Array.from({ length: 6 }).map((_, i) => (
        <div key={i} className="flex flex-col gap-1.5">
          <Skeleton className="h-3 w-1/3 bg-[#2A2A2A]" />
          <Skeleton className="h-9 w-full bg-[#2A2A2A]" />
        </div>
      ))}
    </div>
  </div>
);

// ─── Main Component ───────────────────────────────────────────────────────────

export const ReturnHelp = () => {
  const { data, isLoading, isError } = useGetReturnHelpQuery();
  const [updateReturnHelp, { isLoading: isUpdating }] =
    useUpdateReturnHelpMutation();

  const [editing, setEditing] = useState(false);
  const [form, setForm] = useState<Omit<ReturnHelp, "id" | "updated_at">>({
    title: "",
    heading1: "",
    email: "",
    phone: "",
    hours: "",
    heading2: "",
    address_line1: "",
    address_line2: "",
    city_state_zip: "",
  });

  // Sync form when data loads
  useEffect(() => {
    if (data) {
      setForm({
        title: data.title,
        heading1: data.heading1,
        email: data.email,
        phone: data.phone,
        hours: data.hours,
        heading2: data.heading2,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city_state_zip: data.city_state_zip,
      });
    }
  }, [data]);

  const handleField = (field: keyof typeof form) => (value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleCancel = () => {
    if (data) {
      setForm({
        title: data.title,
        heading1: data.heading1,
        email: data.email,
        phone: data.phone,
        hours: data.hours,
        heading2: data.heading2,
        address_line1: data.address_line1,
        address_line2: data.address_line2,
        city_state_zip: data.city_state_zip,
      });
    }
    setEditing(false);
  };

  const handleSave = async () => {
    if (!data) return;
    try {
      await updateReturnHelp({ id: data.id, ...form }).unwrap();
      setEditing(false);
      toast.success("Return help info has been updated successfully.");
    } catch {
      toast.error("Failed to update return help. Please try again.");
    }
  };

  if (isLoading) return <ReturnHelpSkeleton />;

  if (isError)
    return (
      <div className="text-center py-10 text-red-400 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A]">
        <p className="m-0 text-sm">
          Failed to load return help info. Please try again.
        </p>
      </div>
    );

  return (
    <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-6 py-5 flex flex-col gap-5 my-6">
      {/* Header */}
      <div className="flex justify-between items-start gap-3">
        <div className="flex flex-col gap-0.5">
          <div className="flex items-center gap-2">
            <HelpCircle size={16} className="text-[#FFD345]" />
            {editing ? (
              <Input
                value={form.title}
                onChange={(e) => handleField("title")(e.target.value)}
                placeholder="Section title..."
                className="bg-[#121212] border-[#2A2A2A] text-white placeholder:text-[#555] rounded-lg focus-visible:ring-[#FFD345] focus-visible:ring-1 focus-visible:border-[#FFD345] h-8 font-bold text-sm w-64"
              />
            ) : (
              <h3 className="text-white font-bold text-[15px] m-0">
                {data?.title || "Return Help"}
              </h3>
            )}
          </div>
          {data?.updated_at && (
            <p className="text-[#555] text-xs m-0 pl-6">
              Last updated{" "}
              {new Date(data.updated_at).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          )}
        </div>

        <div className="flex gap-2 shrink-0">
          {editing ? (
            <>
              <button
                onClick={handleCancel}
                className="bg-transparent border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-[#888] hover:border-[#444] hover:text-white transition-all duration-150 flex items-center gap-1.5 text-sm cursor-pointer"
              >
                <X size={13} />
                Cancel
              </button>
              <button
                onClick={handleSave}
                disabled={isUpdating}
                className="bg-[#FFD345] border-none rounded-lg px-3 py-1.5 text-[#121212] font-bold hover:bg-[#e6be30] transition-all duration-150 flex items-center gap-1.5 text-sm cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <Check size={13} />
                {isUpdating ? "Saving..." : "Save"}
              </button>
            </>
          ) : (
            <button
              onClick={() => setEditing(true)}
              className="bg-transparent border border-[#2A2A2A] rounded-lg px-3 py-1.5 text-[#888] hover:border-[#FFD345] hover:text-[#FFD345] transition-all duration-150 flex items-center gap-1.5 text-sm cursor-pointer"
            >
              <Pencil size={13} />
              Edit
            </button>
          )}
        </div>
      </div>

      <div className="h-px bg-[#242424]" />

      {/* Section 1 — Contact */}
      <div className="flex flex-col gap-3">
        <SectionHeading
          value={form.heading1}
          editing={editing}
          inputValue={form.heading1}
          onChange={handleField("heading1")}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pl-4">
          <FieldRow
            label="Email"
            value={data?.email ?? ""}
            icon={<Mail size={11} />}
            editing={editing}
            inputValue={form.email}
            onChange={handleField("email")}
            placeholder="support@example.com"
          />
          <FieldRow
            label="Phone"
            value={data?.phone ?? ""}
            icon={<Phone size={11} />}
            editing={editing}
            inputValue={form.phone}
            onChange={handleField("phone")}
            placeholder="+1 (800) 000-0000"
          />
          <FieldRow
            label="Hours"
            value={data?.hours ?? ""}
            icon={<Clock size={11} />}
            editing={editing}
            inputValue={form.hours}
            onChange={handleField("hours")}
            placeholder="Mon–Fri, 9am–5pm"
          />
        </div>
      </div>

      <div className="h-px bg-[#242424]" />

      {/* Section 2 — Address */}
      <div className="flex flex-col gap-3">
        <SectionHeading
          value={form.heading2}
          editing={editing}
          inputValue={form.heading2}
          onChange={handleField("heading2")}
        />
        <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 pl-4">
          <FieldRow
            label="Address Line 1"
            value={data?.address_line1 ?? ""}
            icon={<MapPin size={11} />}
            editing={editing}
            inputValue={form.address_line1}
            onChange={handleField("address_line1")}
            placeholder="123 Main St"
          />
          <FieldRow
            label="Address Line 2"
            value={data?.address_line2 ?? ""}
            editing={editing}
            inputValue={form.address_line2}
            onChange={handleField("address_line2")}
            placeholder="Suite 100"
          />
          <FieldRow
            label="City, State, ZIP"
            value={data?.city_state_zip ?? ""}
            editing={editing}
            inputValue={form.city_state_zip}
            onChange={handleField("city_state_zip")}
            placeholder="New York, NY 10001"
          />
        </div>
      </div>
    </div>
  );
};
