import { createApi } from '@reduxjs/toolkit/query/react';
import baseQuery from './api';
import { ApplyCouponRequest, ApplyCouponResponse, CouponListResponse, CouponPayload } from '@/interfaces/api/Coupon';

const admin = 'admin/';
const coupons = 'coupons/';

export const couponApi = createApi({
  reducerPath: 'couponApi',
  baseQuery,
  tagTypes: ['Coupon'],
  endpoints: (builder) => ({

    // ✅ Admin Get All Coupons
    getCoupons: builder.query<CouponListResponse,{page:number}>({
      query: ({page}) => `${admin}${coupons}` + `?page=${page}`,
      providesTags: ['Coupon'],
    }),

    // ✅ Admin Create Coupon (POST)
    createCoupon: builder.mutation<void,CouponPayload>({
      query: (body) => ({
        url: `${admin}${coupons}`,
        method: 'POST',
        body,
      }),
      invalidatesTags: ['Coupon'],
    }),

    // ✅ Admin Update Coupon (PUT)
    updateCoupon: builder.mutation({
      query: ({ id, ...body }) => ({
        url: `${admin}${coupons}${id}/`,
        method: 'PUT',
        body,
      }),
      invalidatesTags: ['Coupon'],
    }),

    // ✅ Admin Delete Coupon (DELETE)
    deleteCoupon: builder.mutation({
      query: (id) => ({
        url: `${admin}${coupons}${id}/`,
        method: 'DELETE',
      }),
      invalidatesTags: ['Coupon'],
    }),

    // ✅ Apply Coupon (For user side)
    applyCoupon: builder.mutation<ApplyCouponResponse,ApplyCouponRequest>({
      query: (body) => ({
        url: `coupons/apply/`,
        method: 'POST',
        body,
      }),
    }),

  }),
});

export const {
  useGetCouponsQuery,
  useCreateCouponMutation,
  useUpdateCouponMutation,
  useDeleteCouponMutation,
  useApplyCouponMutation,
} = couponApi;
