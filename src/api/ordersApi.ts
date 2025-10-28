import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api";
const orders = "orders/";
const admin = "admin/";
interface Search {
  query: string;
}
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery,
  tagTypes: ["Orders"],
  endpoints: (builder) => ({
    buyNow: builder.mutation<void, void>({
      query: (formData) => ({
        url: `${orders}buy-now/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateStatus: builder.mutation<void, { id: number; status: string }>({
      query: ({ id, status }) => ({
        url: `${admin}orders/${id}/status/`,
        method: "PATCH",
        body: { status },
      }),
      invalidatesTags: ["Orders"],
    }),
    deleteOrder: builder.mutation<void, number>({
      query: (id: number) => ({
        url: `${admin}orders/${id}/delete/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Orders"],
    }),
    getAllOrders: builder.query<void, void>({
      query: () => `${orders}`,
      providesTags: ["Orders"],
    }),
    orderDetails: builder.query<void, number>({
      query: () => `${orders}hstory/`,
      providesTags: ["Orders"],
    }),
    searchOrders: builder.query<void, Search>({
      query: ({ query }) => `${admin}orders/status/?search=${query}`,
      providesTags: ["Orders"],
    }),
    placeOrder: builder.mutation<void, void>({
      query: () => `${orders}place/`,
    }),
  }),
});
