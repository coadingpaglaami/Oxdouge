import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api";
import { AddToCartRequest, CartItemResponse } from "@/interfaces/api/AddToCart";

const endpoint = "cart/";

export const cartApi = createApi({
  reducerPath: "cartApi",
  baseQuery,
  tagTypes: ["Cart"],
  endpoints: (builder) => ({
    // ✅ GET all cart items
    getCart: builder.query<CartItemResponse[], void>({
      query: () => endpoint,
      providesTags: ["Cart"],
    }),

    // ✅ ADD item to cart  (POST)
    addToCart: builder.mutation<CartItemResponse, AddToCartRequest>({
      query: (body) => ({
        url: endpoint,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Cart"],
    }),

    // ✅ UPDATE cart item (PUT)
    // updateCart: builder.mutation({
    //   query: ({ id, ...body }) => ({
    //     url: `${endpoint}${id}/`,
    //     method: "PUT",
    //     body,
    //   }),
    //   invalidatesTags: ["Cart"],
    // }),

    // ✅ DELETE cart item (DELETE)
    deleteCart: builder.mutation({
      query: (id) => ({
        url: `${endpoint}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Cart"],
    }),
    updateCart: builder.mutation<
      CartItemResponse,
      { id: number; product_id: number; quantity: number }
    >({
      query: ({ id, product_id, quantity }) => ({
        url: `cart/${id}/`,
        method: "PUT", // or 'PUT' depending on your backend
        body: {
          product_id,
          quantity,
        },
      }),
      invalidatesTags: ["Cart"],
    }),
  }),
});

export const {
  useGetCartQuery,
  useAddToCartMutation,
  //   useUpdateCartMutation,
  useDeleteCartMutation,
  useUpdateCartMutation
} = cartApi;
