"use client";

import { useState, useRef } from "react";
import Image from "next/image";
import {
  useAddHowWorksMutation,
  useDeleteHowWorksMutation,
  useGetHowWorksQuery,
  useUpdateHowWorksMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogCancel,
  AlertDialogAction,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";

/* ─── Types ──────────────────────────────────────────────────────── */
interface HowWorksItem {
  id: number;
  icon: string | null;
  title: string;
  description: string;
  created_at: string;
}

interface HowWorksApiResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: HowWorksItem[];
}

interface HowWorksFormPayload {
  title: string;
  description: string;
  icon: File | null;
}

interface FormState extends HowWorksFormPayload {
  iconPreview: string | null;
}

/* ─── Constants ──────────────────────────────────────────────────── */
const DEFAULT_FORM: FormState = {
  title: "",
  description: "",
  icon: null,
  iconPreview: null,
};

/* ─── Helpers ────────────────────────────────────────────────────── */
const Spinner = () => (
  <span className="inline-block w-4 h-4 border-2 border-current border-t-transparent rounded-full animate-spin" />
);

const IconPlaceholder = () => (
  <svg className="w-6 h-6 text-neutral-600" viewBox="0 0 24 24" fill="none">
    <rect
      x="3"
      y="3"
      width="18"
      height="18"
      rx="3"
      stroke="currentColor"
      strokeWidth="1.5"
    />
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

/* ─── FormFields ─────────────────────────────────────────────────────
   MUST live outside HowWorksManagement. If defined inside, React treats
   it as a new component type on every parent render (every keystroke),
   unmounts + remounts the inputs, and focus is lost after each character.
────────────────────────────────────────────────────────────────────── */
interface FormFieldsProps {
  form: FormState;
  setForm: React.Dispatch<React.SetStateAction<FormState>>;
  fileRef: React.RefObject<HTMLInputElement | null>;
  onFilePick: () => void;
  onFileChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}

const FormFields = ({
  form,
  setForm,
  fileRef,
  onFilePick,
  onFileChange,
}: FormFieldsProps) => (
  <div className="flex flex-col gap-5">
    {/* Live preview */}
    <div className="flex items-center gap-3 p-3 rounded-xl border border-primary/30 bg-primary/5">
      <div className="w-10 h-10 flex-shrink-0 rounded-xl bg-gradient-to-br from-amber-900/60 to-amber-700/40 flex items-center justify-center overflow-hidden border border-primary/20">
        {form.iconPreview ? (
          <Image
            src={form.iconPreview}
            alt="preview"
            width={36}
            height={36}
            className="w-8 h-8 object-cover rounded-lg"
          />
        ) : (
          <svg
            className="w-5 h-5 text-primary/60"
            viewBox="0 0 24 24"
            fill="none"
          >
            <rect
              x="3"
              y="3"
              width="18"
              height="18"
              rx="3"
              stroke="currentColor"
              strokeWidth="1.5"
            />
            <circle cx="8.5" cy="8.5" r="1.5" fill="currentColor" />
            <path
              d="M3 15l5-5 4 4 3-3 6 6"
              stroke="currentColor"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
          </svg>
        )}
      </div>
      <div className="min-w-0 flex-1">
        <p className="text-primary text-sm font-bold truncate">
          {form.title || "Step Title"}
        </p>
        <p className="text-neutral-500 text-xs truncate">
          {form.description || "Step description…"}
        </p>
      </div>
      <span className="text-[10px] font-semibold uppercase tracking-widest text-primary/50 shrink-0">
        Preview
      </span>
    </div>

    {/* Title */}
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Title
      </Label>
      <Input
        value={form.title}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, title: e.target.value }))
        }
        placeholder="e.g. Choose Your Kit"
        className="bg-[#1a1a1a] border-white/[0.08] text-white placeholder-neutral-600 focus-visible:ring-primary focus-visible:border-primary"
      />
    </div>

    {/* Description */}
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Description
      </Label>
      <Textarea
        value={form.description}
        onChange={(e) =>
          setForm((prev) => ({ ...prev, description: e.target.value }))
        }
        placeholder="e.g. Select the power kit that suits your adventure…"
        rows={3}
        className="bg-[#1a1a1a] border-white/[0.08] text-white placeholder-neutral-600 focus-visible:ring-primary focus-visible:border-primary resize-none"
      />
    </div>

    {/* Icon upload — input is hidden & lives outside the clickable div
        to avoid the "first click swallowed by overlay input" bug */}
    <div className="flex flex-col gap-1.5">
      <Label className="text-xs font-semibold text-neutral-400 uppercase tracking-wider">
        Icon
      </Label>
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
        className="flex flex-col items-center justify-center gap-2 bg-[#1a1a1a] border-2 border-dashed border-white/10 rounded-xl py-5 cursor-pointer text-neutral-600 hover:border-primary hover:bg-primary/5 hover:text-primary transition-all"
      >
        {form.iconPreview ? (
          <>
            <Image
              src={form.iconPreview}
              alt="icon preview"
              width={52}
              height={52}
              className="object-cover rounded-xl border border-white/10"
            />
            <span className="text-xs">Click to change icon</span>
          </>
        ) : (
          <>
            <svg className="w-7 h-7" viewBox="0 0 24 24" fill="none">
              <path
                d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <polyline
                points="17 8 12 3 7 8"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              <line
                x1="12"
                y1="3"
                x2="12"
                y2="15"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <span className="text-xs">Click to upload icon</span>
            <span className="text-[11px] text-neutral-700">
              PNG, JPG, SVG up to 2 MB
            </span>
          </>
        )}
      </div>
    </div>
  </div>
);

