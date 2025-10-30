import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api";
import { CheckoutRequest, CheckOutResponse, OrderDetailsResponse, OrderListResponse, UserOrderListResponse } from "@/interfaces/api/Orders";

const orders = "order/";
const admin = "admin/";
interface Search {
  query: string;
}
export const ordersApi = createApi({
  reducerPath: "ordersApi",
  baseQuery,
  tagTypes: ["Orders",'UserOrders'],
  endpoints: (builder) => ({
    buyNow: builder.mutation<void, void>({
      query: (formData) => ({
        url: `${orders}buy-now/`,
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Orders"],
    }),
    updateStatus: builder.mutation<void, { id: number; order_status: string }>({
      query: ({ id, order_status }) => ({
        url: `${admin}orders/${id}/status/`,
        method: "PATCH",
        body: { order_status },
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
    getAllOrders: builder.query<OrderListResponse, number | void>({
      query: (page = 1) => `orders/?page=${page}`,
      providesTags: ["Orders"],
    }),
    orderDetails: builder.query<void, number>({
      query: () => `${orders}history/`,
      providesTags: ["Orders"],
    }),
    searchOrders: builder.query<void, Search>({
      query: ({ query }) => `${admin}orders/status/?search=${query}`,
      providesTags: ["Orders"],
    }),
    placeOrder: builder.mutation<CheckOutResponse, CheckoutRequest>({
      query: (body) => (
        {
          url: `${orders}place/`,
          method: "POST",
          body
        }
      ),
    }),
    chekOutSession: builder.mutation({
      query:(body)=>({
        url:`payment/create-checkout-session/`,
        method:"POST",
        body
      })
    }),
    myOrder:builder.query<OrderDetailsResponse,{id:number}>({
     query: ({ id }) => `my-orders/${id}/`,
    }),
    allMyOrder:builder.query<UserOrderListResponse,void>({
      query: () => `my-orders/`,
      providesTags: ['UserOrders'],
    }),
    cancellMyOrder:builder.mutation<void,{id:number}>({
      query: ({id})=>(
        {
          url:`my-orders/${id}/cancel/`,
          method:"POST",
        }
      )
  
    })
  }),
});

export const{
  useBuyNowMutation,
  useUpdateStatusMutation,
  useDeleteOrderMutation,
  useGetAllOrdersQuery,
  useOrderDetailsQuery,
  useSearchOrdersQuery,
  usePlaceOrderMutation,
  useChekOutSessionMutation,
  useMyOrderQuery,
  useAllMyOrderQuery,
  useCancellMyOrderMutation
}=ordersApi;
