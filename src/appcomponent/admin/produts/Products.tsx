"use client";

import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { Breadcrumb } from "@/appcomponent/reusable";
import { productPageData as initialProducts } from "@/data/ProductPageData";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, Search, Plus, X, Video } from "lucide-react";

/**
 * Admin Products page with Add/Edit dialog
 *
 * Note: This is a client-side demo using local state.
 * Replace local upload handlers with your API calls when ready.
 */

type Product = (typeof initialProducts)[number];
export const Prodcuts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [mainImageFile, setMainImageFile] = useState<File | null>(null);
  const [mainImagePreview, setMainImagePreview] = useState<string | null>(null);
  const [moreImageFiles, setMoreImageFiles] = useState<File[]>([]);
  const [moreImagePreviews, setMoreImagePreviews] = useState<string[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);
  const [videoPreview, setVideoPreview] = useState<string | null>(null);
  const [keyFeatures, setKeyFeatures] = useState<string[]>([""]);
  const mainInputRef = useRef<HTMLInputElement | null>(null);
  const moreInputRef = useRef<HTMLInputElement | null>(null);
  const videoInputRef = useRef<HTMLInputElement | null>(null);

  // reset form
  const resetForm = () => {
    setTitle("");
    setCategory("");
    setPrice("");
    setDescription("");
    setQuantity(0);
    setMainImageFile(null);
    setMainImagePreview(null);
    setMoreImageFiles([]);
    setMoreImagePreviews([]);
    setVideoFile(null);
    setVideoPreview(null);
    setKeyFeatures([""]);
    setEditing(null);
  };

  // when editing, populate fields
  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setCategory(editing.category ?? "");
      setPrice(editing.price);
      setDescription(editing.description);
      setQuantity(editing.quantity ?? 0);
      setMainImagePreview(editing.img ?? null);
      setMoreImagePreviews(editing.moreImages ?? []);
      setVideoPreview(editing.howToUseVideo ?? null);
      setKeyFeatures(editing.keyFeatures?.length ? editing.keyFeatures : [""]);
    }
  }, [editing]);

  // previews for File objects
  useEffect(() => {
    if (mainImageFile) {
      const url = URL.createObjectURL(mainImageFile);
      setMainImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mainImageFile]);

  useEffect(() => {
    if (moreImageFiles.length) {
      const urls = moreImageFiles.map((f) => URL.createObjectURL(f));
      setMoreImagePreviews(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    } else {
      setMoreImagePreviews((prev) => prev); // keep existing if editing
    }
  }, [moreImageFiles]);

  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  // handle drag & drop for images (main)
  const handleMainDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setMainImageFile(e.dataTransfer.files[0]);
    }
  };
  // more images drop
  const handleMoreDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    const files = Array.from(e.dataTransfer.files || []);
    if (files.length) {
      setMoreImageFiles((cur) => [...cur, ...files]);
    }
  };
  // video drop
  const handleVideoDrop: React.DragEventHandler = (e) => {
    e.preventDefault();
    if (e.dataTransfer.files?.[0]) {
      setVideoFile(e.dataTransfer.files[0]);
    }
  };

  // key features handlers
  const updateFeature = (index: number, value: string) => {
    setKeyFeatures((prev) => prev.map((v, i) => (i === index ? value : v)));
  };
  const addFeature = () => setKeyFeatures((prev) => [...prev, ""]);
  const removeFeature = (index: number) =>
    setKeyFeatures((prev) => prev.filter((_, i) => i !== index));

  // upload / update action (local demo)
  const handleSubmit = (e?: React.FormEvent) => {
    e?.preventDefault();

    const newProduct: Product = {
      id: editing ? editing.id : Math.max(0, ...products.map((p) => p.id)) + 1,
      img: mainImagePreview ?? "/heaterimg/heater1.jpg", // fallback if none (in real app upload & get url)
      subtitle: "Deiseal Heater",
      title,
      description,
      price,
      availability: quantity > 0 ? "In Stock" : "Out of Stock",
      category,
      quantity,
      keyFeatures: keyFeatures.filter((k) => k.trim() !== ""),
      moreImages: moreImagePreviews.length ? moreImagePreviews : [],
      howToUseVideo: videoPreview ?? undefined,
    };

    if (editing) {
      setProducts((prev) =>
        prev.map((p) => (p.id === editing.id ? newProduct : p))
      );
    } else {
      setProducts((prev) => [newProduct, ...prev]);
    }

    setOpen(false);
    resetForm();
  };

  // open add dialog
  const openAdd = () => {
    resetForm();
    setEditing(null);
    setOpen(true);
  };

  // open edit dialog
  const openEdit = (p: Product) => {
    setEditing(p);
    setOpen(true);
  };

  // remove product (local)
  const removeProduct = (id: number) =>
    setProducts((prev) => prev.filter((p) => p.id !== id));

  // helper to remove a selected more image preview (when editing)
  const removeMorePreview = (index: number) => {
    setMoreImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setMoreImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // simple search state (client)
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    `${p.title} ${p.category} ${p.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Breadcrumb title="Products" subtitle="Manage your product catalog" />

      {/* search + add */}
      <div className="flex flex-wrap gap-4 items-center justify-between my-4">
        <div className="relative flex-1 min-w-[220px] md:max-w-[90%]">
          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
            <Search size={18} />
          </span>
          <input
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search products..."
            className="w-full pl-10 pr-3 py-2 rounded bg-[#121212] border border-primary/20 text-white outline-none"
          />
        </div>

        <div className="flex gap-2">
          <Button onClick={openAdd} className="whitespace-nowrap">
            Add Products
          </Button>
        </div>
      </div>

      {/* table */}
      <div className="overflow-x-auto bg-transparent">
        <Table className="border-0">
          <TableHeader>
            <TableRow className="border-none">
              <TableHead className="text-white">Image</TableHead>
              <TableHead className="text-white">Name</TableHead>
              <TableHead className="text-white">Category</TableHead>
              <TableHead className="text-white">Price</TableHead>
              <TableHead className="w-[35%] text-white">Description</TableHead>
              <TableHead className="text-white">Action</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody className="">
            {/* <div className="flex flex-col gap-4 w-full"> */}
            {filtered.map((item) => (
              <TableRow key={item.id} className=" border-none rounded-lg mb-3">
                <TableCell className="bg-[#18181B]">
                  <div className="w-20 h-20 ">
                    {/* use next/image for main image path if remote - using plain img for preview compat */}
                    <Image
                      src={item.img}
                      alt={item.title}
                      height={100}
                      width={100}
                      className="w-full h-full object-cover"
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px] truncate bg-[#18181B]">
                  {item.title}
                </TableCell>
                <TableCell className="max-w-[120px] truncate bg-[#18181B] ">
                  {item.category}
                </TableCell>
                <TableCell className="max-w-[100px] bg-[#18181B] ">
                  {item.price}
                </TableCell>
                <TableCell className="max-w-[350px] bg-[#18181B] ">
                  <div className="line-clamp-2 text-sm text-gray-300 ">
                    {item.description}
                  </div>
                </TableCell>
                <TableCell className="bg-[#18181B] ">
                  <div className="flex gap-2 items-center">
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => openEdit(item)}
                    >
                      <Edit2 size={16} />
                    </Button>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={() => removeProduct(item.id)}
                    >
                      <Trash2
                        size={16}
                        className="text-red-400 bg-transparent"
                      />
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
            {/* </div> */}
          </TableBody>
        </Table>
      </div>

      {/* Dialog (Add / Edit) */}
      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent
          className=" w-full md:w-[80vw] max-h-[90vh] overflow-y-auto scrollbar-hide bg-[#0B0B0B] border border-primary/20"
          style={{ maxWidth: "-webkit-fill-available" }}
        >
          <DialogHeader>
            <DialogTitle className="text-white text-lg">
              {editing ? "Edit Product" : "Add New Product"}
            </DialogTitle>
          </DialogHeader>

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div className="grid gap-4">
              {/* Left column: main fields */}
              <div className="flex flex-col gap-3">
                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300">Product Name</label>
                  <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    className="p-2 rounded border border-primary/20 bg-transparent text-white"
                    placeholder="Product title"
                    required
                  />
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300">Category</label>
                  <input
                    value={category}
                    onChange={(e) => setCategory(e.target.value)}
                    className="p-2 rounded border border-primary/20 bg-transparent text-white"
                    placeholder="Category"
                  />
                </div>

                <div className="flex flex-col gap-2 w-full">
                  <div className="flex-1 flex flex-col gap-1">
                    <label className="text-sm text-gray-300">Price</label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="p-2 rounded border border-primary/20 bg-transparent text-white"
                      placeholder="$299.99"
                    />
                  </div>
                  <div className="w-36 flex flex-col gap-1">
                    <label className="text-sm text-gray-300">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="p-2 rounded border border-primary/20 bg-transparent text-white w-full"
                    />
                  </div>
                </div>

                <div className="flex flex-col gap-1">
                  <label className="text-sm text-gray-300">Description</label>
                  <textarea
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    rows={4}
                    className="p-2 rounded border border-primary/20 bg-transparent text-white resize-none"
                    placeholder="Write a short description"
                  />
                </div>
              </div>

              {/* Right column: uploads & key features */}
              <div className="flex flex-col gap-3">
                {/* Main Image Drag & Drop */}
                <div>
                  <label className="text-sm text-gray-300">Main Image</label>
                  <div
                    onDrop={handleMainDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => mainInputRef.current?.click()}
                    className="mt-2 border border-primary/20 rounded p-3 flex items-center gap-4 cursor-pointer"
                    style={{ minHeight: 120 }}
                  >
                    <input
                      ref={mainInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && setMainImageFile(e.target.files[0])
                      }
                    />
                    {mainImagePreview ? (
                      <div className="w-24 h-24 relative rounded overflow-hidden">
                        <img
                          src={mainImagePreview}
                          className="object-cover w-full h-full"
                          alt="main preview"
                        />
                      </div>
                    ) : (
                      <div className="w-24 h-24 rounded bg-[#0B0B0B] flex items-center justify-center text-gray-400">
                        <Plus />
                      </div>
                    )}

                    <div className="text-sm text-gray-300">
                      <div>Click or drop to upload the main image</div>
                      <div className="text-xs text-gray-500">
                        Supports JPG, PNG
                      </div>
                    </div>
                  </div>
                </div>

                {/* More Images (multiple) */}
                <div>
                  <label className="text-sm text-gray-300">More Images</label>
                  <div
                    onClick={() => moreInputRef.current?.click()}
                    onDrop={handleMoreDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="mt-2 border border-primary/20 rounded p-3 min-h-[80px] flex flex-col gap-2 cursor-pointer"
                  >
                    <input
                      ref={moreInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        if (!e.target.files) return;
                        setMoreImageFiles((cur) => [
                          ...cur,
                          ...Array.from(e.target.files),
                        ]);
                      }}
                    />

                    <div className="flex gap-2 overflow-x-auto items-center">
                      {moreImagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 rounded overflow-hidden border border-primary/20 shrink-0"
                        >
                          <img
                            src={src}
                            className="w-full h-full object-cover"
                          />
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMorePreview(idx);
                            }}
                            className="absolute top-1 right-1 bg-black/50 p-1 rounded"
                          >
                            <X size={14} />
                          </button>
                        </div>
                      ))}

                      {/* PLUS ICON BOX */}
                      <div
                        className="w-20 h-20 flex items-center justify-center rounded border border-dashed border-primary/30 shrink-0 hover:border-primary/60 transition text-white"
                        onClick={(e) => {
                          e.stopPropagation();
                          moreInputRef.current?.click();
                        }}
                      >
                        <Plus size={22} className="opacity-70" />
                      </div>
                    </div>
                  </div>
                </div>

                {/* Video Drag & Drop */}
                <div>
                  <label className="text-sm text-gray-300">
                    How to Use Video (optional)
                  </label>
                  <div
                    onDrop={handleVideoDrop}
                    onDragOver={(e) => e.preventDefault()}
                    className="mt-2 border border-primary/20 rounded p-3 min-h-[100px] flex items-center gap-3"
                  >
                    <input
                      ref={videoInputRef}
                      type="file"
                      accept="video/*"
                      className="hidden"
                      onChange={(e) =>
                        e.target.files && setVideoFile(e.target.files[0])
                      }
                    />

                    {videoPreview ? (
                      <div className="relative w-full">
                        <video
                          src={videoPreview}
                          controls
                          className="w-full max-h-48 rounded border border-primary/30"
                        />
                        <button
                          type="button"
                          onClick={() => {
                            setVideoFile(null);
                            setVideoPreview(null);
                          }}
                          className="absolute top-2 right-2 bg-black/60 px-2 py-1 rounded text-xs"
                        >
                          Remove
                        </button>
                      </div>
                    ) : (
                      <div
                        onClick={() => videoInputRef.current?.click()}
                        className="w-24 h-24 flex flex-col items-center justify-center gap-1 rounded border border-dashed border-primary/30 cursor-pointer hover:border-primary/60 transition"
                      >
                        <Video size={22} className="opacity-70 text-white" />
                        <span className="text-xs text-gray-500">Upload</span>
                      </div>
                    )}
                  </div>
                </div>

                {/* Key Features dynamic list */}
                <div className="border border-primary/20 p-2 rounded-lg">
                  <label className="text-sm text-gray-300">Key Features</label>
                  <div className="flex flex-col gap-2 mt-2">
                    {keyFeatures.map((kf, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          value={kf}
                          onChange={(e) => updateFeature(i, e.target.value)}
                          className="flex-1 p-2 rounded border border-primary/20 bg-transparent text-white"
                          placeholder={`Feature ${i + 1}`}
                        />
                        <button
                          type="button"
                          onClick={() => removeFeature(i)}
                          className="p-2 rounded bg-red-600 text-white"
                          aria-label="Remove feature"
                        >
                          <X size={14} />
                        </button>
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={addFeature}
                      className="self-start"
                    >
                      <Plus size={14} /> Add Feature
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* dialog footer actions */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit">
                {editing ? "Update Product" : "Upload Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
