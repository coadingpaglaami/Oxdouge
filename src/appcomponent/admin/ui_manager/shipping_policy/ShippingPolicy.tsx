"use client";

import { useState, useEffect } from "react";
import {
  useAddShippingPolicyMutation,
  useDeleteShippingPolicyMutation,
  useGetShippingPolicyQuery,
  useUpdateShippingPolicyMutation,
} from "@/api/ui_manager";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Plus,
  Pencil,
  Trash2,
  Truck,
  GripVertical,
  X,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";

// ─── Types ────────────────────────────────────────────────────────────────────

interface ShippingPolicyItem {
  id: number;
  heading: string;
  content: string;
}

interface PolicyListResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: ShippingPolicyItem[];
}

interface PolicyFormData {
  heading: string;
  points: string[];
}

// ─── Constants ────────────────────────────────────────────────────────────────

const PAGE_SIZE = 10;

// ─── Helpers ──────────────────────────────────────────────────────────────────

const contentToPoints = (content: string): string[] => {
  const pts = content
    .split("\n")
    .map((l) => l.replace(/^[-•*]\s*/, "").trim())
    .filter(Boolean);
  return pts.length > 0 ? pts : [""];
};

const pointsToContent = (points: string[]): string =>
  points.filter((p) => p.trim()).join("\n");

// ─── Pagination ───────────────────────────────────────────────────────────────

