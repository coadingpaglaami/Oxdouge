'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import {
  useAddWhyChooseMutation,
  useDeleteWhyChooseMutation,
  useGetWhyChooseQuery,
  useUpdateWhyChooseMutation,
} from '@/api/ui_manager';
import { toast } from 'sonner';

/* ─── Types ─────────────────────────────────────────────────────── */
interface WhyChooseItem {
  id: number;
  description: string;
  card_heading: string | null;
  card_description: string | null;
  icon: string | null;
  created_at: string;
}

export interface FormState {
  description: string;
  card_heading: string;
  card_description: string;
  icon: File | null;
  iconPreview?: string | null;
}

/* ─── Constants ─────────────────────────────────────────────────── */
const DEFAULT_FORM: FormState = {
  description: '',
  card_heading: '',
  card_description: '',
  icon: null,
  iconPreview: null,
};

/* ─── Sub-components ────────────────────────────────────────────── */
const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

const IconPlaceholder = () => (
  <svg className="w-6 h-6 text-neutral-600" viewBox="0 0 24 24" fill="none">
    <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
    <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
    <path
      d="M3 15l5-5 4 4 3-3 6 6"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </svg>
);

/* ─── Main Component ─────────────────────────────────────────────── */
export const WhyChooseManagement = () => {
  const { data = [], isLoading: isGetLoading } = useGetWhyChooseQuery();
  const [addWhyChoose, { isLoading: isAdding }] = useAddWhyChooseMutation();
  const [updateWhyChoose, { isLoading: isUpdating }] = useUpdateWhyChooseMutation();
  const [deleteWhyChoose, { isLoading: isDeleting }] = useDeleteWhyChooseMutation();

  const [modal, setModal] = useState<'add' | 'edit' | null>(null);
  const [editItem, setEditItem] = useState<WhyChooseItem | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const [deleteTarget, setDeleteTarget] = useState<WhyChooseItem | null>(null);
  const fileRef = useRef<HTMLInputElement>(null);

  /* ── Form helpers ── */
  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setEditItem(null);
    setModal('add');
  };

  const openEdit = (item: WhyChooseItem) => {
    setEditItem(item);
    setForm({
      description: item.description ?? '',
      card_heading: item.card_heading ?? '',
      card_description: item.card_description ?? '',
      icon: null,
      iconPreview: item.icon ?? null,
    });
    setModal('edit');
  };

  const closeModal = () => {
    setModal(null);
    setEditItem(null);
    setForm(DEFAULT_FORM);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      icon: file,
      iconPreview: URL.createObjectURL(file),
    }));
  };


