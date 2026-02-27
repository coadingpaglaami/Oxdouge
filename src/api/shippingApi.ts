import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api";
import { ShippingAddressRequest, ShippingAddressResponse } from "@/interfaces/api/ShippingAddress";

const shippingEndpoint = "shipping/";

export const shippingApi = createApi({
  reducerPath: "shippingApi",
  baseQuery,
  tagTypes: ["Shipping"],
  endpoints: (builder) => ({

    // ✅ GET all shipping options
    getShippings: builder.query<{results: ShippingAddressResponse[], count: number},void>({
      query: () =>  ({ url: shippingEndpoint, credentials: "include" }),
     
      providesTags: ["Shipping"],
    }),

    // ✅ POST create shipping option
    createShipping: builder.mutation<void,ShippingAddressRequest>({
      query: (body) => ({
        url: shippingEndpoint,
        method: "POST",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Shipping"],
    }),

    // ✅ PATCH update shipping option
    updateShipping: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${shippingEndpoint}${id}/`,
        method: "PATCH",
        body,
        credentials: "include",
      }),
      invalidatesTags: ["Shipping"],
    }),

    // ✅ DELETE shipping option
    deleteShipping: builder.mutation({
      query: (id) => ({
        url: `${shippingEndpoint}${id}/`,
        method: "DELETE",
        credentials: "include",
      }),
      invalidatesTags: ["Shipping"],
    }),

  }),
});

export const {
  useGetShippingsQuery,
  useCreateShippingMutation,
  useUpdateShippingMutation,
  useDeleteShippingMutation,
} = shippingApi;
