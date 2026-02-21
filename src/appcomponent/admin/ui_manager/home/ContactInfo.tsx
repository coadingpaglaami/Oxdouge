"use client";

import { useState, useEffect } from "react";
import {
  useGetContactInfoQuery,
  useUpdateContactInfoMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Mail, Phone, MapPin, Save, Loader2, RefreshCw } from "lucide-react";

/* ─── Types ──────────────────────────────────────────────────────── */
interface ContactInfoData {
  email: string;
  contact_number: string;
  location: string;
  created_at: string;
  updated_at: string;
}

interface FormState {
  email: string;
  contact_number: string;
  location: string;
}

/* ─── Field config — drives the form declaratively ──────────────── */
const FIELDS: {
  key: keyof FormState;
  label: string;
  placeholder: string;
  type: string;
  Icon: React.ElementType;
}[] = [
  {
    key: "email",
    label: "Email Address",
    placeholder: "admin@example.com",
    type: "email",
    Icon: Mail,
  },
  {
    key: "contact_number",
    label: "Contact Number",
    placeholder: "+8801710000000",
    type: "tel",
    Icon: Phone,
  },
  {
    key: "location",
    label: "Location",
    placeholder: "Dhaka, Bangladesh",
    type: "text",
    Icon: MapPin,
  },
];

/* ─── Component ──────────────────────────────────────────────────── */
export const ContactInfo = () => {
  // getContactInfo takes no args
  const { data, isLoading } = useGetContactInfoQuery({});
  const [updateContactInfo, { isLoading: isUpdating }] =
    useUpdateContactInfoMutation();

  const contact = data as ContactInfoData | undefined;

  const [form, setForm] = useState<FormState>({
    email: "",
    contact_number: "",
    location: "",
  });

  // Sync form when data loads
  useEffect(() => {
    if (contact) {
      setForm({
        email: contact.email ?? "",
        contact_number: contact.contact_number ?? "",
        location: contact.location ?? "",
      });
    }
  }, [contact]);

  const isDirty =
    form.email !== (contact?.email ?? "") ||
    form.contact_number !== (contact?.contact_number ?? "") ||
    form.location !== (contact?.location ?? "");

  const handleReset = () => {
    if (!contact) return;
    setForm({
      email: contact.email ?? "",
      contact_number: contact.contact_number ?? "",
      location: contact.location ?? "",
    });
  };

  const handleSave = async () => {
    /**
     * No file fields — send as JSON.
     * updateContactInfo slice: query: ({ data }) => ({ body: data })
     * So we pass { data: formPayload } and the body goes as JSON automatically
     * via fetchBaseQuery (default Content-Type: application/json).
     */
    await updateContactInfo({
      data: {
        email: form.email,
        contact_number: form.contact_number,
        location: form.location,
      },
    });
    toast.success("Contact info updated!");
  };

  return (
    <div className="bg-[#0a0a0a] text-white px-6 py-10">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 flex-wrap mb-2">
          <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
            Manage <span className="text-primary">Contact Info</span>
          </h2>
          <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary bg-primary/10 rounded-full px-3 py-1">
            Admin
          </span>
        </div>
        <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
          Update the contact details shown across the site.
        </p>
      </div>

      {/* Card */}
      <div className="max-w-xl bg-[#121212] border border-white/[0.08] rounded-2xl overflow-hidden">
        {/* Card header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.06]">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-primary/15 border border-primary/30 flex items-center justify-center">
              <Phone className="w-4 h-4 text-primary" />
            </div>
            <span className="text-sm font-semibold text-neutral-200">
              Contact Details
            </span>
          </div>
          {contact?.updated_at && (
            <span className="text-[11px] text-neutral-600 font-mono hidden sm:block">
              Updated {new Date(contact.updated_at).toLocaleDateString()}
            </span>
          )}
        </div>

        {/* Form body */}
        <div className="p-6">
          {isLoading ? (
            <div className="flex items-center justify-center gap-3 py-10 text-neutral-500">
              <Loader2 className="w-4 h-4 animate-spin" />
              Loading…
            </div>
          ) : (
            <div className="flex flex-col gap-5">
              {FIELDS.map(({ key, label, placeholder, type, Icon }) => (
                <div key={key} className="flex flex-col gap-1.5">
                  <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                    {label}
                  </Label>
                  <div className="relative">
                    <Icon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-neutral-500 pointer-events-none" />
                    <Input
                      type={type}
                      value={form[key]}
                      onChange={(e) =>
                        setForm((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                      placeholder={placeholder}
                      className="pl-9 bg-[#1a1a1a] border-white/[0.08] text-white placeholder-neutral-600 focus-visible:ring-primary focus-visible:border-primary transition-colors"
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Footer actions */}
        {!isLoading && (
          <div className="flex items-center justify-between gap-3 px-6 py-4 border-t border-white/[0.06] bg-[#0f0f0f]">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleReset}
              disabled={!isDirty || isUpdating}
              className="flex items-center gap-2 text-neutral-400 hover:text-white hover:bg-white/5 disabled:opacity-30 text-xs"
            >
              <RefreshCw className="w-3.5 h-3.5" />
              Reset
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
        )}
      </div>
    </div>
  );
};
