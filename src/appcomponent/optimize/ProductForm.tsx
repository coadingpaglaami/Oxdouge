"use client";

import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command";
import { FeaturesInput } from "./FeaturesInput";
import { ColorsInput } from "./ColorsInput";
import { ImageUploader } from "./ImageUploader";
import { VideoUploader } from "./VideoUploader";
import {
  useAddCategoryMutation,
  useAddProductMutation,
  useCategoryDeleteMutation,
  useEditProductMutation,
  useGetCategoryQuery,
} from "@/api/productApi";
import { ProductResponse } from "@/interfaces/api";
import { Loader2, XIcon } from "lucide-react";

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
  const [selectedCategoryId, setSelectedCategoryId] = useState<number | null>(
    null
  );
  const [categoryPage, setCategoryPage] = useState(1);
  const { data: categories, isFetching } = useGetCategoryQuery({
    page: categoryPage,
  });
  const [addCategory, { isLoading: categoryLoading }] =
    useAddCategoryMutation();
  console.log(categoryLoading, selected);
  const [addProduct, { isLoading }] = useAddProductMutation();
  const [editProduct, { isLoading: loadingEdit }] = useEditProductMutation();
  const [deleteCategory, { isLoading: categoryDeleting }] =
    useCategoryDeleteMutation();
  const [deletingId, setDeletingId] = useState<number | null>(null);

  const [inputValue, setInputValue] = useState("");

  const filteredCategories =
    categories?.results?.filter((cat) =>
      cat.name.toLowerCase().includes(inputValue.toLowerCase())
    ) || [];

  const hasMorePages =
    categories?.next !== null && categories?.next !== undefined;
  const hasPreviousPages =
    categories?.previous !== null && categories?.previous !== undefined;

  const handleSelect = (id: number) => {
    setSelectedCategoryId(id);
    setCategory(id);
    const selected = categories?.results.find((c) => c.id === id);
    if (selected) setInputValue(selected.name);
  };

  // const handleDeleteCategory = async (id: number) => {
  //   try {
  //     await deleteCategory(id);
  //     toast.success("Category deleted successfully");
  //   } catch (error) {
  //     console.error(error);
  //     toast.error("Failed to delete category");
  //   }
  // };

  const handleDeleteCategory = async (id: number) => {
    try {
      setDeletingId(id); // 🔥 only this category shows loader
      await deleteCategory(id).unwrap();
      toast.success("Category deleted successfully");
    } catch (error) {
      toast.error("Failed to delete category");
    } finally {
      setDeletingId(null); // clear after finish
    }
  };

  const convertUrlsToFiles = async (urls: string[] | undefined) => {
    if (!urls) return [];
    const filePromises = urls.map(async (url, index) => {
      const response = await fetch(url);
      const blob = await response.blob();
      // You can provide a default filename or extract from URL
      const filename = url.split("/").pop() || `image-${index}.jpg`;
      return new File([blob], filename, { type: blob.type });
    });

    return Promise.all(filePromises);
  };

  // Populate form on edit
  useEffect(() => {
    if (editing) {
      console.log("Editing product:", editing);
      setTitle(editing.title);
      setSelectedCategoryId(Number(editing.category) ?? null);
      setCategory(Number(editing.category) ?? "");
      // Set the inputValue to show previously selected category
      setInputValue(editing.category_detail?.name || "");
      setPrice(editing.price);
      setDescription(editing.description || "");
      setQuantity(editing.available_stock ?? 0);
      setColors(editing.colors?.length ? editing.colors : [""]);
      setKeyFeatures(editing.features?.length ? editing.features : [""]);
      setMainFile(null);

      // Convert image URLs to File objects
      convertUrlsToFiles(editing?.images || []).then((files) =>
        setMoreFiles(files)
      );

      // Convert video URL to File object if available
      if (editing.video) {
        fetch(editing.video)
          .then((res) => res.blob())
          .then((blob) => {
            const filename = editing.video?.split("/").pop() || "video.mp4";
            const file = new File([blob], filename, { type: blob.type });
            setVideoFile(file);
          });
      } else {
        setVideoFile(null);
      }
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

  const handleSubmit = async (e?: React.FormEvent) => {
    e?.preventDefault();
    console.log("Submitting product:", {
      title,
      category,
      price,
    });
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
    const uniqueImages = [...new Set(moreFiles)];
    uniqueImages.forEach((file) => formData.append("images_upload", file));

    if (videoFile) formData.append("video_upload", videoFile);

    try {
      if (editing?.id) {
        const res = await editProduct({ id: editing.id, formData });
        res.data
          ? toast.success("Product updated")
          : toast.error("Update failed");
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

  const createCategory = async (name: string) => {
    const res = await addCategory({ name });
    if (res.data) {
      setCategory(res.data.id);
      toast.success("Category created");
      setInputValue("");
    } else {
      toast.error("Category creation failed");
    }
  };
  console.log(
    hasMorePages,
    "hasmorepages",
    hasPreviousPages,
    "hasPreviousPages"
  );

  return (
    <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
      <div className="grid gap-4 w-full">
        {/* Left */}
        <div className="flex flex-col gap-3">
          <label htmlFor="title" className="text-sm text-gray-300">
            Product Title
          </label>
          <input
            id="title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            placeholder="Product title"
            className="p-2 rounded border border-primary/20 bg-transparent text-white"
            required
          />

          <div className="flex gap-2">
            <div className="flex flex-col flex-1">
              <label htmlFor="price" className="text-sm text-gray-300">
                Price
              </label>
              <input
                id="price"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Price"
                className="p-2 rounded border border-primary/20 bg-transparent text-white"
                required
              />
            </div>

            <div className="flex flex-col w-24">
              <label htmlFor="discount" className="text-sm text-gray-300">
                Discount (%)
              </label>
              <input
                id="discount"
                type="number"
                value={discount}
                onChange={(e) => setDiscount(Number(e.target.value))}
                placeholder="0"
                className="p-2 rounded border border-primary/20 bg-transparent text-white"
              />
            </div>

            <div className="flex flex-col w-24">
              <label htmlFor="quantity" className="text-sm text-gray-300">
                Stock
              </label>
              <input
                id="quantity"
                type="number"
                value={quantity}
                onChange={(e) => setQuantity(Number(e.target.value))}
                placeholder="0"
                className="p-2 rounded border border-primary/20 bg-transparent text-white"
                required
              />
            </div>
          </div>
          <div className="flex gap-2 items-center">
            <label htmlFor="category" className="text-sm text-gray-300">
              Category
            </label>

            <Popover>
              <PopoverTrigger asChild>
                <Button variant="outline" className="w-64 text-left text-white">
                  {inputValue || "Select category"}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-64 p-0 bg-[#121212] border border-primary">
                <Command>
                  {/* Search */}
                  <CommandInput
                    placeholder="Search or type new category..."
                    value={inputValue}
                    onValueChange={(value) => {
                      setInputValue(value);
                      setCategoryPage(1);
                    }}
                    className="bg-black text-white"
                  />

                  <CommandEmpty className="text-white p-3 text-center">
                    No category found.
                  </CommandEmpty>

                  {/* Category List */}
                  <CommandGroup className="max-h-64 overflow-y-auto">
                    {isFetching ? (
                      <div className="flex justify-center py-4">
                        <Loader2
                          className="animate-spin text-white"
                          size={20}
                        />
                      </div>
                    ) : (
                      <>
                        <div
                          className="flex justify-between items-center p-2 border-t border-primary text-sm text-gray-400"
                          style={{
                            display: hasPreviousPages ? "" : "none",
                          }}
                        >
                          <button
                            onClick={() =>
                              setCategoryPage((p) => Math.max(p - 1, 1))
                            }
                            className="hover:text-white"
                          >
                            ← Show Earlier Categories
                          </button>
                        </div>
                        {filteredCategories.map((cat) => (
                          <CommandItem
                            key={cat.id}
                            onSelect={() => handleSelect(cat.id)}
                            className={`flex justify-between items-center cursor-pointer ${
                              selectedCategoryId === cat.id
                                ? "bg-primary text-black "
                                : "text-white"
                            }`}
                          >
                            <span>{cat.name}</span>

                            {/* Delete Icon */}
                            <button
                              className="p-1 hover:text-red-400"
                              onClick={(e) => {
                                e.stopPropagation(); // prevent selecting while deleting
                                handleDeleteCategory(cat.id);
                              }}
                              disabled={deletingId === cat.id}
                            >
                              {deletingId === cat.id ? (
                                <Loader2 className="animate-spin" size={14} />
                              ) : (
                                <XIcon size={14} />
                              )}
                            </button>
                          </CommandItem>
                        ))}
                      </>
                    )}
                  </CommandGroup>

                  {/* "Create new" option */}
                  {inputValue &&
                    !categories?.results?.some(
                      (cat) =>
                        cat.name.toLowerCase() === inputValue.toLowerCase()
                    ) && (
                      <CommandItem
                        onSelect={() => createCategory(inputValue)}
                        className="text-green-400 cursor-pointer"
                      >
                        Create {'"'}
                        {inputValue}
                        {'"'} category
                      </CommandItem>
                    )}

                  {/* Pagination Controls */}
                  <div
                    className="flex justify-between items-center p-2 border-t border-primary text-sm text-gray-400"
                    style={{
                      display: hasMorePages ? "" : "none",
                    }}
                  >
                    {/* {hasPreviousPages ? (
                      <button
                        onClick={() =>
                          setCategoryPage((p) => Math.max(p - 1, 1))
                        }
                        className="hover:text-white"
                      >
                        ← Show Earlier Categories
                      </button>
                    ) : (
                      <span></span>
                    )} */}
                    {hasMorePages && (
                      <button
                        onClick={() => setCategoryPage((p) => p + 1)}
                        className="hover:text-white text-center"
                      >
                        See More Categories →
                      </button>
                    )}
                  </div>
                </Command>
              </PopoverContent>
            </Popover>
          </div>

          <label htmlFor="description" className="text-sm text-gray-300">
            Description
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={4}
            placeholder="Enter a short product description..."
            className="p-2 rounded border border-primary/20 bg-transparent text-white"
          />
        </div>

        {/* Right */}
        <div className="flex flex-col gap-3">
          <div>
            <label className="text-sm text-gray-300">Main Image</label>
            <ImageUploader
              mainFile={mainFile}
              setMainFile={setMainFile}
              moreFiles={moreFiles}
              setMoreFiles={setMoreFiles}
              editing={editing}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Product Video</label>
            <VideoUploader videoFile={videoFile} setVideoFile={setVideoFile} />
          </div>

          <div>
            <label className="text-sm text-gray-300">Key Features</label>
            <FeaturesInput
              features={keyFeatures}
              setFeatures={setKeyFeatures}
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Available Colors</label>
            <ColorsInput colors={colors} setColors={setColors} />
          </div>
        </div>
      </div>

      <div className="flex justify-center gap-4 mt-4">
        <Button type="button" variant="outline" onClick={onClose}>
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
  );
};
