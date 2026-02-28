import { createApi } from "@reduxjs/toolkit/query/react";
import baseQuery from "./api"; // Your base query setup
import { CardResponse, GetResponse, PostRequest } from "@/interfaces/api";
import { FormState } from "@/appcomponent/admin/ui_manager/home/WhyChooseManagement";
import { buildFormData } from "@/lib/buildFormdata";

interface ReturnHelp {
  id: number;
  title: string;
  heading1: string;
  email: string;
  phone: string;
  hours: string;
  heading2: string;
  address_line1: string;
  address_line2: string;
  city_state_zip: string;
  updated_at: string;
}

interface FooterSection {
  id: number;
  title: string;
  content: string;
  image: string; // cloudinary path
  image_url: string; // full url
}

interface FooterSectionForm {
  title: string;
  content: string;
  image?: File | null;
}

interface SocialLinks {
  id?: number;
  facebook: string;
  instagram: string;
  x: string;
}

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
    "Faq",
    "ShippingPolicy",
    "ReturnPolicy",
    "TermsConditions",
    "ReturnHelp",
    "FooterSection",
    "SocialLinks",
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
    }),

    // ✅ GET FAQs
    getFaqs: builder.query({
      query: ({ page = 1, limit = 10 }) => `faqs/?page=${page}&limit=${limit}`,
      providesTags: ["Faq"],
    }),

    // ✅ POST FAQ
    addFaq: builder.mutation({
      query: (body) => ({
        url: "faqs/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["Faq"],
    }),

    // ✅ PATCH FAQ
    updateFaq: builder.mutation({
      query: ({ id, data }) => ({
        url: `faqs/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["Faq"],
    }),

    // ✅ DELETE FAQ
    deleteFaq: builder.mutation({
      query: (id) => ({
        url: `faqs/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["Faq"],
    }),

    // ✅ GET Shipping Policy
    getShippingPolicy: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `shipping-policy/?page=${page}&limit=${limit}`,
      providesTags: ["ShippingPolicy"],
    }),

    // ✅ POST Shipping Policy
    addShippingPolicy: builder.mutation({
      query: (body) => ({
        url: "shipping-policy/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ShippingPolicy"],
    }),

    // ✅ PATCH Shipping Policy
    updateShippingPolicy: builder.mutation({
      query: ({ id, data }) => ({
        url: `shipping-policy/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ShippingPolicy"],
    }),

    // ✅ DELETE Shipping Policy
    deleteShippingPolicy: builder.mutation({
      query: (id) => ({
        url: `shipping-policy/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ShippingPolicy"],
    }),

    // ✅ GET Return Policy
    getReturnPolicy: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `return-policy/?page=${page}&limit=${limit}`,
      providesTags: ["ReturnPolicy"],
    }),

    // ✅ POST Return Policy
    addReturnPolicy: builder.mutation({
      query: (body) => ({
        url: "return-policy/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["ReturnPolicy"],
    }),

    // ✅ PATCH Return Policy
    updateReturnPolicy: builder.mutation({
      query: ({ id, data }) => ({
        url: `return-policy/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ReturnPolicy"],
    }),

    // ✅ DELETE Return Policy
    deleteReturnPolicy: builder.mutation({
      query: (id) => ({
        url: `return-policy/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["ReturnPolicy"],
    }),

    // ✅ GET Terms & Conditions
    getTermsConditions: builder.query({
      query: ({ page = 1, limit = 10 }) =>
        `terms-and-conditions/?page=${page}&limit=${limit}`,
      providesTags: ["TermsConditions"],
    }),

    // ✅ POST Terms & Conditions
    addTermsConditions: builder.mutation({
      query: (body) => ({
        url: "terms-and-conditions/",
        method: "POST",
        body,
      }),
      invalidatesTags: ["TermsConditions"],
    }),

    // ✅ PATCH Terms & Conditions
    updateTermsConditions: builder.mutation({
      query: ({ id, data }) => ({
        url: `terms-and-conditions/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["TermsConditions"],
    }),

    // ✅ DELETE Terms & Conditions
    deleteTermsConditions: builder.mutation({
      query: (id) => ({
        url: `terms-and-conditions/${id}/`,
        method: "DELETE",
      }),
      invalidatesTags: ["TermsConditions"],
    }),

    // ✅ GET return-help
    getReturnHelp: builder.query<ReturnHelp, void>({
      query: () => "return-help/",
      providesTags: ["ReturnHelp"],
    }),

    // ✅ PATCH return-help by id
    updateReturnHelp: builder.mutation<
      ReturnHelp,
      { id: number } & Partial<ReturnHelp>
    >({
      query: ({ id, ...data }) => ({
        url: `return-help/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["ReturnHelp"],
    }),

    getFooterSection: builder.query<FooterSection[], void>({
      query: () => "footer-section/",
      providesTags: ["FooterSection"],
    }),

    updateFooterSection: builder.mutation<
      FooterSection,
      { id: number; data: FooterSectionForm }
    >({
      query: ({ id, data }) => {
        const formData = new FormData();

        formData.append("title", data.title);
        formData.append("content", data.content);

        // Only append image if new file selected
        if (data.image) {
          formData.append("image", data.image);
        }

        return {
          url: `footer-section/${id}/`,
          method: "PATCH",
          body: formData,
        };
      },
      invalidatesTags: ["FooterSection"],
    }),

    getSocialLinks: builder.query<SocialLinks, void>({
      query: () => "social-links/",
      providesTags: ["SocialLinks"],
    }),

    updateSocialLinks: builder.mutation<
      SocialLinks,
      { id: number } & Partial<SocialLinks>
    >({
      query: ({ id, ...data }) => ({
        url: `social-links/${id}/`,
        method: "PATCH",
        body: data,
      }),
      invalidatesTags: ["SocialLinks"],
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
  useGetFaqsQuery,
  useAddFaqMutation,
  useUpdateFaqMutation,
  useDeleteFaqMutation,
  useGetShippingPolicyQuery,
  useAddShippingPolicyMutation,
  useUpdateShippingPolicyMutation,
  useDeleteShippingPolicyMutation,
  useGetReturnPolicyQuery,
  useAddReturnPolicyMutation,
  useUpdateReturnPolicyMutation,
  useDeleteReturnPolicyMutation,
  useGetTermsConditionsQuery,
  useAddTermsConditionsMutation,
  useUpdateTermsConditionsMutation,
  useDeleteTermsConditionsMutation,
  useGetReturnHelpQuery,
  useUpdateReturnHelpMutation,
  useGetFooterSectionQuery,
  useUpdateFooterSectionMutation,
  useGetSocialLinksQuery,
  useUpdateSocialLinksMutation,
} = uiManagerApi;
