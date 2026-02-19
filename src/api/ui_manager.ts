import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api"; // Your base query setup
import {
  CardRequest,
  CardResponse,
  GetResponse,
  PostRequest,
  PostResponse,
} from "@/interfaces/api";

const endpoint = "why-choose/";
const heroPromotionEndpoint = "hero-promotion/";

export const uiManagerApi = createApi({
  reducerPath: "cardApi",
  baseQuery,
  tagTypes: ["Card", "HeroPromotion"],
  endpoints: (builder) => ({
    getHeroPromotion: builder.query<GetResponse, void>({
      query: () => heroPromotionEndpoint,
      providesTags: ["HeroPromotion"],
    }),
    heropromotion: builder.mutation<void, PostRequest>({
      query: (body) => {
        const formData = new FormData();
        formData.append("title1", body.title1);
        formData.append("title2", body.title2);
        formData.append("description", body.description);

        // Append multiple files
        if (body.new_images) {
          body.new_images.forEach((file, index) => {
            formData.append(`new_images[${index}]`, file);
          });
        }

        body.new_headings.forEach((heading, index) => {
          formData.append(`new_headings[${index}]`, heading);
        });

        body.new_subheadings.forEach((subheading, index) => {
          formData.append(`new_subheadings[${index}]`, subheading);
        });

        return {
          url: heroPromotionEndpoint,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["HeroPromotion"],
    }),

    // ✅ GET all cards
    getWhyChoose: builder.query<CardResponse[], void>({
      query: () => endpoint,
      providesTags: ["Card"],
    }),

    // ✅ POST create a new card (with file upload support)
    addWhyChoose: builder.mutation<CardResponse, CardRequest>({
      query: (body) => ({
        url: endpoint,
        method: "POST",
        body,
      }),
      invalidatesTags: ["Card"],
    }),

    // ✅ PUT update an existing card
    updateWhyChoose: builder.mutation<
      CardResponse,
      { id: number; cardData: CardRequest }
    >({
      query: ({ id, cardData }) => ({
        url: `${endpoint}${id}/`,
        method: "PUT",
        body: cardData,
      }),
      invalidatesTags: ["Card"],
    }),

    // ✅ DELETE a specific card
    deleteWhyChoose: builder.mutation<void, number>({
      query: (id) => ({
        url: `${endpoint}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Card"],
    }),
  }),
});

export const {
  useHeropromotionMutation,
  useGetHeroPromotionQuery,
  useGetWhyChooseQuery,
  useAddWhyChooseMutation,
  useUpdateWhyChooseMutation,
  useDeleteWhyChooseMutation,
} = uiManagerApi;
