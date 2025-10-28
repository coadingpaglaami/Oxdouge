import { createApi } from "@reduxjs/toolkit/query/react";
import  rawBaseQuery  from "./api";
import { CreateUserResponse, LoginResponse } from "@/interfaces/api";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: rawBaseQuery,
  tagTypes: ["Auth"],
  endpoints: (builder) => ({
    signup: builder.mutation<CreateUserResponse, FormData>({
      query: (formData) => ({
        url: "signup/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),

    login: builder.mutation<LoginResponse, FormData>({
      query: (formData) => ({
        url: "login/",
        method: "POST",
        body: formData,
      }),
      invalidatesTags: ["Auth"],
    }),
  }),
});

export const { useSignupMutation, useLoginMutation } = authApi;
