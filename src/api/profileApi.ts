// src/api/profileApi.ts
import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api";

export interface ProfileResponse {
  full_name: string;
  profile_image: string;
  profile_image_url: string;
  gender: string;
  date_of_birth: string | null;
  country: string;
  phone_number: string;
  email: string;
  address: string;
}

export interface UpdateProfileRequest {
  full_name?: string;
  phone_number?: string;
  address?: string;
  gender?: string;
  date_of_birth?: string | null;
  country?: string;
  profile_image?: File;
}

export interface ContactFormPayload {
  name: string;
  email: string;
  subject: string;
  message: string;
}

const profileEndpoint = "profile/";

export const profileApi = createApi({
  reducerPath: "profileApi",
  baseQuery,
  tagTypes: ["Profile"],
  endpoints: (builder) => ({
    // ✅ GET profile
    getProfile: builder.query<ProfileResponse, void>({
      query: () => profileEndpoint,
      providesTags: ["Profile"],
    }),

    // ✅ UPDATE profile with FormData
    updateProfile: builder.mutation<ProfileResponse, FormData>({
      query: (formData) => ({
        url: profileEndpoint,
        method: "PATCH",
        body: formData,
        // Don't set Content-Type header for FormData - let browser set it automatically
      }),
      invalidatesTags: ["Profile"],
    }),
    contactUs: builder.mutation<void, FormData>({
      query: (body) => ({
        url: `send/message/`, 
        method: "POST",
        body
      })
    })
  }),
});

export const {
  useGetProfileQuery,
  useUpdateProfileMutation,
  useContactUsMutation,
} = profileApi;