const handleAdd = async () => {
  await addWhyChoose({
    description: form.description,
    card_heading: form.card_heading,
    card_description: form.card_description,
    icon: form.icon,
  });
  toast.success('Card added successfully!');
  closeModal();
};

 const handleUpdate = async () => {
  if (!editItem) return;
  await updateWhyChoose({
    id: editItem.id,
    cardData: {
      description: form.description,
      card_heading: form.card_heading,
      card_description: form.card_description,
      icon: form.icon,
    },
  });
  toast.success('Card updated successfully!');
  closeModal();
};

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteWhyChoose(deleteTarget.id);
    toast.success('Card deleted successfully!');
    setDeleteTarget(null);
  };

  const items = data as unknown as WhyChooseItem[];

  return (
    <>
      {/* ══════════════════════════ PAGE ══════════════════════════ */}
      <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">

        {/* Hero — mirrors the WhyChoose front-end heading style */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Manage <span className="text-primary">Why Choose</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary bg-primary/10 rounded-full px-3 py-1">
              Admin
            </span>
          </div>
          <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
            Add, edit, or remove the feature cards shown in the &ldquo;Why Choose Overland Tech&rdquo; section.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-neutral-500">
            {items.length} card{items.length !== 1 ? 's' : ''}
          </span>
          <button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-black font-semibold text-sm px-4 py-2.5 rounded-lg hover:bg-primary/80 transition-colors"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path d="M8 2v12M2 8h12" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
            </svg>
            Add Card
          </button>
        </div>

        {/* Grid */}
        {isGetLoading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-neutral-500">
            <Spinner /> Loading cards…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-neutral-600">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.2" />
              <path d="M12 8v4M12 16h.01" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
            </svg>
            <p className="text-sm">No cards yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex flex-col bg-[#121212] rounded-2xl p-5 border border-white/8 hover:border-primary hover:scale-[1.02] transition-all duration-300"
              >
                {/* Icon thumbnail */}
                <div className="w-14 h-14 flex items-center justify-center rounded-xl mb-4 bg-[#1e1e1e] border border-white/8 overflow-hidden shrink-0">
                  {item.icon ? (
                    <Image
                      src={item.icon}
                      alt={item.card_heading ?? 'icon'}
                      width={40}
                      height={40}
                      className="w-8 h-8 object-cover rounded-lg"
                    />
                  ) : (
                    <IconPlaceholder />
                  )}
                </div>

                {/* Text */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-primary font-bold text-sm mb-1 truncate">
                    {item.card_heading ?? (
                      <span className="text-neutral-600 italic font-normal">No heading</span>
                    )}
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed line-clamp-2">
                    {item.card_description ?? (
                      <span className="italic">No description</span>
                    )}
                  </p>
                  <p className="text-neutral-700 text-[11px] mt-2 font-mono">#{item.id}</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 mt-4 pt-4 border-t border-white/5">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-300 border border-white/10 rounded-lg py-2 hover:bg-white/5 hover:border-white/20 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 border border-red-500/20 rounded-lg py-2 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                  >
                    <svg className="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none">
                      <polyline points="3 6 5 6 21 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                      <path d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════ ADD / EDIT MODAL ══════════════════ */}
      {modal && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={closeModal}
        >
          <div
            className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-lg shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-6 pb-0">
              <h3 className="text-lg font-bold text-white">
                {modal === 'add' ? 'Add New Card' : `Edit Card #${editItem?.id}`}
              </h3>
              <button
                onClick={closeModal}
                className="w-8 h-8 flex items-center justify-center rounded-lg bg-[#1e1e1e] border border-white/8 text-neutral-400 hover:text-white hover:bg-[#2a2a2a] transition-colors"
              >
                <svg className="w-4 h-4" viewBox="0 0 24 24" fill="none">
                  <path d="M18 6 6 18M6 6l12 12" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                </svg>
              </button>
            </div>

            {/* Live preview strip */}
            <div className="mx-6 mt-5 p-4 rounded-xl border border-primary/30 bg-primary/5 flex items-center justify-between gap-3">
              <div className="flex items-center gap-3 flex-1 min-w-0">
                <div className="w-11 h-11 shrink-0 rounded-xl bg-linear-to-br from-amber-900/60 to-amber-700/40 flex items-center justify-center overflow-hidden border border-primary/20">
                  {form.iconPreview ? (
                    <Image
                      src={form.iconPreview}
                      alt="preview"
                      width={36}
                      height={36}
                      className="w-8 h-8 object-cover rounded-lg"
                    />
                  ) : (
                    <svg className="w-5 h-5 text-primary/60" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="18" height="18" rx="3" stroke="currentColor" strokeWidth="1.5" />
                      <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
                      <path d="M3 15l5-5 4 4 3-3 6 6" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                    </svg>
                  )}
                </div>
                <div className="min-w-0">
                  <p className="text-primary text-sm font-bold truncate">
                    {form.card_heading || 'Card Heading'}
                  </p>
                  <p className="text-neutral-500 text-xs truncate">
                    {form.card_description || 'Card description…'}
                  </p>
                </div>
              </div>
              <span className="text-xs font-semibold uppercase tracking-widest text-primary/60 shrink-0">
                Preview
              </span>
            </div>

            {/* Fields */}
            <div className="p-6 flex flex-col gap-4">
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Card Heading
                </label>
                <input
                  type="text"
                  value={form.card_heading}
                  onChange={(e) => setForm((prev) => ({ ...prev, card_heading: e.target.value }))}
                  placeholder="e.g. Reliable Power"
                  className="bg-[#1a1a1a] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-primary transition-colors"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Card Description
                </label>
                <textarea
                  value={form.card_description}
                  onChange={(e) => setForm((prev) => ({ ...prev, card_description: e.target.value }))}
                  placeholder="e.g. Built for rugged environments"
                  rows={3}
                  className="bg-[#1a1a1a] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-primary transition-colors resize-none"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Section Description
                </label>
                <input
                  type="text"
                  value={form.description}
                  onChange={(e) => setForm((prev) => ({ ...prev, description: e.target.value }))}
                  placeholder="e.g. Reliable portable power solutions"
                  className="bg-[#1a1a1a] border border-white/8 rounded-lg px-4 py-2.5 text-sm text-white placeholder-neutral-600 outline-none focus:border-primary transition-colors"
                />
              </div>

              {/* Icon upload */}
              <div className="flex flex-col gap-1.5">
                <label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
                  Icon
                </label>
                {/*
                  The hidden file input stores the File object in React state.
                  buildFormData() calls fd.append('icon', file, file.name) —
                  this ensures the browser sends multipart/form-data automatically.
                  Never set Content-Type: multipart/form-data manually.
                */}
                <div
                  role="button"
                  tabIndex={0}
                  onClick={() => fileRef.current?.click()}
                  onKeyDown={(e) => e.key === 'Enter' && fileRef.current?.click()}
                  className="relative flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] border-2 border-dashed border-white/10 rounded-xl py-6 cursor-pointer text-neutral-600 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
                >
                  {form.iconPreview ? (
                    <>
                      <Image
                        src={form.iconPreview}
                        alt="icon preview"
                        width={56}
                        height={56}
                        className="w-14 h-14 object-cover rounded-xl border border-white/10"
                      />
                      <span className="text-xs">Click to change icon</span>
                    </>
                  ) : (
                    <>
                      <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <polyline points="17 8 12 3 7 8" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
                        <line x1="12" y1="3" x2="12" y2="15" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" />
                      </svg>
                      <span className="text-xs">Click to upload icon</span>
                      <span className="text-[11px] text-neutral-700">PNG, JPG, SVG up to 2 MB</span>
                    </>
                  )}
                  <input
                    ref={fileRef}
                    type="file"
                    accept="image/*"
                    className="absolute inset-0 opacity-0 cursor-pointer"
                    onChange={handleFileChange}
                  />
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end gap-3 px-6 pb-6 pt-2 border-t border-white/5">
              <button
                onClick={closeModal}
                className="px-4 py-2.5 text-sm font-semibold text-neutral-300 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={modal === 'add' ? handleAdd : handleUpdate}
                disabled={isAdding || isUpdating}
                className="flex items-center gap-2 px-5 py-2.5 text-sm font-semibold bg-primary text-black rounded-lg hover:bg-primary/80 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {(isAdding || isUpdating) && <Spinner />}
                {modal === 'add' ? 'Add Card' : 'Save Changes'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ══════════════════ DELETE CONFIRM ══════════════════ */}
      {deleteTarget && (
        <div
          className="fixed inset-0 bg-black/75 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          onClick={() => setDeleteTarget(null)}
        >
          <div
            className="bg-[#141414] border border-white/10 rounded-2xl w-full max-w-sm shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-start gap-4 mb-5">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-red-400" viewBox="0 0 24 24" fill="none">
                  <path d="M12 9v4M12 17h.01" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
                  <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                </svg>
              </div>
              <div>
                <h3 className="text-base font-bold text-white mb-1">Delete Card?</h3>
                <p className="text-sm text-neutral-400 leading-relaxed">
                  Permanently remove{' '}
                  <span className="text-white font-semibold">
                    &ldquo;{deleteTarget.card_heading ?? `Card #${deleteTarget.id}`}&rdquo;
                  </span>
                  ? This action cannot be undone.
                </p>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => setDeleteTarget(null)}
                className="flex-1 py-2.5 text-sm font-semibold text-neutral-300 border border-white/10 rounded-lg hover:bg-white/5 transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={isDeleting}
                className="flex-1 flex items-center justify-center gap-2 py-2.5 text-sm font-semibold bg-red-500 text-white rounded-lg hover:bg-red-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {isDeleting && <Spinner />}
                Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};