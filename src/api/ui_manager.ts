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

        // Deleted IDs
        if (body.deleted_image_ids?.length) {
          body.deleted_image_ids.forEach((id) => {
            formData.append("deleted_image_ids", id.toString());
          });
        }

        // New Images
        if (body.new_images?.length) {
          body.new_images.forEach((file) => {
            formData.append("new_images", file);
          });
        }

        // New Headings
        if (body.new_headings?.length) {
          body.new_headings.forEach((heading) => {
            formData.append("new_headings", heading);
          });
        }

        // New Subheadings
        if (body.new_subheadings?.length) {
          body.new_subheadings.forEach((subheading) => {
            formData.append("new_subheadings", subheading);
          });
        }

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
