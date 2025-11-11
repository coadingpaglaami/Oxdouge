"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heater } from "../reusable";
import {  useGetProductUserQuery, useGetUserCategoryQuery } from "@/api/productApi";
import { ChevronLeft, ChevronRight, Loader2 } from "lucide-react";

export const Products = () => {
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [productPage, setProductPag] = useState(1);
  const [page, setPage] = useState(1);

  // Fetch product data with category filter and pagination
  const { data, isLoading } = useGetProductUserQuery({
    category: activeCategoryId || 0,
    productPage,
  });

  // Fetch category data
  const {
    data: categoryData,
    isLoading: categoryLoading,
    isFetching,
  } = useGetUserCategoryQuery({ page });

  const limit = 10;
  const categories = categoryData?.results || [];
  const total = categoryData?.count || 0;
  const totalPages = Math.ceil(total / limit);

  const productLimit = 10;
  const totalProducts = data?.count || 0;
  const totalProductPages = Math.ceil(totalProducts / productLimit);

  const handlePoducNext = () => {
    if (productPage < totalProductPages) setProductPag((p) => p + 1);
  };
  const handlePoducPrevious = () => {
    if (productPage > 1) setProductPag((p) => p - 1);
  };

  const handleNext = () => {
    if (page < totalPages) setPage((p) => p + 1);
  };
  const handlePrevious = () => {
    if (page > 1) setPage((p) => p - 1);
  };

  // Pagination number generator (first 3, last 3)
  const getVisiblePages = () => {
    if (totalProductPages <= 6) {
      return Array.from({ length: totalProductPages }, (_, i) => i + 1);
    }

    if (productPage <= 3) {
      return [
        1,
        2,
        3,
        "...",
        totalProductPages - 2,
        totalProductPages - 1,
        totalProductPages,
      ];
    }

    if (productPage >= totalProductPages - 2) {
      return [
        1,
        2,
        3,
        "...",
        totalProductPages - 2,
        totalProductPages - 1,
        totalProductPages,
      ];
    }

    return [
      1,
      "...",
      productPage - 1,
      productPage,
      productPage + 1,
      "...",
      totalProductPages,
    ];
  };

  return (
    <div className="flex flex-col gap-10 w-full py-20">
      {/* Header Section */}
      <div className="flex flex-col items-center text-center px-4">
        <h2 className="text-3xl md:text-4xl font-semibold text-white">
          Our Products
        </h2>
        <p className="mt-4 max-w-3xl text-[#BEBABA]">
          We{"'"}re committed to providing outdoor enthusiasts with reliable,
          portable power solutions that keep you connected and powered wherever
          your adventures take you.
        </p>
      </div>

      {/* Category Tabs */}
      <div className="flex justify-center items-center gap-2 w-full py-4 overflow-x-auto scrollbar-hide">
        {/* Prev Button */}
        {page > 1 && (
          <Button
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={handlePrevious}
            className="shrink-0"
          >
            {isFetching ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <ChevronLeft size={16} />
            )}
          </Button>
        )}

        {/* Category Buttons */}
        {categoryLoading ? (
          <Loader2 className="animate-spin mx-4" size={22} />
        ) : (
          <>
            <Button
              variant={activeCategoryId === null ? "default" : "outline"}
              onClick={() => {
                setActiveCategoryId(null);
                setProductPag(1);
              }}
              className="shrink-0"
            >
              All
            </Button>

            {categories.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategoryId === cat.id ? "default" : "outline"}
                onClick={() => {
                  console.log(cat);
                  setActiveCategoryId(cat.id);
                  setProductPag(1);
                }}
                className="shrink-0"
              >
                {cat.name}
              </Button>
            ))}
          </>
        )}

        {/* Next Button */}
        {page < totalPages && (
          <Button
            variant="outline"
            size="sm"
            disabled={isFetching}
            onClick={handleNext}
            className="shrink-0"
          >
            {isFetching ? (
              <Loader2 className="animate-spin" size={16} />
            ) : (
              <ChevronRight size={16} />
            )}
          </Button>
        )}
      </div>

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8 px-6">
        {isLoading ? (
          <div className="col-span-full flex justify-center items-center py-20">
            <Loader2 className="animate-spin" size={28} />
          </div>
        ) : data?.results?.length ? (
          data.results.map((item) => <Heater key={item.id} {...item} />)
        ) : (
          <p className="text-center text-gray-400 col-span-full py-20">
            No products found.
          </p>
        )}
      </div>

      {/* Product Pagination */}
      {totalProductPages > 1 && (
        <div className="flex justify-center items-center gap-2 mt-8">
          {/* Previous Button */}
          {productPage > 1 && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePoducPrevious}
              className="shrink-0"
            >
              Prev
            </Button>
          )}

          {/* Page Numbers */}
          {getVisiblePages().map((pageNum, index) =>
            pageNum === "..." ? (
              <span key={index} className="text-gray-400 px-2">
                ...
              </span>
            ) : (
              <Button
                key={pageNum}
                variant={productPage === pageNum ? "default" : "outline"}
                size="sm"
                onClick={() => setProductPag(pageNum as number)}
                className="shrink-0"
              >
                {pageNum}
              </Button>
            )
          )}

          {/* Next Button */}
          {productPage < totalProductPages && (
            <Button
              variant="outline"
              size="sm"
              onClick={handlePoducNext}
              className="shrink-0"
            >
              Next
            </Button>
          )}
        </div>
      )}
    </div>
  );
};
