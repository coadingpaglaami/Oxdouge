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

interface FaqItem {
  id: number;
  question: string;
  answer: string;
}

interface FaqFormData {
  question: string;
  answer: string;
}

const PAGE_SIZE = 10;

const FaqCard = ({
  faq,
  onEdit,
  onDelete,
}: {
  faq: FaqItem;
  onEdit: (faq: FaqItem) => void;
  onDelete: (faq: FaqItem) => void;
}) => (
  <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-6 py-5 flex flex-col gap-3 transition-colors duration-200 hover:border-primary">
    <div className="flex justify-between items-start gap-3">
      <div className="flex gap-3 items-start flex-1">
        <HelpCircle size={18} className="text-primary mt-0.5 shrink-0" />
        <p className="text-white font-semibold text-[15px] leading-relaxed m-0">
          {faq.question}
        </p>
      </div>

      <div className="flex gap-2 shrink-0">
        <button
          onClick={() => onEdit(faq)}
          className="bg-transparent border border-[#2A2A2A] rounded-lg p-1.5 text-[#888] hover:border-primary hover:text-primary transition-all duration-150 flex items-center cursor-pointer"
        >
          <Pencil size={14} />
        </button>

        <button
          onClick={() => onDelete(faq)}
          className="bg-transparent border border-[#2A2A2A] rounded-lg p-1.5 text-[#888] hover:border-red-500 hover:text-red-500 transition-all duration-150 flex items-center cursor-pointer"
        >
          <Trash2 size={14} />
        </button>
      </div>
    </div>

    <p className="text-[#999] text-sm leading-relaxed m-0 pl-7">
      {faq.answer}
    </p>
  </div>
);

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

  useEffect(() => {
    if (open) {
      setForm({
        question: initialData?.question ?? "",
        answer: initialData?.answer ?? "",
      });
    }
  }, [open, initialData]);

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
          <DialogTitle className="text-primary text-lg font-bold">
            {isEdit ? "Edit FAQ" : "Add New FAQ"}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-4 py-2">
          <Input
            value={form.question}
            onChange={(e) =>
              setForm((p) => ({ ...p, question: e.target.value }))
            }
            placeholder="Question"
            className="bg-[#121212] border-[#2A2A2A] text-white focus-visible:ring-primary focus-visible:border-primary"
          />

          <Textarea
            value={form.answer}
            onChange={(e) =>
              setForm((p) => ({ ...p, answer: e.target.value }))
            }
            placeholder="Answer"
            rows={4}
            className="bg-[#121212] border-[#2A2A2A] text-white focus-visible:ring-primary focus-visible:border-primary"
          />
        </div>

        <DialogFooter className="gap-2">
          <Button
            variant="outline"
            onClick={onClose}
            className="border-[#2A2A2A] text-[#aaa] hover:bg-[#2A2A2A]"
          >
            Cancel
          </Button>

          <Button
            onClick={handleSubmit}
            disabled={isLoading || !isValid}
            className="bg-primary text-black hover:opacity-90 border-none"
          >
            {isLoading ? "Saving..." : isEdit ? "Update FAQ" : "Add FAQ"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

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

  const handleAdd = async (formData: FaqFormData) => {
    try {
      await addFaq(formData).unwrap();
      setIsAddOpen(false);
      toast.success("New FAQ has been created successfully.");
    } catch {
      toast.error("Failed to add FAQ.");
    }
  };

  const handleUpdate = async (formData: FaqFormData) => {
    if (!editTarget) return;
    try {
      await updateFaq({
        id: editTarget.id,
        data: formData,
      }).unwrap();
      setEditTarget(null);
      toast.success("FAQ updated.");
    } catch {
      toast.error("Update failed.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteFaq({ id: deleteTarget.id }).unwrap();
      setDeleteTarget(null);
      toast.success("FAQ deleted.");
    } catch {
      toast.error("Delete failed.");
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen p-10">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-primary text-xs font-bold uppercase tracking-widest">
            Knowledge Base
          </p>

          <h1 className="text-white text-3xl font-bold mt-1.5 mb-1">
            FAQ Management
          </h1>

          <p className="text-[#666] text-sm">
            {data?.count ?? 0} questions total
          </p>
        </div>

        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-primary text-black font-bold rounded-xl px-5 py-2.5 flex items-center gap-2 hover:opacity-90"
        >
          <Plus size={16} />
          Add FAQ
        </Button>
      </div>

      {/* Content */}
      {isLoading ? (
        <FaqSkeleton />
      ) : error ? (
        <div className="text-center py-16 text-red-400 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A]">
          Failed to load FAQs
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

      {/* Dialogs */}
      <FaqFormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        isLoading={isAdding}
      />

      <FaqFormDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        initialData={editTarget}
        isLoading={isUpdating}
      />
    </div>
  );
};