/* ─── Main Component ─────────────────────────────────────────────── */
export const HowWorksManagement = () => {
  const { data, isLoading: isGetLoading } = useGetHowWorksQuery({});
  const [addHowWorks, { isLoading: isAdding }] = useAddHowWorksMutation();
  const [updateHowWorks, { isLoading: isUpdating }] =
    useUpdateHowWorksMutation();
  const [deleteHowWorks, { isLoading: isDeleting }] =
    useDeleteHowWorksMutation();

  const [addOpen, setAddOpen] = useState(false);
  const [editItem, setEditItem] = useState<HowWorksItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<HowWorksItem | null>(null);
  const [form, setForm] = useState<FormState>(DEFAULT_FORM);
  const fileRef = useRef<HTMLInputElement>(null);

  const items: HowWorksItem[] = (data as HowWorksApiResponse)?.results ?? [];

  /* ── Dialog open/close ── */
  const openAdd = () => {
    setForm(DEFAULT_FORM);
    setAddOpen(true);
  };
  const closeAdd = () => {
    setAddOpen(false);
    setForm(DEFAULT_FORM);
  };
  const openEdit = (item: HowWorksItem) => {
    setForm({
      title: item.title,
      description: item.description,
      icon: null,
      iconPreview: item.icon ?? null,
    });
    setEditItem(item);
  };
  const closeEdit = () => {
    setEditItem(null);
    setForm(DEFAULT_FORM);
  };

  /* ── File handling ── */
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setForm((prev) => ({
      ...prev,
      icon: file,
      iconPreview: URL.createObjectURL(file),
    }));
    e.target.value = "";
  };

  const triggerFilePick = () => {
    if (fileRef.current) {
      fileRef.current.value = "";
      fileRef.current.click();
    }
  };

  /* ── FormData builder — DO NOT JSON.stringify, pass FormData directly
     so the browser sets Content-Type: multipart/form-data automatically ── */
  const buildFormData = ({
    title,
    description,
    icon,
  }: HowWorksFormPayload): FormData => {
    const fd = new FormData();
    fd.append("title", title);
    fd.append("description", description);
    if (icon) fd.append("icon", icon, icon.name);
    return fd;
  };

  /* ── Mutations ── */
  const handleAdd = async () => {
    await addHowWorks(
      buildFormData({
        title: form.title,
        description: form.description,
        icon: form.icon,
      }),
    );
    toast.success("Step added successfully!");
    closeAdd();
  };

  const handleUpdate = async () => {
    if (!editItem) return;
    await updateHowWorks({
      id: editItem.id,
      data: buildFormData({
        title: form.title,
        description: form.description,
        icon: form.icon,
      }),
    });
    toast.success("Step updated successfully!");
    closeEdit();
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    await deleteHowWorks(deleteTarget.id);
    toast.success("Step deleted successfully!");
    setDeleteTarget(null);
  };

  /* ── Shared props for FormFields ── */
  const formFieldsProps: FormFieldsProps = {
    form,
    setForm,
    fileRef,
    onFilePick: triggerFilePick,
    onFileChange: handleFileChange,
  };

  return (
    <>
      <div className="min-h-screen bg-[#0a0a0a] text-white px-6 py-10">
        {/* Hero */}
        <div className="mb-8">
          <div className="flex items-center gap-3 flex-wrap mb-3">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight">
              Manage <span className="text-primary">How It Works</span>
            </h2>
            <span className="text-xs font-bold uppercase tracking-widest text-primary border border-primary bg-primary/10 rounded-full px-3 py-1">
              Admin
            </span>
          </div>
          <p className="text-neutral-400 text-sm max-w-xl leading-relaxed">
            Add, edit, or remove the step cards shown in the &ldquo;How It
            Works&rdquo; section of the landing page.
          </p>
        </div>

        {/* Toolbar */}
        <div className="flex items-center justify-between mb-6">
          <span className="text-sm text-neutral-500">
            {items.length} step{items.length !== 1 ? "s" : ""}
          </span>
          <Button
            onClick={openAdd}
            className="flex items-center gap-2 bg-primary text-black font-semibold text-sm hover:bg-primary/80"
          >
            <svg className="w-4 h-4" viewBox="0 0 16 16" fill="none">
              <path
                d="M8 2v12M2 8h12"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
              />
            </svg>
            Add Step
          </Button>
        </div>

        {/* Grid */}
        {isGetLoading ? (
          <div className="flex items-center justify-center gap-3 py-24 text-neutral-500">
            <Spinner /> Loading steps…
          </div>
        ) : items.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-4 py-24 text-neutral-600">
            <svg className="w-12 h-12" viewBox="0 0 24 24" fill="none">
              <rect
                x="3"
                y="3"
                width="18"
                height="18"
                rx="3"
                stroke="currentColor"
                strokeWidth="1.2"
              />
              <path
                d="M12 8v4M12 16h.01"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
              />
            </svg>
            <p className="text-sm">No steps yet. Add your first one!</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {items.map((item, index) => (
              <div
                key={item.id}
                className="flex flex-col bg-[#121212] rounded-2xl p-5 border border-white/[0.08] hover:border-primary hover:scale-[1.02] transition-all duration-300"
              >
                <div className="flex items-center justify-between mb-4">
                  <div className="w-14 h-14 flex items-center justify-center rounded-xl bg-[#1e1e1e] border border-white/[0.08] overflow-hidden flex-shrink-0">
                    {item.icon ? (
                      <Image
                        src={item.icon}
                        alt={item.title}
                        width={40}
                        height={40}
                        className="w-8 h-8 object-cover rounded-lg"
                      />
                    ) : (
                      <IconPlaceholder />
                    )}
                  </div>
                  <span className="text-[11px] font-bold text-neutral-600 font-mono">
                    STEP {String(index + 1).padStart(2, "0")}
                  </span>
                </div>

                <div className="flex-1 min-w-0">
                  <h3 className="text-primary font-bold text-sm mb-1 truncate">
                    {item.title}
                  </h3>
                  <p className="text-neutral-500 text-xs leading-relaxed line-clamp-3">
                    {item.description}
                  </p>
                  <p className="text-neutral-700 text-[11px] mt-2 font-mono">
                    #{item.id}
                  </p>
                </div>

                <div className="flex gap-2 mt-4 pt-4 border-t border-white/[0.05]">
                  <button
                    onClick={() => openEdit(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-neutral-300 border border-white/10 rounded-lg py-2 hover:bg-white/5 hover:border-white/20 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <path
                        d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => setDeleteTarget(item)}
                    className="flex-1 flex items-center justify-center gap-1.5 text-xs font-semibold text-red-400 border border-red-500/20 rounded-lg py-2 hover:bg-red-500/10 hover:border-red-500/40 transition-colors"
                  >
                    <svg
                      className="w-3.5 h-3.5"
                      viewBox="0 0 24 24"
                      fill="none"
                    >
                      <polyline
                        points="3 6 5 6 21 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                      <path
                        d="M9 6V4a1 1 0 0 1 1-1h4a1 1 0 0 1 1 1v2"
                        stroke="currentColor"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                    Delete
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ══════════════════ ADD DIALOG ══════════════════ */}
      <Dialog
        open={addOpen}
        onOpenChange={(open) => {
          if (!open) closeAdd();
        }}
      >
        <DialogContent className="bg-[#141414] border border-white/10 text-white max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Add New Step
            </DialogTitle>
          </DialogHeader>
          <FormFields {...formFieldsProps} />
          <DialogFooter className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-white/10 text-neutral-300 hover:bg-white/5 bg-transparent"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleAdd}
              disabled={isAdding}
              className="flex items-center gap-2 bg-primary text-black hover:bg-primary/80 disabled:opacity-50"
            >
              {isAdding && <Spinner />}
              Add Step
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════ EDIT DIALOG ══════════════════ */}
      <Dialog
        open={!!editItem}
        onOpenChange={(open) => {
          if (!open) closeEdit();
        }}
      >
        <DialogContent className="bg-[#141414] border border-white/10 text-white max-w-lg rounded-2xl">
          <DialogHeader>
            <DialogTitle className="text-lg font-bold text-white">
              Edit Step <span className="text-primary">#{editItem?.id}</span>
            </DialogTitle>
          </DialogHeader>
          <FormFields {...formFieldsProps} />
          <DialogFooter className="flex gap-3 pt-2">
            <DialogClose asChild>
              <Button
                variant="outline"
                className="border-white/10 text-neutral-300 hover:bg-white/5 bg-transparent"
              >
                Cancel
              </Button>
            </DialogClose>
            <Button
              onClick={handleUpdate}
              disabled={isUpdating}
              className="flex items-center gap-2 bg-primary text-black hover:bg-primary/80 disabled:opacity-50"
            >
              {isUpdating && <Spinner />}
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* ══════════════════ DELETE ALERT DIALOG ══════════════════ */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null);
        }}
      >
        <AlertDialogContent className="bg-[#141414] border border-white/10 text-white rounded-2xl max-w-sm">
          <AlertDialogHeader>
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-red-500/15 border border-red-500/30 flex items-center justify-center shrink-0">
                <svg
                  className="w-5 h-5 text-red-400"
                  viewBox="0 0 24 24"
                  fill="none"
                >
                  <path
                    d="M12 9v4M12 17h.01"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                  <path
                    d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  />
                </svg>
              </div>
              <div>
                <AlertDialogTitle className="text-base font-bold text-white mb-1">
                  Delete Step?
                </AlertDialogTitle>
                <AlertDialogDescription className="text-sm text-neutral-400 leading-relaxed">
                  Permanently remove{" "}
                  <span className="text-white font-semibold">
                    &ldquo;{deleteTarget?.title ?? `Step #${deleteTarget?.id}`}
                    &rdquo;
                  </span>
                  ? This action cannot be undone.
                </AlertDialogDescription>
              </div>
            </div>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex gap-3">
            <AlertDialogCancel className="flex-1 border-white/10 text-neutral-300 hover:bg-white/5 bg-transparent">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="flex-1 flex items-center justify-center gap-2 bg-red-500 text-white hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting && <Spinner />}
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
