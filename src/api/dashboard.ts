import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api";

export const dashboardApi = createApi({
  reducerPath: "dashboardApi",
  baseQuery,
  tagTypes: ["Dashboard"],
  endpoints: (builder) => ({
    getDashboardOverview: builder.query({
      query: (period = "yearly") => ({
        url: `dashboard/overview/?period=${period}`,
        method: "GET",
      }),
      providesTags: ["Dashboard"],
    }),
  }),
});

export const { useGetDashboardOverviewQuery } = dashboardApi;