import { createApi } from "@reduxjs/toolkit/query/react";
import rawBaseQuery from "./api";
import { CreateUserResponse, LoginResponse, GoogleLoginResponse } from "@/interfaces/api";
import { ChangePasswordPayload } from "@/interfaces/api/User";

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

    // Google OAuth endpoints
    googleLogin: builder.query<{ auth_url: string }, void>({
      query: () => "google/login/",
    }),

    googleExchange: builder.mutation<GoogleLoginResponse, { code: string }>({
      query: (body) => ({
        url: "google/exchange/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Auth"],
    }),

    changePasswordUser: builder.mutation<void, ChangePasswordPayload>({
      query: (body) => ({
        url: "update-password/",
        method: "POST",
        body,
      }),
    }),
    emailSecurity: builder.query({
      query: () => `email-security/`,
    }),
    updateEmailSecurity: builder.mutation({
      query: (body)=>({
        url: `email-security/`,
        method: "PUT",
        body,
      })
    })
  }),
});

export const { 
  useSignupMutation, 
  useLoginMutation, 
  useGoogleLoginQuery,
  useGoogleExchangeMutation,
  useChangePasswordUserMutation, 
  useEmailSecurityQuery, 
  useUpdateEmailSecurityMutation 
} = authApi;