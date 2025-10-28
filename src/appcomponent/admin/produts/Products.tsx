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
import {
  useAddCategoryMutation,
  useAddProductMutation,
  useGetCategoryQuery,
  useGetProductDetailsQuery,
  useGetProductQuery,
  useEditProductMutation,
  useDelteteProductMutation,
} from "@/api/productApi";
import { toast } from "sonner";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ProductResponse } from "@/interfaces/api";

type Product = (typeof initialProducts)[number];

export const Prodcuts = () => {
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [open, setOpen] = useState(false);
  const [editing, setEditing] = useState<ProductResponse | null>(null);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: loadingEdit }] = useEditProductMutation();
  const { data: cateogries, isLoading: categoryLoading } =
    useGetCategoryQuery();
  const [addcategory, { isLoading: cateLoading }] = useAddCategoryMutation();
  const { data: productDetails } = useGetProductDetailsQuery(1);
  const { data: allProduct, isLoading: productLoad } = useGetProductQuery();
  const [deleteProduct, { isLoading: deleting }] = useDelteteProductMutation();
  const [selected, setSelected] = useState<string | undefined>();

  // Form state
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [colors, setColors] = useState<string[]>([""]);
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

  // Reset form
  const resetForm = () => {
    setTitle("");
    setCategory("");
    setPrice("");
    setDescription("");
    setQuantity(0);
    setDiscount(0);
    setColors([""]);
    setMainImageFile(null);
    setMainImagePreview(null);
    setMoreImageFiles([]);
    setMoreImagePreviews([]);
    setVideoFile(null);
    setVideoPreview(null);
    setKeyFeatures([""]);
    setEditing(null);
    setSelected(undefined);
  };

  // Populate form when editing
  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setCategory(Number(editing.category) ?? "");
      setSelected(String(editing.category));
      setPrice(editing.price);
      setDescription(editing.description);
      setQuantity(editing.available_stock ?? 0);
      setMainImagePreview(editing.main_image ?? null);
      setMoreImagePreviews(editing.images ?? []);
      setVideoPreview(editing.video ?? null);
      setKeyFeatures(editing.features?.length ? editing.features : [""]);
    }
  }, [editing]);

  // Main image preview
  useEffect(() => {
    if (mainImageFile) {
      const url = URL.createObjectURL(mainImageFile);
      setMainImagePreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [mainImageFile]);

  // More images preview
  useEffect(() => {
    if (moreImageFiles.length) {
      const urls = moreImageFiles.map((f) => URL.createObjectURL(f));
      setMoreImagePreviews(urls);
      return () => urls.forEach((u) => URL.revokeObjectURL(u));
    } else {
      setMoreImagePreviews([]);
    }
  }, [moreImageFiles]);

  // Video preview
  useEffect(() => {
    if (videoFile) {
      const url = URL.createObjectURL(videoFile);
      setVideoPreview(url);
      return () => URL.revokeObjectURL(url);
    }
  }, [videoFile]);

  // Drag & drop handlers
  const handleMainDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file && file.type.startsWith("image/")) {
      setMainImageFile(file);
    }
  };

  const handleMoreDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const files = e.dataTransfer.files ? Array.from(e.dataTransfer.files) : [];
    const imageFiles = files.filter((f) => f.type.startsWith("image/"));
    if (imageFiles.length) setMoreImageFiles((cur) => [...cur, ...imageFiles]);
  };

  const handleVideoDrop: React.DragEventHandler<HTMLDivElement> = (e) => {
    e.preventDefault();
    const file = e.dataTransfer.files?.[0] ?? null;
    if (file && file.type.startsWith("video/")) {
      setVideoFile(file);
    }
  };

  // handle category select
  const handleSelect = (value: string) => {
    setSelected(value);
    const id = Number(value);
    setCategory(id);
  };

  // Color handlers
  const updateColor = (index: number, value: string) => {
    setColors((prev) => prev.map((v, i) => (i === index ? value : v)));
  };
  const addColor = () => setColors((prev) => [...prev, ""]);
  const removeColor = (index: number) =>
    setColors((prev) => prev.filter((_, i) => i !== index));

  // Key features handlers
  const updateFeature = (index: number, value: string) => {
    setKeyFeatures((prev) => prev.map((v, i) => (i === index ? value : v)));
  };
  const addFeature = () => setKeyFeatures((prev) => [...prev, ""]);
  const removeFeature = (index: number) =>
    setKeyFeatures((prev) => prev.filter((_, i) => i !== index));

  // Add / Update Product
  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();

    // Validation
    if (!title.trim()) {
      toast.error("Product title is required");
      return;
    }
    if (!category) {
      toast.error("Please select a category");
      return;
    }
    if (!price.trim()) {
      toast.error("Price is required");
      return;
    }
    if (!mainImageFile && !editing) {
      toast.error("Main image is required");
      return;
    }

    // Create FormData
    const formData = new FormData();

    // Add text fields
    formData.append("title", title);
    formData.append("category", String(category));
    formData.append("price", price);
    formData.append("description", description);
    formData.append("available_stock", String(quantity));
    formData.append("discount", String(discount));

    // Add colors array (filter out empty values)
    const validColors = colors.filter((c) => c.trim() !== "");
    validColors.forEach((color) => {
      formData.append("colors", color);
    });

    // Add features array (filter out empty values)
    const validFeatures = keyFeatures.filter((k) => k.trim() !== "");
    validFeatures.forEach((feature) => {
      formData.append("features", feature);
    });

    // Add main image
    if (mainImageFile) {
      formData.append("main_image_upload", mainImageFile);
    }

    // Add multiple images
    moreImageFiles.forEach((file) => {
      formData.append("images", file);
    });

    // Add video if exists
    if (videoFile) {
      formData.append("video_upload", videoFile);
    }

    try {
      if (editing?.id) {
        const response = await editProduct({ id: editing.id, formData });
        if (response.data) {
          toast.success("Product updated successfully");
          setOpen(false);
          resetForm();
        } else if (response.error) {
          toast.error("Failed to update product");
        }
      } else {
        const response = await addProduct(formData);
        if (response.data) {
          toast.success("Product added successfully");
          setOpen(false);
          resetForm();
        } else if (response.error) {
          toast.error("Failed to add product");
        }
      }
    } catch (error) {
      console.error("Error submitting product:", error);
      toast.error("An error occurred while saving the product");
    }
  };

  const openAdd = () => {
    resetForm();
    setEditing(null);
    setOpen(true);
  };

  const openEdit = (p: ProductResponse) => {
    setEditing(p);
    setOpen(true);
  };

  const removeProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error("Error deleting product:", error);
    }
  };

  const removeMorePreview = (index: number) => {
    setMoreImagePreviews((prev) => prev.filter((_, i) => i !== index));
    setMoreImageFiles((prev) => prev.filter((_, i) => i !== index));
  };

  // Search filter
  const [search, setSearch] = useState("");
  const filtered = products.filter((p) =>
    `${p.title} ${p.category} ${p.description}`
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div className="p-6">
      <Breadcrumb title="Products" subtitle="Manage your product catalog" />

      {/* Search + Add */}
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

      {/* Table */}
      <div className="overflow-x-auto bg-transparent">
        <Table>
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
          <TableBody>
            {allProduct?.results.map((item) => (
              <TableRow key={item.id} className="border-none rounded-lg mb-3">
                <TableCell className="bg-[#18181B]">
                  <div className="w-20 h-20 relative">
                    <Image
                      src={item.main_image}
                      alt={item.title}
                      fill
                      className="object-cover rounded"
                      unoptimized
                    />
                  </div>
                </TableCell>
                <TableCell className="max-w-[150px] truncate bg-[#18181B]">
                  {item.title}
                </TableCell>
                <TableCell className="max-w-[120px] truncate bg-[#18181B]">
                  {item.category}
                </TableCell>
                <TableCell className="max-w-[100px] bg-[#18181B]">
                  {item.price}
                </TableCell>
                <TableCell className="max-w-[350px] bg-[#18181B]">
                  <div className="line-clamp-2 text-sm text-gray-300">
                    {item.description}
                  </div>
                </TableCell>
                <TableCell className="bg-[#18181B]">
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
                      onClick={() => removeProduct(item.id || 0)}
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
          </TableBody>
        </Table>
      </div>

      {/* Dialog (Add/Edit) */}
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

          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div className="grid gap-4 w-full">
              {/* Left column: fields */}
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

                <div className="flex items-center justify-between gap-2">
                  <div className="flex w-full flex-col gap-1">
                    <label className="text-sm text-gray-300">Price</label>
                    <input
                      value={price}
                      onChange={(e) => setPrice(e.target.value)}
                      className="p-2 rounded border border-primary/20 bg-transparent text-white"
                      placeholder="299.99"
                      required
                    />
                  </div>

                  <div className="flex w-full flex-col gap-1">
                    <label className="text-sm text-gray-300">
                      Discount (%)
                    </label>
                    <input
                      type="number"
                      value={discount}
                      onChange={(e) => setDiscount(Number(e.target.value))}
                      className="p-2 rounded border border-primary/20 bg-transparent text-white w-full"
                      placeholder="0"
                      min="0"
                      max="100"
                    />
                  </div>

                  <div className="flex w-full flex-col gap-1">
                    <label className="text-sm text-gray-300">
                      Stock Quantity
                    </label>
                    <input
                      type="number"
                      value={quantity}
                      onChange={(e) => setQuantity(Number(e.target.value))}
                      className="p-2 rounded border border-primary/20 bg-transparent text-white w-full"
                      required
                    />
                  </div>

                  <div className="flex flex-col w-full gap-1">
                    <label className="text-sm text-gray-300">Category</label>
                    <Select value={selected} onValueChange={handleSelect}>
                      <SelectTrigger className="w-full">
                        <SelectValue placeholder="Select category" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {cateogries?.results?.map((cat) => (
                            <SelectItem
                              className="text-white bg-black"
                              key={cat.id}
                              value={String(cat.id)}
                            >
                              {cat.name}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
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

              {/* Right column: uploads + features */}
              <div className="flex flex-col gap-3">
                {/* Main Image */}
                <div>
                  <label className="text-sm text-gray-300">Main Image *</label>
                  <div
                    onDrop={handleMainDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => mainInputRef.current?.click()}
                    className="mt-2 border border-primary/20 rounded p-3 flex items-center gap-4 cursor-pointer hover:border-primary/40 transition"
                    style={{ minHeight: 120 }}
                  >
                    <input
                      ref={mainInputRef}
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) =>
                        setMainImageFile(e.target.files?.[0] ?? null)
                      }
                    />
                    {mainImagePreview ? (
                      <div className="relative">
                        <img
                          src={mainImagePreview}
                          alt="main preview"
                          className="object-cover w-24 h-24 rounded"
                        />
                        {mainImageFile && (
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              setMainImageFile(null);
                              setMainImagePreview(null);
                            }}
                            className="absolute -top-2 -right-2 bg-red-600 rounded-full p-1"
                          >
                            <X size={14} />
                          </button>
                        )}
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

                {/* More Images */}
                <div>
                  <label className="text-sm text-gray-300">More Images</label>
                  <div
                    onDrop={handleMoreDrop}
                    onDragOver={(e) => e.preventDefault()}
                    onClick={() => moreInputRef.current?.click()}
                    className="mt-2 border border-primary/20 rounded p-3 min-h-20 flex flex-col gap-2 cursor-pointer hover:border-primary/40 transition"
                  >
                    <input
                      ref={moreInputRef}
                      type="file"
                      accept="image/*"
                      multiple
                      className="hidden"
                      onChange={(e) => {
                        const files = e.target.files
                          ? Array.from(e.target.files)
                          : [];
                        if (files.length)
                          setMoreImageFiles((cur) => [...cur, ...files]);
                      }}
                    />
                    <div className="flex gap-2 overflow-x-auto items-center">
                      {moreImagePreviews.map((src, idx) => (
                        <div
                          key={idx}
                          className="relative w-20 h-20 rounded overflow-hidden border border-primary/20 shrink-0"
                        >
                          <Image
                            src={src}
                            alt={`preview ${idx}`}
                            width={80}
                            height={80}
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

                      {/* Plus icon */}
                      <div
                        className="w-20 h-20 flex items-center justify-center rounded border border-dashed border-primary/30 shrink-0 hover:border-primary/60 transition text-white cursor-pointer"
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

                {/* Video Upload */}
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
                        setVideoFile(e.target.files?.[0] ?? null)
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

                {/* Key Features */}
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
                        {keyFeatures.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeFeature(i)}
                            className="p-2 rounded bg-red-600 text-white"
                            aria-label="Remove feature"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addFeature}
                      className="self-start"
                    >
                      <Plus size={14} /> Add Feature
                    </Button>
                  </div>
                </div>

                {/* Colors */}
                <div className="border border-primary/20 p-2 rounded-lg">
                  <label className="text-sm text-gray-300">
                    Available Colors
                  </label>
                  <div className="flex flex-col gap-2 mt-2">
                    {colors.map((color, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          value={color}
                          onChange={(e) => updateColor(i, e.target.value)}
                          className="flex-1 p-2 rounded border border-primary/20 bg-transparent text-white"
                          placeholder={`Color ${i + 1} (e.g., Red, Blue)`}
                        />
                        {colors.length > 1 && (
                          <button
                            type="button"
                            onClick={() => removeColor(i)}
                            className="p-2 rounded bg-red-600 text-white"
                            aria-label="Remove color"
                          >
                            <X size={14} />
                          </button>
                        )}
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      onClick={addColor}
                      className="self-start"
                    >
                      <Plus size={14} /> Add Color
                    </Button>
                  </div>
                </div>
              </div>
            </div>

            {/* Dialog actions */}
            <div className="flex items-center justify-center gap-4 mt-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => {
                  setOpen(false);
                  resetForm();
                }}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isLoading || loadingEdit}>
                {isLoading || loadingEdit
                  ? "Saving..."
                  : editing
                  ? "Update Product"
                  : "Upload Product"}
              </Button>
            </div>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
};
