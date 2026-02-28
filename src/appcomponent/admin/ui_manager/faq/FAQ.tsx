"use client";
import { useState, useEffect } from "react";
import {
  useAddFaqMutation,
  useDeleteFaqMutation,
  useGetFaqsQuery,
  useUpdateFaqMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Skeleton } from "@/components/ui/skeleton";
import {
  ChevronLeft,
  ChevronRight,
  Plus,
  Pencil,
  Trash2,
  HelpCircle,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: FaqItem[];
}

interface FaqFormData {
  question: string;
  answer: string;
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── FAQ Card ─────────────────────────────────────────────────────────────────

const FaqCard = ({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FaqItem;
  onEdit: (faq: FaqItem) => void;
  onDelete: (faq: FaqItem) => void;
}) => (
  <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-6 py-5 flex flex-col gap-3 transition-colors duration-200 hover:border-[#FFD345]">
    <div className="flex justify-between items-start gap-3">
      <div className="flex gap-3 items-start flex-1">
        <HelpCircle size={18} className="text-[#FFD345] mt-0.5 shrink-0" />
        <p className="text-white font-semibold text-[15px] leading-relaxed m-0">
          {faq.question}
        </p>
      </div>
      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(faq)}
          className="bg-transparent border border-[#2A2A2A] rounded-lg p-1.5 text-[#888] hover:border-[#FFD345] hover:text-[#FFD345] transition-all duration-150 flex items-center cursor-pointer"
          title="Edit"
        >
          <Pencil size={14} />
        </button>
        <button
          onClick={() => onDelete(faq)}
          className="bg-transparent border border-[#2A2A2A] rounded-lg p-1.5 text-[#888] hover:border-red-500 hover:text-red-500 transition-all duration-150 flex items-center cursor-pointer"
          title="Delete"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>
    <p className="text-[#999] text-sm leading-relaxed m-0 pl-7">{faq.answer}</p>
  </div>
);

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const FaqSkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 4 }).map((_, i) => (
      <div
        key={i}
        className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-6 py-5"
      >
        <Skeleton className="h-4 w-3/4 mb-3 bg-[#2A2A2A]" />
        <Skeleton className="h-3 w-full mb-2 bg-[#2A2A2A]" />
        <Skeleton className="h-3 w-5/6 bg-[#2A2A2A]" />
      </div>
    ))}
  </div>
);

// ─── FAQ Form Dialog ──────────────────────────────────────────────────────────

interface FaqFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: FaqFormData) => void;
  initialData?: FaqItem | null;
  isLoading: boolean;
}

const FaqFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
}: FaqFormDialogProps) => {
  const [form, setForm] = useState<FaqFormData>({
    question: "",
    answer: "",
  });

  // ✅ Re-populate form every time the dialog opens or initialData changes
  useEffect(() => {
    if (open) {
      setForm({
        question: initialData?.question ?? "",
        answer: initialData?.answer ?? "",
      });
    }
  }, [open, initialData]);

  const handleChange = (field: keyof FaqFormData, value: string) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  const handleSubmit = () => {
    if (!form.question.trim() || !form.answer.trim()) return;
    onSubmit(form);
  };

  const isEdit = !!initialData;
  const isValid =
    form.question.trim().length > 0 && form.answer.trim().length > 0;

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl text-white sm:max-w-lg">
        <DialogHeader>
          <DialogTitle className="text-[#FFD345] text-lg font-bold">
            {isEdit ? "Edit FAQ" : "Add New FAQ"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#aaa] text-xs font-semibold uppercase tracking-widest">
              Question
            </label>
            <Input
              value={form.question}
              onChange={(e) => handleChange("question", e.target.value)}
              placeholder="e.g. Do you offer emergency service?"
              className="bg-[#121212] border-[#2A2A2A] text-white placeholder:text-[#555] rounded-lg focus-visible:ring-[#FFD345] focus-visible:ring-1 focus-visible:border-[#FFD345]"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-[#aaa] text-xs font-semibold uppercase tracking-widest">
              Answer
            </label>
            <Textarea
              value={form.answer}
              onChange={(e) => handleChange("answer", e.target.value)}
              placeholder="e.g. Yes, we provide emergency services within 24 hours."
              rows={4}
              className="bg-[#121212] border-[#2A2A2A] text-white placeholder:text-[#555] rounded-lg resize-none focus-visible:ring-[#FFD345] focus-visible:ring-1 focus-visible:border-[#FFD345]"
            />
          </div>
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="bg-transparent border-[#2A2A2A] text-[#aaa] hover:bg-[#2A2A2A] hover:text-white"
          >
            Cancel
          </Button>
          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
            className="bg-[#FFD345] text-[#121212] font-bold hover:bg-[#e6be30] border-none disabled:opacity-50"
          >
            {isLoading ? "Saving..." : isEdit ? "Update FAQ" : "Add FAQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const FAQ = () => {
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<FaqItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<FaqItem | null>(null);

  const { data, isLoading, error } = useGetFaqsQuery({
    page,
    page_size: PAGE_SIZE,
  });

  const [addFaq, { isLoading: isAdding }] = useAddFaqMutation();
  const [updateFaq, { isLoading: isUpdating }] = useUpdateFaqMutation();
  const [deleteFaq, { isLoading: isDeleting }] = useDeleteFaqMutation();

  const totalPages = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 1;

  // ── Handlers ──────────────────────────────────────────────────────────────

  const handleAdd = async (formData: FaqFormData) => {
    try {
      await addFaq(formData).unwrap();
      setIsAddOpen(false);
      toast.success("New FAQ has been created successfully.");
    } catch {
      toast.error("Failed to add FAQ. Please try again.");
    }
  };

  const handleUpdate = async (formData: FaqFormData) => {
    if (!editTarget) return;
    try {
      console.log(formData);
      await updateFaq({
        id: editTarget.id,
        data: formData,
      }).unwrap();
      setEditTarget(null);
      toast.success("FAQ has been updated successfully.");
    } catch {
      toast.error("Failed to update FAQ. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFaq({ id: deleteTarget.id }).unwrap();
      setDeleteTarget(null);
      toast.success("FAQ has been deleted.");
      if (data?.results.length === 1 && page > 1) {
        setPage((p) => p - 1);
      }
    } catch {
      toast.error("Failed to delete FAQ. Please try again.");
    }
  };

  // ── Pagination helpers ─────────────────────────────────────────────────────

  const getPageNumbers = (): number[] =>
    Array.from({ length: totalPages }, (_, i) => i + 1).filter(
      (p) => Math.abs(p - page) <= 2,
    );

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="bg-[#121212] min-h-screen p-10 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[#FFD345] text-xs font-bold uppercase tracking-widest m-0">
            Knowledge Base
          </p>
          <h1 className="text-white text-3xl font-bold mt-1.5 mb-1">
            FAQ Management
          </h1>
          <p className="text-[#666] text-sm m-0">
            {data?.count ?? 0} question{data?.count !== 1 ? "s" : ""} total
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#FFD345] text-[#121212] font-bold text-sm rounded-xl px-5 py-2.5 flex items-center gap-1.5 border-none hover:bg-[#e6be30] cursor-pointer"
        >
          <Plus size={16} />
          Add FAQ
        </Button>
      </div>

      {/* Divider */}
      <div className="h-px bg-[#1E1E1E] mb-6" />

      {/* Content */}
      {isLoading ? (
        <FaqSkeleton />
      ) : error ? (
        <div className="text-center py-16 text-red-400 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A]">
          <p className="m-0">Failed to load FAQs. Please try again.</p>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-16 text-[#555] bg-[#1C1C1C] rounded-xl border border-dashed border-[#2A2A2A]">
          <HelpCircle size={36} className="text-[#2A2A2A] mx-auto mb-3" />
          <p className="m-0 text-[15px]">No FAQs yet. Add your first one!</p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data?.results.map((faq: FaqItem) => (
            <FaqCard
              key={faq.id}
              faq={faq}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
            />
          ))}
        </div>
      )}

      {/* Pagination */}
      {!isLoading && totalPages > 1 && (
        <div className="flex justify-between items-center mt-7 px-5 py-4 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A]">
          <span className="text-[#666] text-sm">
            Page {page} of {totalPages}
          </span>

          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="bg-transparent border-[#2A2A2A] text-[#aaa] rounded-lg hover:bg-[#2A2A2A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronLeft size={16} />
            </Button>

            {getPageNumbers().map((p) => (
              <Button
                key={p}
                size="sm"
                onClick={() => setPage(p)}
                className={`rounded-lg min-w-9 border font-medium transition-all ${
                  p === page
                    ? "bg-[#FFD345] border-[#FFD345] text-[#121212] font-bold hover:bg-[#e6be30]"
                    : "bg-transparent border-[#2A2A2A] text-[#aaa] hover:bg-[#2A2A2A] hover:text-white"
                }`}
              >
                {p}
              </Button>
            ))}

            <Button
              variant="outline"
              size="sm"
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages || !data?.next}
              className="bg-transparent border-[#2A2A2A] text-[#aaa] rounded-lg hover:bg-[#2A2A2A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
            >
              <ChevronRight size={16} />
            </Button>
          </div>
        </div>
      )}

      {/* Add Dialog */}
      <FaqFormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        isLoading={isAdding}
      />

      {/* Edit Dialog */}
      <FaqFormDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        initialData={editTarget}
        isLoading={isUpdating}
      />

      {/* Delete Confirm */}
      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete this FAQ?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#888]">
              <span className="text-[#FFD345] font-semibold">
                "{deleteTarget?.question}"
              </span>{" "}
              will be permanently removed. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel className="bg-transparent border-[#2A2A2A] text-[#aaa] hover:bg-[#2A2A2A] hover:text-white">
              Cancel
            </AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              disabled={isDeleting}
              className="bg-red-500 text-white font-bold border-none hover:bg-red-600 disabled:opacity-50"
            >
              {isDeleting ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};
