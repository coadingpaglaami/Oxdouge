"use client";

import React, { useState } from "react";
import { Breadcrumb } from "@/appcomponent/reusable";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { ProductForm } from "./ProductForm";
import { ProductTable } from "./ProductTable";
import { ProductResponse } from "@/interfaces/api";

export const Products = () => {
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductResponse | null>(null);

  const openAdd = () => {
    console.log("Open Add Product Dialog");
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (product: ProductResponse) => {
    setEditing(product);
    setOpen(true);
  };

  return (
    <div className="p-6">
      <Breadcrumb title="Products" subtitle="Manage your product catalog" />

      <ProductTable onEdit={openEdit} openAdd={openAdd} />

      {/* Dialog for Add/Edit */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className="w-full max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#0B0B0B] border border-primary/20"
          style={{ maxWidth: "-webkit-fill-available" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {editing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <ProductForm editing={editing} onClose={() => setOpen(false)} />
        </DialogContent>
      </Dialog>
    </div>
  );
};
