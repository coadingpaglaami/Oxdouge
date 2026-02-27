import { createApi } from "@reduxjs/toolkit/query/react";
import rawBaseQuery from "./api";
import {
  CreateUserResponse,
  LoginResponse,
  GoogleLoginResponse,
} from "@/interfaces/api";
import { ChangePasswordPayload } from "@/interfaces/api/User";
import { cartApi } from "./cartApi";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: rawBaseQuery,
  tagTypes: ["Auth", "Cart"],
  endpoints: (builder) => ({
    signup: builder.mutation<CreateUserResponse, FormData>({
      query: (formData) => ({
        url: "signup/",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      invalidatesTags: ["Auth", "Cart"],
    }),

    login: builder.mutation<LoginResponse, FormData>({
      query: (formData) => ({
        url: "login/",
        method: "POST",
        body: formData,
        credentials: "include",
      }),
      async onQueryStarted(arg, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          console.log(data, "Login response data");

          // Save tokens in cookies

          // If backend tells to clear session
          if (data.clear_session) {
            document.cookie =
              "sessionid=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;";
          }

          await dispatch(
            cartApi.endpoints.getCart.initiate(undefined, {
              forceRefetch: true,
            }),
          );

          // 🔥 Force cart refetch
          dispatch(cartApi.util.invalidateTags(["Cart"]));
        } catch (err) {
          console.error("Login failed", err);
        }
      },
      invalidatesTags: ["Auth", "Cart"],
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
      query: (body) => ({
        url: `email-security/`,
        method: "PUT",
        body,
      }),
    }),
    sendOtp: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "send-otp/",
        method: "POST",
        body,
      }),
    }),
    verifyOtp: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "verify-otp/",
        method: "POST",
        body,
      }),
    }),
    resetOtp: builder.mutation<void, FormData>({
      query: (body) => ({
        url: "reset-password/",
        method: "POST",
        body,
      }),
    }),
  }),
});

export const {
  useSignupMutation,
  useLoginMutation,
  useGoogleLoginQuery,
  useGoogleExchangeMutation,
  useChangePasswordUserMutation,
  useEmailSecurityQuery,
  useUpdateEmailSecurityMutation,
  useSendOtpMutation,
  useVerifyOtpMutation,
  useResetOtpMutation,
} = authApi;