const Pagination = ({
  page,
  totalPages,
  hasNext,
  onPageChange,
}: {
  page: number;
  totalPages: number;
  hasNext: boolean;
  onPageChange: (p: number) => void;
}) => {
  if (totalPages <= 1) return null;

  const pageNumbers = Array.from(
    { length: totalPages },
    (_, i) => i + 1,
  ).filter((p) => Math.abs(p - page) <= 2);

  return (
    <div className="flex justify-between items-center mt-7 px-5 py-4 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A]">
      <span className="text-[#666] text-sm">
        Page {page} of {totalPages}
      </span>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          onClick={() => onPageChange(Math.max(1, page - 1))}
          disabled={page === 1}
          className="bg-transparent border-[#2A2A2A] text-[#aaa] rounded-lg hover:bg-[#2A2A2A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronLeft size={16} />
        </Button>
        {pageNumbers.map((p) => (
          <Button
            key={p}
            size="sm"
            onClick={() => onPageChange(p)}
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
          onClick={() => onPageChange(Math.min(totalPages, page + 1))}
          disabled={page === totalPages || !hasNext}
          className="bg-transparent border-[#2A2A2A] text-[#aaa] rounded-lg hover:bg-[#2A2A2A] hover:text-white disabled:opacity-30 disabled:cursor-not-allowed"
        >
          <ChevronRight size={16} />
        </Button>
      </div>
    </div>
  );
};

// ─── Policy Card ──────────────────────────────────────────────────────────────

const PolicyCard = ({
  policy,
  onEdit,
  onDelete,
  icon,
}: {
  policy: ShippingPolicyItem;
  onEdit: (p: ShippingPolicyItem) => void;
  onDelete: (p: ShippingPolicyItem) => void;
  icon: React.ReactNode;
}) => {
  const points = contentToPoints(policy.content);
  return (
    <div className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-6 py-5 flex flex-col gap-4 transition-colors duration-200 hover:border-[#FFD345] group">
      <div className="flex justify-between items-start gap-3">
        <div className="flex gap-3 items-center flex-1 min-w-0">
          {icon}
          <h3 className="text-white font-bold text-[15px] leading-snug m-0 truncate">
            {policy.heading}
          </h3>
        </div>
        <div className="flex gap-2 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-150">
          <button
            onClick={() => onEdit(policy)}
            className="bg-transparent border border-[#2A2A2A] rounded-lg p-1.5 text-[#888] hover:border-[#FFD345] hover:text-[#FFD345] transition-all duration-150 flex items-center cursor-pointer"
            title="Edit"
          >
            <Pencil size={14} />
          </button>
          <button
            onClick={() => onDelete(policy)}
            className="bg-transparent border border-[#2A2A2A] rounded-lg p-1.5 text-[#888] hover:border-red-500 hover:text-red-500 transition-all duration-150 flex items-center cursor-pointer"
            title="Delete"
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
      <ul className="flex flex-col gap-2 pl-7 m-0 list-none">
        {points.map((point, i) => (
          <li key={i} className="flex gap-2.5 items-start">
            <span className="mt-[7px] w-1.5 h-1.5 rounded-full bg-[#FFD345] shrink-0" />
            <span className="text-[#999] text-sm leading-relaxed">{point}</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

// ─── Skeleton ─────────────────────────────────────────────────────────────────

const PolicySkeleton = () => (
  <div className="flex flex-col gap-3">
    {Array.from({ length: 3 }).map((_, i) => (
      <div
        key={i}
        className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-xl px-6 py-5"
      >
        <Skeleton className="h-4 w-1/3 mb-4 bg-[#2A2A2A]" />
        <Skeleton className="h-3 w-full mb-2 bg-[#2A2A2A]" />
        <Skeleton className="h-3 w-4/5 mb-2 bg-[#2A2A2A]" />
        <Skeleton className="h-3 w-2/3 bg-[#2A2A2A]" />
      </div>
    ))}
  </div>
);

// ─── Policy Form Dialog ───────────────────────────────────────────────────────

interface PolicyFormDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: PolicyFormData) => void;
  initialData?: ShippingPolicyItem | null;
  isLoading: boolean;
  title: string;
  placeholder?: string;
}

const PolicyFormDialog = ({
  open,
  onClose,
  onSubmit,
  initialData,
  isLoading,
  title,
  placeholder = "e.g. Standard Shipping",
}: PolicyFormDialogProps) => {
  const [heading, setHeading] = useState("");
  const [points, setPoints] = useState<string[]>([""]);

  useEffect(() => {
    if (open) {
      setHeading(initialData?.heading ?? "");
      setPoints(initialData ? contentToPoints(initialData.content) : [""]);
    }
  }, [open, initialData]);

  const handlePointChange = (index: number, value: string) => {
    setPoints((prev) => prev.map((p, i) => (i === index ? value : p)));
  };

  const addPoint = () => setPoints((prev) => [...prev, ""]);

  const removePoint = (index: number) => {
    if (points.length === 1) return;
    setPoints((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = () => {
    const cleanPoints = points.filter((p) => p.trim());
    if (!heading.trim() || cleanPoints.length === 0) return;
    onSubmit({ heading: heading.trim(), points: cleanPoints });
  };

  const isValid =
    heading.trim().length > 0 && points.some((p) => p.trim().length > 0);

  return (
    <Dialog open={open} onOpenChange={(v) => !v && onClose()}>
      <DialogContent className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl text-white sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-[#FFD345] text-lg font-bold">
            {title}
          </DialogTitle>
        </DialogHeader>

        <div className="flex flex-col gap-5 py-2">
          <div className="flex flex-col gap-1.5">
            <label className="text-[#aaa] text-xs font-semibold uppercase tracking-widest">
              Heading
            </label>
            <Input
              value={heading}
              onChange={(e) => setHeading(e.target.value)}
              placeholder={placeholder}
              className="bg-[#121212] border-[#2A2A2A] text-white placeholder:text-[#555] rounded-lg focus-visible:ring-[#FFD345] focus-visible:ring-1 focus-visible:border-[#FFD345]"
            />
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <label className="text-[#aaa] text-xs font-semibold uppercase tracking-widest">
                Policy Points
              </label>
              <span className="text-[#555] text-xs">
                {points.length} point{points.length !== 1 ? "s" : ""}
              </span>
            </div>

            <div className="flex flex-col gap-2">
              {points.map((point, index) => (
                <div key={index} className="flex items-center gap-2">
                  <GripVertical size={14} className="text-[#444] shrink-0" />
                  <span className="w-1.5 h-1.5 rounded-full bg-[#FFD345] shrink-0" />
                  <Input
                    value={point}
                    onChange={(e) => handlePointChange(index, e.target.value)}
                    placeholder={`Point ${index + 1}...`}
                    className="bg-[#121212] border-[#2A2A2A] text-white placeholder:text-[#555] rounded-lg focus-visible:ring-[#FFD345] focus-visible:ring-1 focus-visible:border-[#FFD345] flex-1"
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        addPoint();
                      }
                    }}
                  />
                  <button
                    onClick={() => removePoint(index)}
                    disabled={points.length === 1}
                    className="p-1.5 rounded-lg text-[#555] hover:text-red-400 hover:bg-red-400/10 transition-all duration-150 disabled:opacity-20 disabled:cursor-not-allowed shrink-0"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
            </div>

            <button
              onClick={addPoint}
              className="flex items-center gap-2 text-[#FFD345] text-sm font-medium mt-1 w-fit hover:opacity-80 transition-opacity cursor-pointer"
            >
              <Plus size={14} />
              Add point
            </button>
          </div>
        </div>

        <DialogFooter className="gap-2 pt-2">
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
            {isLoading ? "Saving..." : !!initialData ? "Update" : "Add"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

// ─── Main Component ───────────────────────────────────────────────────────────

export const ShippingPolicy = () => {
  const [page, setPage] = useState(1);
  const [isAddOpen, setIsAddOpen] = useState(false);
  const [editTarget, setEditTarget] = useState<ShippingPolicyItem | null>(null);
  const [deleteTarget, setDeleteTarget] = useState<ShippingPolicyItem | null>(
    null,
  );

  const { data, isLoading, isError } = useGetShippingPolicyQuery({
    page,
    limit: PAGE_SIZE,
  });

  const [addShippingPolicy, { isLoading: isAdding }] =
    useAddShippingPolicyMutation();
  const [updateShippingPolicy, { isLoading: isUpdating }] =
    useUpdateShippingPolicyMutation();
  const [deleteShippingPolicy, { isLoading: isDeleting }] =
    useDeleteShippingPolicyMutation();

  const totalPages = data?.count ? Math.ceil(data.count / PAGE_SIZE) : 1;

  const handleAdd = async ({ heading, points }: PolicyFormData) => {
    try {
      await addShippingPolicy({
        heading,
        content: pointsToContent(points),
      }).unwrap();
      setIsAddOpen(false);
      toast.success("Shipping policy has been created successfully.");
    } catch {
      toast.error("Failed to add shipping policy. Please try again.");
    }
  };

  const handleUpdate = async ({ heading, points }: PolicyFormData) => {
    if (!editTarget) return;
    try {
      await updateShippingPolicy({
  id: editTarget.id,
  data: {
    heading,
    content: pointsToContent(points),
  },
}).unwrap();
      setEditTarget(null);
      toast.success("Shipping policy has been updated successfully.");
    } catch {
      toast.error("Failed to update shipping policy. Please try again.");
    }
  };

  const handleDelete = async () => {
    if (!deleteTarget) return;
    try {
      await deleteShippingPolicy({ id: deleteTarget.id }).unwrap();
      setDeleteTarget(null);
      toast.success("Shipping policy has been deleted.");
      if (data?.results.length === 1 && page > 1) setPage((p) => p - 1);
    } catch {
      toast.error("Failed to delete shipping policy. Please try again.");
    }
  };

  return (
    <div className="bg-[#121212] min-h-screen p-10 font-sans">
      {/* Header */}
      <div className="flex justify-between items-end mb-8">
        <div>
          <p className="text-[#FFD345] text-xs font-bold uppercase tracking-widest m-0">
            Store Configuration
          </p>
          <h1 className="text-white text-3xl font-bold mt-1.5 mb-1">
            Shipping Policies
          </h1>
          <p className="text-[#666] text-sm m-0">
            {data?.count ?? 0} polic{data?.count !== 1 ? "ies" : "y"} configured
          </p>
        </div>
        <Button
          onClick={() => setIsAddOpen(true)}
          className="bg-[#FFD345] text-[#121212] font-bold text-sm rounded-xl px-5 py-2.5 flex items-center gap-1.5 border-none hover:bg-[#e6be30] cursor-pointer"
        >
          <Plus size={16} />
          Add Policy
        </Button>
      </div>

      <div className="h-px bg-[#1E1E1E] mb-6" />

      {isLoading ? (
        <PolicySkeleton />
      ) : isError ? (
        <div className="text-center py-16 text-red-400 bg-[#1C1C1C] rounded-xl border border-[#2A2A2A]">
          <p className="m-0">
            Failed to load shipping policies. Please try again.
          </p>
        </div>
      ) : data?.results.length === 0 ? (
        <div className="text-center py-16 text-[#555] bg-[#1C1C1C] rounded-xl border border-dashed border-[#2A2A2A]">
          <Truck size={36} className="text-[#2A2A2A] mx-auto mb-3" />
          <p className="m-0 text-[15px]">
            No shipping policies yet. Add your first one!
          </p>
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {data?.results.map((policy: ShippingPolicyItem) => (
            <PolicyCard
              key={policy.id}
              policy={policy}
              onEdit={setEditTarget}
              onDelete={setDeleteTarget}
              icon={<Truck size={18} className="text-[#FFD345] shrink-0" />}
            />
          ))}
        </div>
      )}

      <Pagination
        page={page}
        totalPages={totalPages}
        hasNext={!!data?.next}
        onPageChange={setPage}
      />

      <PolicyFormDialog
        open={isAddOpen}
        onClose={() => setIsAddOpen(false)}
        onSubmit={handleAdd}
        isLoading={isAdding}
        title="Add Shipping Policy"
        placeholder="e.g. Standard Shipping"
      />
      <PolicyFormDialog
        open={!!editTarget}
        onClose={() => setEditTarget(null)}
        onSubmit={handleUpdate}
        initialData={editTarget}
        isLoading={isUpdating}
        title="Edit Shipping Policy"
        placeholder="e.g. Standard Shipping"
      />

      <AlertDialog
        open={!!deleteTarget}
        onOpenChange={(v) => !v && setDeleteTarget(null)}
      >
        <AlertDialogContent className="bg-[#1C1C1C] border border-[#2A2A2A] rounded-2xl text-white">
          <AlertDialogHeader>
            <AlertDialogTitle className="text-white">
              Delete this policy?
            </AlertDialogTitle>
            <AlertDialogDescription className="text-[#888]">
              <span className="text-[#FFD345] font-semibold">
                "{deleteTarget?.heading}"
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
