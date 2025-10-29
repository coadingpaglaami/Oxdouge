import { createApi } from "@reduxjs/toolkit/query/react";
import rawBaseQuery from "./api";
import { PaginatedProductsResponse, ProductResponse } from "@/interfaces/api";
import { ProductDetails } from "@/appcomponent/products";

const admin = "/admin/";

interface EditProductArgs {
  id: number;
  formData: FormData;
}
export interface CategoryResponse {
  id: number;
  name: string;
}
interface CategoryRequest {
  name: string;
}
export interface PaginatedCategories {
  count: number;
  next: string | null;
  previous: string | null;
  results: CategoryResponse[]; // Reusing the previously defined Category interface
}
export const productApi = createApi({
  reducerPath: "productApi",
  baseQuery: rawBaseQuery,
  tagTypes: ["Product", "UserProduct"],
  endpoints: (builder) => ({
    addProduct: builder.mutation<ProductResponse, FormData>({
      query: (formData) => ({
        url: `${admin}products/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    getProduct: builder.query<PaginatedProductsResponse, void>({
      query: () => ({
        url: `${admin}products/`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getProductDetails: builder.query<ProductResponse, number>({
      query: (id: number) => `${admin}products/${id}/`,
      providesTags: ["Product"],
    }),
    getProductUser: builder.query<PaginatedProductsResponse, void>({
      query: () => `products/`,
      providesTags: ["UserProduct"],
    }),
    delteteProduct: builder.mutation<{ message: string }, number>({
      query: (id: number) => ({
        url: `${admin}products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getCategory: builder.query<PaginatedCategories, void>({
      query: () => `${admin}categories/`,
    }),
    editProduct: builder.mutation<ProductResponse, EditProductArgs>({
      query: ({ id, formData }) => ({
        url: `${admin}products/${id}/`,
        method: "PATCH",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    addCategory: builder.mutation<CategoryResponse, CategoryRequest>({
      query: ({ name }) => ({
        url: `${admin}categories/`,
        method: "POST",
        body: name,
      }),
    }),
    ProductDetails: builder.query<ProductResponse, number>({
      query: (id: number) => `products/${id}/`,
      providesTags: ["UserProduct"],
    }),
    reviewProduct: builder.mutation<
      void,
      { productId: number; rating: number; comment: string }
    >({
      query: ({ productId, rating, comment }) => ({
        url: `product/${productId}/reviews/`,
        method: "POST",
        body: { rating, comment },
      }),
      invalidatesTags: ["UserProduct"],
    }),
  }),
});

export const {
  useAddProductMutation,
  useGetProductQuery,
  useGetProductDetailsQuery,
  useGetProductUserQuery,
  useDelteteProductMutation,
  useGetCategoryQuery,
  useEditProductMutation,
  useAddCategoryMutation,
  useProductDetailsQuery,
  useReviewProductMutation,
} = productApi;
