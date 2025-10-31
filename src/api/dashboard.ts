import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api";
import { ContactListResponse } from "@/interfaces/api/Contact";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboard", "Message"],
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: (period = "yearly") => ({
        url: `dashboard/overview/?period=${period}`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
    getContacts: builder.query<ContactListResponse, { page: number }>({
      query: ({page}) => `contact/admin/${page ? `?page=${page | 1}` : ""}`, // replace with your actual endpoint
    }),
    replyMessage: builder.mutation<void, { id: number; admin_reply: string }>({
      query: ({ id, admin_reply }) => ({
        url: `contact/admin/reply/${id}/`,
        method: "POST",
        body: { admin_reply },
      }),
    }),
    deleteMessage: builder.mutation<void, number>({
      query: (id) => ({
        url: `contact/admin/${id}/`,
        method: "DELETE",
      }),
    }),
  }),
});

export const {
  useGetDashboardOverviewQuery,
  useDeleteMessageMutation,
  useGetContactsQuery,
  useReplyMessageMutation,
} = dashboardApi;
