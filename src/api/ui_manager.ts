import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api"; // Your base query setup
import { CardResponse, GetResponse, PostRequest } from "@/interfaces/api";
import { FormState } from "@/appcomponent/admin/ui_manager/home/WhyChooseManagement";
import { buildFormData } from "@/lib/buildFormdata";
import { get } from "http";

const endpoint = "why-choose/";
const heroPromotionEndpoint = "hero-promotion/";
const howWorks = "how-works/";
const contactInfo = "contact-info/";

export const uiManagerApi = createApi({
  reducerPath: "cardApi",
  baseQuery,
  tagTypes: [
    "Card",
    "HeroPromotion",
    "HowWorks",
    "Section",
    "ContactInfo",
    "AboutStory",
    "AboutJourney",
  ],
  endpoints: (builder) => ({
    getHeroPromotion: builder.query<GetResponse, void>({
      query: () => heroPromotionEndpoint,
      providesTags: ["HeroPromotion"],
    }),
    heropromotion: builder.mutation<void, PostRequest>({
      query: (body) => {
        const formData = new FormData();

        // ── Basic content fields ──
        formData.append("title1", body.title1);
        formData.append("title2", body.title2);
        formData.append("description", body.description);

        // ── Deleted images ──
        if (body.deleted_image_ids?.length) {
          body.deleted_image_ids.forEach((id) => {
            formData.append("delete_images_ids", id.toString());
          });
        }

        // ── New images + headings + subheadings ──
        if (body.new_images?.length) {
          body.new_images.forEach((file, idx) => {
            formData.append("new_images", file);
            formData.append("new_headings", body.new_headings?.[idx] || "");
            formData.append(
              "new_subheadings",
              body.new_subheadings?.[idx] || "",
            );
          });
        }

        // Debug: check what’s being sent
        // for (const pair of formData.entries()) {
        //   console.log(pair[0], pair[1]);
        // }

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
    addWhyChoose: builder.mutation<void, FormState>({
      query: (body) => ({
        url: `${endpoint}`,
        method: "POST",
        body: buildFormData(body), // <-- FormData
      }),
      invalidatesTags: ["Card"],
    }),
    updateWhyChoose: builder.mutation<
      void,
      { id: number; cardData: FormState }
    >({
      query: ({ id, cardData }) => ({
        url: `${endpoint}${id}/`,
        method: "PUT",
        body: buildFormData(cardData), // <-- FormData
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

    addHowWorks: builder.mutation({
      query: (body) => ({
        url: howWorks,
        method: "POST",
        body,
      }),
      invalidatesTags: ["HowWorks"],
    }),
    updateHowWorks: builder.mutation({
      query: ({ id, data }) => ({
        url: `${howWorks}${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["HowWorks"],
    }),
    deleteHowWorks: builder.mutation({
      query: (id) => ({
        url: `${howWorks}${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["HowWorks"],
    }),
    getHowWorks: builder.query({
      query: () => howWorks,
      providesTags: ["HowWorks"],
    }),

    getWarm: builder.query({
      query: () => "section/",
      providesTags: ["Section"],
    }),
    updateWarm: builder.mutation({
      query: ({ data }) => ({
        url: `section/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Section"],
    }),
    getContactInfo: builder.query({
      query: () => contactInfo,
      providesTags: ["ContactInfo"],
    }),
    updateContactInfo: builder.mutation({
      query: ({ data }) => ({
        url: contactInfo,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ContactInfo"],
    }),
    getAboutStory: builder.query({
      query: () => "our-story/",
      providesTags: ["AboutStory"],
    }),
    updateAboutStory: builder.mutation({
      query: ({ data }) => ({
        url: "our-story/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AboutStory"],
    }),
    getAboutJourney: builder.query({
      query: () => "join-our-journey/",
      providesTags: ["AboutJourney"],
    }),
    updateAboutJourney: builder.mutation({
      query: ({ data }) => ({
        url: "join-our-journey/",
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["AboutJourney"],
    })
  }),
});

export const {
  useHeropromotionMutation,
  useGetHeroPromotionQuery,
  useGetWhyChooseQuery,
  useAddWhyChooseMutation,
  useUpdateWhyChooseMutation,
  useDeleteWhyChooseMutation,
  useUpdateHowWorksMutation,
  useAddHowWorksMutation,
  useDeleteHowWorksMutation,
  useGetHowWorksQuery,
  useGetWarmQuery,
  useUpdateWarmMutation,
  useGetContactInfoQuery,
  useUpdateContactInfoMutation,
  useGetAboutStoryQuery,
  useUpdateAboutStoryMutation,
  useGetAboutJourneyQuery,
  useUpdateAboutJourneyMutation,
} = uiManagerApi;
