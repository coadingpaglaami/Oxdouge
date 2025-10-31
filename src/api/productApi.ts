import { createApi } from "@reduxjs/toolkit/query/react";
import rawBaseQuery from "./api";
import { PaginatedProductsResponse, ProductResponse, ProductReviewResponse } from "@/interfaces/api";

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
  tagTypes: ["Product", "UserProduct", "Category"],
  endpoints: (builder) => ({
    addProduct: builder.mutation<ProductResponse, FormData>({
      query: (formData) => ({
        url: `${admin}products/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Product"],
    }),
    getProduct: builder.query<
      PaginatedProductsResponse,
      { page?: number; search?: string }
    >({
      query: ({ page, search }) => ({
        url: `${admin}products/?page=${page}${
          search ? `&search=${search}` : ""
        }`,
        method: "GET",
      }),
      providesTags: ["Product"],
    }),
    getProductDetails: builder.query<ProductResponse, number>({
      query: (id: number) => `${admin}products/${id}/`,
      providesTags: ["Product"],
    }),
    getProductUser: builder.query<
      PaginatedProductsResponse,
      { category?: number; productPage?: number }
    >({
      query: ({ category, productPage }) =>
        `products/${productPage ? `?page=${productPage}` : ""}${
          category ? `&category=${category}` : ""
        }`,
      providesTags: ["UserProduct"],
    }),
    delteteProduct: builder.mutation<{ message: string }, number>({
      query: (id: number) => ({
        url: `${admin}products/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Product"],
    }),
    getCategory: builder.query<PaginatedCategories, { page?: number }>({
      query: ({ page }) => `${admin}categories/${page ? `?page=${page}` : ""}`,
      providesTags: ["Category"],
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
      query: (body) => ({
        url: `${admin}categories/`,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Category"],
    }),
    categoryDelete: builder.mutation<{ message: string }, number>({
      query: (id: number) => ({
        url: `${admin}categories/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Category"],
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
    reviewList: builder.query<ProductReviewResponse[],void>({
      query: () => `top/reviews/`,
    })
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
  useCategoryDeleteMutation,
  useReviewListQuery,
} = productApi;
