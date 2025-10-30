"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Edit2, Trash2, Search } from "lucide-react";
import {
  useGetProductQuery,
  useDelteteProductMutation,
} from "@/api/productApi";
import { toast } from "sonner";
import { ProductResponse } from "@/interfaces/api";

interface Props {
  onEdit: (product: ProductResponse) => void;
  openAdd: (product: ProductResponse) => void;
}

export const ProductTable = ({ onEdit, openAdd }: Props) => {
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState("");
  const { data: allProduct } = useGetProductQuery(page);
  const [deleteProduct] = useDelteteProductMutation();

  const totalPages = allProduct ? Math.ceil(allProduct.count / 10) : 1;

  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) setPage(newPage);
  };

  const filteredProducts = useMemo(
    () =>
      allProduct?.results.filter((p) =>
        `${p.title} ${p.category?.name} ${p.description}`
          .toLowerCase()
          .includes(search.toLowerCase())
      ),
    [search, allProduct]
  );

  const removeProduct = async (id: number) => {
    try {
      await deleteProduct(id);
      toast.success("Product deleted successfully");
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete product");
    }
  };

  return (
    <div className="overflow-x-auto">
      {/* Search */}
      <div className="flex items-center flex-col gap-2 md:flex-row">
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
        <div className="flex py-4">
          <Button onClick={() => openAdd}>Add Products</Button>
        </div>
      </div>

      <Table>
        <TableHeader>
          <TableRow className="border-none">
            <TableHead className="text-white">Image</TableHead>
            <TableHead className="text-white">Name</TableHead>
            <TableHead className="text-white">Category</TableHead>
            <TableHead className="text-white">Price</TableHead>
            <TableHead className="text-white">Description</TableHead>
            <TableHead className="text-white">Action</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {filteredProducts?.map((item) => (
            <TableRow key={item.id}>
              <TableCell>
                <div className="w-20 h-20 relative">
                  <Image
                    src={item.main_image || ""}
                    alt={item.title}
                    fill
                    className="object-cover rounded"
                    unoptimized
                    loading="lazy"
                  />
                </div>
              </TableCell>
              <TableCell>{item.title}</TableCell>
              <TableCell>{item.category.name}</TableCell>
              <TableCell>{item.price}</TableCell>
              <TableCell className="line-clamp-2">{item.description}</TableCell>
              <TableCell>
                <div className="flex gap-2 items-center">
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => onEdit(item)}
                  >
                    <Edit2 size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    size="icon"
                    onClick={() => removeProduct(item.id || 0)}
                  >
                    <Trash2 size={16} className="text-red-400" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>

      {/* Pagination */}
      <div className="flex justify-center items-center gap-2 mt-4">
        {allProduct?.previous && (
          <Button onClick={() => handlePageChange(page - 1)}>Prev</Button>
        )}
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <Button
            key={p}
            variant={p === page ? "default" : "outline"}
            onClick={() => handlePageChange(p)}
          >
            {p}
          </Button>
        ))}
        {allProduct?.next && (
          <Button onClick={() => handlePageChange(page + 1)}>Next</Button>
        )}
      </div>
    </div>
  );
};
