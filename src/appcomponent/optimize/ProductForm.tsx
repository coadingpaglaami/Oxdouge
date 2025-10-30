"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Select, SelectContent, SelectGroup, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { FeaturesInput } from "./FeaturesInput";
import { ColorsInput } from "./ColorsInput";
import { ImageUploader } from "./ImageUploader";
import { VideoUploader } from "./VideoUploader";
import {
  useAddProductMutation,
  useEditProductMutation,
  useGetCategoryQuery,
} from "@/api/productApi";
import { ProductResponse } from "@/interfaces/api";

interface Props {
  editing: ProductResponse | null;
  onClose: () => void;
}

export const ProductForm = ({ editing, onClose }: Props) => {
  const [title, setTitle] = useState("");
  const [category, setCategory] = useState<number | "">("");
  const [selected, setSelected] = useState<string | undefined>();
  const [price, setPrice] = useState("");
  const [description, setDescription] = useState("");
  const [quantity, setQuantity] = useState<number>(0);
  const [discount, setDiscount] = useState<number>(0);
  const [colors, setColors] = useState<string[]>([""]);
  const [keyFeatures, setKeyFeatures] = useState<string[]>([""]);
  const [mainFile, setMainFile] = useState<File | null>(null);
  const [moreFiles, setMoreFiles] = useState<File[]>([]);
  const [videoFile, setVideoFile] = useState<File | null>(null);

  const { data: categories } = useGetCategoryQuery();
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: loadingEdit }] = useEditProductMutation();

  // Populate form on edit
  useEffect(() => {
    if (editing) {
      setTitle(editing.title);
      setCategory(Number(editing.category) ?? "");
      setSelected(String(editing.category));
      setPrice(editing.price);
      setDescription(editing.description || "");
      setQuantity(editing.available_stock ?? 0);
      setColors(editing.colors?.length ? editing.colors : [""]);
      setKeyFeatures(editing.features?.length ? editing.features : [""]);
      setMainFile(null);
      setMoreFiles([]);
      setVideoFile(null);
    } else {
      resetForm();
    }
  }, [editing]);

  const resetForm = () => {
    setTitle("");
    setCategory("");
    setSelected(undefined);
    setPrice("");
    setDescription("");
    setQuantity(0);
    setDiscount(0);
    setColors([""]);
    setKeyFeatures([""]);
    setMainFile(null);
    setMoreFiles([]);
    setVideoFile(null);
  };

  const handleSelect = (value: string) => {
    setSelected(value);
    setCategory(Number(value));
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    if (!title.trim() || !category || !price.trim()) {
      toast.error("Please fill all required fields");
      return;
    }
    if (!mainFile && !editing) {
      toast.error("Main image is required");
      return;
    }

    const formData = new FormData();
    formData.append("title", title);
    formData.append("category", String(category));
    formData.append("price", price);
    formData.append("description", description);
    formData.append("available_stock", String(quantity));
    formData.append("discount", String(discount));

    colors.filter(Boolean).forEach((c) => formData.append("colors", c));
    keyFeatures.filter(Boolean).forEach((f) => formData.append("features", f));
    if (mainFile) formData.append("main_image_upload", mainFile);
    moreFiles.forEach((file) => formData.append("images", file));
    if (videoFile) formData.append("video_upload", videoFile);

    try {
      if (editing?.id) {
        const res = await editProduct({ id: editing.id, formData });
        res.data ? toast.success("Product updated") : toast.error("Update failed");
      } else {
        const res = await addProduct(formData);
        res.data ? toast.success("Product added") : toast.error("Add failed");
      }
      onClose();
      resetForm();
    } catch (error) {
      console.error(error);
      toast.error("Something went wrong");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
      <div className="grid gap-4 w-full ">
        {/* Left */}
        <div className="flex flex-col gap-3">
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product title"
            className="p-2 rounded border border-primary/20 bg-transparent text-white"
            required
          />
          <div className="flex gap-2">
            <input
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="Price"
              className="p-2 rounded border border-primary/20 bg-transparent text-white flex-1"
              required
            />
            <input
              type="number"
              value={discount}
              onChange={(e) => setDiscount(Number(e.target.value))}
              placeholder="Discount %"
              className="p-2 rounded border border-primary/20 bg-transparent text-white w-24"
            />
            <input
              type="number"
              value={quantity}
              onChange={(e) => setQuantity(Number(e.target.value))}
              placeholder="Stock"
              className="p-2 rounded border border-primary/20 bg-transparent text-white w-24"
              required
            />
          </div>
          <Select value={selected} onValueChange={handleSelect}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select category" />
            </SelectTrigger>
            <SelectContent>
              <SelectGroup>
                {categories?.results?.map((cat) => (
                  <SelectItem key={cat.id} value={String(cat.id)}>
                    {cat.name}
                  </SelectItem>
                ))}
              </SelectGroup>
            </SelectContent>
          </Select>
          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Description"
            className="p-2 rounded border border-primary/20 bg-transparent text-white"
          />
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3">
          <ImageUploader
            mainFile={mainFile}
            setMainFile={setMainFile}
            moreFiles={moreFiles}
            setMoreFiles={setMoreFiles}
            editing={editing}
          />
          <VideoUploader videoFile={videoFile} setVideoFile={setVideoFile} />
          <FeaturesInput features={keyFeatures} setFeatures={setKeyFeatures} />
          <ColorsInput colors={colors} setColors={setColors} />
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button type="submit" disabled={isLoading || loadingEdit}>
          {isLoading || loadingEdit ? "Saving..." : editing ? "Update Product" : "Upload Product"}
        </Button>
      </div>
    </form>
  );
};
